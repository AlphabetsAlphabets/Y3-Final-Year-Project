import * as Comlink from "comlink";

import {
  initDb,
  insert,
  list,
  reset,
  setupTables,
  update,
} from "$lib/workers/commands";

import type { Activity, Log, Project } from "$lib/types/schema";

const dbWorker = {
  async initWorker() {
    await initDb();
    await setupTables();
  },

  list,
  insert,
  reset,
  update,

  async listActivities(): Promise<Activity[]> {
    const response = await this.list("activity");
    console.log("Received activities from worker.", response);
    return (response?.result?.resultRows as Activity[]) || [];
  },

  async addActivity(name: string): Promise<Activity[]> {
    await this.insert("activity", "name", `'${name}'`);
    return await this.listActivities();
  },

  async listProjects(): Promise<Project[]> {
    const response = await this.list("project");
    console.log("Received projects from worker", response);
    return (response?.result?.resultRows as Project[]) || [];
  },

  async addProject(name: string, color: string): Promise<Project[]> {
    await this.insert("project", "name, color", `'${name}', '${color}'`);
    return await this.listProjects();
  },

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

  async listLogsByActivity(activityName: string): Promise<Log[]> {
    const response = await this.list(
      "log",
      "*",
      `activity = '${activityName}'`,
    );
    console.log(
      `Received logs for activity ${activityName} from worker`,
      response,
    );
    if (!(response && response.result && response.result.resultRows)) {
      console.error("Something went wrong.");
      return [];
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

  async updateProject(name: string, color: string) {
    const res = await update(
      "project",
      `color = '${color}'`,
      `name = '${name}'`,
    );
    console.log(res);
  },

  async updateLog(toUpdate: string, clause: string) {
    const res = await update("log", toUpdate, clause);
    console.log(res);
  },
};

export type DbWorker = typeof dbWorker;

Comlink.expose(dbWorker);
