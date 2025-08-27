<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    // If there is an ep.EventListener error then the cause is this import statement.
    // comlink requires the worker be exposed via Comlink.expose but importing this file
    // runs that code and it may be ran BEFORE the worker is ready. Which causes
    // the EventListener error.
    import type { DbWorker } from "$lib/database.worker";
    import type { Activity, Log, Project, Task } from "$lib/types/schema";

    import ProjectModal from "./ProjectModal.svelte";
    import SelectModal from "./SelectModal.svelte";
    import Todo from "../tasks/Todo.svelte";
    import Timer from "./Timer.svelte";
    import RecentlyDone from "./RecentlyDone.svelte";

    import { listTasks } from "$lib/utils/task";
    import { listActivities } from "$lib/utils/activity";
    import { listProjects } from "$lib/utils/projects";
    import { seconds } from "./timer";
    import { listLog } from "../calendar/log";

    let activityName: string = $state("Activity");
    let projectName: string = $state("No Project");
    let projectColor: string = $state("");

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    let tasks: Task[] = $state([]);
    let logs: Log[] = $state([]);

    let activities: Activity[] = $state([]);
    let projects: Project[] = $state([]);

    const getTaskAndActivities = (tasks: Task[], activities: Activity[]) => {
        const taskItems = tasks
            .filter((task) => task.completed == 0)
            .map((task: Task) => {
                return { id: task.id, name: task.name, isTask: true };
            });

        const activityItems = activities.map((activity: Activity) => {
            return { id: activity.id, name: activity.name, isTask: false };
        });

        return [...taskItems, ...activityItems];
    };

    let taskAndActivities: { id: number; name: string; isTask: boolean }[] =
        $derived(getTaskAndActivities(tasks, activities));

    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours}<sup>h</sup>`);
        if (minutes > 0) parts.push(`${minutes}<sup>m</sup>`);
        if (seconds > 0 || parts.length === 0)
            parts.push(`${seconds}<sup>s</sup>`);

        return parts.join("");
    };

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        tasks = await listTasks(dbWorker);
        activities = await listActivities(dbWorker);
        projects = await listProjects(dbWorker);
        logs = await listLog(dbWorker);
    };

    onMount(loadWorker);
</script>

<div class="settings-container">
    <button id="settings" class="btn btn-light rounded-circle p-2 lh-1">
        <img src="/gear.svg" alt="gear" />
    </button>
</div>

<main class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 text-center">
            {#if dbWorker}
                <Todo {dbWorker} bind:tasks />

                <br />

                <form onsubmit={(e) => e.preventDefault()}>
                    <div class="d-flex gap-2 mb-3">
                        <div class="flex-grow-1">
                            <SelectModal
                                {dbWorker}
                                bind:selected={activityName}
                                bind:taskAndActivities
                            />
                        </div>
                        <div class="flex-grow-1">
                            <ProjectModal
                                {dbWorker}
                                bind:selected={projectName}
                                bind:color={projectColor}
                                bind:projects
                            />
                        </div>
                    </div>

                    <div class="display-1 fw-bold my-3">
                        {@html formatTime($seconds)}
                    </div>

                    {#if activityName === "Activity"}
                        <p>Please select or create an activity to track.</p>
                    {:else}
                        <Timer {activityName} {projectName} />
                    {/if}
                </form>

                <RecentlyDone {dbWorker} {logs} />
            {:else}
                <div class="d-flex flex-column align-items-center p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 mb-0">Please wait while the app loads</p>
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    .settings-container {
        position: fixed;
        top: 0;
        right: 0;
        margin: 1rem;
        z-index: 1050; /* Ensure it's above other content */
    }

    /* Make the settings button icon a bit cleaner */
    #settings img {
        width: 1.5rem;
        height: 1.5rem;
    }
</style>
