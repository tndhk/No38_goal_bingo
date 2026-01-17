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
		border-radius: 9999px;
		font-weight: 700;
		font-size: 0.875rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease-out;
		outline: none;
	}

	.btn:focus-visible {
		outline: 2px solid #A78BFA;
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	/* Primary */
	.btn-primary {
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		color: white;
		box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(124, 58, 237, 0.2);
	}

	/* Secondary */
	.btn-secondary {
		background: linear-gradient(145deg, #FFFFFF, #F5F3FF);
		color: #7C3AED;
		box-shadow:
			0 2px 8px rgba(124, 58, 237, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(124, 58, 237, 0.15);
	}

	.btn-secondary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow:
			0 4px 12px rgba(124, 58, 237, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.btn-secondary:active:not(:disabled) {
		transform: translateY(0);
	}

	/* Ghost */
	.btn-ghost {
		background: transparent;
		color: #6366F1;
		box-shadow: none;
	}

	.btn-ghost:hover:not(:disabled) {
		background: rgba(124, 58, 237, 0.08);
	}

	.btn-ghost:active:not(:disabled) {
		background: rgba(124, 58, 237, 0.12);
	}

	/* Danger */
	.btn-danger {
		background: linear-gradient(135deg, #EF4444, #F87171);
		color: white;
		box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
	}

	.btn-danger:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
	}

	.btn-danger:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
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
