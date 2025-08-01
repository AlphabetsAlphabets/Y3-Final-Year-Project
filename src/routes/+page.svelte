<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Timer from "$lib/components/Timer.svelte";
    import SelectModal from "$lib/components/derived/SelectModal.svelte";

    import { seconds } from "$lib/timer";

    // If there is an ep.EventListener error then the cause is this import statement.
    // comlink requires the worker be exposed via Comlink.expose but importing this file
    // runs that code and it may be ran BEFORE the worker is ready. Which causes
    // the EventListener error.
    import type { DbWorker } from "$lib/workers/database.worker";
    import ProjectModal from "$lib/components/derived/ProjectModal.svelte";

    let activityName: string = $state("Activity");
    let projectName: string = $state("Project");
    let projectColor: string = $state("");
    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);

    let isPomodoro = $state(false);
</script>

<div class="container-md py-4">
    <div class="settings-container">
        <button id="settings">
            <img src="/gear.svg" alt="gear" />
        </button>
    </div>

    {#if dbWorker}
        {#key dbWorker}
            <SelectModal bind:selected={activityName} />
            <ProjectModal
                bind:selected={projectName}
                bind:color={projectColor}
            />
        {/key}
    {:else}
        <p>Please wait while the app loads</p>
    {/if}

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

                {#if dbWorker}
                    {#key dbWorker}
                        <Timer {activityName} {projectName} {projectColor} />
                    {/key}
                {:else}
                    <p>Please wait while the app loads</p>
                {/if}
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
