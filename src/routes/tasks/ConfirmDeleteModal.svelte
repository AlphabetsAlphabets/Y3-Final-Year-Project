<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";

    let modal: Modal | null = $state(null);
    let { children, title, yesAction } = $props();
    let showTooltip = $state(false);
</script>

<button
    class="delete-all-btn"
    aria-label="Delete all completed tasks"
    onclick={() => modal?.showModal()}
    onmouseenter={() => (showTooltip = true)}
    onmouseleave={() => (showTooltip = false)}
>
    <i class="bi bi-trash"></i>
    {#if showTooltip}
        <span class="tooltip">Delete all COMPLETED tasks</span>
    {/if}
</button>
<div class="message-modal-wrapper">
    <Modal bind:this={modal} {title}>
        {@render children()}
        <button
            onclick={() => {
                yesAction();
                modal?.closeModal();
            }}>Yes</button
        >
        <button onclick={() => modal?.closeModal()}>No</button>
    </Modal>
</div>

<style>
    /* This targets the modal content box */
    .message-modal-wrapper :global(.modal-content) {
        background-color: #d9534f;
        color: white;
        width: 25vw; /* Sets width to 25% of the viewport width */
        min-width: 0; /* Overrides the base min-width */
    }

    /* --- Responsive Styles for Small Screens --- */
    @media (max-width: 768px) {
        .message-modal-wrapper :global(.modal-content) {
            width: 90vw; /* Use 90% of the viewport width on smaller screens */
        }
    }

    .delete-all-btn {
        background: none;
        border: none;
        color: #6c757d;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
        border-radius: 8px;
        transition:
            color 0.15s ease-in-out,
            background-color 0.15s ease-in-out;
    }

    .delete-all-btn:hover {
        color: #dc3545;
        background-color: #f8d7da;
    }

    .tooltip {
        position: absolute;
        background-color: #000;
        color: #fff;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }

    .delete-all-btn:hover .tooltip {
        opacity: 1;
    }
</style>
