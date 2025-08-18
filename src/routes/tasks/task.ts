import type { DbWorker } from "$lib/database.worker";
import type { Task } from "$lib/types/schema";

const TABLE = "tasks";

export const addTask = async (
  dbWorker: DbWorker,
  task: string,
  description: string = "",
): Promise<Task[]> => {
  const createdAt = Date.now();
  await dbWorker.insert(
    TABLE,
    "name, description, created_at",
    `'${task}', '${description}', ${createdAt}`,
  );

  return await listTasks(dbWorker);
};

export const listTasks = async (dbWorker: DbWorker): Promise<Task[]> => {
  const response = await dbWorker.list(TABLE);
  return (response?.result?.resultRows as Task[]) || [];
};

export const deleteTask = async (
  dbWorker: DbWorker,
  taskId: number,
): Promise<Task[]> => {
  await dbWorker.remove(TABLE, `id = ${taskId}`);
  return await listTasks(dbWorker);
};

export const markTaskComplete = async (
  dbWorker: DbWorker,
  taskId: number,
): Promise<Task[]> => {
  const completedAt = Date.now();
  await dbWorker.update(
    TABLE,
    `completed = 1, completed_at = ${completedAt}`,
    `id = ${taskId}`,
  );
  return await listTasks(dbWorker);
};
