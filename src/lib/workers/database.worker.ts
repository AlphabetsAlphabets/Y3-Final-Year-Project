import * as Comlink from "comlink";

import {
  initDb,
  insert,
  list,
  reset,
  setupTables,
} from "$lib/workers/commands";

import type { Activity, Project } from "$lib/types/schema";

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
    console.log("Received activities from worker", response);
    const list: Activity[] = [];
    if (response && response.result && response.result.resultRows) {
      response.result.resultRows.forEach((value) => {
        // @ts-expect-error This will always be Activity
        list.push({ id: value[0], name: value[1] });
      });
    }

    return list;
  },

  async addActivity(name: string): Promise<Activity[]> {
    await this.insert("activity", "name", `'${name}'`);
    return await this.listActivities();
  },

  async listProjects(): Promise<Project[]> {
    const response = await this.list("project");
    console.log("Received projects from worker", response);
    const list: Project[] = [];
    if (response && response.result && response.result.resultRows) {
      response.result.resultRows.forEach((value) => {
        // @ts-expect-error This will always be Project
        list.push({ name: value[0], color: value[1] });
      });
    }

    return list;
  },

  async addProject(name: string, color: string): Promise<Project[]> {
    await this.insert("project", "name, color", `'${name}', '${color}'`);
    return await this.listProjects();
  },
};

export type DbWorker = typeof dbWorker;

Comlink.expose(dbWorker);
