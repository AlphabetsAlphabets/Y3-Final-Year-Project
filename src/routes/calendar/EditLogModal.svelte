<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";

    import { formatDateForInput } from "./calendar";

    import { handleActivityUpdate } from "./log";

    // updateEvent will call a method defined in the parent component to change the parent's state.
    let {
        dbWorker,
        modal = $bindable(),
        event = $bindable(),
        updateEvent,
    } = $props();

    let newTitle = $state("");
    let newColor = $state("");
    let newStartTime: Date | null = $state(null);
    let newEndTime: Date | null = $state(null);
</script>

<Modal bind:this={modal} title="Edit Event">
    <form
        onsubmit={async () => {
            await handleActivityUpdate(
                modal,
                dbWorker,
                newTitle,
                newColor,
                event,
                newStartTime,
                newEndTime,
                updateEvent,
            );
        }}
    >
        <div class="form-grid">
            <label for="title">Title</label>
            <input
                id="title"
                type="text"
                value={event.title}
                oninput={(e) => {
                    newTitle = e.currentTarget.value;
                }}
            />

            <label for="start">Start time</label>
            <input
                id="start"
                type="datetime-local"
                value={formatDateForInput(event.start)}
                oninput={(e) => {
                    newStartTime = new Date(e.currentTarget.value);
                }}
            />

            <label for="end">End time</label>
            <input
                id="end"
                type="datetime-local"
                value={formatDateForInput(event.end)}
                oninput={(e) => {
                    newEndTime = new Date(e.currentTarget.value);
                }}
            />

            <label for="color">Color</label>
            <input
                id="color"
                type="color"
                value={event.backgroundColor}
                oninput={(e) => (newColor = e.currentTarget.value)}
            />
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
