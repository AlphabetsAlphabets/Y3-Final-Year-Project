<script lang="ts">
    import Modal from "../Modal.svelte";

    let { options, fn } = $props();
    let modal: Modal | null = $state(null);
    let userInput = $state("");

    let filteredOptions: { id: number; name: string }[] = $derived.by(() => {
        if (userInput.length === 0) {
            return options;
        }

        return options.filter((option: { id: number; name: string }) =>
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
    {userInput || "Activity"}
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
            {#each filteredOptions as option (option.id)}
                <li class="option-item">
                    <button
                        type="button"
                        class="btn btn-outline-primary w-100"
                        onclick={() => {
                            userInput = option.name;
                            modal?.closeModal();
                        }}
                    >
                        {option.name}
                    </button>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No options found for "{userInput}"</p>
        <button
            type="button"
            class="btn btn-outline-success w-100"
            onclick={async () => await fn(userInput)}
            >Create "{userInput}"</button
        >
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
