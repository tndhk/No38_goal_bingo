<script lang="ts">
	import { page } from '$app/state';
	import { currentLocale } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';

	const locale = $derived($currentLocale);
	const i18n = $derived(t(locale));

	const is404 = $derived(page.status === 404);
	const title = $derived(is404 ? i18n.error.notFound : i18n.error.genericTitle);
	const description = $derived(is404 ? i18n.error.notFoundDesc : i18n.error.genericDesc);
</script>

<svelte:head>
	<title>{title} - BinGoal!</title>
</svelte:head>

<div class="page">
	<div class="content">
		<div class="icon-container" class:is-404={is404}>
			{#if is404}
				<!-- Lost/Map icon for 404 -->
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
					/>
				</svg>
			{:else}
				<!-- Warning icon for other errors -->
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			{/if}
		</div>

		<h1 class="title">{title}</h1>
		<p class="description">{description}</p>

		{#if !is404 && page.error?.message}
			<p class="error-detail">{page.error.message}</p>
		{/if}

		<a href="/" class="btn-primary">{i18n.error.returnHome}</a>
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

	.icon-container.is-404 {
		background: #fef3c7;
	}

	.icon {
		width: 2rem;
		height: 2rem;
		color: #dc2626;
	}

	.is-404 .icon {
		color: #d97706;
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
		line-height: 1.6;
	}

	.error-detail {
		font-size: 0.875rem;
		color: var(--theme-text-light);
		opacity: 0.7;
		margin-bottom: 1.5rem;
		font-family: monospace;
		background: var(--theme-card-bg);
		padding: 0.75rem;
		border-radius: 0.5rem;
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
