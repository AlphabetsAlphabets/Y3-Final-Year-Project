<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Calendar from "$lib/components/Calendar.svelte";
    import type { DbWorker } from "$lib/workers/database.worker";
    import type { CalendarEvent } from "$lib/calendar";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let calendarEvents: Log[] = $state([]);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        calendarEvents = await dbWorker.listLog();
        console.log(calendarEvents);
    };

    onMount(loadWorker);
</script>

{#if dbWorker}
    <p>Done</p>
    <!-- <Calendar events={calendarEvents} /> -->
{:else}
    <p>Please wait while the calendar loads</p>
{/if}
