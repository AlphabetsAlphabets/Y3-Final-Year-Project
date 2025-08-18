<script lang="ts">
    import type { DbWorker } from "$lib/database.worker";
    import * as Comlink from "comlink";
    import { onMount } from "svelte";
    import { addTask, deleteTask, listTasks, markTaskComplete } from "./task";
    import type { Task } from "$lib/types/schema";

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
    let isDoneListCollapsed = $state(true);

    let finishTask = async (taskId: number) => {
        if (dbWorker) {
            tasks = await markTaskComplete(dbWorker, taskId);
        } else {
            console.error("Worker is not ready. Please try again.");
        }
    };

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

    <div class="tasks-section">
        <button
            class="section-title-button"
            onclick={() => (isDoneListCollapsed = !isDoneListCollapsed)}
        >
            <h2 class="section-title">Done</h2>
            <i class="bi bi-chevron-down" class:rotated={isDoneListCollapsed}
            ></i>
        </button>
        {#if !isDoneListCollapsed}
            <ul class="task-list">
                {#each tasks as task (task.id)}
                    {#if task.completed}
                        <li class="task-item">
                            <button
                                aria-label="Finish task"
                                class="checkbox"
                                onclick={async () => finishTask(task.id)}
                            >
                                <i class="bi bi-check"></i>
                            </button>
                            <span class="task-name">{task.name}</span>
                            <small>{task.description}</small>
                            <button
                                class="delete-btn"
                                aria-label="Delete task"
                                onclick={async () => {
                                    if (dbWorker) {
                                        tasks = await deleteTask(
                                            dbWorker,
                                            task.id,
                                        );
                                    } else {
                                        console.error(
                                            "Worker not ready. Please wait.",
                                        );
                                    }
                                }}
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </li>
                    {/if}
                {/each}
            </ul>
        {/if}
    </div>

    <div class="tasks-section">
        <h2 class="section-title">Todo</h2>
        <ul class="task-list">
            {#each tasks as task (task.id)}
                {#if !task.completed}
                    <li class="task-item">
                        <button
                            aria-label="Finish task"
                            class="checkbox"
                            onclick={async () => finishTask(task.id)}
                        >
                            <i class="bi bi-check"></i>
                        </button>
                        <span class="task-name">{task.name}</span>
                        <small>{task.description}</small>
                        <button
                            class="delete-btn"
                            aria-label="Delete task"
                            onclick={async () => {
                                if (dbWorker) {
                                    tasks = await deleteTask(dbWorker, task.id);
                                } else {
                                    console.error(
                                        "Worker not ready. Please wait.",
                                    );
                                }
                            }}
                        >
                            <i class="bi bi-trash"></i>
                        </button>
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
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

    .tasks-section {
        margin-bottom: 2rem;
    }

    .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #212529;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .section-title-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 1rem;
    }

    .section-title-button .section-title {
        margin-bottom: 0;
        border-bottom: none;
    }

    .section-title-button .bi-chevron-down {
        transition: transform 0.2s ease-in-out;
    }

    .section-title-button .bi-chevron-down.rotated {
        transform: rotate(-90deg);
    }

    .task-list {
        list-style: none;
        padding: 0;
        max-height: 300px;
        overflow-y: auto;
        padding-right: 0.5rem; /* For scrollbar spacing */
    }

    .task-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0.5rem;
        border-bottom: 1px solid #e9ecef;
    }

    .task-list .task-item:last-child {
        border-bottom: none;
    }

    .checkbox {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #adb5bd;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .checkbox .bi-check {
        color: white;
        font-size: 1.2rem;
        font-weight: bold;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s ease;
    }

    .task-item.completed .checkbox {
        background-color: #0d6efd;
        border-color: #0d6efd;
    }

    .task-item.completed .checkbox .bi-check {
        opacity: 1;
        transform: scale(1);
    }

    .task-name {
        flex-grow: 1;
        color: #495057;
        transition: color 0.2s ease;
    }

    .task-item.completed .task-name {
        text-decoration: line-through;
        color: #adb5bd;
    }

    .delete-btn {
        background: none;
        border: none;
        color: #6c757d;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        transition:
            opacity 0.15s ease-in-out,
            color 0.15s ease-in-out;
    }

    .task-item:hover .delete-btn {
        opacity: 1;
    }

    .delete-btn:hover {
        color: #dc3545;
    }

    .empty-state {
        text-align: center;
        color: #6c757d;
        padding: 2rem 0;
    }
</style>
