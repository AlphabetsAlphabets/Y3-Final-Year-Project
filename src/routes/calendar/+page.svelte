<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Calendar from "$lib/components/Calendar.svelte";
    import type { DbWorker } from "$lib/workers/database.worker";
    import type { CalendarEvent } from "$lib/calendar";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let calendarEvents: CalendarEvent[] = $state([]);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        let events: CalendarEvent[] = [];
        (await dbWorker.listLog()).forEach((log) => {
            events.push({
                id: log.id,
                title: log.activity,
                start: new Date(log.start).toISOString(),
                end: new Date(log.end).toISOString(),
                backgroundColor: log.project_color,
            });
        });

        calendarEvents = events;
    };

    onMount(loadWorker);
</script>

{#if dbWorker}
    {#key calendarEvents}
        <Calendar events={calendarEvents} />
    {/key}
{:else}
    <p>Please wait while the calendar loads</p>
{/if}
