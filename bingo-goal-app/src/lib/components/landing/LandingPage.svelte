<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '$lib/supabase/types';
	import { currentTheme } from '$lib/stores/themeStore';
	import { currentLocale } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';
	import ThemeSelector from '$lib/components/ui/ThemeSelector.svelte';
	import LocaleToggle from '$lib/components/ui/LocaleToggle.svelte';
	import HeroSection from './HeroSection.svelte';
	import FeaturesSection from './FeaturesSection.svelte';

	type Props = {
		supabase: SupabaseClient<Database>;
		onCreateBoard: () => void;
	};

	let { supabase, onCreateBoard }: Props = $props();

	const themeIcon = $derived($currentTheme.meta.icon);
	const translations = $derived(t($currentLocale));
</script>

<div class="landing-container">
	<!-- Ambient Background -->
	<div class="ambient-bg">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="orb orb-3"></div>
	</div>

	<div class="landing-content">
		<header class="landing-header">
			<div class="brand">
				<span class="brand-icon">{themeIcon}</span>
				<span class="brand-text">BinGoal!</span>
			</div>
			<div class="header-controls">
				<LocaleToggle />
				<ThemeSelector />
			</div>
		</header>

		<main>
			<HeroSection {supabase} onGuestTry={onCreateBoard} {translations} />
			<FeaturesSection {translations} />
		</main>

		<footer class="landing-footer">
			<div class="footer-links">
				<a href="/privacy" class="footer-link">{translations.footer.privacy}</a>
				<span class="footer-divider">|</span>
				<a href="/terms" class="footer-link">{translations.footer.terms}</a>
			</div>
		</footer>
	</div>
</div>

<style>
	.landing-container {
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}

	.landing-content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* Ambient Background */
	.ambient-bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		background: radial-gradient(circle at 50% 0%, var(--theme-bg-grad-end), var(--theme-bg-grad-start));
		overflow: hidden;
		/* iPhoneでタッチイベントが背景に捕捉されないようにする */
		pointer-events: none;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.6;
		animation: float 10s ease-in-out infinite;
	}

	.orb-1 {
		width: 400px;
		height: 400px;
		background: var(--theme-primary);
		top: -100px;
		right: -100px;
		animation-delay: 0s;
	}

	.orb-2 {
		width: 300px;
		height: 300px;
		background: var(--theme-secondary);
		bottom: 10%;
		left: -50px;
		animation-delay: -2s;
	}

	.orb-3 {
		width: 200px;
		height: 200px;
		background: var(--theme-accent);
		top: 40%;
		right: 20%;
		animation-delay: -5s;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-20px) scale(1.05);
		}
	}

	/* Header */
	.landing-header {
		position: sticky;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		z-index: 50;
		background: rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(8px);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--theme-text);
	}

	.brand-icon {
		font-size: 1.25rem;
	}

	.header-controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	/* Footer */
	.landing-footer {
		padding: 2rem 1.5rem;
		text-align: center;
	}

	.footer-links {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.footer-link {
		color: var(--theme-text-light);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s;
	}

	.footer-link:hover {
		color: var(--theme-text);
	}

	.footer-divider {
		color: var(--theme-text-light);
		opacity: 0.5;
	}
</style>
