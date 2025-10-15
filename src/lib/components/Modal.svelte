<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { Prompt, SavePromptData } from "$lib/types.js";

	export let prompt: Prompt | null = null;
	export let closeOnEsc: boolean = true;

	const dispatch = createEventDispatcher<{
		save: Prompt;
		close: void;
	}>();

	let name: string = prompt?.name ?? '';
	let text: string = prompt?.text ?? '';
	let modalEl: HTMLDivElement;

	function close() {
		dispatch('close');
	}

	function save() {
		const data: SavePromptData = {
			id: prompt?.id,
			name,
			text,
		};
		dispatch('save', data);
		close();
	}

	function handleBackdropKeyDown(e: KeyboardEvent) {
		if (e.target === e.currentTarget && e.key === 'Enter') {
			e.preventDefault();
			close();
		}
	}

	function trapFocus(e: KeyboardEvent) {
		if (!modalEl) return;

		const tabbables = modalEl.querySelectorAll<HTMLElement>(
				'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
		);
		const first = tabbables[0];
		const last = tabbables[tabbables.length - 1];

		if (e.key === 'Tab') {
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last?.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first?.focus();
			}
		}

		if (e.key === 'Escape' && closeOnEsc) close();
	}

	onMount(() => {
		document.body.style.overflow = 'hidden'; // Prevent body scroll
		window.addEventListener('keydown', trapFocus, true);
	});

	onDestroy(() => {
		document.body.style.overflow = ''; // Restore body scroll
		window.removeEventListener('keydown', trapFocus, true);
	});
</script>

<div
		class="backdrop"
		role="button"
		tabindex="0"
		aria-label="Close modal"
		on:click|self={close}
		on:keydown={handleBackdropKeyDown}
>
	<div
			class="modal"
			bind:this={modalEl}
			tabindex="-1"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
	>
		<header>
			<h2 id="modal-title">{prompt ? 'Edit Prompt' : 'New Prompt'}</h2>
			<button aria-label="Close modal" on:click={close}>×</button>
		</header>

		<main>
			<label for="prompt-name">Name:</label>
			<input id="prompt-name" type="text" bind:value={name} />

			<label for="prompt-text">Text:</label>
			<textarea id="prompt-text" rows="4" bind:value={text}></textarea>
		</main>

		<footer>
			<button on:click={close}>Cancel</button>
			<button class="save" on:click={save}>{prompt ? 'Save' : 'Create'}</button>
		</footer>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: grid;
		place-items: center;
		z-index: 1000;
	}

	.modal {
		background: white;
		padding: 1rem 1.5rem;
		width: min(500px, 90vw);
		max-height: 90vh;
		overflow: auto;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	main label {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	input, textarea {
		margin-top: 0.25rem;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.save {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.save:hover {
		background: #2563eb;
	}

	button {
		cursor: pointer;
	}
</style>
