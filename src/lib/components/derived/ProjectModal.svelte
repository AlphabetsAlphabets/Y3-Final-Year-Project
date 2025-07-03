<script lang="ts">
    import type { Observable } from "dexie";
    import Modal from "../Modal.svelte";

    // Props
    let { name = $bindable(), getter, setter } = $props();

    // Modal and data state
    let modal: Modal | null = $state(null);
    let options: string[] = $state([]);
    let observable: Observable<unknown> = getter();

    // Subscribe to data source
    observable.subscribe({
        next(entries) {
            //@ts-expect-error entries is an observable that can contain pretty much anything.
            entries.map((entry) => {
                if (!options.includes(entry.name, 0)) {
                    options.push(entry.name);
                }
            });
        },
        error(error) {
            console.log(`Failed to get projects due to :\n${error}`);
        },
    });

    // Derived state for filtering options
    let filteredOptions: string[] = $derived.by(() => {
        if (name.length === 0) {
            return options;
        } else {
            return options.filter((option) =>
                option.toLowerCase().includes(name.toLowerCase()),
            );
        }
    });

    // State for selected option and colors
    let selectedOption: string = $state(name);
    const optionColors = $state(new Map<string, string>());

    function selectOption(option: string) {
        selectedOption = option;
        name = option;
    }

    function handleColorChange(event: Event, option: string) {
        const target = event.target as HTMLInputElement;
        optionColors.set(option, target.value);
    }

    let backgroundColor = "#e9ecef";
</script>

<!-- Button to trigger the modal -->
<button
    type="button"
    class="btn btn-outline-primary w-100"
    onclick={() => {
        modal?.showModal();
        name = "";
    }}
>
    {selectedOption || "Select a Project"}
</button>

<!-- Main Modal Component -->
<Modal bind:this={modal} title="Select a Project">
    <input
        type="text"
        class="form-control mb-3"
        placeholder="Type to search..."
        bind:value={name}
    />
    {#if filteredOptions.length > 0 || name.length === 0}
        <ul class="options-list">
            {#each filteredOptions as option (option)}
                <li class="option-item">
                    <div class="split-button-container">
                        <button
                            type="button"
                            class="select-part"
                            onclick={() => {
                                selectOption(option);
                                modal?.closeModal();
                            }}
                        >
                            {option}
                        </button>
                        <!-- TODO: The color change isn't reactive. Will need more time to
                       take a look and see what is responsible for what -->
                        <div
                            class="color-part"
                            style:background-color={optionColors.get(option) ||
                                "#e9ecef"}
                        >
                            <input
                                type="color"
                                value={optionColors.get(option) || "#e9ecef"}
                                class="color-input"
                                title="Choose a color for {option}"
                                oninput={(e) => handleColorChange(e, option)}
                            />
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <div>
            <p>No project found for "{name}"</p>
            <button
                type="button"
                class="btn btn-outline-success w-100"
                onclick={async () => {
                    await setter(name);
                    selectOption(name);
                    modal?.closeModal();
                }}
            >
                Create "{name}"
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
