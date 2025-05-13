<script lang="ts">
  let { data } = $props();
</script>

<h1>{data.activity.name}</h1>
<p>You spent {data.activity.stats} seconds on it!</p>
