<script lang="ts">
    import * as Comlink from "comlink";
    import { onMount } from "svelte";

    import Modal from "../Modal.svelte";

    import type { DbWorker } from "$lib/workers/database.worker";
    import { type Project } from "$lib/types/schema";

    let { selected = $bindable() } = $props();

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let projects: Project[] = $state([]);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
        projects = await dbWorker.listProjects();
    };

    onMount(loadWorker);

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
    {userInput || "Project"}
</button>
<Modal bind:this={modal} title="Select an option">
    <input
        type="text"
        class="form-control mb-3"
        placeholder="Type to search..."
        bind:value={userInput}
    />
    {#if filteredOptions.length > 0 || userInput === ""}
        <ul class="options-list">
            {#each filteredOptions as option (option.name)}
                <li class="option-item">
                    <button
                        type="button"
                        class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between"
                        onclick={() => {
                            userInput = option.name;
                            selectedColor = option.color;
                            modal?.closeModal();
                        }}
                    >
                        <span>{option.name}</span>
                        <div
                            class="color-preview"
                            style="background-color: {option.color ||
                                '#CCCCCC'}"
                        ></div>
                    </button>
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

                    projects = await dbWorker.addProject(
                        userInput,
                        selectedColor,
                    );

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
