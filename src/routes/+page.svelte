<script lang="ts">
    import { onMount } from "svelte";

    import * as Comlink from "comlink";
    import type { DbWorker } from "$lib/workers/database.worker";
    import type { RowModeArray } from "$lib/types/promiser";

    import Modal from "$lib/components/Modal.svelte";
    import SelectModal from "$lib/components/derived/SelectModal.svelte";
    import MessageModal from "$lib/components/derived/MessageModal.svelte";
    import ProjectModal from "$lib/components/derived/ProjectModal.svelte";

    import Timer from "$lib/components/Timer.svelte";
    import { seconds } from "$lib/timer";

    let activities: {
        id: number;
        name: string;
    }[] = $state([]);

    let projects: {
        name: string;
        color: string;
    }[] = $state([]);

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    // Function to add an activity
    let addActivities = $state();
    let addProjects = $state();

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        // Create Comlink wrapper for the worker
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());

        console.log("Setting up database");
        // Initialize and setup the database
        await dbWorker.setup();

        // Load activity data
        let response = await dbWorker.list("activity");
        console.log("Received activities from worker", response);

        if (response && response.result && response.result.resultRows) {
            response.result.resultRows.forEach((value) => {
                activities.push({ id: value[0], name: value[1] });
            });
        }

        response = await dbWorker.list("project");
        console.log("Received projects from worker", response);
        if (response && response.result && response.result.resultRows) {
            response.result.resultRows.forEach((value) => {
                console.log(value);
                projects.push({ name: value[0], color: value[1] });
            });
        }

        addActivities = async (name: string) => {
            console.log("Adding activity:", name);
            if (dbWorker) {
                await dbWorker.insert("activity", "name", `'${name}'`);

                // Refresh the list after insertion
                const newResponse = await dbWorker.list("activity");

                // Clear and update names array
                activities = [];
                if (
                    newResponse &&
                    newResponse.result &&
                    newResponse.result.resultRows
                ) {
                    newResponse.result.resultRows.forEach((value) => {
                        activities.push({ id: value[0], name: value[1] });
                    });
                }
            }
        };

        addProjects = async (name: string, color: string = "#3498db") => {
            if (dbWorker) {
                await dbWorker.insert(
                    "project",
                    "name, color",
                    `'${name}', '${color}'`,
                );

                // Refresh the list after insertion
                const newResponse = await dbWorker.list("project");
                console.log(newResponse);

                projects = [];
                if (
                    newResponse &&
                    newResponse.result &&
                    newResponse.result.resultRows
                ) {
                    newResponse.result.resultRows.forEach((value) => {
                        projects.push({ name: value[0], color: value[1] });
                    });
                }
            }
        };
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
    {#key activities || addActivities}
        <SelectModal options={activities} fn={addActivities} />
    {/key}

    {#key projects || addProjects}
        <ProjectModal options={projects} fn={addProjects} />
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
