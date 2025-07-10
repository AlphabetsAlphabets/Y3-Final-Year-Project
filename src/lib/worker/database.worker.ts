import sqlite3Worker1Promiser from "$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs";
import { DB_NAME } from "$lib/common/constants";

import type { Promiser } from "$lib/types/database";

let promiser: Promiser | null = null;

function isPromiserReady(
  promiser: Promiser | null,
): asserts promiser is Promiser {
  if (!promiser) {
    throw new Error("Promiser not ready.");
  }
}

const initializeDB = async () => {
  promiser = await sqlite3Worker1Promiser({
    onready: () => {
      console.log("WORKER: SQLite promiser is ready.");
    },
  });

  isPromiserReady(promiser);
  await promiser("open", {
    filename: DB_NAME,
    vfs: "opfs",
  });
};

const setupSchema = async () => {
  isPromiserReady(promiser);

  console.log("WORKER: Creating table...");
  await promiser("exec", {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `,
  });

  await promiser("exec", {
    sql: "INSERT INTO users (name) VALUES (?);",
    bind: ["John Doe"],
  });
};

const listUsers = async () => {
  isPromiserReady(promiser);

  const users = await promiser("exec", {
    sql: "SELECT * FROM users;",
    rowMode: "array",
  });

  console.log(users);

  return users.result;
};

// TODO: Will need to fix this
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
