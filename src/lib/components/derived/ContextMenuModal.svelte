<script lang="ts">
    import Modal from "../Modal.svelte";

    let { modal = $bindable(), event } = $props();

    function handleConfirm() {
        console.log("Saved.");
        modal.closeModal();
    }
</script>

<Modal bind:this={modal} title="Edit Event">
    <form onsubmit={handleConfirm}>
        <div class="form-grid">
            <label for="title">Title</label>
            <input id="title" type="text" bind:value={event.title} />

            <label for="start">Start Time</label>
            <input
                id="start"
                type="datetime-local"
                oninput={(e) => {
                    if (event)
                        event.start = new Date(
                            e.currentTarget.value,
                        ).toISOString();
                }}
            />

            <label for="end">End Time</label>
            <input
                id="end"
                type="datetime-local"
                oninput={(e) => {
                    if (event)
                        event.end = new Date(
                            e.currentTarget.value,
                        ).toISOString();
                }}
            />

            <label for="color">Project Color</label>
            <input id="color" type="color" bind:value={event.backgroundColor} />
        </div>

        <div class="form-actions">
            <button type="submit">Confirm</button>
            <button type="button" onclick={() => modal?.closeModal()}
                >Cancel</button
            >
        </div>
    </form>
</Modal>

<style>
    .form-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem;
        align-items: center;
    }
    .form-grid label {
        text-align: right;
        font-weight: 500;
    }
    .form-grid input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .form-grid input[type="color"] {
        width: auto;
        padding: 0.2rem;
        height: 2.5rem;
    }
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }

    @media (max-width: 500px) {
        .form-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }
        .form-grid label {
            text-align: left;
            margin-bottom: -0.25rem;
        }
    }
    :global(.modal-content) {
        max-width: 60%;
        width: auto;
    }
</style>
