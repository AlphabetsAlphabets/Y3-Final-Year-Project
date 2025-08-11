<script lang="ts">
    import * as Comlink from "comlink";
    import { onMount } from "svelte";

    import type { DbWorker } from "$lib/workers/database.worker";

    import Modal from "../Modal.svelte";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let { modal = $bindable(), event = $bindable() } = $props();

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
        let titleChanged = newTitle.length != 0;
        if (titleChanged && newTitle !== event.title) {
            clause.push(`title = '${newTitle}'`);
            toUpdate.push(`title = '${event.title}'`);
        }
    }

    async function updateEventColor() {
        let colorChanged = newColor.length != 0;

        if (colorChanged && newColor != event.color) {
            // This is wrong. I am updating the event name. Which is the activity name.
        }
    }

    async function updateEventTime() {
        let newElapsed = 0;

        let startTimeChanged = newStartTime && newStartTime !== event.startTime;
        let endTimeChanged = newEndTime && newEndTime !== event.endTime;

        if (startTimeChanged && endTimeChanged) {
            newElapsed = newEndTime.getTime() - newStartTime.getTime();
        } else if (startTimeChanged) {
            newElapsed = event.end - newStartTime.getTime();
        } else if (endTimeChanged) {
            newElapsed = newEndTime.getTime() - event.start;
        }

        if (startTimeChanged) {
            clause.push(`id = ${event.id}`); // original value
            toUpdate.push(`start = ${newStartTime.getTime()}`); // new value
        }

        if (endTimeChanged) {
            clause.push(`id = ${event.id}`); // original value
            toUpdate.push(`end = ${newEndTime.getTime()}`);
        }

        if (newElapsed !== 0) {
            toUpdate.push(`elapsed = ${newElapsed}`);
        }
    }

    async function handleActivityUpdate() {
        if (!dbWorker) {
            console.error("Worker in context menu not ready.");
            return;
        }

        // await updateEventTitle();
        // await updateEventColor();
        await updateEventTime();

        let finalClause = clause.join(" AND ");
        let finalToUpdate = toUpdate.join(", ");

        console.log("Final clause: ", finalClause);
        console.log("Final update: ", finalToUpdate);
        await dbWorker.updateLog(finalToUpdate, finalClause);

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
            <input id="color" type="color" bind:value={event.color} />
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
