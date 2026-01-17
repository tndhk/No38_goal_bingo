<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeTheme, currentTheme } from '$lib/stores/themeStore';
	import { authStore } from '$lib/stores/authStore';
	import { setSupabaseClient } from '$lib/stores/boardStore';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	const theme = $derived($currentTheme);
	const { supabase, session, user } = data;

	onMount(() => {
		initializeTheme();

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
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href={theme.fonts.googleFontsUrl} rel="stylesheet" />
</svelte:head>

{@render children()}
