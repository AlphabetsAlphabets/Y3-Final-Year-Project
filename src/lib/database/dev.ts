import type { Table } from "dexie";
import { db } from "./db";

export async function clearActivities() {
  await db.activities.clear();
  console.log("Cleared activities.");
}

export async function clearProjects() {
  await db.projects.clear();
  console.log("Cleared projects.");
}

export async function clearLogs() {
  await db.logs.clear();
  console.log("Cleared logs.");
}

export async function listAllItems<T, U>(table: Table<T, U>) {
  const values = await table.toArray();
  console.log(`Items in table "${table.name}":`);
  values.forEach((value) => console.log(value));
}
