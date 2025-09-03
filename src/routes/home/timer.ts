import { writable, type Writable } from "svelte/store";

export const seconds: Writable<number> = writable(0);

export const TimerState = {
  Running: "Running",
  Paused: "Paused",
  Stopped: "Stopped",
};

let startDate: number = -1;
let endDate: number = -1;

let id: ReturnType<typeof setInterval> | null = null;
let is_paused = false;

export function startCountdown() {
  is_paused = false;
  seconds.set(0);

  id = setInterval(() => {
    if (!is_paused) {
      seconds.update((s) => s + 1);
    }
  }, 1000);

  startDate = Date.now();
}

export function stopCountdown(): [number, number, number] {
  if (id !== null) {
    clearInterval(id);
    id = null;
  }

  endDate = Date.now();
  // milliseconds
  const elapsed = endDate - startDate;

  seconds.set(0);
  is_paused = false;

  // Convert elapsed to seconds
  return [startDate, endDate, elapsed / 1000];
}

export function pauseCountdown() {
  is_paused = true;
}

export function resumeCountdown() {
  is_paused = false;
}

export const secondsToHMS = (
  time: number,
): { hours: number; minutes: number; seconds: number } => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return { hours, minutes, seconds };
};
