import type { DbWorker } from "$lib/database.worker";
import type { Project } from "$lib/types/schema";

export const listProjects = async (dbWorker: DbWorker): Promise<Project[]> => {
  const response = await dbWorker.list("project");
  return (response?.result?.resultRows as Project[]) || [];
};

export const addProject = async (
  dbWorker: DbWorker,
  name: string,
  color: string,
): Promise<Project[]> => {
  await dbWorker?.insert("project", "name, color", `'${name}', '${color}'`);
  return await listProjects(dbWorker);
};
