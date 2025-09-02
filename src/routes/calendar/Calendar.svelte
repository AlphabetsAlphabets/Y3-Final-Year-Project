<script lang="ts">
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";

    import Modal from "$lib/components/Modal.svelte";
    import EditLogModal from "./EditLogModal.svelte";

    import {
        createEventWithClick,
        updateEventTime,
        type CalendarEvent,
        type FullCalendarCalendarEvent,
    } from "./calendar";
    import { updateLog } from "./log";

    let {
        dbWorker,
        events,
        refresh, // calls a method defined in the parent component to change the parent's state.
    } = $props();

    let modal: Modal | null = $state(null);
    let targetEvent: CalendarEvent | undefined = $state();

    async function handleEventChange(arg: { event: CalendarEvent }) {
        let newStart = new Date(arg.event.start);
        let newEnd = new Date(arg.event.end);

        let toUpdate = await updateEventTime(newStart, newEnd);
        console.log("Resize toUpdate: ", toUpdate);

        await updateLog(dbWorker, toUpdate.join(", "), `id = ${arg.event.id}`);
    }

    let options = $state({
        view: "timeGridWeek",
        events: events,
        eventClick: function (arg: FullCalendarCalendarEvent) {
            targetEvent = arg.event;
            modal?.showModal();
        },
        dateClick: async function () {
            targetEvent = await createEventWithClick(dbWorker);
            modal?.showModal();
        },
        eventDrop: handleEventChange,
        eventResize: handleEventChange,
        editable: true,
    });
</script>

<EditLogModal
    {dbWorker}
    bind:modal
    bind:event={targetEvent}
    updateEvent={async () => {
        await refresh();
    }}
/>

<Calendar plugins={[TimeGrid, Interaction]} {options} />
