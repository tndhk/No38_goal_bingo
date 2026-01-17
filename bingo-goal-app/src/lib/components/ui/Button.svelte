<script lang="ts">
	import type { Snippet } from 'svelte';

	type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

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
</script>

<button
	class="btn btn-{variant}"
	disabled={disabled || loading}
	{onclick}
>
	{#if loading}
		<span class="spinner"></span>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		border-radius: 1rem;
		font-weight: 600;
		font-size: 0.875rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease-out;
		outline: none;
		font-family: var(--theme-font-body);
	}

	.btn:focus-visible {
		outline: 2px solid var(--theme-primary-light);
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	/* Primary */
	.btn-primary {
		background: linear-gradient(135deg, var(--theme-primary-dim), var(--theme-primary));
		color: var(--theme-text-on-primary);
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-primary) 25%, transparent);
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent);
	}

	/* Secondary */
	.btn-secondary {
		background: linear-gradient(145deg, var(--theme-surface), var(--theme-pending));
		color: var(--theme-primary);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid var(--theme-pending-border);
	}

	.btn-secondary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.btn-secondary:active:not(:disabled) {
		transform: translateY(0);
	}

	/* Ghost */
	.btn-ghost {
		background: transparent;
		color: var(--theme-text-light);
		box-shadow: none;
	}

	.btn-ghost:hover:not(:disabled) {
		background: color-mix(in srgb, var(--theme-primary) 8%, transparent);
	}

	.btn-ghost:active:not(:disabled) {
		background: color-mix(in srgb, var(--theme-primary) 12%, transparent);
	}

	/* Danger */
	.btn-danger {
		background: linear-gradient(135deg, var(--theme-achieved), var(--theme-achieved-light));
		color: white;
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-achieved) 25%, transparent);
	}

	.btn-danger:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-achieved) 35%, transparent);
	}

	.btn-danger:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-achieved) 20%, transparent);
	}

	/* Spinner */
	.spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>
