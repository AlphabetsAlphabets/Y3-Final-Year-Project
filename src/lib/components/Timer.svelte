<script lang="ts">
    import { writable } from "svelte/store";
    let seconds: number = $props();

    let id: number | null = 0;
    let paused = 0;
    let is_paused = false;

    const TimerState = {
        Running: "Running",
        Resumed: "Resumed",
        Paused: "Paused",
        Stopped: "Stopped",
    };

    const timer_state = writable(TimerState.Stopped);

    function start() {
        timer_state.set(TimerState.Running);
        id = setInterval(() => {
            if (!is_paused) {
                seconds++;
                console.log(seconds);
            } else {
                paused++;
            }
        }, 1000);
    }

    function stop() {
        if (id !== null) {
            seconds = 0;
            timer_state.set(TimerState.Stopped);
            clearInterval(id);
            id = null;
        }
    }

    function pause() {
        is_paused = true;
        timer_state.set(TimerState.Paused);
    }

    function resume() {
        seconds += paused;
        paused = 0;
        is_paused = false;
        timer_state.set(TimerState.Running);
    }

    let newState = $state(TimerState.Stopped);

    timer_state.subscribe((state) => {
        newState = state;
    });
</script>

{#if newState === TimerState.Stopped}
    <button
        type="button"
        class="btn btn-outline-success w-100 h-100 d-flex justify-content-center align-items-center"
        onclick={start}>Start</button
    >
{/if}
{#if newState === TimerState.Running}
    <div
        style="display: flex; justify-content: space-between; margin-top: 10px;"
    >
        <button
            type="button"
            class="btn btn-outline-warning flex-grow-1"
            style="margin-right: 10px;"
            onclick={pause}>Pause</button
        >
        <button
            type="button"
            class="btn btn-outline-danger flex-grow-1"
            onclick={stop}>Stop</button
        >
    </div>
{/if}
{#if newState === TimerState.Paused}
    <div
        style="display: flex; justify-content: space-between; margin-top: 10px;"
    >
        <button
            type="button"
            class="btn btn-outline-primary flex-grow-1"
            style="margin-right: 10px;"
            onclick={resume}>Resume</button
        >
        <button
            type="button"
            class="btn btn-outline-danger flex-grow-1"
            onclick={stop}>Stop</button
        >
    </div>
{/if}
