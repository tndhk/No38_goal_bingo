<script lang="ts">
	import { currentTheme } from '$lib/stores/themeStore';
	import { localeStore } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';

	const theme = $derived($currentTheme);
	const locale = $derived($localeStore);
	const i18n = $derived(t(locale));
</script>

<svelte:head>
	<title>{i18n.auth.errorTitle} - BinGoal!</title>
</svelte:head>

<div class="page">
	<div class="content">
		<div class="icon-container">
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
		</div>
		<h1 class="title">{i18n.auth.errorTitle}</h1>
		<p class="description">{i18n.auth.errorDesc}</p>
		<a href="/" class="btn-primary">{i18n.auth.returnHome}</a>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			180deg,
			var(--theme-background) 0%,
			var(--theme-pending) 100%
		);
		padding: 1rem;
	}

	.content {
		text-align: center;
		max-width: 24rem;
	}

	.icon-container {
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1.5rem;
		background: #fee2e2;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon {
		width: 2rem;
		height: 2rem;
		color: #dc2626;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--theme-text);
		margin-bottom: 0.5rem;
		font-family: var(--theme-font-heading);
	}

	.description {
		color: var(--theme-text-light);
		margin-bottom: 1.5rem;
	}

	.btn-primary {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-primary));
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-primary) 25%, transparent);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent);
	}
</style>
