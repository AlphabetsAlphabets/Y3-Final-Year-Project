<script lang="ts">
    import { onMount } from "svelte";

    let syncWorker: Worker | undefined = undefined;

    const onWorkerMessage = () => {
        console.log("MAIN THREAD: A message was received from the worker.");
    };

    const loadWorker = async () => {
        const SyncWorker = await import("$lib/worker/database.worker?worker");
        syncWorker = new SyncWorker.default();
        syncWorker.onmessage = onWorkerMessage;
        syncWorker.postMessage({});
        console.log(
            "MAIN THREAD: Component mounted and sent message to web worker.",
        );
    };

    onMount(loadWorker);
</script>
