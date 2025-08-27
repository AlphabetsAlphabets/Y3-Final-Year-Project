import type { Promiser } from "$lib/types/promiser";
import sqlite3Worker1Promiser from "$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs";
import { createSql } from "$lib/types/schema";

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

export const createDefaultProject = async () => {
  isPromiserReady(promiser);

  // Check if the default "No Project" already exists
  const existingProject = await list("project", "*", "name = 'No Project'");

  if (
    existingProject.result &&
    existingProject.result.resultRows &&
    existingProject.result.resultRows.length === 0
  ) {
    // Insert the default "No Project" project if it doesn't exist
    await insert("project", "name, color", "'No Project', '#000000'");
    console.log("Default 'No Project' project created");
  }
};

export const setupTables = async () => {
  isPromiserReady(promiser);
  const createTablesSql = createSql.join("\n");

  // Enable foreign key constraints
  await promiser("exec", {
    sql: createTablesSql,
  });

  // Create the default "No Project" project
  await createDefaultProject();
};

const concatColums = (columns: string, table: string): string => {
  let query = "";
  if (columns.length > 0) {
    query += ` ${columns}`;
  } else {
    query += " *";
  }

  query += ` FROM ${table}`;

  return query;
};

const concatClause = (clause: string): string => {
  let query = "";
  if (clause.length > 0) {
    query += ` WHERE ${clause}`;
  }

  return query;
};

export const remove = async (table: string, clause: string) => {
  isPromiserReady(promiser);

  let query = `DELETE FROM ${table}`;
  query += concatClause(clause);

  return await promiser("exec", {
    sql: query,
    rowMode: "object",
  });
};

export const list = async (
  table: string,
  columns: string = "",
  clause: string = "",
) => {
  isPromiserReady(promiser);

  let query = `SELECT`;
  query += concatColums(columns, table);
  query += concatClause(clause);

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

export const update = async (
  table: string,
  setClause: string,
  whereClause: string,
) => {
  isPromiserReady(promiser);

  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  console.log(query);
  return await promiser("exec", {
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
        DROP TABLE IF EXISTS tasks;
      `,
    });
    console.log("All tables have been dropped");
  }

  // Recreate tables schema
  await setupTables();
  console.log("Tables have been recreated with fresh schema");
};
