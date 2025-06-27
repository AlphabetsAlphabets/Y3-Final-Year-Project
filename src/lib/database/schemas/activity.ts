// This just doesn't make sense. This is just a string, doesn't really matter
// if it is unique or not. It's just a string. If this wants to exist, there should
// be a separate reason for it. So, far it's just there to display a list of activities.
// Maybe this can be a list of recent 5 activities?
//
// If "reading" is under "resting". If your activity has reading again, it'll be
// given the "resting" project.

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
