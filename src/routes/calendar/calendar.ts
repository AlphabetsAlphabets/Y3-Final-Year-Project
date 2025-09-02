import type { DbWorker } from "$lib/database.worker";
import type { Log } from "$lib/types/schema";
import { startCountdown, stopCountdown } from "../home/timer";
import { addLog } from "./log";

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
}

export type FullCalendarCalendarEvent = {
  event: CalendarEvent;
  allDay: false;
  date: string;
  dateStr: string;
};

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export async function updateEventTitle(
  newTitle: string,
  event: CalendarEvent,
): Promise<string[]> {
  const titleChanged = newTitle.length > 0 && newTitle !== event.title;
  if (titleChanged) {
    return [`activity = '${newTitle}'`];
  }

  return [];
}

export async function updateEventColor(
  newColor: string,
  event: CalendarEvent,
): Promise<string[]> {
  const colorChanged =
    newColor.length !== 0 && newColor !== event.backgroundColor;

  if (colorChanged) {
    return [`color = '${newColor}'`, `color = '${event.backgroundColor}'`];
  }

  return [];
}

export async function updateEventTime(
  newStartTime: Date,
  newEndTime: Date,
): Promise<string[]> {
  const toUpdate: string[] = [];

  const newElapsed = (newEndTime.getTime() - newStartTime.getTime()) / 1000;
  if (newStartTime.getTime() >= newEndTime.getTime()) {
    console.error("Start time must be before end time.");
    // TODO: You might want to show this error to the user in the UI
    return toUpdate;
  }

  toUpdate.push(`start = ${newStartTime.getTime()}`);
  toUpdate.push(`end = ${newEndTime.getTime()}`);
  toUpdate.push(`elapsed = ${newElapsed}`);

  return toUpdate;
}

export const createEventWithClick = async (
  dbWorker: DbWorker,
): Promise<CalendarEvent> => {
  startCountdown();
  const [startDate, endDate, elapsed] = stopCountdown();

  await addLog(
    dbWorker,
    "NEW EVENT",
    "No Project",
    elapsed,
    startDate,
    endDate,
  );

  const queryResult = await dbWorker.list(
    "log",
    "",
    `elapsed = ${elapsed} AND start = ${startDate} AND end = ${endDate}`,
  );

  const resultRows = queryResult.result.resultRows;

  if (resultRows.length != 1) {
    console.error("Something went wrong.");
  }

  const newEvent = resultRows[0] as Log;

  return {
    id: newEvent.id,
    title: newEvent.activity,
    start: new Date(newEvent.start),
    end: new Date(newEvent.end),
    backgroundColor: "#000000",
  };
};
