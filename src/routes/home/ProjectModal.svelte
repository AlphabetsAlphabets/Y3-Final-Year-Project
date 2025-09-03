<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";

    import { type Project } from "$lib/types/schema";
    import { addProject, updateProjectColor } from "$lib/utils/projects";

    let {
        dbWorker,
        selected = $bindable(),
        color = $bindable(),
        projects = $bindable(),
    } = $props();

    let modal: Modal | null = $state(null);
    let userInput = $state("");
    let selectedColor = $state("#3498db"); // Default color

    let filteredOptions: Project[] = $derived.by(() => {
        if (userInput.length === 0) {
            return projects;
        }

        return projects.filter((option: { name: string; color: string }) =>
            option.name.toLowerCase().includes(userInput.toLowerCase()),
        );
    });
</script>

<button
    id="activity select"
    type="button"
    class="btn btn-outline-primary w-100"
    onclick={() => {
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
                            type="button"
                            class="btn btn-outline-primary w-100 d-flex p-0"
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
        width: 75%;
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
</style>
