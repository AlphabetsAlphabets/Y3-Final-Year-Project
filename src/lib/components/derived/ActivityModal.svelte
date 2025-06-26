<script lang="ts">
    import { addActivity, getActivities } from "$lib/database/schemas/activity";
    import Modal from "../Modal.svelte";

    let options: string[] = $state([]);
    let activities = getActivities();

    activities.subscribe({
        next(activities) {
            activities.map((activity) => {
                if (!options.includes(activity.name, 0)) {
                    options.push(activity.name);
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

    let input: string = $state("");
    let modal: Modal | null = $state(null);

    let filteredOptions: string[] = $derived.by(() => {
        if (input.length === 0) {
            return options;
        } else {
            return options.filter((option) =>
                option.toLowerCase().includes(input.toLowerCase()),
            );
        }
    });

    let selectedOption: string = $state("Activity");

    function selectOption(option: string) {
        selectedOption = option;
        filteredOptions = options;
    }
</script>

<button
    id="activity select"
    type="button"
    class="btn btn-outline-primary w-100"
    onclick={modal?.showModal}
>
    {selectedOption}
</button>
<Modal bind:this={modal} title="Select an option">
    <input
        type="text"
        class="form-control mb-3"
        placeholder="Type to search..."
        bind:value={input}
    />
    {#if filteredOptions.length > 0 || input.length === 0}
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
            <p>No options found for "{input}"</p>
            <button
                type="button"
                class="btn btn-outline-success w-100"
                onclick={async () => {
                    await addActivity(input);
                    selectOption(input);
                    input = "";
                }}>Create "{input}"</button
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
