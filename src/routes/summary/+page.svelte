<script lang="ts">
  let { data } = $props();
</script>

<h1>Summary</h1>

<ul>
  {#each data.summaries as { name, stats }}
    <li><a href="/summary/{name}">{name}</a></li>
  {/each}
</ul>
