<script lang="ts">
    import { db } from "$lib/db";
    import { liveQuery } from "dexie";

    import Modal from "$lib/Modal.svelte";

    import {
        start,
        pause,
        resume,
        stop,
        seconds,
        timer_state,
        TimerState,
    } from "./page";

    let new_state = TimerState.Stopped;

    timer_state.subscribe((state) => {
        new_state = state;
    });

    let acts = liveQuery(() => db.activities.toArray());
    let options: string[] = [];
    acts.subscribe(async (activities) => {
        if (activities) {
            activities.forEach((activity) => options.push(activity.name));
        }
    });

    let filteredOptions: string[] = options;

    let modal: Modal | null = null;
    let modalInput = "";

    let selectedOption: string = "Activity";

    function handleFilter(input: string) {
        filteredOptions = options.filter((option) =>
            option.toLowerCase().includes(input.toLowerCase()),
        );

        modalInput = input;
    }

    function selectOption(option: string) {
        selectedOption = option;
        filteredOptions = options;
    }

    async function addActivity(name: string) {
        let status = "";
        try {
            let count = await db.activities.where("name").equals(name).count();
            if (count !== 0) {
                console.error("Already exists.");
                return;
            }

            db.activities.add({
                name: name,
                project: "studying",
            });

            status = `Activity ${name} has been added`;
        } catch (error) {
            status = `Failed due to ${error}`;
        }

        console.log(status);
    }

    async function clearItems() {
        await db.activities.clear();
        console.log("Cleared");
    }
</script>

<button
    onclick={async () => {
        let acts = liveQuery(() => db.activities.toArray());
        acts.getValue();
        console.log(acts);
    }}>options</button
>

<div class="container-md py-4">
    <div style="position: fixed; top: 0; right: 0; margin: 10px;">
        <button id="settings">
            <img src="/gear.svg" alt="gear" />
        </button>
    </div>

    <style>
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
    </style>
    <form class="pt-4">
        <div class="mb-3">
            <!--
                Button that opens the modal popup for selecting an option.
                The button label updates to reflect the user's selection.
            -->
            <button
                id="activity select"
                type="button"
                class="btn btn-outline-primary w-100"
                onclick={modal?.showModal}
            >
                {selectedOption}
            </button>
            <Modal bind:this={modal} title="Select an option">
                <input
                    type="text"
                    class="form-control mb-3"
                    placeholder="Type to search..."
                    bind:value={modalInput}
                    oninput={(e) =>
                        handleFilter(
                            (e.target as HTMLInputElement)?.value || "",
                        )}
                />
                {#if filteredOptions.length > 0}
                    <ul style="list-style:none; padding:0;">
                        {#each filteredOptions as option, index (index)}
                            <li style="margin-bottom: 0.5rem;">
                                <button
                                    type="button"
                                    class="btn btn-outline-primary w-100"
                                    onclick={() => {
                                        selectOption(option);
                                        modal?.closeModal();
                                    }}>{option}</button
                                >
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <div>
                        <p>No options found for "{modalInput}"</p>
                        <button
                            type="button"
                            class="btn btn-outline-success w-100"
                            onclick={async () => {
                                await addActivity(modalInput);
                                selectOption(modalInput);
                                modalInput = "";
                            }}>Create "{modalInput}"</button
                        >
                    </div>
                {/if}
                <button
                    type="button"
                    class="btn btn-secondary w-100 mt-3"
                    onclick={modal?.closeModal}>Cancel</button
                >
            </Modal>

            <div style="display: flex; align-items: center; margin: 10px 0;">
                <span style="margin-right: 10px;">Goal</span>
                <input
                    type="text"
                    style="flex-grow: 1; border-radius: 15px; background-color: white; border: 2px solid lightblue; padding: 5px;"
                />
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

            {#if new_state === TimerState.Stopped}
                <button
                    type="button"
                    class="btn btn-outline-success w-100 h-100 d-flex justify-content-center align-items-center"
                    onclick={start}>Start</button
                >
            {/if}
            {#if new_state === TimerState.Running}
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
            {#if new_state === TimerState.Paused}
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
            <button onclick={clearItems}>Clear db</button>
        </div>
    </form>
    <div
        style="display: flex; justify-content: center; align-items: center; margin-top: 20px;"
    >
        <div
            style="width: 300px; height: 100px; border-radius: 15px; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center;"
        >
            {$seconds}s
        </div>
    </div>
</div>
