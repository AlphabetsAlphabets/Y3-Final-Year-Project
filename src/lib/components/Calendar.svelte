<script lang="ts">
    import type { CalendarEvent } from "$lib/calendar";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";
    import { createEventDispatcher, onMount } from "svelte";
    import * as Comlink from "comlink";
    import type { DbWorker } from "$lib/workers/database.worker";

    import Modal from "./Modal.svelte";
    import ContextMenuModal from "./derived/ContextMenuModal.svelte";

    let { events }: { events: CalendarEvent[] } = $props();

    let modal: Modal | null = $state(null);
    let targetEvent: CalendarEvent | undefined = $state();
    const dispatch = createEventDispatcher();
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
        dispatch("eventupdated");
    }

    let options = $state({
        view: "timeGridWeek",
        events: events,
        eventDidMount: function (arg: unknown) {
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
    on:eventupdated={() => dispatch("eventupdated")}
/>
<Calendar plugins={[TimeGrid, Interaction]} {options} />
