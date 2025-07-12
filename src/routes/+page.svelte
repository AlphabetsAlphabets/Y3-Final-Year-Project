<script lang="ts">
    import { onMount } from "svelte";

    onMount(async () => {
        let myWorker = await import("$lib/worker?worker");
        let worker = new myWorker.default();

        worker.postMessage({});
        console.log("Message sent to worker");

        worker.onmessage = (e: MessageEvent) => {
            console.log("Received response from worker:", e.data);
        };
    });
</script>
