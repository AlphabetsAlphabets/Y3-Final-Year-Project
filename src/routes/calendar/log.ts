import type { Log, Project } from "$lib/types/schema";
import type { DbWorker } from "$lib/database.worker";

export const listLog = async (dbWorker: DbWorker): Promise<Log[]> => {
  const response = await dbWorker.list("log");
  console.log("Received logs from worker", response);
  if (!(response && response.result && response.result.resultRows)) {
    console.error("Something went wrong.");
  }

  const results = response.result.resultRows as Log[];
  const logs = Promise.all(
    results.map(async (log: Log) => {
      // get the project name and query the project table
      const color = await dbWorker.list(
        "project",
        "color",
        `name = '${log.project_name}'`,
      );

      log.project_color = (color.result.resultRows[0] as Project).color;
      return log;
    }),
  );

  return logs || [];
};

export const addLog = async (
  dbWorker: DbWorker,
  name: string,
  projectName: string,
  elapsed: number,
  start: number,
  end: number,
): Promise<Log[]> => {
  await dbWorker.insert(
    "log",
    "activity, project_name, elapsed, start, end",
    `'${name}', '${projectName}', ${elapsed}, ${start}, ${end}`,
  );

  return await listLog(dbWorker);
};

export const updateLog = async (
  dbWorker: DbWorker,
  toUpdate: string,
  clause: string,
) => {
  await dbWorker.update("log", toUpdate, clause);
};
