<script lang="ts">
    import { getLogs } from "$lib/database/schemas/log";

    let logs = getLogs();
</script>

<p>Calendar</p>

{#if $logs}
    {#each $logs as log (log.activity)}
        <li>{log.activity} you did it for {log.elasped} amount of time</li>
    {/each}
{/if}
