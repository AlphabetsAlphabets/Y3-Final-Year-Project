import { get, writable, type Writable } from "svelte/store";
import { logEntry } from "./database/schemas/log";

// Writable store for the timer's seconds
export const seconds: Writable<number> = writable(0);

// Timer state enum
export const TimerState = {
  Running: "Running",
  Paused: "Paused",
  Stopped: "Stopped",
};

let start = Date.now();
let end = Date.now();

let id: ReturnType<typeof setInterval> | null = null;
let is_paused = false;

seconds.subscribe((value) => console.log(value));

export function startCountdown() {
  is_paused = false;
  seconds.set(0);

  id = setInterval(() => {
    if (!is_paused) {
      seconds.update((s) => s + 1);
    }
  }, 1000);

  start = Date.now();
}

export function stopCountdown(activity: string, projectName: string) {
  if (id !== null) {
    clearInterval(id);
    id = null;
  }

  const finalSeconds = get(seconds);
  end = Date.now();
  logEntry(activity, projectName, start, end, finalSeconds);

  seconds.set(0);
  is_paused = false;
}

export function pauseCountdown() {
  is_paused = true;
}

export function resumeCountdown() {
  is_paused = false;
}
