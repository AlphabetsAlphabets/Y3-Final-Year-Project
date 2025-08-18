<script lang="ts">
    import { onMount } from "svelte";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";
    import * as Comlink from "comlink";

    import type { DbWorker } from "$lib/database.worker";

    import Modal from "$lib/components/Modal.svelte";
    import EditLogModal from "./EditLogModal.svelte";

    import { updateEventTime, type CalendarEvent } from "./calendar";
    import { updateLog } from "./log";

    let {
        events,
        refresh, // calls a method defined in the parent component to change the parent's state.
    }: { events: CalendarEvent[]; refresh: () => Promise<void> } = $props();

    let modal: Modal | null = $state(null);
    let targetEvent: CalendarEvent | undefined = $state();
    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);

    async function handleEventChange(arg: { event: CalendarEvent }) {
        if (!dbWorker) {
            console.error("DB worker is not available.");
            return;
        }

        let newStart = new Date(arg.event.start);
        let newEnd = new Date(arg.event.end);

        let toUpdate = await updateEventTime(newStart, newEnd);
        console.log("Resize toUpdate: ", toUpdate);

        await updateLog(dbWorker, toUpdate.join(", "), `id = ${arg.event.id}`);
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

<EditLogModal
    bind:modal
    bind:event={targetEvent}
    updateEvent={async () => {
        await refresh();
    }}
/>

<Calendar plugins={[TimeGrid, Interaction]} {options} />
