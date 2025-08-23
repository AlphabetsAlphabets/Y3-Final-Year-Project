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
        timeDistributionByActivity,
        timeDistributionByProject,
        getSummaryStats,
        formatDateRange,
        getColors,
    } from "./time_distributions";

    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    let logs: Log[] = $state([]);
    let filteredLogs: Log[] = $state([]);
    let pieData: PieData[] = $state([]);
    let selectedOption: string = $state("activity");
    let startDate: string = $state("");
    let endDate: string = $state("");
    let summaryStats = $state({
        totalHours: 0,
        totalSessions: 0,
        averageSessionLength: 0,
        dateRange: {
            earliest: null as Date | null,
            latest: null as Date | null,
        },
    });

    let pieTitle = `Time distribution by ${selectedOption}`;
    pieOptions.title = pieTitle;
    let colors = {};
    const filterLogsByDateRange = () => {
        if (!startDate && !endDate) {
            filteredLogs = logs;
            return;
        }

        const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
        const endTimestamp = endDate
            ? new Date(endDate + "T23:59:59").getTime()
            : Number.MAX_SAFE_INTEGER;

        filteredLogs = logs.filter((log) => {
            return log.start >= startTimestamp && log.end <= endTimestamp;
        });
    };

    const updateChartData = () => {
        summaryStats = getSummaryStats(filteredLogs);
        const dateRangeText = formatDateRange(startDate, endDate);

        if (selectedOption === "activity") {
            pieData = timeDistributionByActivity(filteredLogs);
            colors = getColors(filteredLogs, true);
        } else if (selectedOption === "project") {
            pieData = timeDistributionByProject(filteredLogs);
            colors = getColors(filteredLogs, false);
        }

        pieOptions.title = `Time distribution by ${selectedOption} (${dateRangeText})`;
        pieOptions.color.scale = colors;
    };

    const handleDropdownChange = (event: Event) => {
        const target = event.target as HTMLSelectElement;
        selectedOption = target.value;
        if (selectedOption === "activity") {
            pieData = timeDistributionByActivity(logs);
            pieOptions.title = "Time Distribution by Activity";
        } else if (selectedOption === "project") {
            pieData = timeDistributionByProject(logs);
            pieOptions.title = "Time Distribution by Project";
        }

        console.log("Selected option:", selectedOption);
        updateChartData();
    };

    const handleDateChange = () => {
        filterLogsByDateRange();
        updateChartData();
    };

    const clearDates = () => {
        startDate = "";
        endDate = "";
        handleDateChange();
    };

    const setPresetRange = (preset: string) => {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        switch (preset) {
            case "today":
                startDate = todayStr;
                endDate = todayStr;
                break;
            case "yesterday": {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split("T")[0];
                startDate = yesterdayStr;
                endDate = yesterdayStr;
                break;
            }
            case "thisWeek": {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                startDate = weekStart.toISOString().split("T")[0];
                endDate = todayStr;
                break;
            }
            case "lastWeek": {
                const lastWeekEnd = new Date(today);
                lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
                const lastWeekStart = new Date(lastWeekEnd);
                lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
                startDate = lastWeekStart.toISOString().split("T")[0];
                endDate = lastWeekEnd.toISOString().split("T")[0];
                break;
            }
            case "thisMonth": {
                const monthStart = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1,
                );
                startDate = monthStart.toISOString().split("T")[0];
                endDate = todayStr;
                break;
            }
            case "lastMonth": {
                const lastMonth = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    1,
                );
                const lastMonthEnd = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0,
                );
                startDate = lastMonth.toISOString().split("T")[0];
                endDate = lastMonthEnd.toISOString().split("T")[0];
                break;
            }
        }
        handleDateChange();
    };

    const loadWorker = async () => {
        const Worker = await import("$lib/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();

        logs = await listLog(dbWorker);
        filteredLogs = logs;
        pieData = timeDistributionByActivity(filteredLogs);

        colors = getColors(filteredLogs, true);
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
            <option value="date">By Date</option>
            <option value="hour">By Hour</option>
        </select>
        <div class="filters-container">
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

            <div class="date-filter">
                <div class="date-input-group">
                    <label for="start-date">From:</label>
                    <input
                        id="start-date"
                        type="date"
                        bind:value={startDate}
                        onchange={handleDateChange}
                    />
                </div>
                <div class="date-input-group">
                    <label for="end-date">To:</label>
                    <input
                        id="end-date"
                        type="date"
                        bind:value={endDate}
                        onchange={handleDateChange}
                    />
                </div>
                <button class="clear-dates" onclick={clearDates}>
                    Clear Dates
                </button>
            </div>

            <div class="preset-buttons">
                <h3>Quick Select:</h3>
                <div class="preset-grid">
                    <button
                        class="preset-btn"
                        onclick={() => setPresetRange("today")}
                    >
                        Today
                    </button>
                    <button
                        class="preset-btn"
                        onclick={() => setPresetRange("yesterday")}
                    >
                        Yesterday
                    </button>
                    <button
                        class="preset-btn"
                        onclick={() => setPresetRange("thisWeek")}
                    >
                        This Week
                    </button>
                    <button
                        class="preset-btn"
                        onclick={() => setPresetRange("lastWeek")}
                    >
                        Last Week
                    </button>
                    <button
                        class="preset-btn"
                        onclick={() => setPresetRange("thisMonth")}
                    >
                        This Month
                    </button>
                    <button
                        class="preset-btn"
                        onclick={() => setPresetRange("lastMonth")}
                    >
                        Last Month
                    </button>
                </div>
            </div>
        </div>
    </div>

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

    .distribution-selector {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .date-filter {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        flex-wrap: wrap;
    }

    .date-input-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .distribution-selector label,
    .date-input-group label {
        font-weight: 500;
        color: #161616;
        font-size: 1rem;
        white-space: nowrap;
    }

    .distribution-selector select,
    .date-input-group input {
        padding: 0.5rem 1rem;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        background: white;
        color: #161616;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s;
    }

    .distribution-selector select:hover,
    .date-input-group input:hover {
        border-color: #0f62fe;
    }

    .distribution-selector select:focus,
    .date-input-group input:focus {
        outline: none;
        border-color: #0f62fe;
        box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.2);
    }

    .clear-dates {
        padding: 0.5rem 1rem;
        background: #da1e28;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        white-space: nowrap;
    }

    .clear-dates:hover {
        background: #ba1b23;
    }

    .clear-dates:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(218, 30, 40, 0.2);
    }

    @media (max-width: 768px) {
        .filters-container {
            gap: 1rem;
        }

        .date-filter {
            flex-direction: column;
            align-items: stretch;
        }

        .date-input-group {
            justify-content: space-between;
        }

        .clear-dates {
            align-self: center;
            margin-top: 0.5rem;
        }
    }

    .preset-buttons {
        padding: 1rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .preset-buttons h3 {
        margin: 0 0 1rem 0;
        color: #161616;
        font-size: 1rem;
        font-weight: 500;
    }

    .preset-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 0.5rem;
    }

    .preset-btn {
        padding: 0.5rem 0.75rem;
        background: #f4f4f4;
        color: #161616;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
    }

    .preset-btn:hover {
        background: #e0e0e0;
        border-color: #0f62fe;
    }

    .preset-btn:focus {
        outline: none;
        border-color: #0f62fe;
        box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.2);
    }

    .preset-btn:active {
        background: #0f62fe;
        color: white;
        border-color: #0f62fe;
    }

    @media (min-width: 769px) {
        .filters-container {
            flex-direction: row;
        }

        .distribution-selector,
        .date-filter {
            flex: 1;
        }

        .preset-buttons {
            flex: 2;
        }
    }
</style>
