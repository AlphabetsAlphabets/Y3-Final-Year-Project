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
