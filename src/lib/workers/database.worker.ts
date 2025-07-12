// https://www.youtube.com/watch?v=Uvnzwp72Ze8
// proper setup of WASM SQLITE
//
// This should only run once in the entire lifetime of the application.
// So the database object must be shared in a convenient manner.
//
// Having database stuff be here is the preferred and standard way of doing
// things. https://www.sqlite.org/wasm/doc/trunk/api-index.md#mwthread
//
// There are two approaches OO API #1 (OO1) or Worker API #2 (Worker1 and Promiser).
// Gonna need to try both and see what doesn't work lmfao
// OO1 - https://www.sqlite.org/wasm/doc/trunk/api-worker1.md
// Worker1 and Promiser - https://www.sqlite.org/wasm/doc/trunk/api-worker1.md
//
// Web Worker generic tutorial - https://freedium.cfd/https://medium.com/geekculture/sveltekit-web-worker-8cfc0c86abf6

import sqlite3Worker1Promiser from "$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs";
import type { Message, MessageReply } from "$lib/types/message";

const DB_NAME = "time-tracker.db";

import type { Promiser } from "$lib/types/promiser";

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

  return users;
};

// TODO: Will need to fix this
onmessage = async (e) => {
  const { command, messageId }: Message = e.data;

  const result: MessageReply = {
    messageId,
  };

  try {
    if (!promiser) {
      await initializeDB();
    }

    isPromiserReady(promiser);

    if (command === "schema") {
      await setupSchema();
    } else if (command == "list") {
      result.data = await listUsers();
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
    } else {
      throw new Error(`Unknown command: ${command}`);
    }

    postMessage(result);
  } catch (error: any) {
    // TODO: FIX THIS
    // Use the same result structure for consistency
    result.error = error.message || "An unknown error occurred";
    console.error("Worker error:", error);
    postMessage(result);
  }
};

export {};
