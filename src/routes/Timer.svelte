<script lang="ts">
    import * as Comlink from "comlink";
    import { onMount } from "svelte";

    import {
        pauseCountdown,
        resumeCountdown,
        startCountdown,
        stopCountdown,
        TimerState,
    } from "./timer";

    import type { DbWorker } from "$lib/database.worker";
    import { addLog } from "./calendar/log";

    let { activityName, projectName } = $props();

    let timerState = $state(TimerState.Stopped);

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
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
            onclick={async () => {
                if (activityName.length === 0 || activityName === "Activity") {
                    console.log(activityName);
                    console.error("No activity selected.");
                    return;
                }

                let [startDate, endDate, elapsed] = stopCountdown();
                if (!dbWorker) {
                    console.error("No database worker available.");
                    return;
                }

                await addLog(
                    dbWorker,
                    activityName,
                    projectName,
                    elapsed,
                    startDate,
                    endDate,
                );

                timerState = TimerState.Stopped;
            }}>Stop</button
        >
    </div>
{/if}
