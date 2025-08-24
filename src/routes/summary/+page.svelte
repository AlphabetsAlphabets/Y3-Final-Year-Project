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

    import Filter from "./Filter.svelte";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    let logs: Log[] = $state([]);

    let pieOptions = $state(defaultPieOptions);
    let pieData: PieData[] = $state([]);

    let selectedOption = $state("activity");
    let colors: PieColor = $state({});

    pieOptions.title = `Time distribution by activity`;

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        logs = await listLog(dbWorker);
        pieData = timeDistributionByActivity(logs);
        console.log("PIE DATA: ", pieData);

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
        bind:selectedOption
        bind:pieOptions
        {logs}
    />

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
