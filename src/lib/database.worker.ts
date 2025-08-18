// This file contains primitives for interacting with the database. Any specific functionality
// should be implemented elsewhere.
import * as Comlink from "comlink";

import { initDb, insert, list, reset, setupTables, update } from "$lib/sqlite";

import type { Log, Project } from "$lib/types/schema";

const dbWorker = {
  list,
  insert,
  reset,
  update,

  async initWorker() {
    await initDb();
    await setupTables();
  },
};

export type DbWorker = typeof dbWorker;

Comlink.expose(dbWorker);
