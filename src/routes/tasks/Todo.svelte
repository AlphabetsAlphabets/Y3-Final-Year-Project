<script lang="ts">
    import { deleteTask, markTaskComplete } from "./task";

    let { dbWorker, tasks } = $props();

    let finishTask = async (taskId: number) => {
        if (dbWorker) {
            tasks = await markTaskComplete(dbWorker, taskId);
        } else {
            console.error("Worker is not ready. Please try again.");
        }
    };
</script>

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
                                console.error("Worker not ready. Please wait.");
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

<style>
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

    .task-name {
        flex-grow: 1;
        color: #495057;
        transition: color 0.2s ease;
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
</style>
