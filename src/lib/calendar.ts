export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
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
  newStartTime: Date | null,
  newEndTime: Date | null,
  event: CalendarEvent,
): Promise<string[]> {
  const toUpdate: string[] = [];

  const startTimeChanged =
    newStartTime && newStartTime.getTime() !== new Date(event.start).getTime();
  const endTimeChanged =
    newEndTime && newEndTime.getTime() !== new Date(event.end).getTime();

  if (!startTimeChanged && !endTimeChanged) {
    return toUpdate;
  }

  const finalStartTime = startTimeChanged
    ? newStartTime
    : new Date(event.start);
  const finalEndTime = endTimeChanged ? newEndTime : new Date(event.end);

  if (finalStartTime.getTime() >= finalEndTime.getTime()) {
    console.error("Start time must be before end time.");
    // TODO: You might want to show this error to the user in the UI
    return toUpdate;
  }

  const newElapsed = finalEndTime.getTime() - finalStartTime.getTime();

  if (startTimeChanged) {
    toUpdate.push(`start = ${finalStartTime.getTime()}`);
  }

  if (endTimeChanged) {
    toUpdate.push(`end = ${finalEndTime.getTime()}`);
  }

  toUpdate.push(`elapsed = ${newElapsed}`);
  return toUpdate;
}
