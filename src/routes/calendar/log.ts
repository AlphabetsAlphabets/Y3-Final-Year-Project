import type Modal from "$lib/components/Modal.svelte";

import type { Log, Project } from "$lib/types/schema";
import type { DbWorker } from "$lib/database.worker";

import {
  updateEventColor,
  updateEventTime,
  updateEventTitle,
  type CalendarEvent,
} from "./calendar";

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

export const deleteLog = async (dbWorker: DbWorker, id: number) => {
  await dbWorker.remove("log", `id = ${id}`);
};

export const handleActivityUpdate = async (
  modal: Modal,
  dbWorker: DbWorker,
  newTitle: string,
  newColor: string,
  event: CalendarEvent,
  newStartTime: Date | null,
  newEndTime: Date | null,
  updateEvent: any,
) => {
  const toUpdate: string[] = [];

  const updateTitle = await updateEventTitle(newTitle, event);
  toUpdate.push(...updateTitle);

  if (newStartTime && newEndTime) {
    const update = await updateEventTime(newStartTime, newEndTime);
    toUpdate.push(...update);
  } else if (newStartTime) {
    const updateStart = await updateEventTime(newStartTime, event.end);
    toUpdate.push(...updateStart);
  } else if (newEndTime) {
    const updateEnd = await updateEventTime(event.start, newEndTime);
    toUpdate.push(...updateEnd);
  } else {
    console.error("Something went wrong.");
  }

  const query = await updateEventColor(newColor, event);
  if (query.length !== 0) {
    dbWorker.update("project", query[0], query[1]);
  }

  if (toUpdate.length === 0) {
    modal.closeModal();
    if (query.length !== 0) {
      updateEvent();
    }
    return;
  }

  await updateLog(dbWorker, toUpdate.join(", "), `id = ${event.id}`);

  updateEvent();
  modal.closeModal();
};
