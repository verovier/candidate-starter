export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 1, timeoutMs = 300): Promise<Response> {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, { ...options, signal: controller.signal });
		clearTimeout(id);
		if (!res.ok && retries > 0) {
			await new Promise((r) => setTimeout(r, 50));
			// BUG: blindly retry including POST/PUT causing duplicate creates without idempotency key
			return fetchWithRetry(url, options, retries - 1, timeoutMs);
		}
		return res;
	} catch (e) {
		clearTimeout(id);
		if (retries > 0) {
			await new Promise((r) => setTimeout(r, 50));
			// BUG: repeats POST body again after timeout
			return fetchWithRetry(url, options, retries - 1, timeoutMs);
		}
		throw e;
	}
}

export async function httpJson<T>(url: string, options: RequestInit = {}): Promise<T> {
	const res = await fetchWithRetry(url, options, 1);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
