<script lang="ts">
    import { page } from "$app/stores";

    let { children } = $props();
    let pages = [
        {
            name: "Summary",
            href: "/summary",
            icon: "bi bi-bar-chart",
        },
        {
            name: "Home",
            href: "/home",
            icon: "bi-house",
        },
        {
            name: "Calendar",
            href: "/calendar",
            icon: "bi-calendar",
        },
        {
            name: "Task",
            href: "/tasks",
            icon: "bi bi-list-check",
        },
    ];

    /**
     * Determines if a navigation link should be considered active.
     * The "Home" link ("/") requires an exact match, while other links
     * match if the current path starts with their href.
     * @param href The link's destination
     */
    function isActive(href: string): boolean {
        if (href === "/home") {
            return $page.url.pathname === "/home";
        }
        return $page.url.pathname.startsWith(href);
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    />
</svelte:head>

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
                            title={p.name}
                        >
                            <i
                                class="bi {p.icon}"
                                style="font-size: 1.5rem;"
                                aria-hidden="true"
                            ></i>
                            <span class="visually-hidden">{p.name}</span>
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>
