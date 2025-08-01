<script lang="ts">
    import { page } from "$app/stores";

    let { children } = $props();
    let pages = [
        {
            name: "Home",
            href: "/",
        },
        {
            name: "Summary",
            href: "/summary",
        },
        {
            name: "Calendar",
            href: "/calendar",
        },
    ];

    /**
     * Determines if a navigation link should be considered active.
     * The "Home" link ("/") requires an exact match, while other links
     * match if the current path starts with their href.
     * @param href The link's destination
     */
    function isActive(href: string): boolean {
        if (href === "/") {
            return $page.url.pathname === "/";
        }
        return $page.url.pathname.startsWith(href);
    }
</script>

{@render children()}

<div class="container mt-4 fixed-bottom mb-3">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <ul class="nav nav-pills nav-fill justify-content-center">
                {#each pages as p (p.href)}
                    <li class="nav-item">
                        <a
                            class="nav-link {isActive(p.href) ? 'active' : ''}"
                            aria-current={isActive(p.href) ? "page" : undefined}
                            href={p.href}
                        >
                            {p.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>
