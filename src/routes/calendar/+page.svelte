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
            // The wrong project color is due to the fact that this field
            // doesn't exist. Will need to pull from the database.
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

    onMount(loadWorker);

    const addTestLog = async () => {
        if (!dbWorker) return;

        const projects = {
            Relaxing: "green",
            Work: "blue",
        };

        const activities = [
            { name: "Reading", project: "Relaxing" },
            { name: "Gaming", project: "Relaxing" },
            { name: "FYP", project: "Work" },
        ];

        const existingProjects = await dbWorker.listProjects();
        const existingProjectNames = new Set(
            existingProjects.map((p) => p.name),
        );

        for (const [projectName, projectColor] of Object.entries(projects)) {
            if (!existingProjectNames.has(projectName)) {
                await dbWorker.addProject(projectName, projectColor);
            }
        }

        const existingActivities = await dbWorker.listActivities();
        const existingActivityNames = new Set(
            existingActivities.map((a) => a.name),
        );

        for (const activity of activities) {
            if (!existingActivityNames.has(activity.name)) {
                await dbWorker.addActivity(activity.name);
            }
        }

        const now = Date.now();
        const twoHoursInMillis = 2 * 60 * 60 * 1000;

        const logsToAdd = [
            {
                activityName: "Reading",
                projectName: "Relaxing",
                start: now,
                end: now + twoHoursInMillis,
            },
            {
                activityName: "FYP",
                projectName: "Work",
                start: now + twoHoursInMillis,
                end: now + 2 * twoHoursInMillis,
            },
            {
                activityName: "Gaming",
                projectName: "Relaxing",
                start: now - 3 * 60 * 60 * 1000,
                end: now - 3 * 60 * 60 * 1000 + twoHoursInMillis,
            },
        ];

        for (const log of logsToAdd) {
            await dbWorker.addLog(
                log.activityName,
                log.projectName,
                log.end - log.start,
                log.start,
                log.end,
            );
        }

        await refreshCalendar();
    };

    const listReadingLogs = async () => {
        if (!dbWorker) return;

        const readingLogs = await dbWorker.listLogsByActivity("Reading");
        console.log("Reading logs:", readingLogs);
    };
</script>

{#if dbWorker}
    <button onclick={addTestLog}> Add test log </button>
    <button onclick={listReadingLogs}> List Reading Logs </button>
    {#key calendarEvents}
        <Calendar events={calendarEvents} on:eventupdated={refreshCalendar} />
    {/key}
{:else}
    <p>Please wait while the calendar loads</p>
{/if}
