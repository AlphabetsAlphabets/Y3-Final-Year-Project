import type { Table } from "dexie";
import { db } from "./db";

export async function clearItems() {
  await db.activities.clear();
  console.log("Cleared");
}

export async function listAllItems<T, U>(table: Table<T, U>) {
  const values = await table.toArray();
  console.log(`Items in table "${table.name}":`);
  values.forEach((value) => console.log(value));
}
