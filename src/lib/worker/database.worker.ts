import sqlite3Worker1Promiser from "$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs";
import sqlite3InitModule from "$lib/sqlite/jswasm/sqlite3";

const SQLITE_INIT = false;

onmessage = () => {
  console.log("WORKER: A message was received.");
  if (!SQLITE_INIT) {
    console.log("Initing SQLITE3.");
    // sqlite3InitModule();
    // sqlite3Worker1Promiser();
  }

  postMessage({});
  console.log("WORKER: Sent a reply to MAIN THREAD.");
};

export {};
