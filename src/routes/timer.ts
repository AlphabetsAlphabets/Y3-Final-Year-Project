import { get, writable, type Writable } from "svelte/store";

export const seconds: Writable<number> = writable(0);

export const TimerState = {
  Running: "Running",
  Paused: "Paused",
  Stopped: "Stopped",
};

let startDate = Date.now();
let endDate = Date.now();

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

  const elapsed = get(seconds);
  endDate = Date.now();

  seconds.set(0);
  is_paused = false;

  return [startDate, endDate, elapsed];
}

export function pauseCountdown() {
  is_paused = true;
}

export function resumeCountdown() {
  is_paused = false;
}
