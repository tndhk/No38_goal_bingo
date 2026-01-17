<script lang="ts">
	interface Props {
		isSaving: boolean;
	}

	let { isSaving }: Props = $props();
</script>

{#if isSaving}
	<span class="save-indicator">
		<span class="dots">
			<span class="dot"></span>
			<span class="dot"></span>
			<span class="dot"></span>
		</span>
		<span class="label">Saving</span>
	</span>
{/if}

<style>
	.save-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		background: rgba(45, 80, 22, 0.15);
		border-radius: 0.5rem;
		backdrop-filter: blur(4px);
	}

	.dots {
		display: flex;
		gap: 0.25rem;
	}

	.dot {
		width: 0.375rem;
		height: 0.375rem;
		background: #4A7C23;
		border-radius: 50%;
		animation: bounce 1.4s ease-in-out infinite;
	}

	.dot:nth-child(1) {
		animation-delay: 0s;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes bounce {
		0%, 80%, 100% {
			transform: translateY(0);
			opacity: 0.5;
		}
		40% {
			transform: translateY(-4px);
			opacity: 1;
		}
	}

	.label {
		font-size: 0.75rem;
		font-weight: 600;
		color: #2D5016;
		letter-spacing: 0.025em;
	}
</style>
