import type { Prompt } from '$lib/types';

let prompts: Prompt[] = [
	{ id: 'p1', name: 'Portrait soft light', text: 'portrait, soft light, 50mm', updatedAt: Date.now() - 10000 },
	{ id: 'p2', name: 'Studio product', text: 'product on white, studio lighting', updatedAt: Date.now() - 5000 }
];

function rand(msMin = 60, msMax = 400) {
	return Math.floor(Math.random() * (msMax - msMin + 1)) + msMin;
}

function flaky() {
	// ~20% failure rate
	return Math.random() < 0.2;
}

function delay<T>(value: T, ms = rand()) {
	return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
}

export async function listPrompts(): Promise<Prompt[]> {
	const result = prompts.slice().sort((a, b) => b.updatedAt - a.updatedAt);
	// Out-of-order responses via random delay
	return delay(result);
}

export async function createPrompt(name: string, text: string): Promise<Prompt> {
	if (flaky()) throw new Error('Network error');
	const p: Prompt = { id: `p_${Math.random().toString(36).slice(2, 9)}`, name, text, updatedAt: Date.now() };
	prompts = [p, ...prompts];
	return delay(p, rand(150, 600));
}

export async function updatePrompt(id: string, patch: Partial<Prompt>): Promise<Prompt> {
	if (flaky()) throw new Error('Network error');
	const idx = prompts.findIndex((p) => p.id === id);
	if (idx === -1) throw new Error('Not found');
	const updated = { ...prompts[idx], ...patch, updatedAt: Date.now() } as Prompt;
	prompts[idx] = updated;
	return delay(updated, rand(100, 700));
}

export async function deletePrompt(id: string): Promise<{ id: string }> {
	if (flaky()) throw new Error('Network error');
	prompts = prompts.filter((p) => p.id !== id);
	return delay({ id }, rand(80, 500));
}
