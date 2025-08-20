<script lang="ts">
    import type { DbWorker } from "$lib/database.worker";
    import * as Comlink from "comlink";
    import { onMount } from "svelte";

    import type { Task } from "$lib/types/schema";
    import { listTasks } from "$lib/utils/task";

    import TaskAdder from "./TaskAdder.svelte";
    import Done from "./Done.svelte";
    import Todo from "./Todo.svelte";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    let tasks: Task[] = $state([]);
    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
        tasks = await listTasks(dbWorker);
    };

    onMount(loadWorker);
</script>

<div class="container">
    {#key dbWorker}
        {#if dbWorker}
            <TaskAdder {dbWorker} bind:tasks />
            <Done {dbWorker} bind:tasks />
            <Todo {dbWorker} bind:tasks />
        {:else}
            <p>Please wait while the app loads.</p>
        {/if}
    {/key}
</div>

<style>
    .container {
        max-width: 700px;
        margin: 2rem auto;
        padding: 1rem;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
    }
</style>
