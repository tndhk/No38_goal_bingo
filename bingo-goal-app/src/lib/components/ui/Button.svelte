<script lang="ts">
	import type { Snippet } from 'svelte';

	type ButtonVariant = 'primary' | 'secondary' | 'ghost';

	interface Props {
		variant?: ButtonVariant;
		disabled?: boolean;
		loading?: boolean;
		onclick?: () => void;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		disabled = false,
		loading = false,
		onclick,
		children
	}: Props = $props();

	const variantClasses: Record<ButtonVariant, string> = {
		primary: 'bg-primary text-white hover:bg-primary-dark',
		secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
		ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
	};
</script>

<button
	class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed {variantClasses[variant]}"
	disabled={disabled || loading}
	{onclick}
>
	{#if loading}
		<span class="inline-block animate-spin mr-2">...</span>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>
