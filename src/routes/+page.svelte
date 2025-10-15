<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import PromptCard from '$lib/components/PromptCard.svelte';
	import type { Prompt } from '$lib/types';
	import { listPrompts, createPrompt, updatePrompt, deletePrompt } from '$lib/api/prompts';
	import Toast from '$lib/components/Toast.svelte';
	import { addToast } from '$lib/stores/toast';

	let prompts: Prompt[] = [];
	let editingPrompt: Prompt | null = null;
	let loading = false;

	// Track latest fetch to avoid race conditions
	let latestFetchKey = 0;

	let showModal = false;

	function updateFromURL() {
		if (typeof window === 'undefined') return;

		const params = new URLSearchParams(window.location.search);
		const promptId = params.get('prompt');

		if (promptId === 'new') {
			editingPrompt = null;
			showModal = true;
		} else if (promptId) {
			const promptToEdit = prompts.find(p => p.id === promptId);
			if (promptToEdit) {
				editingPrompt = promptToEdit;
				showModal = true;
			}
		} else {
			editingPrompt = null;
			showModal = false;
		}
	}

	function openEditPromptModal(prompt: Prompt) {
		if (typeof window === 'undefined') return;

		const url = new URL(window.location.href);
		url.searchParams.set('prompt', prompt.id);
		history.pushState({}, '', url);
		updateFromURL();
	}

	function openNewPromptModal() {
		if (typeof window === 'undefined') return;

		const url = new URL(window.location.href);
		url.searchParams.set('prompt', 'new');
		history.pushState({}, '', url);
		updateFromURL();
	}

	function handleClose() {
		if (typeof window === 'undefined') return;

		const url = new URL(window.location.href);
		url.searchParams.delete('prompt');
		history.pushState({}, '', url);
		updateFromURL();
	}

	async function fetchPrompts() {
		const fetchKey = ++latestFetchKey;
		loading = true;
		try {
			const data = await listPrompts();
			if (fetchKey === latestFetchKey) {
				prompts = data;
				updateFromURL();
			}
		} catch (err: any) {
			addToast(err.message || 'Failed to load prompts', 'error');
		} finally {
			if (fetchKey === latestFetchKey) loading = false;
		}
	}

	async function handleSave(event: CustomEvent<Prompt>) {
		const updated = event.detail;
		const index = prompts.findIndex(p => p.id === updated.id);

		try {
			if (index >= 0) {
				const old = prompts[index];
				prompts[index] = updated;
				await updatePrompt(updated.id, { name: updated.name, text: updated.text });
			} else {
				prompts = [updated, ...prompts];
				const created = await createPrompt(updated.name, updated.text);
				const tempIndex = prompts.findIndex(p => p.id === updated.id);
				prompts[tempIndex] = created;

				if (typeof window !== 'undefined') {
					const url = new URL(window.location.href);
					url.searchParams.set('prompt', created.id);
					history.replaceState({}, '', url);
				}
			}
		} catch (err: any) {
			addToast(err.message || 'Failed to save prompt', 'error');
			if (index >= 0) {
				await fetchPrompts();
			} else {
				prompts = prompts.filter(p => p.id !== updated.id);
			}
		}
	}

	async function handleDelete(id: string) {
		const old = [...prompts];
		prompts = prompts.filter(p => p.id !== id);

		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			if (url.searchParams.get('prompt') === id) {
				url.searchParams.delete('prompt');
				history.replaceState({}, '', url);
			}
		}

		try {
			await deletePrompt(id);
		} catch (err: any) {
			addToast(err.message || 'Failed to delete prompt', 'error');
			prompts = old;
		}
	}

	function handleEdit(id: string) {
		const promptToEdit = prompts.find(p => p.id === id);
		if (promptToEdit) openEditPromptModal(promptToEdit);
	}

	/** Update modal state on browser back/forward */
	function handlePopState() {
		updateFromURL();
	}

	onMount(async () => {
		await fetchPrompts();
		if (typeof window !== 'undefined') {
			window.addEventListener('popstate', handlePopState);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('popstate', handlePopState);
		}
	});
</script>

<div class="container">
	<Toast />

	{#if showModal}
		<Modal
				prompt={editingPrompt}
				on:save={handleSave}
				on:close={handleClose}
		/>
	{/if}

	<h1 id="page-title">Generation Page</h1>

	<section class="prompts-section" aria-label="Saved Prompts">
		<div class="prompts-section-header">
			<h2>Saved Prompts</h2>
			<button on:click={openNewPromptModal} aria-label="Add new prompt">Add prompt</button>
		</div>

		{#if loading}
			<div class="loader" role="status" aria-label="Loading prompts">
				<div class="spinner"></div>
				<span>Loading prompts...</span>
			</div>
		{/if}

		<div class="starter-list">
			<ul>
				{#each prompts as prompt}
					<PromptCard
							{prompt}
							onEdit={handleEdit}
							onDelete={handleDelete}
					/>
				{/each}
			</ul>
		</div>
	</section>
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 24px;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1, h2, h3 {
		color: #333;
		margin: 8px 0;
	}

	button {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
	}

	button:hover {
		background: #2563eb;
	}

	.prompts-section {
		margin-top: 32px;
		padding: 24px;
		border-radius: 8px;
		background: #fafafa;
	}

	.prompts-section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.starter-list {
		background: white;
		padding: 16px;
		border-radius: 6px;
		margin: 16px 0;
		border: 1px solid #e5e7eb;
	}

	.starter-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.loader {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 3px solid #ccc;
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
