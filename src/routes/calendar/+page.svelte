<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Calendar from "./Calendar.svelte";
    import type { CalendarEvent } from "./calendar";

    import type { DbWorker } from "$lib/database.worker";
    import type { Log } from "$lib/types/schema";
    import { addTestLog } from "$lib/utils/calendar";
    import { listLog } from "./log";

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

        calendarEvents = mapLogsToEvents(await listLog(dbWorker));
    }

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        await refreshCalendar();
    };

    const createDummyLogs = async () => {
        if (!dbWorker) {
            console.error("Worker not ready yet.");
            return;
        }

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
