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

    let newTitle = $state("");
    let newColor = $state("");
    // TODO: These should be numbers
    // TEST THIS TOO
    let newStartTime = $state(new Date());
    let newEndTime = $state(new Date());

    let clause: string[] = [];
    let toUpdate: string[] = [];

    async function handleTitleAndColorChange() {
        // Only update if title or color isn't empty string.
        let titleChanged = newTitle.length != 0;
        let colorChanged = newColor.length != 0;

        if (titleChanged || colorChanged) {
            // Update only if it is different
            if (newTitle != event.title || newColor != event.color) {
                await dbWorker?.updateProject(newTitle, newColor);
                return;
            }

            // If title changed, we need to find the log with the newly updated title.
            // Nothing for color because color info isn't tracked in the log table.
            if (titleChanged) {
                clause.push(`title = '${newTitle}'`);
            }
        }
    }

    async function handleTimeChange() {
        let startTimeChanged = newStartTime !== event.startTime;
        let endTimeChanged = newEndTime !== event.endTime;
        let newElapsed = 0;

        if (startTimeChanged && endTimeChanged) {
            newElapsed = newEndTime - newStartTime;
        } else if (startTimeChanged) {
            newElapsed = event.endTime - newStartTime;
        } else if (endTimeChanged) {
            newElapsed = newEndTime - event.startTime;
        }

        if (startTimeChanged) {
            toUpdate.push(`start = ${newStartTime}`); // new value
            clause.push(`start = ${event.startTime}`); // original value
        }

        if (endTimeChanged) {
            toUpdate.push(`end = ${newEndTime}`);
            clause.push(`end = ${event.endTime}`);
        }

        if (newElapsed !== 0) {
            toUpdate.push(`elapsed = ${newElapsed}`);
        }
    }

    async function handleConfirm() {
        if (!dbWorker) {
            console.error("Worker in context menu not ready.");
            return;
        }

        await handleTitleAndColorChange();
        await handleTimeChange();

        let finalClause = clause.join(" AND ");
        let finalToUpdate = toUpdate.join(", ");
        await dbWorker.updateLog(finalToUpdate, finalClause);

        modal.closeModal();
    }
</script>

<Modal bind:this={modal} title="Edit Event">
    <form onsubmit={handleConfirm}>
        <div class="form-grid">
            <label for="title">Title</label>
            <input id="title" type="text" bind:value={event.title} />

            <label for="start">Start time</label>
            <input
                id="start"
                type="datetime-local"
                oninput={(e) => {
                    if (event) newStartTime = new Date(e.currentTarget.value);
                }}
            />

            <label for="end">End time</label>
            <input
                id="end"
                type="datetime-local"
                oninput={(e) => {
                    if (event) newEndTime = new Date(e.currentTarget.value);
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
