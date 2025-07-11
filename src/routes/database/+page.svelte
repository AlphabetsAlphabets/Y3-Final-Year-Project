<script lang="ts">
    import { onMount } from "svelte";

    let syncWorker: Worker | undefined = undefined;
    let users: any[] = [];
    let logs: string[] = [];

    const addLog = (message: string) => {
        logs = [`[${new Date().toLocaleTimeString()}] ${message}`, ...logs];
    };

    const onWorkerMessage = (e: MessageEvent) => {
        const { success, data, error } = e.data;
        addLog("MAIN THREAD: A message was received from the worker.");

        if (success) {
            const dataString = JSON.stringify(data, null, 2);
            addLog(`Success: ${dataString}`);
            // If the data is an array, it's likely the user list
            if (Array.isArray(data)) {
                users = data;
            }
        } else {
            addLog(`Error: ${error}`);
        }
    };

    const loadWorker = async () => {
        try {
            const SyncWorker = await import(
                "$lib/worker/database.worker?worker"
            );
            syncWorker = new SyncWorker.default();
            syncWorker.onmessage = onWorkerMessage;
            addLog("MAIN THREAD: Web worker loaded successfully.");
        } catch (e: any) {
            addLog(`MAIN THREAD: Failed to load web worker. ${e.message}`);
        }
    };

    const initializeDatabase = () => {
        if (!syncWorker) {
            addLog("Worker not ready.");
            return;
        }
        addLog("MAIN THREAD: Sending 'init' command to worker.");
        syncWorker.postMessage({ command: "init" });
    };

    const listUsers = () => {
        if (!syncWorker) {
            addLog("Worker not ready.");
            return;
        }
        addLog("MAIN THREAD: Sending 'list' command to worker.");
        syncWorker.postMessage({ command: "list" });
    };

    onMount(loadWorker);
</script>

<svelte:head>
    <title>Database Test</title>
</svelte:head>

<h1>DB test</h1>
