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

export const updateProjectColor = async (
  dbWorker: DbWorker,
  name: string,
  color: string,
): Promise<Project[]> => {
  await dbWorker.update("project", `color = '${color}'`, `name = '${name}'`);
  return await listProjects(dbWorker);
};

export const updateProjectName = async (
  dbWorker: DbWorker,
  oldName: string,
  newName: string,
): Promise<Project[]> => {
  await dbWorker.update(
    "project",
    `name = '${newName}'`,
    `name = '${oldName}'`,
  );
  return await listProjects(dbWorker);
};

export const findProjectFromColor = async (
  dbWorker: DbWorker,
  color: string,
): Promise<Project> => {
  const none = {} as Project;
  const response = await dbWorker.list("project", "name", `color = '${color}'`);

  if (!response) {
    console.error("Failed to execute query.");
    return none;
  }

  if (!response.result) {
    console.error("No results from response.");
    return none;
  }

  const result = response.result;

  if (!result.resultRows) {
    console.error("No result rows.");
    return none;
  }

  const resultRows = result.resultRows;

  if (resultRows.length != 1) {
    console.error("More than one project detected from the same color.");
    return none;
  }

  return response.result.resultRows[0] as Project;
};
