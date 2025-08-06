<script lang="ts">
    import Modal from "../Modal.svelte";
    let { modal = $bindable(), title, message, type } = $props();
</script>

<div class={type}>
    <Modal bind:this={modal} {title}>
        <p>Title</p>
        <input value={title} />
        <!-- Turn this into a drop down so users can update the calendar information. -->
        <button>Confirm</button>
    </Modal>
</div>

<style>
    .message-modal-ok :global(.modal-content) {
        background-color: blue;
        color: white;
        width: 75vw; /* Sets width to 25% of the viewport width */
        min-width: 0; /* Overrides the base min-width */
    }

    /* --- Responsive Styles for Small Screens --- */
    @media (max-width: 768px) {
        .message-modal-wrapper :global(.modal-content) {
            width: 90vw; /* Use 90% of the viewport width on smaller screens */
        }
    }
</style>
