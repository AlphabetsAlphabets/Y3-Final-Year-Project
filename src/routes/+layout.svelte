<script lang="ts">
    import { goto } from "$app/navigation";
    import { page as pageStore } from "$app/stores";
    let { children } = $props();

    const pages = [
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

    let currentPageName = $derived(
        pages.find((p) => p.href === $pageStore.url.pathname)?.name ?? "Home",
    );
    let currentPageIndex = $derived(
        pages.findIndex((p) => p.href === $pageStore.url.pathname),
    );

    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event: TouchEvent) {
        touchStartX = event.touches[0].clientX;
        touchEndX = 0;
    }

    function handleTouchMove(event: TouchEvent) {
        touchEndX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
        if (
            touchStartX === 0 ||
            touchEndX === 0 ||
            Math.abs(touchStartX - touchEndX) < 50
        ) {
            touchStartX = 0;
            touchEndX = 0;
            return;
        }

        if (touchStartX - touchEndX > 50) {
            const nextIndex = (currentPageIndex + 1) % pages.length;
            goto(pages[nextIndex].href);
        }

        if (touchStartX - touchEndX < -50) {
            const prevIndex =
                (currentPageIndex - 1 + pages.length) % pages.length;
            goto(pages[prevIndex].href);
        }

        touchStartX = 0;
        touchEndX = 0;
    }
</script>

<div
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
>
    {@render children()}
</div>

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
        {currentPageName}
    </button>
    <ul class="dropdown-menu w-100">
        {#each pages as page (page.href)}
            {#if page.name !== currentPageName}
                <li>
                    <a class="dropdown-item" href={page.href}>{page.name}</a>
                </li>
            {/if}
        {/each}
    </ul>
</div>
