<script lang="ts">
    import Modal from "../Modal.svelte";

    let { modal = $bindable() } = $props();
</script>

<div class="message-modal-wrapper">
    <Modal bind:this={modal} title="Warning">
        <p>You have failed your FYP.</p>
    </Modal>
</div>

<style>
    /* This targets the backdrop to align the modal at the top */
    .message-modal-wrapper :global(.modal-backdrop) {
        align-items: flex-start;
        padding-top: 5vh; /* Adds 5% of the viewport height as spacing from the top */
    }

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
</style>
