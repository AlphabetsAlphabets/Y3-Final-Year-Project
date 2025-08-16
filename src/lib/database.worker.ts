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

  // Puts data in the log table into a Log object.
  // Color is also obtained based on the project name.
  async listLog(): Promise<Log[]> {
    const response = await this.list("log");
    console.log("Received logs from worker", response);
    if (!(response && response.result && response.result.resultRows)) {
      console.error("Something went wrong.");
    }

    const results = response.result.resultRows as Log[];
    const logs = Promise.all(
      results.map(async (log: Log) => {
        // get the project name and query the project table
        const color = await this.list(
          "project",
          "color",
          `name = '${log.project_name}'`,
        );

        log.project_color = (color.result.resultRows[0] as Project).color;
        return log;
      }),
    );

    return logs || [];
  },

  async addLog(
    name: string,
    projectName: string,
    elapsed: number,
    start: number,
    end: number,
  ): Promise<Log[]> {
    await this.insert(
      "log",
      "activity, project_name, elapsed, start, end",
      `'${name}', '${projectName}', ${elapsed}, ${start}, ${end}`,
    );

    return await this.listLog();
  },

  async updateLog(toUpdate: string, clause: string) {
    const res = await update("log", toUpdate, clause);
    console.log(res);
  },
};

export type DbWorker = typeof dbWorker;

Comlink.expose(dbWorker);
