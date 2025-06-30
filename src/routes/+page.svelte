<script lang="ts">
    import { clearItems, listAllItems } from "$lib/database/dev";
    import { db } from "$lib/database/db";
    import {
        pauseCountdown,
        resumeCountdown,
        seconds,
        startCountdown,
        stopCountdown,
        TimerState,
    } from "$lib/timer";
    import SelectModal from "$lib/components/derived/SelectModal.svelte";
    import { addActivity, getActivities } from "$lib/database/schemas/activity";
    import { addProject, getProjects } from "$lib/database/schemas/project";

    let activityName: string = $state("Activity");
    let projectName: string = $state("Project");

    let timerState = $state(TimerState.Stopped);
    let isPomodoro = $state(false);
</script>

<button onclick={async () => await listAllItems(db.activities)}
    >List all items</button
>
<button
    onclick={async () => {
        await clearItems();
    }}>Clear db</button
>

<div class="container-md py-4">
    <div class="settings-container">
        <button id="settings">
            <img src="/gear.svg" alt="gear" />
        </button>
    </div>

    <form class="pt-4">
        <div class="mb-3">
            <SelectModal
                bind:name={activityName}
                getter={() => getActivities()}
                setter={(name: string) => addActivity(name)}
            ></SelectModal>

            <SelectModal
                bind:name={projectName}
                getter={() => getProjects()}
                setter={(name: string) => addProject(name)}
            ></SelectModal>

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
