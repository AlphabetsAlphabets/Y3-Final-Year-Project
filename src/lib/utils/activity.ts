import type { DbWorker } from "$lib/database.worker";
import type { Activity } from "$lib/types/schema";

export const listActivities = async (
  dbWorker: DbWorker,
): Promise<Activity[]> => {
  const response = await dbWorker.list("activity");
  console.log("Received activities from worker.", response);
  return (response?.result?.resultRows as Activity[]) || [];
};

export const addActivity = async (
  dbWorker: DbWorker,
  name: string,
): Promise<Activity[]> => {
  await dbWorker.insert("activity", "name", `'${name}'`);
  return await listActivities(dbWorker);
};
