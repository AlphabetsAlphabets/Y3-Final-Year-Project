import type { Promiser } from "$lib/types/promiser";
import sqlite3Worker1Promiser from "$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs";

export enum Command {
  INIT,
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

let initDb = async () => {
  promiser = await sqlite3Worker1Promiser({
    onready: () => {
      console.log("WORKER: SQLite promiser is ready.");
    },
  });

  isPromiserReady(promiser);
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
        elasped INTEGER NOT NULL,
        start INTEGER NOT NULL,
        end INTEGER NOT NULL,
        FOREIGN KEY (project_name, project_color) REFERENCES project(name, color) ON UPDATE CASCADE
      );
    `,
  });
};

export let list = async (
  table: string,
  columns: string = "",
  clause: string = "",
) => {
  isPromiserReady(promiser);

  let query = `SELECT`;
  if (columns.length > 0) {
    query += ` ${columns}`;
  }

  query += ` FROM ${table}`;

  if (clause.length > 0) {
    query += ` WHERE ${clause}`;
  }

  return await promiser("exec", {
    sql: query,
    rowMode: "array",
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

  await promiser("exec", {
    sql: `INSERT INTO ${table} (${columns}) VALUES (${values})`,
  });
};
