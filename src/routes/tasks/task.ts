import type { DbWorker } from "$lib/database.worker";
import type { Task } from "$lib/types/schema";
import { listTasks } from "$lib/utils/task";

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

export const deleteTask = async (
  dbWorker: DbWorker,
  taskId: number,
): Promise<Task[]> => {
  await dbWorker.remove(TABLE, `id = ${taskId}`);
  return await listTasks(dbWorker);
};

export const deleteCompletedTasks = async (
  dbWorker: DbWorker,
): Promise<Task[]> => {
  await dbWorker.remove("tasks", "completed = 1");
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

export const updateTaskName = async (
  dbWorker: DbWorker,
  taskId: number,
  newName: string,
): Promise<Task[]> => {
  await dbWorker.update(TABLE, `name = '${newName}'`, `id = ${taskId}`);
  return await listTasks(dbWorker);
};

export const markTaskIncomplete = async (
  dbWorker: DbWorker,
  taskId: number,
): Promise<Task[]> => {
  await dbWorker.update(
    TABLE,
    `completed = 0, completed_at = NULL`,
    `id = ${taskId}`,
  );
  return await listTasks(dbWorker);
};
