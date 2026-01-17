<script lang="ts">
	import { localeStore, currentLocale, type Locale } from '$lib/stores/localeStore';

	const locale = $derived($currentLocale);

	function setLocale(newLocale: Locale) {
		localeStore.setLocale(newLocale);
	}
</script>

<div class="locale-toggle">
	<button
		type="button"
		class="locale-btn"
		class:active={locale === 'ja'}
		onclick={() => setLocale('ja')}
		aria-label="Switch to Japanese"
	>
		JP
	</button>
	<button
		type="button"
		class="locale-btn"
		class:active={locale === 'en'}
		onclick={() => setLocale('en')}
		aria-label="Switch to English"
	>
		EN
	</button>
</div>

<style>
	.locale-toggle {
		display: flex;
		border-radius: 0.75rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid var(--theme-border);
		backdrop-filter: blur(4px);
		overflow: hidden;
	}

	.locale-btn {
		padding: 0.5rem 0.75rem;
		background: transparent;
		border: none;
		color: var(--theme-text-muted);
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}

	.locale-btn:first-child {
		border-right: 1px solid var(--theme-border);
	}

	.locale-btn:hover:not(.active) {
		background: rgba(255, 255, 255, 0.1);
		color: var(--theme-text);
	}

	.locale-btn.active {
		background: var(--theme-primary);
		color: var(--theme-text-on-primary);
	}
</style>
