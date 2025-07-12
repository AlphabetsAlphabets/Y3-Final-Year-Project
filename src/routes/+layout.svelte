<script lang="ts">
    let { children } = $props();
    let currentPage = $state("Home");
    let pages = [
        {
            name: "Summary",
            href: "/summary",
        },
        {
            name: "Calendar",
            href: "/calendar",
        },
        {
            name: "Home",
            href: "/",
        },
    ];

    let setDropdownTitle = (name: string) => (currentPage = name);
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
        {currentPage}
    </button>
    <ul class="dropdown-menu w-100">
        {#each pages as page (page.href)}
            {#if page.name !== currentPage}
                <li>
                    <a
                        class="dropdown-item"
                        href={page.href}
                        onclick={() => setDropdownTitle(page.name)}
                        >{page.name}</a
                    >
                </li>
            {/if}
        {/each}
    </ul>
</div>
