<script>
  let { data, children } = $props();
</script>

<div class="layout">
  <main>
    {@render children()}
  </main>
</div>

<h2>Other activities</h2>
<ul>
  {#each data.summaries as { name, stats }}
    <li><a href="/summary/{name}">{name}</a></li>
  {/each}
</ul>

<style>
  @media (min-width: 640px) {
    .layout {
      display: grid;
      gap: 2em;
      grid-template-columns: 1fr 16em;
    }
  }
</style>
