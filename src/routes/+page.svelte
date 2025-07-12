<script lang="ts">
    import { onMount } from "svelte";

    onMount(async () => {
        let SyncWorker = await import("$lib/worker?worker");
        let worker = new SyncWorker.default();
        worker.postMessage({});
        worker.onmessage = (e: MessageEvent) => {
            console.log(`Received from worker: ${e.data}`);
        };
    });
</script>
