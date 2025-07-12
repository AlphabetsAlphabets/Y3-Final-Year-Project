<script lang="ts">
    import { onMount } from "svelte";

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        let worker = new Worker.default();

        worker.onmessage = (e) => {
            console.log("message received from worker.");
            console.log(e.data);
        };

        worker.postMessage({ command: "schema", messageId: 1 });
        worker.postMessage({ command: "reset", messageId: 2 });
        worker.postMessage({ command: "list", messageId: 3 });
    };

    onMount(loadWorker);
</script>
