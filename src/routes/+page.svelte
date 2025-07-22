<script lang="ts">
    import { onMount } from "svelte";

    import Modal from "$lib/components/Modal.svelte";
    import SelectModal from "$lib/components/derived/SelectModal.svelte";
    import MessageModal from "$lib/components/derived/MessageModal.svelte";
    import ProjectModal from "$lib/components/derived/ProjectModal.svelte";

    import Timer from "$lib/components/Timer.svelte";
    import { seconds } from "$lib/timer";

    import * as Comlink from "comlink";

    import {
        loadActivities,
        loadProjects,
        addProjects,
        addActivity,
        activites,
        projects,
        initWorker,
    } from "$lib/database/services";
    import { dbWorker } from "$lib/workers/database.worker";

    let activity: string = $state("Activity");
    let project: string = $state("Project");

    let isPomodoro = $state(false);

    let modal: Modal | null = $state(null);

    const loadWorker = async () => {
        await initWorker();
        // This is here instead of database.worker.ts is because
        // you can't expose without the worker being setup.
        Comlink.expose(dbWorker);
        await loadActivities();
        await loadProjects();
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
    {#key activites || addActivity}
        <SelectModal selected={activity} options={activites} fn={addActivity} />
    {/key}

    {#key projects || addProjects}
        <ProjectModal selected={project} options={projects} fn={addProjects} />
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
                <Timer elapsed={seconds} activity project />
            </div>
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
