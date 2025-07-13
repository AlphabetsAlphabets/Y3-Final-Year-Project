<script lang="ts">
    import { onMount } from "svelte";

    import type { MessageReply } from "$lib/types/message";
    import type { RowModeArray } from "$lib/types/promiser";

    import Modal from "$lib/components/Modal.svelte";
    import SelectModal from "$lib/components/derived/SelectModal.svelte";
    import MessageModal from "$lib/components/derived/MessageModal.svelte";
    import ProjectModal from "$lib/components/derived/ProjectModal.svelte";

    import {
        pauseCountdown,
        resumeCountdown,
        seconds,
        startCountdown,
        stopCountdown,
        TimerState,
    } from "$lib/timer";
    import { Command } from "$lib/workers/commands";

    let activityName: string = $state("Activity");
    let projectName: string = $state("Project");

    let timerState = $state(TimerState.Stopped);
    let isPomodoro = $state(false);

    let modal: Modal | null = $state(null);

    let names: {
        id: number;
        name: string;
    }[] = $state([]);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        let worker = new Worker.default();

        worker.onmessage = (e) => {
            console.log("message received from worker.");

            let reply: MessageReply = e.data;
            if (reply.messageId === 3 && reply.data) {
                let response = reply.data as RowModeArray;
                let results = response.result.resultRows;
                results.forEach((value) => {
                    names.push({ id: value[0], name: value[1] });
                });
            }
        };

        // worker.postMessage({
        //     command: "new user",
        //     messageId: 1,
        //     data: ["Jack Black"],
        // });
        worker.postMessage({ command: Command.INIT, messageId: 1 });
        // worker.postMessage({ command: Command.LIST, messageId: 3 });
    };

    onMount(loadWorker);
</script>

<MessageModal bind:modal></MessageModal>

<div class="container-md py-4">
    <div class="settings-container">
        <button id="settings">
            <img src="/gear.svg" alt="gear" />
        </button>
    </div>
    {#key names}
        <SelectModal options={names} />
    {/key}

    <form class="pt-4">
        <div class="mb-3">
            <div class="goal-container">
                <span class="goal-label">Goal</span>
                <input type="text" class="goal-input" />
            </div>
            <div class="mb-3">
                <button
                    type="button"
                    class="btn pomodoro-btn w-100"
                    class:active={isPomodoro}
                    onclick={() => (isPomodoro = !isPomodoro)}
                >
                    Pomodoro
                </button>
            </div>
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
                            stopCountdown(activityName, projectName);
                            timerState = TimerState.Stopped;
                        }}>Stop</button
                    >
                </div>
            {/if}
        </div>
    </form>
    <div class="timer-display-container">
        <div class="timer-display">
            <p>{$seconds}s</p>
        </div>
    </div>
</div>

<style>
    .settings-container {
        position: fixed;
        top: 0;
        right: 0;
        margin: 10px;
    }

    .goal-container {
        display: flex;
        align-items: center;
        margin: 10px 0;
    }

    .goal-label {
        margin-right: 10px;
    }

    .goal-input {
        flex-grow: 1;
        border-radius: 15px;
        background-color: white;
        border: 2px solid lightblue;
        padding: 5px;
    }

    .timer-display-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }

    .timer-display {
        width: 300px;
        height: 100px;
        border-radius: 15px;
        background-color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pomodoro-btn {
        background-color: white;
        border: 2px solid var(--bs-success);
        color: var(--bs-success);
    }

    .pomodoro-btn.active,
    .pomodoro-btn:hover {
        background-color: var(--bs-success);
        color: white;
    }
</style>
