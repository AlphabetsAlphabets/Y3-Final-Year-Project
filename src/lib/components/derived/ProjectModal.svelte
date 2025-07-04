<script lang="ts">
    import type { Observable } from "dexie";
    import Modal from "../Modal.svelte";

    let { name: selected = $bindable(), getter, setter } = $props();
    import {
        getProjectColor,
        updatedProjectColor,
    } from "$lib/database/schemas/project";

    let modal: Modal | null = $state(null);
    let projects: string[] = $state([]);
    let observable: Observable<unknown> = getter();

    observable.subscribe({
        next(entries) {
            //@ts-expect-error entries is an observable that can contain pretty much anything.
            entries.map((entry) => {
                if (!projects.includes(entry.name, 0)) {
                    projects.push(entry.name);
                }
            });
        },
        error(error) {
            console.log(`Failed to get projects due to :\n${error}`);
        },
    });

    let filtered: string[] = $derived.by(() => {
        if (selected.length === 0) {
            return projects;
        } else {
            return projects.filter((option) =>
                option.toLowerCase().includes(selected.toLowerCase()),
            );
        }
    });

    function selectOption(option: string) {
        selected = option;
    }

    let color = $state("#fffff");
    let projectColors = $state(new Map<string, string>());

    $effect(() => {
        for (const project of projects) {
            if (!projectColors.has(project)) {
                getProjectColor(project).then((color) => {
                    projectColors.set(project, color);
                });
            }
        }
    });
</script>

<button
    type="button"
    class="btn btn-outline-primary w-100"
    onclick={() => {
        modal?.showModal();
        selected = "";
    }}
>
    {selected || "Project"}
</button>

<Modal bind:this={modal} title={selected || "Project"}>
    <input
        type="text"
        class="form-control mb-3"
        placeholder="Type to search..."
        bind:value={selected}
    />
    <!-- Has entries already -->
    {#if filtered.length > 0 || selected.length === 0}
        <ul class="options-list">
            {#each filtered as project (project)}
                <li class="option-item">
                    <div class="split-button-container">
                        <button
                            type="button"
                            class="select-part"
                            onclick={() => {
                                selectOption(project);
                                modal?.closeModal();
                            }}
                        >
                            {project}
                        </button>
                        <div
                            class="color-part"
                            style:background-color={projectColors.get(project)}
                        >
                            <input
                                type="color"
                                class="color-input"
                                title="Choose a color for '{project}'"
                                onchange={(e) => {
                                    let newColor = (
                                        e.target as HTMLInputElement
                                    ).value;

                                    projectColors.set(project, newColor);
                                    updatedProjectColor(project, newColor);
                                    projectColors = new Map(projectColors);
                                }}
                            />
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <!-- Create a new entry -->
        <div>
            <p>No project found for "{selected}"</p>

            <div class="split-button-container">
                <div class="split-button-container">
                    <button class="btn btn-light" disabled>
                        {selected}
                    </button>
                    <div class="color-part" style:background-color={color}>
                        <input
                            type="color"
                            class="color-input"
                            title="Choose a color"
                            onchange={(e) =>
                                (color = (e.target as HTMLInputElement).value)}
                        />
                    </div>
                </div>
            </div>
            <button
                type="button"
                class="btn btn-outline-success w-100"
                onclick={async () => {
                    if (color === "#fffff" || selected.length === 0) {
                        console.error(
                            "Color is default and no name for project.",
                        );

                        return;
                    }

                    await setter(selected, color);
                    selectOption(selected);
                    modal?.closeModal();
                }}
            >
                Create project "{selected}"
            </button>
        </div>
    {/if}
    <button
        type="button"
        class="btn btn-secondary w-100 mt-3"
        onclick={modal?.closeModal}
    >
        Cancel
    </button>
</Modal>

<style>
    .options-list {
        list-style: none;
        padding: 0;
        max-height: 40vh;
        overflow-y: auto;
    }

    .option-item {
        margin-bottom: 0.5rem;
    }

    .split-button-container {
        display: flex;
        width: 100%;
        border: 1px solid #dee2e6;
        border-radius: 0.375rem; /* Corresponds to Bootstrap's .btn */
        overflow: hidden;
        height: 38px; /* Corresponds to Bootstrap's .btn */
    }

    .select-part {
        flex: 3; /* 75% */
        background-color: white;
        color: #0d6efd;
        border: none;
        text-align: left;
        padding: 0.375rem 0.75rem;
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
    }

    .select-part:hover {
        background-color: #e9ecef;
    }

    .color-part {
        flex: 1; /* 25% */
        position: relative;
        border-left: 1px solid #dee2e6;
        cursor: pointer;
    }

    .color-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0; /* Makes the input invisible */
        cursor: pointer;
    }
</style>
