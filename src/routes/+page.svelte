<script lang="ts">
    import { onMount } from "svelte";

    onMount(async () => {
        let myWorker = await import("$lib/worker?worker");
        let worker = new myWorker.default();

        worker.postMessage({ command: "schema", messageId: 1 });
        worker.postMessage({ command: "reset", messageId: 2 });
        worker.postMessage({ command: "list", messageId: 3 });
        console.log("Message sent to worker");

        worker.onmessage = (e: MessageEvent) => {
            console.log("Received response from worker:", e.data);
        };
    });
</script>
