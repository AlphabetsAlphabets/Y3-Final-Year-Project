<script lang="ts">
    import type { CalendarEvent } from "$lib/calendar";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";

    let { events }: { events: CalendarEvent[] } = $props();

    let options = $state({
        view: "timeGridWeek",
        events: events,
    });
</script>

<Calendar plugins={[TimeGrid, Interaction]} {options} />
