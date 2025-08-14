<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Calendar from "$lib/components/Calendar.svelte";
    import type { CalendarEvent } from "$lib/calendar";

    import type { DbWorker } from "$lib/workers/database.worker";
    import type { Log } from "$lib/types/schema";
    import { addTestLog } from "$lib/utils/calendar";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let calendarEvents: CalendarEvent[] = $state([]);

    const mapLogsToEvents = (logs: Log[]): CalendarEvent[] => {
        return logs.map((log) => ({
            id: log.id,
            title: log.activity,
            start: new Date(log.start),
            end: new Date(log.end),
            backgroundColor: log.project_color,
        }));
    };

    async function refreshCalendar() {
        if (!dbWorker) return;
        calendarEvents = mapLogsToEvents(await dbWorker.listLog());
    }

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        await refreshCalendar();
    };

    const createDummyLogs = async () => {
        addTestLog(dbWorker);
        await refreshCalendar();
    };

    onMount(loadWorker);
</script>

{#if dbWorker}
    <button onclick={createDummyLogs}> Add test log </button>
    {#key calendarEvents}
        <Calendar events={calendarEvents} refresh={refreshCalendar} />
    {/key}
{:else}
    <p>Please wait while the calendar loads</p>
{/if}
