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
};

const listUsers = async () => {
  isPromiserReady(promiser);

  const users = await promiser("exec", {
    sql: "SELECT * FROM users;",
    rowMode: "array",
  });

  return users.result;
};

// TODO: Will need to fix this
onmessage = async (e) => {
  const { command, messageId } = e.data;

  const result = {
    success: false,
    message: "",
    messageId: messageId,
    data: undefined,
    error: undefined,
  };

  try {
    if (!promiser) {
      await initializeDB();
    }

    isPromiserReady(promiser);

    if (command === "schema") {
      await setupSchema();
      result.success = true;
    } else if (command == "list") {
      const users = await listUsers();
      result.data = users.resultRows;
      result.success = true;
    } else if (command === "reset") {
      await promiser("exec", { sql: "DELETE FROM users;" });
      await promiser("exec", {
        sql: `
      INSERT INTO users (name) VALUES
      ('John Doe'),
      ('Mark Mayson'),
      ('Peter Parker'),
      ('J. Jonah Jameson');
      `,
      });

      console.log("Reset dummy data.");
      result.success = true;
    } else {
      throw new Error(`Unknown command: ${command}`);
    }

    postMessage(result);
  } catch (error: any) {
    // Use the same result structure for consistency
    result.success = false;
    result.message = error.message || "An unknown error occurred";
    result.error = error.message;
    console.error("Worker error:", error);
    postMessage(result);
  }
};

export {};
