<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { TranslationKeys } from '$lib/i18n/translations';

	type Props = {
		translations: TranslationKeys;
	};

	let { translations }: Props = $props();

	let isVisible = $state(false);
	let sectionRef: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					isVisible = true;
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(sectionRef);
		return () => observer.disconnect();
	});
</script>

<section class="features" bind:this={sectionRef}>
	{#if isVisible}
		<div class="features-grid">
			{#each translations.features as feature, i}
				<div
					class="feature-card glass-panel"
					in:fly={{ y: 30, duration: 400, delay: i * 100, easing: cubicOut }}
				>
					<div class="feature-icon">
						{#if feature.icon === 'grid'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="3" width="7" height="7" rx="1" />
								<rect x="14" y="3" width="7" height="7" rx="1" />
								<rect x="3" y="14" width="7" height="7" rx="1" />
								<rect x="14" y="14" width="7" height="7" rx="1" />
							</svg>
						{:else if feature.icon === 'star'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
						{:else if feature.icon === 'cloud'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
							</svg>
						{/if}
					</div>
					<h3 class="feature-title">{feature.title}</h3>
					<p class="feature-desc">{feature.description}</p>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	.features {
		padding: 2rem 1.5rem 4rem;
		min-height: 200px;
	}

	.features-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		max-width: 48rem;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.features-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	.feature-card {
		padding: 1.5rem;
		border-radius: 1.25rem;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.feature-card:hover {
		transform: translateY(-4px);
	}

	.feature-icon {
		width: 3rem;
		height: 3rem;
		margin: 0 auto 1rem;
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.feature-icon svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.feature-title {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: var(--theme-text);
	}

	.feature-desc {
		color: var(--theme-text-muted);
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}
</style>
