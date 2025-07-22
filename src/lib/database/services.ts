import * as Comlink from "comlink";
import { writable, type Writable } from "svelte/store";
import { type DbWorker } from "$lib/workers/database.worker";

type Activity = {
  id: number;
  name: string;
};

type Project = {
  name: string;
  color: string;
};

function isWorkerReady(
  worker: Comlink.Remote<DbWorker> | null,
): asserts worker is Comlink.Remote<DbWorker> {
  if (!worker) {
    throw new Error("Worker not ready. Run initWorker first");
  }
}

let worker: Comlink.Remote<DbWorker> | null = null;

export const activites: Writable<Activity[]> = writable([]);
export const projects: Writable<Project[]> = writable([]);

export const initWorker = async () => {
  const Worker = await import("$lib/workers/database.worker?worker");
  worker = Comlink.wrap<DbWorker>(new Worker.default());

  await worker.setup();
};

export const loadActivities = async () => {
  isWorkerReady(worker);

  await worker.setup();
  const response = await worker.list("activity");

  const activityList: Activity[] = [];
  if (response?.result?.resultRows) {
    response.result.resultRows.forEach((value) => {
      activityList.push({ id: value[0], name: value[1] });
    });
  }

  activites.set(activityList);
};

export const addActivity = async (name: string) => {
  isWorkerReady(worker);

  await worker.insert("activity", "name", `'${name}'`);
  await loadActivities();
};

export const loadProjects = async () => {
  isWorkerReady(worker);

  await worker.setup();
  const response = await worker.list("projects");

  const projectList: Project[] = [];
  if (response?.result?.resultRows) {
    response.result.resultRows.forEach((value) => {
      projectList.push({ name: value[0], color: value[1] });
    });
  }

  projects.set(projectList);
};

export const addProjects = async (name: string, color: string = "#fffff") => {
  isWorkerReady(worker);

  await worker.insert("project", "name, color", `'${name}, '${color}'`);
  await loadProjects();
};

export const reset = async (table?: string) => {
  isWorkerReady(worker);

  await worker.reset(table);
  await loadActivities();
  await loadProjects();
};
