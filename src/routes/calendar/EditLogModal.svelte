<script lang="ts">
    import * as Comlink from "comlink";
    import { onMount } from "svelte";

    import type { DbWorker } from "$lib/database.worker";

    import Modal from "$lib/components/Modal.svelte";

    import {
        formatDateForInput,
        updateEventColor,
        updateEventTime,
        updateEventTitle,
    } from "./calendar";
    import { updateLog } from "./log";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    // updateEvent will call a method defined in the parent component to change the parent's state.
    let { modal = $bindable(), event = $bindable(), updateEvent } = $props();

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);

    let newTitle = $state("");
    let newColor = $state("");
    let newStartTime: Date | null = $state(null);
    let newEndTime: Date | null = $state(null);

    async function handleActivityUpdate() {
        if (!dbWorker) {
            console.error("Worker in context menu not ready.");
            return;
        }

        let toUpdate: string[] = [];

        let updateTitle = await updateEventTitle(newTitle, event);
        toUpdate.push(...updateTitle);

        if (newStartTime && newEndTime) {
            let update = await updateEventTime(newStartTime, newEndTime);
            toUpdate.push(...update);
        } else if (newStartTime) {
            let updateStart = await updateEventTime(newStartTime, event.end);
            toUpdate.push(...updateStart);
        } else if (newEndTime) {
            let updateEnd = await updateEventTime(event.start, newEndTime);
            toUpdate.push(...updateEnd);
        } else {
            console.error("Something went wrong.");
        }

        let query = await updateEventColor(newColor, event);
        if (query.length !== 0) {
            dbWorker.update("project", query[0], query[1]);
        }

        if (toUpdate.length === 0) {
            modal.closeModal();
            if (query.length !== 0) {
                updateEvent();
            }
            return;
        }

        await updateLog(dbWorker, toUpdate.join(", "), `id = ${event.id}`);

        updateEvent();
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
