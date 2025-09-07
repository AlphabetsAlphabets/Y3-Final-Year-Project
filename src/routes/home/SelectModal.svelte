<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import type { Activity } from "$lib/types/schema";

    import {
        addActivity,
        deleteActivity,
        updateActivityName,
    } from "$lib/utils/activity";
    import { deleteTask } from "../tasks/task";
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
            await updateActivityName(
                dbWorker,
                option.name,
                editingActivityName,
            );

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
        class="form-control flex-grow-1 mb-3"
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
                                if (!editingActivity) {
                                    editingActivity = option.name;
                                    editingActivityName = option.name;
                                } else {
                                    editingActivity = null;
                                    editingActivityName = "";
                                }
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
                                            e.preventDefault();
                                            e.stopPropagation();
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
                                class="btn modal-item btn-outline-primary option-select-btn"
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
    @import "./modal.css";

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
</style>
