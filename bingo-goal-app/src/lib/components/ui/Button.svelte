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
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn:focus-visible {
		outline: 2px solid #4A7C23;
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	/* Primary - Forest Green */
	.btn-primary {
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(45, 80, 22, 0.2);
	}

	/* Secondary - Cream */
	.btn-secondary {
		background: linear-gradient(145deg, #FAF7F2, #F5F0E6);
		color: #2D5016;
		box-shadow:
			0 2px 8px rgba(61, 48, 36, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid #D4C4B0;
	}

	.btn-secondary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 4px 12px rgba(61, 48, 36, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.btn-secondary:active:not(:disabled) {
		transform: translateY(0);
	}

	/* Ghost - Brown Text */
	.btn-ghost {
		background: transparent;
		color: #6B5C4C;
		box-shadow: none;
	}

	.btn-ghost:hover:not(:disabled) {
		background: rgba(45, 80, 22, 0.08);
	}

	.btn-ghost:active:not(:disabled) {
		background: rgba(45, 80, 22, 0.12);
	}

	/* Danger - Terracotta */
	.btn-danger {
		background: linear-gradient(135deg, #C2410C, #EA580C);
		color: white;
		box-shadow: 0 4px 14px rgba(194, 65, 12, 0.25);
	}

	.btn-danger:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(194, 65, 12, 0.35);
	}

	.btn-danger:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(194, 65, 12, 0.2);
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
