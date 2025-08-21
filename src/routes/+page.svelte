<script lang="ts">
    import { onMount } from "svelte";
    import * as Comlink from "comlink";

    import Timer from "$lib/components/Timer.svelte";
    import SelectModal from "$lib/components/derived/SelectModal.svelte";

    import { seconds } from "$lib/timer";

    // If there is an ep.EventListener error then the cause is this import statement.
    // comlink requires the worker be exposed via Comlink.expose but importing this file
    // runs that code and it may be ran BEFORE the worker is ready. Which causes
    // the EventListener error.
    import type { DbWorker } from "$lib/workers/database.worker";
    import ProjectModal from "$lib/components/derived/ProjectModal.svelte";

    let activityName: string = $state("Activity");
    let projectName: string = $state("Project");
    let projectColor: string = $state("");
    let dbWorker: Comlink.Remote<DbWorker> | null = $state(null);

    const loadWorker = async () => {
        const Worker = await import("$lib/workers/database.worker?worker");
        dbWorker = Comlink.wrap<DbWorker>(new Worker.default());
        await dbWorker.initWorker();
    };

    onMount(loadWorker);
</script>

<div class="settings-container">
    <button id="settings" class="btn btn-light rounded-circle p-2 lh-1">
        <img src="/gear.svg" alt="gear" />
    </button>
</div>

<main class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 text-center">
            {#if dbWorker}
                <form onsubmit={(e) => e.preventDefault()}>
                    <div class="d-flex gap-2 mb-3">
                        <div class="flex-grow-1">
                            <SelectModal bind:selected={activityName} />
                        </div>
                        <div class="flex-grow-1">
                            <ProjectModal
                                bind:selected={projectName}
                                bind:color={projectColor}
                            />
                        </div>
                    </div>

                    <div class="display-1 fw-bold my-3">
                        {$seconds}<span class="fs-4 align-text-top">s</span>
                    </div>

                    {#if activityName === "Activity"}
                        <p>Please select or create an activity to track.</p>
                    {:else}
                        <Timer {activityName} {projectName} {projectColor} />
                    {/if}
                </form>
            {:else}
                <div class="d-flex flex-column align-items-center p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 mb-0">Please wait while the app loads</p>
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    .settings-container {
        position: fixed;
        top: 0;
        right: 0;
        margin: 1rem;
        z-index: 1050; /* Ensure it's above other content */
    }

    /* Make the settings button icon a bit cleaner */
    #settings img {
        width: 1.5rem;
        height: 1.5rem;
    }
</style>
