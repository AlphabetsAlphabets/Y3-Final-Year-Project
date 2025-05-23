<script lang="ts">
    import { writable } from "svelte/store";

    const buttonState = writable("start");

    function handleStart() {
        console.log("start to pause-stop");
        console.log("resume-stop to pause-stop");
        buttonState.set("pause-stop");
    }

    function handlePause() {
        console.log("pause-stop to resume-stop");
        buttonState.set("resume-stop");
    }

    function handleResume() {
        buttonState.set("pause-stop");
    }

    function handleStop() {
        console.log("pause-stop or resume-stop to start");
        buttonState.set("start");
    }

    // TODO: Pull these options from a database.
    let options = ["One", "Two", "Three"];
    let filteredOptions: string[] = [];
    // Controls whether the modal is visible
    let showModal = false;
    // Holds the current input value inside the modal
    let modalInput = "";
    // Stores the currently selected option for the button label
    let selectedOption: string = "Select Option";

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
     * Opens the modal and initializes the filter state.
     */
    function openModal() {
        modalInput = "";
        filteredOptions = options;
        showModal = true;
    }

    /**
     * Called when a user selects an option from the modal.
     * Updates the button label and closes the modal.
     */
    function selectOption(option: string) {
        selectedOption = option;
        filteredOptions = [];
        showModal = false;
    }

    /**
     * Closes the modal without making a selection.
     */
    function closeModal() {
        showModal = false;
    }

    /**
     * Adds a new option (from modal input) and selects it.
     */
    function createNewOption() {
        options = [...options, modalInput];
        selectOption(modalInput);
    }
</script>

<div class="container-md py-4">
    <div style="position: fixed; top: 0; right: 0; margin: 10px;">
        <button>
            <img src="/gear.svg" alt="gear" />
        </button>
    </div>
    <form class="pt-4">
        <div class="mb-3">
            <!--
                Button that opens the modal popup for selecting an option.
                The button label updates to reflect the user's selection.
            -->
            <button
                type="button"
                class="btn btn-outline-primary w-100"
                on:click={openModal}
            >
                {selectedOption}
            </button>
            {#if showModal}
                <!--
                    Modal popup for option selection and filtering.
                    Contains:
                    - An input for filtering options.
                    - A list of filtered options as buttons.
                    - A button to create a new option if none match.
                    - A cancel button to close the modal.
                -->
                <div class="modal-backdrop" style="position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:1000;">
                    <div class="modal-content" style="background:white; padding:2rem; border-radius:10px; min-width:300px;">
                        <h5>Select an option</h5>
                        <!-- Input for filtering options inside the modal -->
                        <input
                            type="text"
                            class="form-control mb-3"
                            placeholder="Type to search..."
                            bind:value={modalInput}
                            on:input={(e) => handleFilter((e.target as HTMLInputElement)?.value || "")}
                            autofocus
                        />
                        {#if filteredOptions.length > 0}
                            <!-- List of filtered options as selectable buttons -->
                            <ul style="list-style:none; padding:0;">
                                {#each filteredOptions as option (option)}
                                    <li style="margin-bottom: 0.5rem;">
                                        <button type="button" class="btn btn-outline-primary w-100" on:click={() => selectOption(option)}>{option}</button>
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <!-- Option to create a new entry if no matches are found -->
                            <div>
                                <p>No options found for "{modalInput}"</p>
                                <button type="button" class="btn btn-outline-success w-100" on:click={createNewOption}>Create "{modalInput}"</button>
                            </div>
                        {/if}
                        <!-- Cancel button to close the modal without selection -->
                        <button type="button" class="btn btn-secondary w-100 mt-3" on:click={closeModal}>Cancel</button>
                    </div>
                </div>
            {/if}

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
            />
            <label
                class="btn btn-outline-success w-100 h-100 d-flex justify-content-center align-items-center"
                for="btn-check-outlined">Pomodoro</label
            >
        </div>

        {#if $buttonState === "start"}
            <button
                type="button"
                class="btn btn-outline-success w-100 h-100 d-flex justify-content-center align-items-center"
                on:click={handleStart}>Start</button
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
                    on:click={handlePause}>Pause</button
                >
                <button
                    type="button"
                    class="btn btn-outline-danger flex-grow-1"
                    on:click={handleStop}>Stop</button
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
                    on:click={handleResume}>Resume</button
                >
                <button
                    type="button"
                    class="btn btn-outline-danger flex-grow-1"
                    on:click={handleStop}>Stop</button
                >
            </div>
        {/if}
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
