import { liveQuery, type Observable } from "dexie";
import { db } from "../db";

export interface Project {
  name: string;
}

export function getProjects(): Observable<Project[]> {
  return liveQuery(() => db.projects.toArray());
}

export async function addProject(name: string) {
  let status = "";
  try {
    const count = await db.projects.where("name").equals(name).count();
    if (count !== 0) {
      console.error(`Project '${name}' already exists.`);
      return;
    }

    db.projects.add({
      name: name,
    });

    status = `Project "${name}" has been added`;
  } catch (error) {
    status = `Failed due to ${error}`;
  }

  console.log(status);
}
