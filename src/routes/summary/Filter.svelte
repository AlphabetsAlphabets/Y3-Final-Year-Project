<script lang="ts">
    import {
        getColors,
        timeDistributionByActivity,
        timeDistributionByProject,
    } from "./time_distributions";

    let {
        pieData = $bindable(),
        colors = $bindable(),
        selectedOption = $bindable(),
        pieOptions = $bindable(),
        logs,
    } = $props();

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
    };
</script>

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
