<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '$lib/supabase/types';
	import type { TranslationKeys } from '$lib/i18n/translations';
	import CTAButtons from './CTAButtons.svelte';

	type Props = {
		supabase: SupabaseClient<Database>;
		onGuestTry: () => void;
		translations: TranslationKeys;
	};

	let { supabase, onGuestTry, translations }: Props = $props();

	// Demo data for preview grid with achievement status
	const demoAchieved = [true, true, false, true, true, false, true, false, true];
	const demoGoals = $derived(
		translations.preview.goals.map((goal, i) => ({
			goal,
			achieved: demoAchieved[i]
		}))
	);
</script>

<section class="hero">
	<h1 class="hero-title" in:fly={{ y: 20, duration: 600, easing: cubicOut }}>
		{translations.hero.title}<span class="highlight">{translations.hero.titleHighlight}</span>{translations.hero.titleSuffix}
	</h1>

	<p class="hero-subtitle" in:fly={{ y: 20, duration: 400, delay: 100, easing: cubicOut }}>
		{@html translations.hero.subtitle.replace('\n', '<br />')}
	</p>

	<div in:fly={{ y: 20, duration: 400, delay: 200, easing: cubicOut }}>
		<CTAButtons {supabase} {onGuestTry} {translations} />
	</div>

	<div class="preview-wrapper" in:scale={{ start: 0.95, duration: 500, delay: 300, easing: cubicOut }}>
		<div class="preview-grid">
			{#each demoGoals as cell, i}
				<div
					class="preview-cell"
					class:achieved={cell.achieved}
					class:center={i === 4}
				>
					<span class="cell-text">{cell.goal}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 4rem 1.5rem;
		gap: 1rem;
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 700;
		color: var(--theme-text);
		line-height: 1.2;
		margin: 0;
	}

	.highlight {
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		font-size: 1.125rem;
		color: var(--theme-text-muted);
		max-width: 24rem;
		line-height: 1.6;
		margin: 0.5rem 0 0;
	}

	.preview-wrapper {
		margin-top: 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.preview-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		width: min(280px, 80vw);
		aspect-ratio: 1;
	}

	.preview-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 0.75rem;
		background: var(--theme-surface);
		border: 1px solid var(--theme-border);
		transition: all 0.3s ease;
	}

	.preview-cell.achieved {
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
		border-color: transparent;
		box-shadow: 0 0 15px var(--theme-glow);
	}

	.preview-cell.center {
		background: linear-gradient(135deg, var(--color-bingo), var(--color-bingo-glow));
		border-color: transparent;
	}

	.cell-text {
		font-size: 0.625rem;
		font-weight: 600;
		color: var(--theme-text);
		text-align: center;
		line-height: 1.2;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

</style>
