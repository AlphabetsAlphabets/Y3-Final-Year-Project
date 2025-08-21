<script>
    import { PieChart } from "@carbon/charts-svelte";
    import "@carbon/charts-svelte/styles.css";

    // Sample data for the pie chart
    const pieData = [
        {
            group: "Work",
            value: 120,
        },
        {
            group: "Personal Projects",
            value: 80,
        },
        {
            group: "Learning",
            value: 60,
        },
        {
            group: "Meetings",
            value: 40,
        },
        {
            group: "Break",
            value: 30,
        },
    ];

    // Chart options
    const pieOptions = {
        title: "Time Distribution Summary",
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
                Work: "#0f62fe",
                "Personal Projects": "#24a148",
                Learning: "#f1c21b",
                Meetings: "#fa4d56",
                Break: "#8a3ffc",
            },
        },
    };
</script>

<div class="summary-page">
    <h1>Time Tracking Summary</h1>

    <div class="chart-container">
        <PieChart data={pieData} options={pieOptions} />
    </div>

    <div class="summary-stats">
        <h3>Summary Statistics</h3>
        <div class="stats-grid">
            {#each pieData as item}
                <div class="stat-item">
                    <span class="stat-label">{item.group}:</span>
                    <span class="stat-value">{item.value} hours</span>
                </div>
            {/each}
        </div>
    </div>
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
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background: white;
        border-radius: 4px;
        border-left: 4px solid #0f62fe;
    }

    .stat-label {
        font-weight: 500;
        color: #525252;
    }

    .stat-value {
        font-weight: 600;
        color: #161616;
    }
</style>
