<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import Timer from "$lib/components/Timer.svelte";

    import { addActivity, getActivities } from "$lib/activities";
    import { clearItems, listAllItems } from "$lib/database/dev";
    import { db } from "$lib/database/db";
    import { seconds } from "$lib/timer";

    let options: string[] = $state([]);
    let activities = getActivities();

    activities.subscribe({
        next(activities) {
            activities.map((activity) => {
                if (!options.includes(activity.name, 0)) {
                    options.push(activity.name);
                }
            });
        },
        error(error) {
            console.log(`Failed to get activities due to :\n${error}`);
        },
        complete() {
            console.log("Done");
        },
    });

    let modalInput: string = $state("");
    let modal: Modal | null = $state(null);
    let filteredOptions: string[] = $derived.by(() => {
        if (modalInput.length === 0) {
            return options;
        } else {
            return options.filter((option) =>
                option.toLowerCase().includes(modalInput.toLowerCase()),
            );
        }
    });

    let selectedOption: string = $state("Activity");

    function selectOption(option: string) {
        selectedOption = option;
        filteredOptions = options;
    }
</script>

<button onclick={async () => await listAllItems(db.activities)}
    >List all items</button
>
<button
    onclick={async () => {
        await clearItems();
        options = [];
    }}>Clear db</button
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
                />
                {#if filteredOptions.length > 0 || modalInput.length === 0}
                    <ul style="list-style:none; padding:0;">
                        {#each filteredOptions as option (option)}
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

            <Timer></Timer>
        </div>
    </form>
    <div
        style="display: flex; justify-content: center; align-items: center; margin-top: 20px;"
    >
        <div
            style="width: 300px; height: 100px; border-radius: 15px; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center;"
        >
            <p>{$seconds}s</p>
        </div>
    </div>
</div>
