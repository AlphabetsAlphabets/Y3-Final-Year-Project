import type { Promiser } from "$lib/types/promiser";
import sqlite3Worker1Promiser from "$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs";

export enum Command {
  SETUP,
  INSERT,
  LIST,
  RESET,
}

let promiser: Promiser | null = null;

function isPromiserReady(
  promiser: Promiser | null,
): asserts promiser is Promiser {
  if (!promiser) {
    throw new Error("Promiser not ready.");
  }
}

let DB_HAS_INIT = false;
export const initDb = async () => {
  if (DB_HAS_INIT) {
    return;
  }
  promiser = await sqlite3Worker1Promiser({
    onready: () => {
      console.log("WORKER: SQLite promiser is ready.");
    },
  });

  isPromiserReady(promiser);

  DB_HAS_INIT = true;
  await promiser("open", {
    filename: "time-tracker.db",
    vfs: "opfs",
  });

  await promiser("exec", {
    sql: "PRAGMA foreign_keys = ON;",
  });
};

export const setupTables = async () => {
  isPromiserReady(promiser);

  // Enable foreign key constraints
  await promiser("exec", {
    sql: `
      CREATE TABLE IF NOT EXISTS activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS project (
        name TEXT PRIMARY KEY,
        color TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity TEXT NOT NULL,
        project_name TEXT,
        project_color TEXT,
        elapsed INTEGER NOT NULL,
        start INTEGER NOT NULL,
        end INTEGER NOT NULL,
        FOREIGN KEY (project_name) REFERENCES project(name) ON UPDATE CASCADE
      );
    `,
  });
};

export const list = async (
  table: string,
  columns: string = "",
  clause: string = "",
) => {
  isPromiserReady(promiser);

  let query = `SELECT`;
  if (columns.length > 0) {
    query += ` ${columns}`;
  } else {
    query += " *";
  }

  query += ` FROM ${table}`;

  if (clause.length > 0) {
    query += ` WHERE ${clause}`;
  }

  return await promiser("exec", {
    sql: query,
    rowMode: "object",
  });
};

export const insert = async (
  table: string,
  columns: string,
  values: string,
) => {
  // Using exec's built-in parameter binding (implicit prepared statement)
  // It needs to go from structured to a flat array. Like a flat_map operation.
  // The number of ? is equal to the number of things that needs to be inserted and this applies
  // to multiple inserts at a time as well.
  // So, I need to get the length after it has been flattened. So flat map's length.
  isPromiserReady(promiser);

  const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
  console.log(query);
  await promiser("exec", {
    sql: query,
  });
};

/**
 * Reset tables by dropping and recreating them
 * @param table Optional table name. If not provided, all tables will be dropped and recreated
 */
export const reset = async (table?: string): Promise<void> => {
  isPromiserReady(promiser);

  if (table) {
    // Drop a specific table
    await promiser("exec", {
      sql: `DROP TABLE IF EXISTS ${table};`,
    });
    console.log(`Table ${table} has been dropped`);
  } else {
    // Drop all tables
    await promiser("exec", {
      sql: `
        DROP TABLE IF EXISTS log;
        DROP TABLE IF EXISTS activity;
        DROP TABLE IF EXISTS project;
      `,
    });
    console.log("All tables have been dropped");
  }

  // Recreate tables schema
  await setupTables();
  console.log("Tables have been recreated with fresh schema");
};
