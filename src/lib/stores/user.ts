import { writable } from 'svelte/store';
import type { User } from '$lib/types';

const mockUser: User = {
	id: 'u_123',
	email: 'candidate@example.com',
	name: 'Candidate'
};

export const userStore = writable<User | null>(mockUser);
