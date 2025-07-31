<script lang="ts">
    import * as Comlink from "comlink";
    import { onMount } from "svelte";

    import {
        pauseCountdown,
        resumeCountdown,
        startCountdown,
        stopCountdown,
        TimerState,
    } from "$lib/timer";

    import type { DbWorker } from "$lib/workers/database.worker";

    let { activity, project, elapsed = $bindable() } = $props();

    let timerState = $state(TimerState.Stopped);

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);
</script>

{#if timerState === TimerState.Stopped}
    <button
        type="button"
        class="btn btn-outline-success w-100 h-100 d-flex justify-content-center align-items-center"
        onclick={() => {
            startCountdown();
            timerState = TimerState.Running;
        }}>Start</button
    >
{/if}
{#if timerState === TimerState.Running || timerState === TimerState.Paused}
    <div
        style="display: flex; justify-content: space-between; margin-top: 10px;"
    >
        {#if timerState === TimerState.Paused}
            <button
                type="button"
                class="btn btn-outline-primary flex-grow-1"
                style="margin-right: 10px;"
                onclick={() => {
                    resumeCountdown();
                    timerState = TimerState.Running;
                }}>Resume</button
            >
        {:else}
            <button
                type="button"
                class="btn btn-outline-warning flex-grow-1"
                style="margin-right: 10px;"
                onclick={() => {
                    pauseCountdown();
                    timerState = TimerState.Paused;
                }}>Pause</button
            >
        {/if}
        <button
            type="button"
            class="btn btn-outline-danger flex-grow-1"
            onclick={() => {
                if (activity.length === 0 || activity === "Activity") {
                    console.error("No activity selected.");
                    return;
                }

                let [start, end, finalSeconds] = stopCountdown();
                // logEntry(activity, projectName, start, end, finalSeconds);

                timerState = TimerState.Stopped;
            }}>Stop</button
        >
    </div>
{/if}
