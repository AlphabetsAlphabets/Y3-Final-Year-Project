<script lang="ts">
    import Timer from "$lib/components/Timer.svelte";
    import ActivityModal from "$lib/components/derived/ActivityModal.svelte";
    import ProjectModal from "$lib/components/derived/ProjectModal.svelte";

    import { clearItems, listAllItems } from "$lib/database/dev";
    import { db } from "$lib/database/db";
    import { seconds } from "$lib/timer";
</script>

<button onclick={async () => await listAllItems(db.activities)}
    >List all items</button
>
<button
    onclick={async () => {
        await clearItems();
    }}>Clear db</button
>

<div class="container-md py-4">
    <div class="settings-container">
        <button id="settings">
            <img src="/gear.svg" alt="gear" />
        </button>
    </div>

    <form class="pt-4">
        <div class="mb-3">
            <ActivityModal></ActivityModal>
            <ProjectModal></ProjectModal>

            <div class="goal-container">
                <span class="goal-label">Goal</span>
                <input type="text" class="goal-input" />
            </div>
            <div class="mb-3">
                <input
                    type="checkbox"
                    class="btn-check"
                    id="btn-check-outlined"
                    autocomplete="off"
                /><label
                    class="btn w-100 h-100 d-flex justify-content-center align-items-center"
                    for="btn-check-outlined">Pomodoro</label
                >
            </div>
            <Timer />
        </div>
    </form>
    <div class="timer-display-container">
        <div class="timer-display">
            <p>{$seconds}s</p>
        </div>
    </div>
</div>

<style>
    .settings-container {
        position: fixed;
        top: 0;
        right: 0;
        margin: 10px;
    }

    /* Make the Pomodoro button black by default */
    label[for="btn-check-outlined"] {
        background-color: black !important;
        color: white !important;
        border-color: black !important;
    }

    /* When checked, turn it green */
    #btn-check-outlined:checked + label[for="btn-check-outlined"] {
        background-color: green !important;
        color: white !important;
        border-color: green !important;
    }

    .goal-container {
        display: flex;
        align-items: center;
        margin: 10px 0;
    }

    .goal-label {
        margin-right: 10px;
    }

    .goal-input {
        flex-grow: 1;
        border-radius: 15px;
        background-color: white;
        border: 2px solid lightblue;
        padding: 5px;
    }

    .timer-display-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }

    .timer-display {
        width: 300px;
        height: 100px;
        border-radius: 15px;
        background-color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
