import sqlite3Worker1Promiser from "$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs";
import sqlite3InitModule from "$lib/sqlite/jswasm/sqlite3";
import { DB_NAME } from "$lib/common/constants";

// This import is crucial for Vite to correctly bundle the worker
import "$lib/sqlite/jswasm/sqlite3-worker1?worker";

let promiser: any = null;

const initializeDB = async () => {
  console.log("WORKER: Initializing SQLite...");
  const sqlite3 = await sqlite3InitModule();
  console.log("WORKER: SQLite module loaded.", sqlite3);

  promiser = await sqlite3Worker1Promiser({
    onready: () => {
      console.log("WORKER: SQLite promiser is ready.");
    },
  });

  console.log("WORKER: Opening database...");
  const openResponse = await promiser("open", {
    filename: `opfs:${DB_NAME}`,
    vfs: "opfs",
  });
  console.log("WORKER: Database opened.", openResponse);
};

const setupSchema = async () => {
  console.log("WORKER: Creating table...");
  await promiser("exec", {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `,
  });
  console.log("WORKER: Table created.");

  console.log("WORKER: Inserting initial data...");
  await promiser("exec", {
    sql: "INSERT INTO users (name) VALUES (?);",
    bind: ["John Doe"],
  });
  console.log("WORKER: Initial data inserted.");
};

const listUsers = async () => {
  console.log("WORKER: Querying all users...");
  const users = await promiser("exec", {
    sql: "SELECT * FROM users;",
    rowMode: "object",
  });
  console.log("WORKER: User list retrieved.");
  return users.result;
};

onmessage = async (e) => {
  console.log("WORKER: A message was received from the main thread.", e.data);
  const { command } = e.data;

  try {
    if (!promiser) {
      await initializeDB();
    }

    let result;
    switch (command) {
      case "init":
        await setupSchema();
        result = { message: "Database initialized and schema created." };
        break;
      case "list":
        result = await listUsers();
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }

    postMessage({ success: true, data: result });
    console.log("WORKER: Sent a success reply to the main thread.");
  } catch (error: any) {
    console.error("WORKER: An error occurred:", error.message);
    postMessage({ success: false, error: error.message });
    console.log("WORKER: Sent an error reply to the main thread.");
  }
};

export {};
