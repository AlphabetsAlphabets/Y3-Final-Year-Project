<script lang="ts">
    import type { DbWorker } from "$lib/database.worker";
    import * as Comlink from "comlink";
    import { onMount } from "svelte";

    import { addTask, listTasks } from "./task";

    import type { Task } from "$lib/types/schema";
    import Todo from "./Todo.svelte";
    import Done from "./Done.svelte";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    let tasks: Task[] = $state([]);
    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
        tasks = await listTasks(dbWorker);
    };

    let newTaskName = $state("");
    let newTaskDescription = $state("");

    let addNewTask = async () => {
        if (dbWorker) {
            tasks = await addTask(dbWorker, newTaskName, newTaskDescription);
        } else {
            console.error("Worker is not ready. Please try again.");
        }
    };

    onMount(loadWorker);
</script>

<div class="container">
    <header>
        <h1>Tasks</h1>
        <p>Stay organized and get things done.</p>
    </header>

    <div class="add-task-wrapper">
        <div class="task-inputs">
            <input
                type="text"
                bind:value={newTaskName}
                placeholder="e.g., Finish project report"
            />
            <input
                type="text"
                class="description-input"
                bind:value={newTaskDescription}
                placeholder="description"
            />
        </div>
        <button aria-label="Add new task" onclick={addNewTask}>
            <i class="bi bi-plus-lg"></i>
            <span>Add Task</span>
        </button>
    </div>

    {#key dbWorker}
        {#if dbWorker}
            <Done {dbWorker} bind:tasks />
            <Todo {dbWorker} bind:tasks />
        {:else}
            <p>Please wait while the app loads.</p>
        {/if}
    {/key}
</div>

<style>
    .container {
        max-width: 700px;
        margin: 2rem auto;
        padding: 1rem;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
    }

    header {
        margin-bottom: 2rem;
    }

    h1 {
        font-size: 2rem;
        font-weight: 600;
        color: #212529;
    }

    p {
        color: #6c757d;
    }

    .add-task-wrapper {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .task-inputs {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .add-task-wrapper input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-size: 1rem;
        transition:
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        box-sizing: border-box;
    }

    .description-input {
        font-size: 0.8rem !important;
        padding: 0.4rem 0.8rem !important;
    }

    .add-task-wrapper input:focus {
        outline: none;
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }

    .add-task-wrapper button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background-color: #0d6efd;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
    }

    .add-task-wrapper button:hover {
        background-color: #0b5ed7;
    }

    .add-task-wrapper button .bi {
        font-size: 1.2rem;
    }
</style>
