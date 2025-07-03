import { liveQuery, type Observable } from "dexie";
import { db } from "../db";
import type { Project } from "./project";

export interface Log {
  id: number;
  activity: string;
  project: Project;
  elasped: number;
  start: number;
  end: number;
}

export const colors: Map<string, string> = new Map();
colors.set("reading", "red");

export async function logEntry(
  activity: string,
  projectName: string,
  start: number,
  end: number,
  elasped: number,
) {
  const project = await db.projects.where("name").equals(projectName).first();
  if (project === undefined) {
    console.error(`Project with "${projectName}" doesn't exist.`);
    return;
  }

  db.logs.add({
    activity,
    project,
    elasped,
    start,
    end,
  });
}

export function getLogs(): Observable<Log[]> {
  return liveQuery(() => db.logs.toArray());
}
