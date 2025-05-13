<script lang="ts">
    let { children } = $props();
</script>

{@render children()}

<div
    class="dropdown"
    style="width: calc(100% - 40px); text-align: center; margin: 20px auto;"
>
    <button
        class="btn btn-secondary dropdown-toggle w-100"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style="display: flex; justify-content: center; align-items: center; height: 50px;"
    >
        Dropdown
    </button>
    <ul class="dropdown-menu w-100">
        <li>
            <a class="dropdown-item" href="/summary">Summary</a>
        </li>
        <li>
            <a class="dropdown-item" href="/">Home</a>
        </li>
    </ul>
</div>
