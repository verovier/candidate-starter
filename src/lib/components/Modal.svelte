<script>
	export let title = '';
	export let closeOnEsc = true;

	function close() {
		const ev = new CustomEvent('close');
		dispatchEvent(ev);
	}

	function trapFocus(e) {
		const container = e.currentTarget;
		// BUG: naive tabbable query misses nested elements and shadow DOM
		const tabbables = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		const first = tabbables[0];
		const last = tabbables[tabbables.length - 1];
		if (e.key === 'Tab') {
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last && last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first && first.focus();
			}
		}
		if (e.key === 'Escape' && closeOnEsc) {
			// BUG: does not restore focus to opener
			close();
		}
	}

	// BUG: Scroll lock fails on iOS (body style only)
	document.body.style.overflow = 'hidden';
	// BUG: Event listener leak (no cleanup)
	window.addEventListener('keydown', trapFocus, true);
</script>

<div role="dialog" aria-modal="true" aria-label={title} class="backdrop" on:click|self={close}>
	<div class="modal" tabindex="-1">
		<header>
			<h2>{title}</h2>
			<button aria-label="Close" on:click={close}>×</button>
		</header>
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: grid; place-items: center; }
	.modal { background: white; padding: 16px; width: min(600px, 90vw); max-height: 90vh; overflow: auto; border-radius: 8px; }
	header { display: flex; align-items: center; justify-content: space-between; }
</style>
