<script lang="ts">
    import { onMount } from "svelte";

    import * as Comlink from "comlink";

    import { PieChart } from "@carbon/charts-svelte";
    import "@carbon/charts-svelte/styles.css";

    import type { DbWorker } from "$lib/database.worker";
    import type { Log } from "$lib/types/schema";
    import { listLog } from "../calendar/log";

    import { defaultPieOptions, type PieData } from "./charts";
    import {
        getColors,
        timeDistributionByActivity,
        type PieColor,
    } from "./time_distributions";

    import Filter from "./filter/Filter.svelte";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    let logs: Log[] = $state([]);

    let pieOptions = $state(defaultPieOptions);
    let pieData: PieData[] = $state([]);

    let viewBy = $state("activity");
    let timeUnit = $state("hours");
    let colors: PieColor = $state({});

    pieOptions.title = `Time distribution by activity`;

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        logs = await listLog(dbWorker);
        pieData = timeDistributionByActivity(logs);

        colors = getColors(logs, true);
        pieOptions.color.scale = colors;
    };

    onMount(loadWorker);
</script>

<div class="summary-page">
    <h1>Time Tracking Summary</h1>
    <Filter
        bind:pieData
        bind:colors
        bind:viewBy
        bind:timeUnit
        bind:pieOptions
        {logs}
    />

    {#if filteredLogs.length > 0}
        <div class="summary-stats">
            <div class="stat-card">
                <h3>Total Hours</h3>
                <p class="stat-value">{summaryStats.totalHours}h</p>
            </div>
            <div class="stat-card">
                <h3>Sessions</h3>
                <p class="stat-value">{summaryStats.totalSessions}</p>
            </div>
            <div class="stat-card">
                <h3>Avg Session</h3>
                <p class="stat-value">{summaryStats.averageSessionLength}h</p>
            </div>
            {#if summaryStats.dateRange.earliest && summaryStats.dateRange.latest}
                <div class="stat-card">
                    <h3>Date Range</h3>
                    <p class="stat-value-small">
                        {summaryStats.dateRange.earliest.toLocaleDateString()}
                        {#if summaryStats.dateRange.earliest.toDateString() !== summaryStats.dateRange.latest.toDateString()}
                            <br />to<br />
                            {summaryStats.dateRange.latest.toLocaleDateString()}
                        {/if}
                    </p>
                </div>
            {/if}
        </div>
    {/if}

    {#if dbWorker}
        {#key pieData}
            {#if pieData.length > 0}
                <div class="chart-container">
                    <PieChart data={pieData} options={pieOptions} />
                </div>
            {:else}
                <div class="no-data">
                    <p>
                        No time tracking data found{startDate || endDate
                            ? " for the selected date range"
                            : ""}.
                    </p>
                    {#if startDate || endDate}
                        <p>
                            Try adjusting your date range or clearing the
                            filters.
                        </p>
                    {:else}
                        <p>Start logging your activities to see the summary!</p>
                    {/if}
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

    .filters-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .summary-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        text-align: center;
        border-left: 4px solid #0f62fe;
    }

    .stat-card h3 {
        color: #525252;
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .stat-value {
        color: #161616;
        font-size: 2rem;
        font-weight: 600;
        margin: 0;
        line-height: 1;
    }

    .stat-value-small {
        color: #161616;
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
        line-height: 1.2;
    }

    .chart-container {
        margin: 2rem 0;
        padding: 1rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
</style>
