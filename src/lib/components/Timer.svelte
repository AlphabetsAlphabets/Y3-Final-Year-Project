<script lang="ts">
    import {
        pauseCountdown,
        resumeCountdown,
        startCountdown,
        stopCountdown,
        TimerState,
    } from "$lib/timer";

    import { writable } from "svelte/store";

    const timerState = writable(TimerState.Stopped);

    function start() {
        timerState.set(TimerState.Running);
        startCountdown();
    }

    function stop() {
        timerState.set(TimerState.Stopped);
        stopCountdown();
    }

    function pause() {
        timerState.set(TimerState.Paused);
        pauseCountdown();
    }

    function resume() {
        timerState.set(TimerState.Running);
        resumeCountdown();
    }
</script>

{#if $timerState === TimerState.Stopped}
    <button
        type="button"
        class="btn btn-outline-success w-100 h-100 d-flex justify-content-center align-items-center"
        onclick={start}>Start</button
    >
{/if}
{#if $timerState === TimerState.Running}
    <div
        style="display: flex; justify-content: space-between; margin-top: 10px;"
    >
        <button
            type="button"
            class="btn btn-outline-warning flex-grow-1"
            style="margin-right: 10px;"
            onclick={pause}>Pause</button
        >
        <button
            type="button"
            class="btn btn-outline-danger flex-grow-1"
            onclick={stop}>Stop</button
        >
    </div>
{/if}
{#if $timerState === TimerState.Paused}
    <div
        style="display: flex; justify-content: space-between; margin-top: 10px;"
    >
        <button
            type="button"
            class="btn btn-outline-primary flex-grow-1"
            style="margin-right: 10px;"
            onclick={resume}>Resume</button
        >
        <button
            type="button"
            class="btn btn-outline-danger flex-grow-1"
            onclick={stop}>Stop</button
        >
    </div>
{/if}
