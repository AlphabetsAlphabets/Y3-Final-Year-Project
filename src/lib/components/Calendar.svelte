<script lang="ts">
    import type { CalendarEvent } from "$lib/calendar";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";
    import { createEventDispatcher } from "svelte";

    import Modal from "./Modal.svelte";
    import ContextMenuModal from "./derived/ContextMenuModal.svelte";

    let { events }: { events: CalendarEvent[] } = $props();

    let modal: Modal | null = $state(null);
    let event: CalendarEvent | undefined = $state();
    const dispatch = createEventDispatcher();

    let options = $state({
        view: "timeGridWeek",
        events: events,
        eventDidMount: function (arg) {
            arg.el.addEventListener("click", () => {
                event = arg.event;
                modal?.showModal();
            });
        },
    });
</script>

<ContextMenuModal
    bind:modal
    bind:event
    on:eventupdated={() => dispatch("eventupdated")}
/>
<Calendar plugins={[TimeGrid, Interaction]} {options} />
