<script lang="ts">
    import * as Comlink from "comlink";
    import type { DbWorker } from "$lib/workers/database.worker";
    import type { RowModeArray } from "$lib/types/promiser";
    import { onMount } from "svelte";

    let names: {
        id: number;
        name: string;
    }[] = $state([]);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        // Create Comlink wrapper for the worker
        const dbWorker = Comlink.wrap<DbWorker>(new Worker.default());

        console.log("Setting up database");
        // Initialize and setup the database
        await dbWorker.setup();

        // Load activity data
        const response = await dbWorker.list("activity");
        console.log("Received activities from worker", response);

        if (response && response.result && response.result.resultRows) {
            response.result.resultRows.forEach((value) => {
                names.push({ id: value[0], name: value[1] });
            });
        }
    };

    onMount(loadWorker);
</script>

{#each names as name (name.id)}
    <p>{name.name}</p>
{/each}
