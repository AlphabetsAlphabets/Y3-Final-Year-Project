<script lang="ts">
    import ActivityOrProject from "./ActivityOrProject.svelte";

    let {
        pieData = $bindable(),
        colors = $bindable(),
        viewBy = $bindable(),
        timeUnit = $bindable(),
        pieOptions = $bindable(),
        logs,
    } = $props();
</script>

<ActivityOrProject
    bind:pieData
    bind:colors
    bind:viewBy
    bind:timeUnit
    bind:pieOptions
    {logs}
/>
