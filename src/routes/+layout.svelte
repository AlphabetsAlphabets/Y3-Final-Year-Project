<script lang="ts">
  let { children } = $props();
</script>

{@render children()}

<div class="dropdown-center">
  <button
    class="btn btn-secondary dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Centered dropdown
  </button>
  <ul class="dropdown-menu">
    <li>
      <a class="dropdown-item" href="/summary">Summary</a>
    </li>
    <li>
      <a class="dropdown-item" href="/">Home</a>
    </li>
  </ul>
</div>
