import { writable } from 'svelte/store';

export type ToastMessage = {
  id: string;
  text: string;
  type?: 'error' | 'info' | 'success';
  duration?: number;
};

export const toasts = writable<ToastMessage[]>([]);

export function addToast(text: string, type: 'error' | 'info' | 'success' = 'info', duration = 4000) {
  const id = crypto.randomUUID();
  const toast: ToastMessage = { id, text, type, duration };
  toasts.update(ts => [...ts, toast]);

  setTimeout(() => {
    toasts.update(ts => ts.filter(t => t.id !== id));
  }, duration);
}

export function removeToast(id: string) {
  toasts.update(ts => ts.filter(t => t.id !== id));
}
