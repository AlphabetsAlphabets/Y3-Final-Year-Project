<script lang="ts">
    import type { MessageReply } from "$lib/types/message";
    import type { RowModeArray } from "$lib/types/promiser";
    import { onMount } from "svelte";

    let names: {
        id: number;
        name: string;
    }[] = $state([]);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        let worker = new Worker.default();

        worker.onmessage = (e) => {
            console.log("message received from worker.");

            let reply: MessageReply = e.data;
            if (reply.messageId === 3 && reply.data) {
                let response = reply.data as RowModeArray;
                let results = response.result.resultRows;
                results.forEach((value) => {
                    let activity = value as Activity;
                    names.push({ id: activity[0], name: activity[1] });
                });
            }
        };

        worker.postMessage({ command: "schema", messageId: 1 });
        worker.postMessage({ command: "list", messageId: 3 });
    };

    onMount(loadWorker);
</script>

{#each names as name (name.id)}
    <p>{name.name}</p>
{/each}
