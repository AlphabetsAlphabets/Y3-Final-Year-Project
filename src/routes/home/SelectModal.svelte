<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import type { Activity } from "$lib/types/schema";

    import {
        addActivity,
        deleteActivity,
        updateActivityName,
    } from "$lib/utils/activity";
    import { deleteTask, updateTaskName } from "../tasks/task";
    import { getTaskAndActivities } from "./SelectModal";

    let {
        dbWorker,
        selected = $bindable(),
        tasks = $bindable(),
        activities = $bindable(),
        refreshActivities,
    } = $props();

    let taskAndActivities: { id: number; name: string; isTask: boolean }[] =
        $derived(getTaskAndActivities(tasks, activities));

    let modal: Modal | null = $state(null);
    let userInput = $state("");

    let editingActivity = $state<string | null>(null);
    let editingActivityName = $state("");

    let filteredOptions: { id: number; name: string; isTask: boolean }[] =
        $derived.by(() => {
            if (userInput.length === 0) {
                return taskAndActivities;
            }

            return taskAndActivities.filter((option: Activity) =>
                option.name.toLowerCase().includes(userInput.toLowerCase()),
            );
        });

    function focusOnMount(node: HTMLElement) {
        node.focus();
        return {
            destroy() {},
        };
    }

    const handleActivityNameUpdate = async (option: {
        id: number;
        name: string;
        isTask: boolean;
    }) => {
        if (editingActivityName.trim() && editingActivityName !== option.name) {
            if (option.isTask) {
                tasks = await updateTaskName(
                    dbWorker,
                    option.id,
                    editingActivityName,
                );
            } else {
                await updateActivityName(
                    dbWorker,
                    option.name,
                    editingActivityName,
                );
            }

            await refreshActivities();
        }

        editingActivity = null;
        editingActivityName = "";
    };

    const handleDelete = async (option: {
        id: number;
        name: string;
        isTask: boolean;
    }) => {
        if (!dbWorker) {
            console.error("dbWorker not ready yet.");
            return;
        }

        if (option.isTask) {
            tasks = await deleteTask(dbWorker, option.id);
        } else {
            activities = await deleteActivity(dbWorker, option.id);
        }
    };
</script>

<button
    id="activity select"
    type="button"
    class="btn btn-outline-primary w-100"
    onclick={() => {
        userInput = "";
        modal?.showModal();
    }}
>
    {selected}
</button>
<Modal bind:this={modal} title="Select an activity">
    <input
        type="text"
        class="form-control mb-3"
        placeholder="Name of an activity. Reading, writing, etc."
        bind:value={userInput}
    />
    {#if filteredOptions.length > 0 || userInput === ""}
        <ul class="options-list">
            {#each filteredOptions as option (option.name)}
                <li class="option-item">
                    <div class="d-flex">
                        <button
                            aria-label="Edit activity name"
                            type="button"
                            class="btn btn-outline-secondary"
                            onclick={() => {
                                editingActivity = option.name;
                                editingActivityName = option.name;
                            }}
                            title="Edit activity name"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>

                        {#if editingActivity === option.name}
                            <div class="d-flex w-100">
                                <input
                                    type="text"
                                    class="form-control edit-input flex-grow-1"
                                    bind:value={editingActivityName}
                                    use:focusOnMount
                                    onkeydown={async (e) => {
                                        if (e.key === "Escape") {
                                            editingActivity = null;
                                            editingActivityName = "";
                                        } else if (e.key === "Enter") {
                                            await handleActivityNameUpdate(
                                                option,
                                            );
                                        }
                                    }}
                                />
                                <button
                                    aria-label="Confirm changes to activity name"
                                    type="button"
                                    class="btn btn-success btn-sm ms-1"
                                    onclick={async () => {
                                        await handleActivityNameUpdate(option);
                                    }}
                                    title="Confirm changes"
                                >
                                    ✓
                                </button>
                            </div>
                        {:else}
                            <button
                                type="button"
                                class="btn btn-outline-primary option-select-btn"
                                onclick={() => {
                                    selected = option.name;
                                    userInput = "";
                                    modal?.closeModal();
                                }}
                            >
                                {#if option.isTask}
                                    <span class="badge bg-success">TASK</span>
                                {/if}
                                {option.name}
                            </button>
                            <button
                                type="button"
                                class="delete-btn"
                                aria-label="Delete activity"
                                onclick={async (e) => {
                                    e.stopPropagation();
                                    await handleDelete(option);
                                }}
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        {/if}
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No options found for "{userInput}"</p>
        <button
            type="button"
            class="btn btn-outline-success w-100"
            onclick={async () => {
                if (!dbWorker) {
                    console.error("dbWorker not ready yet.");
                    return;
                }

                activities = await addActivity(dbWorker, userInput);
                selected = userInput;
                userInput = "";
                modal?.closeModal();
            }}>Create "{userInput}"</button
        >
    {/if}
    <button
        type="button"
        class="btn btn-secondary w-100 mt-3"
        onclick={() => {
            userInput = "";
            modal?.closeModal();
        }}>Cancel</button
    >
</Modal>

<style>
    .options-list {
        list-style: none;
        padding: 0;
    }

    .option-item {
        margin-bottom: 0.5rem;
    }

    .option-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .option-select-btn {
        flex: 1;
    }

    .delete-btn {
        background: none;
        border: none;
        color: #6c757d;
        padding: 0.375rem 0.5rem;
        border-radius: 0.25rem;
        opacity: 0.7;
        transition:
            opacity 0.2s,
            color 0.2s,
            background-color 0.2s;
    }

    .delete-btn:hover {
        opacity: 1;
        color: #dc3545;
        background-color: #f8d7da;
    }

    .option-item:hover .delete-btn {
        opacity: 1;
    }

    /*
      NOTE: This :global() selector targets the Modal's content pane.
      This approach is taken because the modal's DOM structure is rendered
      outside of this component, making direct styling difficult without
      modifying the base Modal component.

      This may have unintended side effects if other modals with different
      width requirements are added to the app, as this style will apply
      globally to any element with the `.modal-content` class.
    */
    :global(.modal-content) {
        width: 90%; /* Default for smaller screens */
        max-width: none; /* Override any potential max-width from the base modal style */
    }

    /* Mimic Bootstrap's grid system for col-md-8 */
    @media (min-width: 768px) {
        :global(.modal-content) {
            width: 66.66666667%;
        }
    }

    /* Mimic Bootstrap's grid system for col-lg-6 */
    @media (min-width: 992px) {
        :global(.modal-content) {
            width: 50%;
        }
    }
</style>
