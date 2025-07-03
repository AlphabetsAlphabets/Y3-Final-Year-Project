<script lang="ts">
    import type { Observable } from "dexie";
    import Modal from "../Modal.svelte";

    let { name = $bindable(), getter, setter } = $props();

    let options: string[] = $state([]);
    let observable: Observable<unknown> = getter();

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
            console.log(`Failed to get activities due to :\n${error}`);
        },
        complete() {
            console.log("Done");
        },
    });

    let modal: Modal | null = $state(null);

    let filteredOptions: string[] = $derived.by(() => {
        if (name.length === 0) {
            return options;
        } else {
            return options.filter((option) =>
                option.toLowerCase().includes(name.toLowerCase()),
            );
        }
    });

    let selectedOption: string = $state(name);

    function selectOption(option: string) {
        selectedOption = option;
        filteredOptions = options;
        name = option;
    }
</script>

<button
    id="activity select"
    type="button"
    class="btn btn-outline-primary w-100"
    onclick={() => {
        modal?.showModal();
        name = "";
    }}
>
    {selectedOption}
</button>

<Modal bind:this={modal} title="Select an option">
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
                    <button
                        type="button"
                        class="btn btn-outline-primary w-100"
                        onclick={() => {
                            selectOption(option);
                            modal?.closeModal();
                        }}>{option}</button
                    >
                </li>
            {/each}
        </ul>
    {:else}
        <div>
            <p>No options found for "{name}"</p>
            <button
                type="button"
                class="btn btn-outline-success w-100"
                onclick={async () => {
                    await setter(name);
                    selectOption(name);
                }}>Create "{name}"</button
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
</style>
