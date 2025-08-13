<script lang="ts">
    import { onMount } from "svelte";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";
    import * as Comlink from "comlink";

    import type { CalendarEvent } from "$lib/calendar";
    import type { DbWorker } from "$lib/workers/database.worker";

    import Modal from "./Modal.svelte";
    import ContextMenuModal from "./derived/ContextMenuModal.svelte";

    let {
        events,
        refresh, // calls a method defined in the parent component to change the parent's state.
    }: { events: CalendarEvent[]; refresh: () => Promise<void> } = $props();

    let modal: Modal | null = $state(null);
    let updated = $state(1);
    let targetEvent: CalendarEvent | undefined = $state();
    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);

    async function handleEventChange(arg: { event: CalendarEvent }) {
        if (!dbWorker) {
            console.error("DB worker is not available.");
            return;
        }

        const { id, start, end } = arg.event;
        const elapsed = new Date(end).getTime() - new Date(start).getTime();

        const toUpdate = `start = ${new Date(
            start,
        ).getTime()}, end = ${new Date(end).getTime()}, elapsed = ${elapsed}`;
        const clause = `id = ${id}`;

        await dbWorker.updateLog(toUpdate, clause);
    }

    let options = $state({
        view: "timeGridWeek",
        events: events,
        eventDidMount: function (arg: { event: CalendarEvent }) {
            arg.el.addEventListener("click", () => {
                targetEvent = arg.event;
                modal?.showModal();
            });
        },
        eventDrop: handleEventChange,
        eventResize: handleEventChange,
        editable: true,
    });
</script>

<ContextMenuModal
    bind:modal
    bind:event={targetEvent}
    updateEvent={async () => {
        await refresh();
    }}
/>

{#key updated}
    <Calendar plugins={[TimeGrid, Interaction]} {options} />
{/key}
