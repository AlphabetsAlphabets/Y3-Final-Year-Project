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

    let options = ["One", "Two", "Three"];
    let filteredOptions: string[] = [];

    function handleAutocomplete(input: string) {
        filteredOptions = options.filter((option) =>
            option.toLowerCase().includes(input.toLowerCase()),
        );
        if (filteredOptions.length === 0) {
            console.log(`Option '${input}' doesn't exist.`);
        }
    }

    function selectOption(option: string) {
        console.log(`Selected option: ${option}`);
        const inputElement = document.querySelector(
            "#autocomplete-input",
        ) as HTMLInputElement | null;
        if (inputElement) {
            inputElement.value = option;
        }
        filteredOptions = [];
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
            <input
                type="text"
                class="form-control"
                placeholder="Type to search..."
                on:input={(e) =>
                    handleAutocomplete(
                        (e.target as HTMLInputElement)?.value || "",
                    )}
                id="autocomplete-input"
            />
            <ul class="list-group mt-2">
                {#each filteredOptions as option (option)}
                    <button
                        type="button"
                        class="list-group-item list-group-item-action"
                        on:click={() => selectOption(option)}
                    >
                        {option}
                    </button>
                {/each}
            </ul>
        </div>

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
