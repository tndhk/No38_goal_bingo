<script lang="ts">
	interface Props {
		achieved: number;
		total: number;
		bingoCount: number;
		hint: string | null;
		isPerfect: boolean;
	}

	let { achieved, total, bingoCount, hint, isPerfect }: Props = $props();
</script>

<div class="progress-display flex flex-col items-center gap-2 py-4">
	<div class="flex items-center gap-4">
		<span class="text-lg font-medium text-gray-700">{achieved}/{total} 達成</span>

		{#if bingoCount > 0}
			<span class="text-lg font-bold text-bingo">{bingoCount} BINGO!</span>
		{/if}

		{#if isPerfect}
			<span class="text-lg font-bold text-perfect">PERFECT!</span>
		{/if}
	</div>

	{#if hint && !isPerfect}
		<span class="hint text-sm text-gray-500">{hint}</span>
	{/if}
</div>

<style>
	.progress-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.flex {
		display: flex;
	}

	.flex-col {
		flex-direction: column;
	}

	.items-center {
		align-items: center;
	}

	.gap-2 {
		gap: 0.5rem;
	}

	.gap-4 {
		gap: 1rem;
	}

	.py-4 {
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.text-lg {
		font-size: 1.125rem;
		line-height: 1.75rem;
	}

	.text-sm {
		font-size: 0.875rem;
		line-height: 1.25rem;
	}

	.font-medium {
		font-weight: 500;
	}

	.font-bold {
		font-weight: 700;
	}

	.text-gray-700 {
		color: #374151;
	}

	.text-gray-500 {
		color: #6b7280;
	}

	.text-bingo {
		color: #fbbf24;
	}

	.text-perfect {
		color: #10b981;
	}
</style>
