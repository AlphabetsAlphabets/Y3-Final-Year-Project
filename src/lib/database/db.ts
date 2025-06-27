import Dexie, { type EntityTable } from "dexie";
import { type Activity } from "./schemas/activity";
import type { Project } from "./schemas/project";
import type { Log } from "./schemas/log";

const db = new Dexie("activityDB") as Dexie & {
  activities: EntityTable<Activity, "id">;
  projects: EntityTable<Project, "name">;
  logs: EntityTable<Log, "id">;
};

db.version(5).stores({
  activities: "++id, name",
  projects: "&name",
  logs: "++id, activity, project, elapsed, start, end",
});

export { db };
