<script lang="ts">
    import type { Log } from "$lib/types/schema";
    import { pieChartByActivityOrProject, viewByMinute } from "../filter";

    let {
        startDate = $bindable(),
        endDate = $bindable(),
        pieData = $bindable(),
        viewBy = $bindable(),
        timeUnit = $bindable(),
        logs,
    } = $props();

    const filterLogsByDateRange = () => {
        let filtered: Log[] = [];
        if (startDate) {
            const startTimestamp = new Date(startDate).getTime();
            filtered = logs.filter((log: Log) => log.start >= startTimestamp);
        }

        if (endDate) {
            const endTimestamp = new Date(endDate).getTime();
            filtered = logs.filter((log: Log) => log.end <= endTimestamp);
        }

        let newPieData = pieChartByActivityOrProject(viewBy, filtered);

        if (timeUnit === "minutes") {
            newPieData = viewByMinute(newPieData);
        }

        pieData = newPieData;
    };

    const handleStartDateChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        startDate = target.value;
        filterLogsByDateRange();
    };

    const handleEndDateChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        endDate = target.value;
        filterLogsByDateRange();
    };

    const setToYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        startDate = yesterdayStr;
        endDate = yesterdayStr;
        filterLogsByDateRange();
    };

    const setToToday = () => {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        startDate = todayStr;
        endDate = todayStr;
        filterLogsByDateRange();
    };

    const clearDates = () => {
        startDate = "";
        endDate = "";
        // Show all logs when no date filter is applied
        let newPieData = pieChartByActivityOrProject(viewBy, logs);
        if (timeUnit === "minutes") {
            newPieData = viewByMinute(newPieData);
        }
        pieData = newPieData;
    };
</script>

<div class="date-range-selector">
    <label for="start-date">Start Date:</label>
    <input
        id="start-date"
        type="date"
        value={startDate}
        onchange={handleStartDateChange}
    />
    <label for="end-date">End Date:</label>
    <input
        id="end-date"
        type="date"
        value={endDate}
        onchange={handleEndDateChange}
    />

    <div class="button-group">
        <button class="date-button" onclick={setToYesterday}>Yesterday</button>
        <button class="date-button" onclick={setToToday}>Today</button>
        <button class="date-button clear" onclick={clearDates}
            >Clear date</button
        >
    </div>
</div>

<style>
    .date-range-selector {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .date-range-selector label {
        font-weight: 500;
        color: #161616;
        font-size: 1rem;
    }

    .date-range-selector input[type="date"] {
        padding: 0.5rem 1rem;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        background: white;
        color: #161616;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s;
    }

    .date-range-selector input[type="date"]:hover {
        border-color: #0f62fe;
    }

    .date-range-selector input[type="date"]:focus {
        outline: none;
        border-color: #0f62fe;
        box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.2);
    }

    .button-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-left: auto;
    }

    @media (max-width: 768px) {
        .date-range-selector {
            flex-direction: column;
            align-items: stretch;
        }

        .button-group {
            margin-left: 0;
            justify-content: center;
        }

        .date-range-selector label {
            margin-bottom: 0.25rem;
        }

        .date-range-selector input[type="text"] {
            margin-bottom: 0.5rem;
        }
    }

    .date-button {
        padding: 0.5rem 1rem;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        background: white;
        color: #161616;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
    }

    .date-button:hover {
        border-color: #0f62fe;
        background: #f4f4f4;
    }

    .date-button:focus {
        outline: none;
        border-color: #0f62fe;
        box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.2);
    }

    .date-button.clear {
        border-color: #da1e28;
        color: #da1e28;
    }

    .date-button.clear:hover {
        background: #fff1f1;
        border-color: #da1e28;
    }
</style>
