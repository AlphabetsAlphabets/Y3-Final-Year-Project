<script lang="ts">
    import type { CalendarEvent } from "$lib/calendar";
    import { getLogs, colors } from "$lib/database/schemas/log";
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";

    let events: CalendarEvent[] = $state([]);

    let logs = getLogs();

    // At first I expected the event to change if a new activity was logged but that is not the case at all.
    // Instead two projects will exist. One with the color it was originally tracked with and another with the color
    // that it was changed to which is bad.
    //
    // This is likely because the events variable has not been updated properly. Why was it not updated properly?
    // Because only the project was updated, not the log. The log object that has an instance of a project object
    // did not get updated.
    //
    // The bandaid fix would be to just go through every single log and update the project instance in all effected logs.
    // This would be O(n) to find the correct logs to edit.
    // Then O(n) to actually replace the instance.
    //
    // I have two choices
    // 1. Restructure the database.
    // 2. Have an O(n) solution. First O(n) to find all affected logs, then bulkUpdate.
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

                console.log(`${log.activity} ${log.project.color}`);

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
