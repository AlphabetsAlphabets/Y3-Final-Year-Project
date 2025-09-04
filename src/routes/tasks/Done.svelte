<script lang="ts">
    import {
        deleteCompletedTasks,
        deleteTask,
        updateTaskName,
        markTaskIncomplete,
    } from "./task";

    import ConfirmDeleteModal from "./ConfirmDeleteModal.svelte";
    let { dbWorker, tasks = $bindable() } = $props();

    let isDoneListCollapsed = $state(true);
    let editingTaskId = $state(null);
    let editingTaskName = $state("");

    let unfinishTask = async (taskId: number) => {
        if (dbWorker) {
            tasks = await markTaskIncomplete(dbWorker, taskId);
        } else {
            console.error("Worker is not ready. Please try again.");
        }
    };
</script>

<div class="tasks-section">
    <div class="section-header">
        <button
            class="section-title-button"
            onclick={() => (isDoneListCollapsed = !isDoneListCollapsed)}
        >
            <h2 class="section-title">Done</h2>
            <i class="bi bi-chevron-down" class:rotated={isDoneListCollapsed}
            ></i>
        </button>
        <ConfirmDeleteModal
            title="Are you sure?"
            yesAction={async () =>
                (tasks = await deleteCompletedTasks(dbWorker))}
        >
            <p>Are you sure you want to delete all completed tasks?</p>
        </ConfirmDeleteModal>
    </div>
    {#if !isDoneListCollapsed}
        <ul class="task-list">
            {#each tasks as task (task.id)}
                {#if task.completed}
                    <li class="task-item">
                        <button
                            aria-label="Mark task as uncompleted"
                            class="checkbox"
                            onclick={async () => unfinishTask(task.id)}
                        >
                            <i class="bi bi-check"></i>
                        </button>
                        {#if editingTaskId === task.id}
                            <input
                                type="text"
                                bind:value={editingTaskName}
                                class="task-edit-input"
                                onkeydown={async (e) => {
                                    if (e.key === "Enter") {
                                        if (
                                            dbWorker &&
                                            editingTaskName.trim()
                                        ) {
                                            tasks = await updateTaskName(
                                                dbWorker,
                                                task.id,
                                                editingTaskName.trim(),
                                            );
                                        }
                                        editingTaskId = null;
                                        editingTaskName = "";
                                    } else if (e.key === "Escape") {
                                        editingTaskId = null;
                                        editingTaskName = "";
                                    }
                                }}
                                onblur={async () => {
                                    if (
                                        dbWorker &&
                                        editingTaskName.trim() &&
                                        editingTaskName !== task.name
                                    ) {
                                        tasks = await updateTaskName(
                                            dbWorker,
                                            task.id,
                                            editingTaskName.trim(),
                                        );
                                    }
                                    editingTaskId = null;
                                    editingTaskName = "";
                                }}
                            />
                        {:else}
                            <span class="task-name">{task.name}</span>
                        {/if}
                        <small>{task.description}</small>
                        <button
                            class="delete-btn"
                            aria-label="Edit task name"
                            onclick={() => {
                                editingTaskId = task.id;
                                editingTaskName = task.name;
                            }}
                        >
                            <i class="bi bi-pencil"></i>
                        </button>
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
    {/if}
</div>

<style>
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

    .tasks-section {
        margin-bottom: 2rem;
    }

    .task-list {
        list-style: none;
        padding: 0;
        max-height: 300px;
        overflow-y: auto;
        padding-right: 0.5rem; /* For scrollbar spacing */
    }

    .task-item:hover .delete-btn {
        opacity: 1;
    }

    .task-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0.5rem;
        border-bottom: 1px solid #e9ecef;
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

    .task-list .task-item:last-child {
        border-bottom: none;
    }

    .task-list .task-item:last-child {
        border-bottom: none;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .task-list {
        list-style: none;
        padding: 0;
        max-height: 300px;
        overflow-y: auto;
        padding-right: 0.5rem; /* For scrollbar spacing */
    }

    .task-name {
        flex-grow: 1;
        color: #495057;
        transition: color 0.2s ease;
    }

    .task-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0.5rem;
        border-bottom: 1px solid #e9ecef;
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
        flex-grow: 1;
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

    .task-edit-input {
        flex-grow: 1;
        border: 1px solid #007bff;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-size: 1rem;
        color: #495057;
        background-color: #fff;
        outline: none;
    }

    .task-edit-input:focus {
        border-color: #0056b3;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
</style>
