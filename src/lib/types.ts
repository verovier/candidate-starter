export type User = {
	id: string;
	email: string;
	name: string;
};

export type Prompt = {
	id: string;
	name: string;
	text: string;
	updatedAt: number;
};

export type SavePromptData = {
	id?: string;
	name: string;
	text: string;
}

export type ToastMessage = {
	id: string;
	text: string;
	type?: 'error' | 'info' | 'success';
	duration?: number;
};
