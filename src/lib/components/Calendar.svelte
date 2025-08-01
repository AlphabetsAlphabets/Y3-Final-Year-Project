<script lang="ts">
    import type { CalendarEvent } from "$lib/calendar";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";

    let events: CalendarEvent[] = $state([]);

    // What an event should look like for CalendarEvent
    // const event = {
    //     id: log.id,
    //     title: log.activity,
    //     start: new Date(log.start).toISOString(),
    //     end: new Date(log.end).toISOString(),
    //     backgroundColor: log.project.color,
    // };
    let options = $derived({
        view: "timeGridWeek",
        events: events,
    });
</script>

<p>Calendar</p>
<Calendar plugins={[TimeGrid, Interaction]} {options} />
