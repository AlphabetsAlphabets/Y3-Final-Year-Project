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

<section>
    <h1>Database Worker Test</h1>
    <p>
        Use the buttons below to interact with the SQLite database running in a
        web worker. The database is stored in the Origin Private File System for
        persistence.
    </p>

    <div class="controls">
        <button on:click={initializeDatabase}
            >Initialize DB & Insert "John Doe"</button
        >
        <button on:click={listUsers}>List Users</button>
    </div>

    <h2>Users in Database</h2>
    {#if users.length > 0}
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user (user.id)}
                    <tr>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>
            No users found. Click "Initialize DB" first, then "List Users" to
            fetch data.
        </p>
    {/if}

    <h2>Logs</h2>
    <div class="logs">
        {#each logs as log}
            <p>{log}</p>
        {/each}
    </div>
</section>

<style>
    section {
        font-family: sans-serif;
        max-width: 800px;
        margin: 2rem auto;
        padding: 1rem;
    }
    .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-block: 2rem;
    }
    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        border: 1px solid #ccc;
        background-color: #f0f0f0;
        border-radius: 4px;
    }
    button:hover {
        background-color: #e0e0e0;
    }
    .logs {
        background-color: #2e2e2e;
        color: #f0f0f0;
        border: 1px solid #ccc;
        padding: 1rem;
        height: 300px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: monospace;
        font-size: 0.875rem;
        border-radius: 4px;
    }
    .logs p {
        margin: 0;
        padding: 0.25rem 0;
        border-bottom: 1px solid #444;
    }
    .logs p:last-child {
        border-bottom: none;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    th,
    td {
        border: 1px solid #ccc;
        padding: 0.5rem;
        text-align: left;
    }
    th {
        background-color: #f0f0f0;
    }
</style>
