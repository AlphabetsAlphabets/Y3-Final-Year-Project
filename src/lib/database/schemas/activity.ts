import { liveQuery, type Observable } from "dexie";
import { db } from "$lib/database/db";

export interface Activity {
  id: number;
  name: string;
}

export function getActivities(): Observable<Activity[]> {
  return liveQuery(() => db.activities.toArray());
}

export async function addActivity(name: string) {
  let status = "";
  try {
    const count = await db.activities.where("name").equals(name).count();
    if (count !== 0) {
      console.error("Already exists.");
      return;
    }

    db.activities.add({
      name: name,
    });

    status = `Activity "${name}" has been added`;
  } catch (error) {
    status = `Failed due to ${error}`;
  }

  console.log(status);
}
