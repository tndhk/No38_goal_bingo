<script lang="ts">
	import type { Cell } from '$lib/types/bingo';

	interface Props {
		cell: Cell;
		isHighlighted?: boolean;
		ontap: () => void;
	}

	let { cell, isHighlighted = false, ontap }: Props = $props();

	const isEmpty = $derived(cell.goal.trim() === '');
</script>

<button
	type="button"
	class="flex items-center justify-center w-full h-full min-h-[80px] p-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50
		{cell.isAchieved ? 'bg-achieved text-white' : 'bg-unachieved text-gray-700'}
		{isHighlighted ? 'ring-2 ring-bingo-line ring-offset-2' : ''}"
	onclick={ontap}
>
	{#if isEmpty}
		<span class="text-gray-400 text-xs">タップして入力</span>
	{:else}
		<span class="break-words text-center line-clamp-3">{cell.goal}</span>
	{/if}
</button>

<style>
	.bg-achieved {
		background-color: #10b981;
	}

	.bg-unachieved {
		background-color: #e5e7eb;
	}

	.ring-bingo-line {
		--tw-ring-color: #fbbf24;
	}

	.ring-primary\/50 {
		--tw-ring-color: rgb(79 70 229 / 0.5);
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
