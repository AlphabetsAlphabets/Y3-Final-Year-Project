<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import MessageModal from "$lib/components/derived/MessageModal.svelte";
    import SelectModal from "$lib/components/derived/SelectModal.svelte";
    import { onMount } from "svelte";

    let activityName = $state("Activity");

    let modal: Modal | null = $state(null);
    let options: {
        id: number;
        name: string;
    }[] = $state([]);

    onMount(async () => {
        let SyncWorker = await import("$lib/database.worker?worker");
        let worker = new SyncWorker.default();
        worker.postMessage({ command: "schema", messageId: 1 });
        worker.postMessage({ command: "list", messageId: 2 });

        worker.onmessage = (data: MessageEvent) => {
            let result = data.data;
            if (result.messageId === 2) {
                for (var i = 0; i < result.data.length; i++) {
                    let entry = result.data[i];
                    options.push({ id: entry[0], name: entry[1] });
                }
            }
        };
    });
</script>

{#key options}
    {#each options as option (option.id)}
        <p>{option.name}</p>
    {/each}
{/key}

<MessageModal bind:modal></MessageModal>

<div class="container-md py-4">
    <form class="pt-4">
        {#key options}
            <SelectModal bind:name={activityName} {options} />
        {/key}
    </form>
</div>
