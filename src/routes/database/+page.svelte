<script lang="ts">
    import { onMount } from "svelte";

    let syncWorker: Worker | undefined = undefined;

    const loadWorker = async () => {
        const SyncWorker = await import("$lib/workers/database.worker?worker");

        syncWorker = new SyncWorker.default();

        syncWorker.onmessage = (e) => {
            console.log("message received from worker.");
            console.log(e.data);
        };

        syncWorker.postMessage("Hello from +page.svelte");
    };

    onMount(loadWorker);
</script>
