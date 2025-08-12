<script lang="ts">
    import * as Comlink from "comlink";
    import { createEventDispatcher, onMount } from "svelte";

    import type { DbWorker } from "$lib/workers/database.worker";

    import Modal from "../Modal.svelte";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let { modal = $bindable(), event = $bindable() } = $props();

    const dispatch = createEventDispatcher();

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);

    function formatDateForInput(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    let newTitle = $state("");
    let newColor = $state("");
    let newStartTime: Date | null = $state(null);
    let newEndTime: Date | null = $state(null);

    let clause: string[] = [];
    let toUpdate: string[] = [];

    async function updateEventTitle() {
        const titleChanged = newTitle.length > 0 && newTitle !== event.title;
        if (titleChanged) {
            toUpdate.push(`activity = '${newTitle}'`);
        }
    }

    async function updateEventColor() {
        const colorChanged =
            newColor.length !== 0 && newColor !== event.backgroundColor;
        // nothing to do
        if (!colorChanged) return;

        if (colorChanged && dbWorker) {
            console.log("New color:", newColor);
            console.log("old color:", event.backgroundColor);
            await dbWorker.update(
                "project",
                `color = '${newColor}'`,
                `color = '${event.backgroundColor}'`,
            );
        }
    }

    async function updateEventTime() {
        const startTimeChanged =
            newStartTime &&
            newStartTime.getTime() !== new Date(event.start).getTime();
        const endTimeChanged =
            newEndTime &&
            newEndTime.getTime() !== new Date(event.end).getTime();

        if (!startTimeChanged && !endTimeChanged) {
            return;
        }

        const finalStartTime = startTimeChanged
            ? newStartTime
            : new Date(event.start);
        const finalEndTime = endTimeChanged ? newEndTime : new Date(event.end);

        if (finalStartTime.getTime() >= finalEndTime.getTime()) {
            console.error("Start time must be before end time.");
            // NOTE: You might want to show this error to the user in the UI
            return;
        }

        const newElapsed = finalEndTime.getTime() - finalStartTime.getTime();

        if (startTimeChanged) {
            toUpdate.push(`start = ${finalStartTime.getTime()}`);
        }

        if (endTimeChanged) {
            toUpdate.push(`end = ${finalEndTime.getTime()}`);
        }

        toUpdate.push(`elapsed = ${newElapsed}`);
    }

    async function handleActivityUpdate() {
        if (!dbWorker) {
            console.error("Worker in context menu not ready.");
            return;
        }

        // Reset arrays
        clause = [];
        toUpdate = [];

        await updateEventTitle();
        await updateEventTime();
        await updateEventColor();

        if (toUpdate.length === 0) {
            modal.closeModal();
            dispatch("eventupdated"); // Still dispatch in case color was changed
            return;
        }

        clause.push(`id = ${event.id}`);

        let finalClause = clause.join(" AND ");
        let finalToUpdate = toUpdate.join(", ");

        console.log("Final clause: ", finalClause);
        console.log("Final update: ", finalToUpdate);
        await dbWorker.updateLog(finalToUpdate, finalClause);

        dispatch("eventupdated");
        modal.closeModal();
    }
</script>

<Modal bind:this={modal} title="Edit Event">
    <form onsubmit={handleActivityUpdate}>
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
                value={formatDateForInput(new Date(event.start))}
                oninput={(e) => {
                    newStartTime = new Date(e.currentTarget.value);
                }}
            />

            <label for="end">End time</label>
            <input
                id="end"
                type="datetime-local"
                value={formatDateForInput(new Date(event.end))}
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
