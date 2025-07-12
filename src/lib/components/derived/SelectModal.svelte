<script lang="ts">
    let { options } = $props();
</script>

{#each options as option (option.id)}
    <p>{option.name}</p>
{/each}
