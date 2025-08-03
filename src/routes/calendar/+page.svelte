<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Calendar from "$lib/components/Calendar.svelte";
    import type { DbWorker } from "$lib/workers/database.worker";
    import type { CalendarEvent } from "$lib/calendar";
    import type { Log } from "$lib/types/schema";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let calendarEvents: CalendarEvent[] = $state([]);

    const mapLogsToEvents = (logs: Log[]): CalendarEvent[] => {
        return logs.map((log) => ({
            id: log.id,
            title: log.activity,
            start: new Date(log.start).toISOString(),
            end: new Date(log.end).toISOString(),
            backgroundColor: log.project_color,
        }));
    };

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        calendarEvents = mapLogsToEvents(await dbWorker.listLog());
    };

    onMount(loadWorker);

    const addTestLog = async () => {
        if (!dbWorker) return;

        const activityName = "TEST";
        const projectName = "TEST";
        const projectColor = "hotpink";

        await dbWorker.addActivity(activityName);
        await dbWorker.addProject(projectName, projectColor);

        const start = Date.now();
        const twoHoursInMillis = 2 * 60 * 60 * 1000;
        const end = start + twoHoursInMillis;
        const elapsed = twoHoursInMillis;

        const newLogs = await dbWorker.addLog(
            activityName,
            projectName,
            elapsed,
            start,
            end,
        );

        calendarEvents = mapLogsToEvents(newLogs);
    };
</script>

{#if dbWorker}
    <button onclick={addTestLog}> Add test log </button>
    {#key calendarEvents}
        <Calendar events={calendarEvents} />
    {/key}
{:else}
    <p>Please wait while the calendar loads</p>
{/if}
