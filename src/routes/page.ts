import { writable } from "svelte/store";

let id: number | null = 0;
let paused = 0;
let is_paused = false;

export const seconds = writable(0);

export enum TimerState {
  Running,
  Resumed,
  Paused,
  Stopped,
}

export const timer_state = writable(TimerState.Stopped);

export function start() {
  timer_state.set(TimerState.Running);
  id = setInterval(() => {
    if (!is_paused) {
      seconds.update((seconds) => seconds + 1);
    } else {
      paused++;
    }

    seconds.subscribe((s) => console.log(s));
  }, 1000);
}

export function stop() {
  if (id !== null) {
    seconds.set(0);
    timer_state.set(TimerState.Stopped);
    clearInterval(id);
    id = null;
  }
}

export function pause() {
  is_paused = true;
  timer_state.set(TimerState.Paused);
}

export function resume() {
  seconds.update((seconds) => seconds + paused);
  paused = 0;
  is_paused = false;
  timer_state.set(TimerState.Running);
}
