<script lang="ts">
    import Modal from "../Modal.svelte";

    let { name = $bindable(), options } = $props();

    let modal: Modal | null = $state(null);
    let selectedOption: string = $state(name);
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
    {#each options as option (option.id)}
        <p>{option.name}</p>
    {/each}
    <button
        type="button"
        class="btn btn-secondary w-100 mt-3"
        onclick={modal?.closeModal}>Cancel</button
    >
</Modal>
