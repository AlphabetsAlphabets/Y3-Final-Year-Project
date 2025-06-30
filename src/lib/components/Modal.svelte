<script lang="ts">
    let { children, title } = $props();
    let visible = $state(false);

    export function showModal() {
        visible = true;
    }
    export function closeModal() {
        visible = false;
    }
</script>

{#if visible}
    <div
        class="modal-backdrop"
        onclick={() => closeModal()}
        onkeydown={() => closeModal()}
        role="button"
        aria-pressed="false"
        tabindex="0"
    >
        <div
            id="modal-content"
            class="modal-content"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="button"
            aria-pressed="false"
            tabindex="0"
        >
            <button aria-label="Close" class="modal-close" onclick={closeModal}
                >&times;</button
            >
            {#if title}
                <h5 class="modal-title">{title}</h5>
            {/if}
            {@render children()}
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        min-width: 300px;
        position: relative;
    }
    .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
    .modal-title {
        margin-top: 0;
    }
</style>
