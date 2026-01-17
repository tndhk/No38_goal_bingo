<script lang="ts">
	interface Props {
		achieved: number;
		total: number;
		bingoCount: number;
		hint: string | null;
		isPerfect: boolean;
	}

	let { achieved, total, bingoCount, hint, isPerfect }: Props = $props();

	const percentage = $derived(Math.round((achieved / total) * 100));
</script>

<div class="progress-display">
	<!-- Progress Bar -->
	<div class="progress-section">
		<div class="progress-header">
			<span class="progress-label">{achieved}/{total} achieved</span>
			<span class="progress-percentage">{percentage}%</span>
		</div>
		<div class="progress-track">
			<div
				class="progress-fill"
				style="width: {percentage}%"
			></div>
		</div>
	</div>

	<!-- Badges -->
	<div class="badges">
		{#if bingoCount > 0}
			<span class="badge badge-bingo">
				<svg class="badge-icon" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
				{bingoCount} BINGO!
			</span>
		{/if}

		{#if isPerfect}
			<span class="badge badge-perfect">
				<svg class="badge-icon" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
				</svg>
				PERFECT!
			</span>
		{/if}
	</div>

	{#if hint && !isPerfect}
		<span class="hint">{hint}</span>
	{/if}
</div>

<style>
	.progress-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
	}

	.progress-section {
		width: 100%;
		max-width: 20rem;
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.progress-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1E1B4B;
	}

	.progress-percentage {
		font-size: 0.875rem;
		font-weight: 700;
		color: #7C3AED;
	}

	.progress-track {
		width: 100%;
		height: 0.75rem;
		background: linear-gradient(145deg, #F5F3FF, #E9E5FF);
		border-radius: 9999px;
		overflow: hidden;
		box-shadow:
			inset 2px 2px 4px rgba(124, 58, 237, 0.1),
			inset -1px -1px 2px rgba(255, 255, 255, 0.8);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #10B981, #34D399, #6EE7B7);
		border-radius: 9999px;
		transition: width 0.5s ease-out;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
	}

	.badges {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		font-weight: 700;
		font-size: 0.875rem;
		border-radius: 9999px;
	}

	.badge-icon {
		width: 1rem;
		height: 1rem;
		margin-right: 0.375rem;
	}

	.badge-bingo {
		background: linear-gradient(135deg, #F59E0B, #FBBF24);
		color: #1E1B4B;
		box-shadow:
			0 4px 12px rgba(245, 158, 11, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		animation: badge-pop 0.3s ease-out;
	}

	.badge-perfect {
		background: linear-gradient(135deg, #7C3AED, #A78BFA, #F472B6, #FBBF24, #34D399);
		background-size: 300% 300%;
		animation: rainbow-shift 3s ease infinite, badge-pop 0.3s ease-out;
		color: white;
		box-shadow:
			0 4px 16px rgba(124, 58, 237, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	@keyframes badge-pop {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes rainbow-shift {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	.hint {
		font-size: 0.875rem;
		font-weight: 500;
		color: #6366F1;
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(245, 243, 255, 0.8));
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		box-shadow:
			0 2px 8px rgba(124, 58, 237, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(124, 58, 237, 0.1);
	}
</style>
