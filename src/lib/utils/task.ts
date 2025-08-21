import type { DbWorker } from "$lib/database.worker";
import type { Task } from "$lib/types/schema";

const TABLE = "tasks";

export const listTasks = async (dbWorker: DbWorker): Promise<Task[]> => {
  const response = await dbWorker.list(TABLE);
  return (response?.result?.resultRows as Task[]) || [];
};
