<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeTheme, currentTheme } from '$lib/stores/themeStore';
	import { currentLocale } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';
	import { authStore } from '$lib/stores/authStore';
	import { setSupabaseClient } from '$lib/stores/boardStore';
	import { initGA } from '$lib/utils/analytics';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	const theme = $derived($currentTheme);
	const translations = $derived(t($currentLocale));
	const { supabase, session, user } = data;

	onMount(() => {
		initializeTheme();
		initGA();

		authStore.setSession(session, user);
		setSupabaseClient(supabase, user?.id ?? null);

		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			authStore.setSession(newSession, newSession?.user ?? null);
			setSupabaseClient(supabase, newSession?.user?.id ?? null);
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>{translations.seo.title}</title>
	<meta name="description" content={translations.seo.description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="BinGoal!" />
	<meta property="og:title" content={translations.seo.ogTitle} />
	<meta property="og:description" content={translations.seo.ogDescription} />
	<meta property="og:image" content="/og-image.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={translations.seo.ogTitle} />
	<meta name="twitter:description" content={translations.seo.ogDescription} />
	<meta name="twitter:image" content="/og-image.png" />

	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href={theme.fonts.googleFontsUrl} rel="stylesheet" />
</svelte:head>

{@render children()}
