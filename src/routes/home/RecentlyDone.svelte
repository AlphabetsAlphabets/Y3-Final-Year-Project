<script lang="ts">
    import type { DbWorker } from "$lib/database.worker";
    import * as Comlink from "comlink";
    import type { Log } from "$lib/types/schema";

    let {
        dbWorker,
        logs,
    }: { dbWorker: Comlink.Remote<DbWorker>; logs: Log[] } = $props();

    let recentLogs: Log[] = $state([]);

    const loadRecentLogs = async () => {
        recentLogs = logs.sort((a, b) => b.end - a.end).slice(0, 10);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return (
            date.toLocaleDateString() +
            " " +
            date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    };

    const formatDuration = (elapsed: number) => {
        // Convert milliseconds to seconds
        const totalSeconds = Math.floor(elapsed / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

        return parts.join("");
    };

    // Load logs when logs prop changes
    $effect(() => {
        loadRecentLogs();
    });
</script>

<div class="recently-done-container">
    <h3>Recent activities</h3>

    {#if dbWorker}
        {#if recentLogs.length > 0}
            <div class="scrollable-list">
                <ul>
                    {#each recentLogs as log (log.id)}
                        <li>
                            <strong>{log.activity}</strong>
                            {#if log.project_name}
                                <span
                                    class="badge rounded-pill"
                                    style="background-color: {log.project_color ||
                                        '#6c757d'}; color: white; margin-left: 8px;"
                                >
                                    {log.project_name}
                                </span>
                            {/if}
                            <span class="duration"
                                >{formatDuration(log.elapsed)}</span
                            >
                            <span class="ended">{formatDate(log.end)}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        {:else}
            <p>No recently tracked activities found.</p>
        {/if}
    {:else}
        <p>Loading recently tracked activities...</p>
    {/if}
</div>

<style>
    .scrollable-list {
        max-height: 400px; /* Roughly 5 items */
        overflow-y: auto;
        border: 1px solid #dee2e6;
        border-radius: 0.375rem;
        padding: 0.5rem;
    }

    .scrollable-list ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .scrollable-list li {
        padding: 0.75rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .duration {
        margin-left: auto;
        font-size: 0.875rem;
        color: #6c757d;
    }

    .ended {
        font-size: 0.875rem;
        color: #6c757d;
        white-space: nowrap;
    }

    .scrollable-list li:last-child {
        border-bottom: none;
    }

    .recently-done-container {
        margin-bottom: 100px; /* Add space for fixed bottom navigation */
    }
</style>
