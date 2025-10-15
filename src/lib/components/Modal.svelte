<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { Prompt } from '$lib/types.js';

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
		console.log("close");
		dispatch('close');
	}

	function save() {
		const data: Prompt = {
			id: prompt?.id ?? crypto.randomUUID(), // новий id для нового промпта
			name,
			text,
			updatedAt: Date.now()
		};
		dispatch('save', data);
		close();
	}

	function trapFocus(e: KeyboardEvent) {
		const container = modalEl;
		if (!container) return;

		const tabbables = container.querySelectorAll<HTMLElement>(
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

		if (e.key === 'Escape' && closeOnEsc) {
			close();
		}
	}

	onMount(() => {
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', trapFocus, true);
	});

	onDestroy(() => {
		document.body.style.overflow = '';
		window.removeEventListener('keydown', trapFocus, true);
	});
</script>

<div
	class="backdrop"
	role="button"
	tabindex="0"
	aria-label="Close modal"
	on:click|self={close}
	on:keydown={(e) => {
    if (e.target === e.currentTarget && e.key === 'Enter') {
      e.preventDefault();
      close();
    }
  }}>
	<div class="modal" tabindex="-1" bind:this={modalEl}>
		<header>
			<h2>{prompt ? 'Edit Prompt' : 'New Prompt'}</h2>
			<button aria-label="Close" on:click={close}>×</button>
		</header>

		<main>
			<label>
				Name:
				<input type="text" bind:value={name} />
			</label>

			<label>
				Text:
				<textarea rows="4" bind:value={text}></textarea>
			</label>
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
