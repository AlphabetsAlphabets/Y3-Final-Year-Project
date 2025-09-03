import * as Comlink from "comlink";

import {
  initDb,
  insert,
  list,
  remove,
  reset,
  setupTables,
  update,
} from "$lib/sqlite";

const dbWorker = {
  list,
  insert,
  reset,
  update,
  remove,

  async initWorker() {
    await initDb();
    await setupTables();
  },
};

export type DbWorker = typeof dbWorker;

Comlink.expose(dbWorker);
