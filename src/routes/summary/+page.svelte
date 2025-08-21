<script lang="ts">
    import { onMount } from "svelte";

    import * as Comlink from "comlink";

    import { PieChart } from "@carbon/charts-svelte";
    import "@carbon/charts-svelte/styles.css";

    import type { DbWorker } from "$lib/database.worker";
    import type { Log } from "$lib/types/schema";
    import { listLog } from "../calendar/log";

    import type { PieData } from "./charts";
    import { timeDistributionByActivity } from "./time_distributions";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);
    let logs: Log[] = $state([]);
    let pieData: PieData[] = $state([]);

    // Initialize the worker
    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        logs = await listLog(dbWorker);
        pieData = timeDistributionByActivity(logs);
    };

    // Chart options
    const pieOptions = {
        title: "Time Distribution by Activity",
        resizable: true,
        height: "400px",
        pie: {
            alignment: "center",
        },
        donut: {
            center: {
                label: "Total Hours",
            },
        },
        legend: {
            position: "right",
        },
        color: {
            scale: {
                // Dynamic colors will be applied based on data
            },
        },
    };

    onMount(loadWorker);
</script>

<div class="summary-page">
    <h1>Time Tracking Summary</h1>

    {#if dbWorker}
        {#key pieData}
            {#if pieData.length > 0}
                <div class="chart-container">
                    <PieChart data={pieData} options={pieOptions} />
                </div>
            {:else}
                <div class="no-data">
                    <p>No time tracking data found.</p>
                    <p>Start logging your activities to see the summary!</p>
                </div>
            {/if}
        {/key}
    {:else}
        <div class="loading">
            <p>Loading summary data...</p>
        </div>
    {/if}
</div>

<style>
    .summary-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    h1 {
        color: #161616;
        font-size: 2.5rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f4f4f4;
        border-radius: 8px;
    }

    .refresh-btn {
        padding: 0.75rem 1.5rem;
        background: #0f62fe;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .refresh-btn:hover {
        background: #0353e9;
    }

    .total-time {
        font-size: 1.1rem;
        color: #161616;
    }

    .chart-container {
        margin: 2rem 0;
        padding: 1rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .summary-stats {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #f4f4f4;
        border-radius: 8px;
    }

    .summary-stats h3 {
        color: #161616;
        margin-bottom: 1rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: white;
        border-radius: 4px;
        border-left: 4px solid #0f62fe;
    }

    .stat-label {
        font-weight: 500;
        color: #525252;
        flex: 1;
    }

    .stat-value {
        font-weight: 600;
        color: #161616;
        margin-right: 0.5rem;
    }

    .stat-percentage {
        font-size: 0.9rem;
        color: #6f6f6f;
    }

    .recent-logs {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .recent-logs h3 {
        color: #161616;
        margin-bottom: 1rem;
    }

    .logs-table {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .log-entry {
        display: grid;
        grid-template-columns: 2fr 2fr 1fr 1fr;
        gap: 1rem;
        padding: 0.75rem;
        background: #f9f9f9;
        border-radius: 4px;
        align-items: center;
    }

    .log-activity {
        font-weight: 500;
        color: #161616;
    }

    .log-project {
        padding-left: 0.5rem;
        border-left: 3px solid #0f62fe;
        color: #525252;
    }

    .log-duration {
        font-weight: 600;
        color: #0f62fe;
        text-align: right;
    }

    .log-date {
        color: #6f6f6f;
        font-size: 0.9rem;
        text-align: right;
    }

    .no-data,
    .loading {
        text-align: center;
        padding: 3rem;
        color: #525252;
    }

    .no-data p,
    .loading p {
        margin: 0.5rem 0;
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .summary-page {
            padding: 1rem;
        }

        .summary-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }

        .log-entry {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .log-duration,
        .log-date {
            text-align: left;
        }
    }
</style>
