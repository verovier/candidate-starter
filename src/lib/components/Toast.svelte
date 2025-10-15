<script lang="ts">
  import { toasts, removeToast } from '$lib/stores/toast';
  import { fly, fade } from 'svelte/transition';
</script>

<div class="toast-container">
    {#each $toasts as toast (toast.id)}
        <div
                class="toast {toast.type}"
                in:fly="{{ x: 200, duration: 300 }}"
                out:fade="{{ duration: 200 }}"
        >
            <span>{toast.text}</span>
            <button aria-label="Close" on:click={() => removeToast(toast.id)}>×</button>
        </div>
    {/each}
</div>


<style>
    .toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column-reverse;
        gap: 8px;
        z-index: 9999;
    }

    .toast {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 250px;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .toast.error { background-color: #ef4444; }    /* червоний */
    .toast.info { background-color: #3b82f6; }     /* синій */
    .toast.success { background-color: #16a34a; }  /* зелений */

    .toast button {
        background: transparent;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        margin-left: 8px;
    }
</style>
