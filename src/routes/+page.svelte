<script lang="ts">
    import { writable } from "svelte/store";
    import Modal from "$lib/Modal.svelte";

    import { handleStart, handlePause, handleResume, handleStop } from "./page";

    const buttonState = writable("start");

    // TODO: Pull these options from a database.
    let options = ["One", "Two", "Three"];
    let filteredOptions: string[] = [];

    // An instance to Modal
    let modal: Modal | null = null;
    // Holds the current input value inside the modal
    let modalInput = "";

    // Stores the currently selected option for the button label
    let selectedOption: string = "Activity";

    /**
     * Filters the options array based on user input in the modal.
     * Updates the filteredOptions and modalInput state.
     */
    function handleFilter(input: string) {
        filteredOptions = options.filter((option) =>
            option.toLowerCase().includes(input.toLowerCase()),
        );

        modalInput = input;
    }

    /**
     * Called when a user selects an option from the modal.
     * Updates the button label and closes the modal.
     */
    function selectOption(option: string) {
        selectedOption = option;
        filteredOptions = [];
        modal?.closeModal();
    }
</script>

<div class="container-md py-4">
    <div style="position: fixed; top: 0; right: 0; margin: 10px;">
        <button>
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
                {#if filteredOptions.length == 0}
                    <ul style="list-style:none; padding:0;">
                        {#each filteredOptions as option (option)}
                            <li style="margin-bottom: 0.5rem;">
                                <button
                                    type="button"
                                    class="btn btn-outline-primary w-100"
                                    onclick={() => selectOption(option)}
                                    >{option}</button
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
                            >Create "{modalInput}"</button
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

            {#if $buttonState === "start"}
                <button
                    type="button"
                    class="btn btn-outline-success w-100 h-100 d-flex justify-content-center align-items-center"
                    onclick={() => handleStart(buttonState)}>Start</button
                >
            {/if}
            {#if $buttonState === "pause-stop"}
                <div
                    style="display: flex; justify-content: space-between; margin-top: 10px;"
                >
                    <button
                        type="button"
                        class="btn btn-outline-warning flex-grow-1"
                        style="margin-right: 10px;"
                        onclick={() => handlePause(buttonState)}>Pause</button
                    >
                    <button
                        type="button"
                        class="btn btn-outline-danger flex-grow-1"
                        onclick={() => handleStop(buttonState)}>Stop</button
                    >
                </div>
            {/if}
            {#if $buttonState === "resume-stop"}
                <div
                    style="display: flex; justify-content: space-between; margin-top: 10px;"
                >
                    <button
                        type="button"
                        class="btn btn-outline-primary flex-grow-1"
                        style="margin-right: 10px;"
                        onclick={() => handleResume(buttonState)}>Resume</button
                    >
                    <button
                        type="button"
                        class="btn btn-outline-danger flex-grow-1"
                        onclick={() => handleStop(buttonState)}>Stop</button
                    >
                </div>
            {/if}
        </div>
    </form>
    <div
        style="display: flex; justify-content: center; align-items: center; margin-top: 20px;"
    >
        <div
            style="width: 300px; height: 100px; border-radius: 15px; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center;"
        >
            1 hour 50 minutes
        </div>
    </div>
</div>
