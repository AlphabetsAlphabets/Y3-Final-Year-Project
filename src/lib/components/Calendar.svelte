<script lang="ts">
    import type { CalendarEvent } from "$lib/calendar";
    import { getLogs, colors } from "$lib/database/schemas/log";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";

    let events: CalendarEvent[] = $state([]);

    let logs = getLogs();

    logs.subscribe({
        next(logs) {
            events = logs.map((log) => {
                const event = {
                    id: log.id,
                    title: log.activity,
                    start: new Date(log.start).toISOString(),
                    end: new Date(log.end).toISOString(),
                    backgroundColor: log.project.color,
                };

                if (colors.has(log.project.name)) {
                    let color = colors.get(log.project.name);
                    if (color) {
                        event.backgroundColor = color;
                    } else {
                        console.log(
                            `${log.project.name} has no color. Defaulting to white.`,
                        );
                    }
                }

                return event;
            });
        },
        error(error) {
            console.error(`Failed to get activities due to :\n${error}`);
        },
        complete() {
            console.log("Done loading logs for calendar.");
        },
    });

    let options = $derived({
        view: "timeGridWeek",
        events: events,
    });
</script>

<p>Calendar</p>
<Calendar plugins={[TimeGrid, Interaction]} {options} />
