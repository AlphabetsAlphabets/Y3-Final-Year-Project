<script lang="ts">
    import { getLogs } from "$lib/database/schemas/log";

    let logs = getLogs();
</script>

<p>Calendar</p>

{#if $logs}
    <ul>
        {#each $logs as log (log.activity)}
            <li>
                ({log.project.name}) {log.activity} for {log.elasped}s
            </li>
        {/each}
    </ul>
{/if}
