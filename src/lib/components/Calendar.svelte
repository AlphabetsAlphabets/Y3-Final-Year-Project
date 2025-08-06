<script lang="ts">
    import type { CalendarEvent } from "$lib/calendar";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";

    import Modal from "./Modal.svelte";
    import ContextMenuModal from "./derived/ContextMenuModal.svelte";

    let { events }: { events: CalendarEvent[] } = $props();

    let modal: Modal | null = $state(null);
    let message = $state("");

    let options = $state({
        view: "timeGridWeek",
        events: events,
        eventDidMount: function (arg) {
            arg.el.addEventListener("click", () => {
                message = "Goodbye";
                modal?.showModal();
            });
        },
    });
</script>

<ContextMenuModal
    bind:modal
    title="Edit event"
    {message}
    type="message-modal-ok"
/>
<Calendar plugins={[TimeGrid, Interaction]} {options} />
