import * as Comlink from "comlink";

import {
  initDb,
  insert,
  list,
  reset,
  setupTables,
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
    // Note: The `log` table stores `activity` as TEXT, but the `Log` type expects a number.
    // This is an existing issue in the codebase. A direct cast here might lead to
    // runtime errors if the rest of the application expects `activity` to be a number.
    return (response?.result?.resultRows as Log[]) || [];
  },

  async addLog(
    name: string,
    projectName: string,
    projectColor: string,
    elapsed: number,
    start: number,
    end: number,
  ): Promise<Log[]> {
    await this.insert(
      "log",
      "activity, project_name, project_color, elapsed, start, end",
      `'${name}', '${projectName}', '${projectColor}', ${elapsed}, ${start}, ${end}`,
    );

    return await this.listLog();
  },
};

export type DbWorker = typeof dbWorker;

Comlink.expose(dbWorker);
