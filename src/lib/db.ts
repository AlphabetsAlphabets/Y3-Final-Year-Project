// The reason the app isn't accessible while offline is because the
// files that I should cache are wrong.
// https://dexie.org/docs/Typescript

import Dexie, { type EntityTable } from "dexie";

interface Activity {
  id: number;
  name: string;
  project: string;
}

const db = new Dexie("activityDB") as Dexie & {
  activities: EntityTable<Activity, "id">;
};

db.version(1).stores({
  activities: "++id, name, project",
});

export type { Activity };
export { db };
