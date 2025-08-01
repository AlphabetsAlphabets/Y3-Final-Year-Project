<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Calendar from "$lib/components/Calendar.svelte";
    import type { DbWorker } from "$lib/workers/database.worker";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);
</script>

<Calendar />
