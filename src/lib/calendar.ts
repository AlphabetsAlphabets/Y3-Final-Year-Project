export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
}

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

  const newElapsed = newStartTime.getTime() - newEndTime.getTime();
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
