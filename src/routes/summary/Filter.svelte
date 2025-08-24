<script lang="ts">
    import { pieChartByActivityOrProject, viewByMinute } from "./filter";
    import { getColors } from "./time_distributions";

    let {
        pieData = $bindable(),
        colors = $bindable(),
        viewBy = $bindable(),
        timeUnit = $bindable(),
        pieOptions = $bindable(),
        logs,
    } = $props();

    const handleViewByChange = (event: Event) => {
        const target = event.target as HTMLSelectElement;
        viewBy = target.value;

        let newPieData = pieChartByActivityOrProject(viewBy, logs);
        let pieColor = getColors(logs, true);

        if (viewBy === "project") {
            pieColor = getColors(logs, false);
            newPieData = pieChartByActivityOrProject(viewBy, logs);
        }

        pieOptions.color.scale = pieColor;
        pieData = newPieData;
    };

    const handleTimeUnitChange = (event: Event) => {
        const target = event.target as HTMLSelectElement;
        timeUnit = target.value;

        let newPieData = pieChartByActivityOrProject(viewBy, logs);

        if (timeUnit === "minutes") {
            newPieData = viewByMinute(newPieData);
        }

        pieData = newPieData;
    };
</script>

<div class="distribution-selector">
    <label for="view-by-select">View by:</label>
    <select id="view-by-select" value={viewBy} onchange={handleViewByChange}>
        <option value="activity">Activity</option>
        <option value="project">Project</option>
    </select>
    <label for="time-unit-select">Time unit:</label>
    <select
        id="time-unit-select"
        value={timeUnit}
        onchange={handleTimeUnitChange}
    >
        <option value="hours">Hours</option>
        <option value="minutes">Minutes</option>
    </select>
</div>

<style>
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
