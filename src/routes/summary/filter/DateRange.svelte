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
</div>

<style>
    .date-range-selector {
        display: flex;
        align-items: center;
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
</style>
