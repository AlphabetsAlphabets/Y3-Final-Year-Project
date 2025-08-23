<script lang="ts">
    import { onMount } from "svelte";

    import * as Comlink from "comlink";

    import { PieChart } from "@carbon/charts-svelte";
    import "@carbon/charts-svelte/styles.css";

    import type { DbWorker } from "$lib/database.worker";
    import type { Log } from "$lib/types/schema";
    import { listLog } from "../calendar/log";

    import { pieOptions, type PieData } from "./charts";
    import {
        getColors,
        timeDistributionByActivity,
        timeDistributionByProject,
    } from "./time_distributions";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    let logs: Log[] = $state([]);
    let pieData: PieData[] = $state([]);
    let selectedOption: string = $state("activity");
    let colors = {};

    pieOptions.title = `Time distribution by ${selectedOption}`;

    const handleDropdownChange = (event: Event) => {
        const target = event.target as HTMLSelectElement;
        selectedOption = target.value;
        if (selectedOption === "activity") {
            pieData = timeDistributionByActivity(logs);
            colors = getColors(logs, true);
        } else if (selectedOption === "project") {
            pieData = timeDistributionByProject(logs);
            colors = getColors(logs, false);
        }

        pieOptions.color.scale = colors;
        pieOptions.title = `Time distribution by ${selectedOption}`;
    };

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        logs = await listLog(dbWorker);
        colors = getColors(logs, true);
        pieData = timeDistributionByActivity(logs);
        pieOptions.color.scale = colors;
    };

    onMount(loadWorker);
</script>

<div class="summary-page">
    <h1>Time Tracking Summary</h1>
    <div class="distribution-selector">
        <label for="distribution-type">View by:</label>
        <select
            id="distribution-type"
            value={selectedOption}
            onchange={handleDropdownChange}
        >
            <option value="activity">Activity</option>
            <option value="project">Project</option>
        </select>
    </div>

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

    .distribution-selector {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .distribution-selector label {
        font-weight: 500;
        color: #161616;
        font-size: 1rem;
    }

    .distribution-selector select {
        padding: 0.5rem 1rem;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        background: white;
        color: #161616;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s;
    }

    .distribution-selector select:hover {
        border-color: #0f62fe;
    }

    .distribution-selector select:focus {
        outline: none;
        border-color: #0f62fe;
        box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.2);
    }
</style>
