import { writable, type Writable } from "svelte/store";

export const seconds: Writable<number> = writable(0);

let id: number | null = 0;
let paused = 0;
let is_paused = false;

export const TimerState = {
  Running: "Running",
  Resumed: "Resumed",
  Paused: "Paused",
  Stopped: "Stopped",
};

seconds.subscribe((seconds) => console.log(seconds));
export function startCountdown() {
  id = setInterval(() => {
    if (!is_paused) {
      seconds.update((seconds) => seconds + 1);
    } else {
      paused++;
    }
  }, 1000);
}

export function stopCountdown() {
  if (id !== null) {
    seconds.set(0);
    clearInterval(id);
    id = null;
  }
}

export function pauseCountdown() {
  is_paused = true;
}

export function resumeCountdown() {
  seconds.update((seconds) => seconds + paused);
  paused = 0;
  is_paused = false;
}
