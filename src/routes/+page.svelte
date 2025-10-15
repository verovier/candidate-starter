<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores/user';
	import Modal from '$lib/components/Modal.svelte';
	import { listPrompts } from '$lib/api/prompts';
	import type { Prompt } from '$lib/types';

	let prompts: Prompt[] = [];
	let showModal = false;

	onMount(async () => {
		prompts = await listPrompts();
	});
</script>

<div class="container">
	<h1>Generation Page</h1>
	<p class="instructions">
		<strong>Task:</strong> Implement a "Saved Prompts" panel below with CRUD operations,
		optimistic updates, URL state sync, and basic accessibility.
	</p>

	<div class="demo-section">
		<h2>Modal Demo</h2>
		<p>Use this modal component for add/edit prompt operations.</p>
		<button on:click={() => (showModal = true)}>Open Modal Demo</button>
	</div>

	{#if showModal}
		<Modal title="Example Modal" on:close={() => (showModal = false)}>
			<p>Use this modal for your add and edit operations.</p>
			<p>Make sure keyboard navigation works (Tab, Enter, Esc).</p>
		</Modal>
	{/if}

	<section class="prompts-section" aria-label="Saved Prompts">
		<h2>Saved Prompts</h2>
		<p class="hint">Candidates implement the full panel here ↓</p>
		
		<div class="starter-list">
			<h3>Current prompts from API:</h3>
			<ul>
				{#each prompts as p}
					<li>
						<strong>{p.name}</strong> - {p.text}
					</li>
				{/each}
			</ul>
		</div>

		<div class="requirements">
			<h3>Requirements to implement:</h3>
			<ul>
				<li>✓ Add, rename, delete prompts</li>
				<li>✓ Optimistic updates with rollback on failure</li>
				<li>✓ Selected prompt ID in URL (?prompt=...)</li>
				<li>✓ URL + store sync (back/forward works)</li>
				<li>✓ Handle out-of-order API responses</li>
				<li>✓ Basic keyboard navigation & ARIA labels</li>
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

	h1 {
		color: #333;
		margin-bottom: 8px;
	}

	h2 {
		color: #555;
		font-size: 1.25rem;
		margin-top: 32px;
		margin-bottom: 12px;
	}

	h3 {
		color: #666;
		font-size: 1rem;
		margin-top: 16px;
		margin-bottom: 8px;
	}

	.instructions {
		background: #f0f9ff;
		border-left: 4px solid #0ea5e9;
		padding: 12px 16px;
		margin: 16px 0;
		border-radius: 4px;
	}

	.demo-section {
		background: #fef3c7;
		border: 1px solid #fbbf24;
		padding: 16px;
		border-radius: 6px;
		margin: 24px 0;
	}

	.demo-section p {
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
		border: 2px dashed #d1d5db;
		border-radius: 8px;
		background: #fafafa;
	}

	.hint {
		color: #6b7280;
		font-style: italic;
		margin-bottom: 16px;
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
		margin: 8px 0 0 0;
	}

	.starter-list li {
		padding: 8px;
		border-bottom: 1px solid #f3f4f6;
	}

	.starter-list li:last-child {
		border-bottom: none;
	}

	.requirements {
		background: #f0fdf4;
		padding: 16px;
		border-radius: 6px;
		margin-top: 16px;
		border: 1px solid #86efac;
	}

	.requirements ul {
		margin: 8px 0 0 0;
		padding-left: 24px;
	}

	.requirements li {
		margin: 6px 0;
		color: #166534;
	}
</style>
