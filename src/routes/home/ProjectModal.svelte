<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";

    import { type Project } from "$lib/types/schema";
    import {
        addProject,
        updateProjectColor,
        updateProjectName,
    } from "$lib/utils/projects";

    let {
        dbWorker,
        selected = $bindable(),
        color = $bindable(),
        projects = $bindable(),
        onProjectUpdated,
    } = $props();

    let modal: Modal | null = $state(null);
    let userInput = $state("");
    let selectedColor = $state("#3498db"); // Default color
    let editingProject = $state<string | null>(null);
    let editingProjectName = $state("");

    let filteredOptions: Project[] = $derived.by(() => {
        if (userInput.length === 0) {
            return projects;
        }

        return projects.filter((option: { name: string; color: string }) =>
            option.name.toLowerCase().includes(userInput.toLowerCase()),
        );
    });

    // Focus directive for auto-focusing input
    function focusOnMount(node: HTMLElement) {
        node.focus();
        return {
            destroy() {},
        };
    }

    const handleProjectNameUpdate = async (option: Project) => {
        if (editingProjectName.trim() && editingProjectName !== option.name) {
            projects = await updateProjectName(
                dbWorker,
                option.name,
                editingProjectName.trim(),
            );

            // Update selected project name if it was the one being edited
            if (selected === option.name) {
                selected = editingProjectName.trim();
            }

            await onProjectUpdated();
        }

        editingProject = null;
        editingProjectName = "";
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
    {userInput || "No Project"}
</button>
<Modal bind:this={modal} title="Select a project">
    <input
        type="text"
        class="form-control mb-3"
        placeholder="Type name of project. Relaxing, work, etc."
        bind:value={userInput}
    />
    {#if filteredOptions.length > 0 || userInput === ""}
        <ul class="options-list">
            {#each filteredOptions as option (option.name)}
                <li class="option-item">
                    <div class="d-flex">
                        <button
                            aria-label="Edit project name"
                            type="button"
                            class="btn btn-outline-secondary"
                            onclick={() => {
                                editingProject = option.name;
                                editingProjectName = option.name;
                            }}
                            title="Edit project name"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>
                        {#if editingProject === option.name}
                            <div class="d-flex w-100">
                                <input
                                    type="text"
                                    class="form-control edit-input flex-grow-1"
                                    bind:value={editingProjectName}
                                    use:focusOnMount
                                    onkeydown={async (e) => {
                                        if (e.key === "Escape") {
                                            editingProject = null;
                                            editingProjectName = "";
                                        } else if (e.key === "Enter") {
                                            await handleProjectNameUpdate(
                                                option,
                                            );
                                        }
                                    }}
                                />
                                <button
                                    aria-label="Confirm changes to project name"
                                    type="button"
                                    class="btn btn-success btn-sm ms-1"
                                    onclick={async () =>
                                        await handleProjectNameUpdate(option)}
                                    title="Confirm changes"
                                >
                                    ✓
                                </button>
                            </div>
                        {:else}
                            <button
                                type="button"
                                class="btn btn-outline-primary flex-grow-1 d-flex p-0"
                                style="border-top-left-radius: 0; border-bottom-left-radius: 0;"
                                onclick={() => {
                                    userInput = option.name;
                                    selected = userInput;

                                    selectedColor = option.color;
                                    color = selectedColor;
                                    modal?.closeModal();
                                }}
                            >
                                <span class="project-name">{option.name}</span>
                            </button>
                        {/if}
                        <input
                            type="color"
                            class="form-control form-control-color"
                            bind:value={option.color}
                            onchange={async () => {
                                projects = await updateProjectColor(
                                    dbWorker,
                                    option.name,
                                    option.color,
                                );
                            }}
                            title="Update project color"
                        />
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No options found for "{userInput}"</p>
        <div class="new-project-section">
            <div class="color-picker-container">
                <input
                    type="color"
                    id="project-color"
                    bind:value={selectedColor}
                    title="Choose project color"
                />
            </div>
            <button
                type="button"
                class="btn btn-outline-success w-100 mt-2"
                onclick={async () => {
                    if (!dbWorker) {
                        console.error("dbWorker not ready yet.");
                        return;
                    }

                    projects = await addProject(
                        dbWorker,
                        userInput,
                        selectedColor,
                    );

                    selected = userInput;
                    color = selectedColor;

                    modal?.closeModal();
                }}>Create "{userInput}"</button
            >
        </div>
    {/if}
    <button
        type="button"
        class="btn btn-secondary w-100 mt-3"
        onclick={modal?.closeModal}>Cancel</button
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

    .option-item .btn {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .option-item .form-control-color {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        width: 50px; /* Adjust width as needed */
    }

    .project-name {
        width: 100%;
        padding: 0.375rem 0.75rem;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .new-project-section {
        margin-top: 0.5rem;
    }

    .color-picker-container {
        height: 38px;
    }

    #project-color {
        padding: 0;
        margin: 0;
        border: none;
        border-left: 1px solid #dee2e6;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-clip: padding-box;
    }

    .edit-input {
        margin: 0 !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: transparent;
        padding: 0.375rem 0.75rem;
        font-size: inherit;
    }

    .edit-input:focus {
        border: 1px solid #0d6efd !important;
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        background: #fff;
    }

    .edit-input {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
    }

    .btn-success.btn-sm {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
    }
</style>
