<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeTheme, currentTheme } from '$lib/stores/themeStore';

	let { children } = $props();

	const theme = $derived($currentTheme);

	onMount(() => {
		initializeTheme();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href={theme.fonts.googleFontsUrl} rel="stylesheet" />
</svelte:head>

{@render children()}
