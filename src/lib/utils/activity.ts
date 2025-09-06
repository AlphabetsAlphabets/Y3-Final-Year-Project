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

export const deleteActivity = async (
  dbWorker: DbWorker,
  activityId: number,
): Promise<Activity[]> => {
  await dbWorker.remove("activity", `id = ${activityId}`);
  return await listActivities(dbWorker);
};

export const updateActivityName = async (
  dbWorker: DbWorker,
  oldName: string,
  newName: string,
): Promise<Activity[]> => {
  await dbWorker.update(
    "activity",
    `name = '${newName}'`,
    `name = '${oldName}'`,
  );
  return await listActivities(dbWorker);
};
