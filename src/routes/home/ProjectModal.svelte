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
                                if (!editingProject) {
                                    editingProject = option.name;
                                    editingProjectName = option.name;
                                } else {
                                    editingProject = null;
                                    editingProjectName = "";
                                }
                            }}
                            title="Edit project name"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>
                        {#if editingProject === option.name}
                            <div class="d-flex w-100">
                                <input
                                    type="text"
                                    class="form-control flex-grow-1"
                                    bind:value={editingProjectName}
                                    use:focusOnMount
                                    onkeydown={async (e) => {
                                        if (e.key === "Escape") {
                                            editingProject = null;
                                            editingProjectName = "";
                                        } else if (e.key === "Enter") {
                                            e.preventDefault();
                                            e.stopPropagation();
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
                                <span class="modal-item">{option.name}</span>
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
        <div>
            <div>
                <input
                    type="color"
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
    @import "./modal.css";

    .option-item .form-control-color {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        width: 50px; /* Adjust width as needed */
    }
</style>
