<script lang="ts">
    import ActivityOrProject from "./ActivityOrProject.svelte";
    import DateRange from "./DateRange.svelte";

    let {
        pieData = $bindable(),
        colors = $bindable(),
        viewBy = $bindable(),
        timeUnit = $bindable(),
        pieOptions = $bindable(),
        logs,
    } = $props();

    let startDate = $state("");
    let endDate = $state("");
</script>

<DateRange
    bind:startDate
    bind:viewBy
    bind:timeUnit
    bind:endDate
    bind:pieData
    {logs}
/>

<ActivityOrProject
    bind:pieData
    bind:colors
    bind:viewBy
    bind:timeUnit
    bind:pieOptions
    {logs}
/>
