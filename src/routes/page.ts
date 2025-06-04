import type { Writable } from "svelte/store";

export function handleStart(buttonState: Writable<string>) {
  console.log("start to pause-stop");
  console.log("resume-stop to pause-stop");
  buttonState.set("pause-stop");
}

export function handlePause(buttonState: Writable<string>) {
  console.log("pause-stop to resume-stop");
  buttonState.set("resume-stop");
}

export function handleResume(buttonState: Writable<string>) {
  buttonState.set("pause-stop");
}

export function handleStop(buttonState: Writable<string>) {
  console.log("pause-stop or resume-stop to start");
  buttonState.set("start");
}
