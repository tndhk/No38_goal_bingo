<script lang="ts">
	import { onMount } from 'svelte';
	import {
		boardStore,
		currentBoard,
		initializeStore,
		createBoard,
		updateCell,
		setCurrentBoard,
		toggleAchieved
	} from '$lib/stores/boardStore';
	import type { CellPosition } from '$lib/types/bingo';
	import { getCellByPosition } from '$lib/types/bingo';
	import BingoGrid from '$lib/components/bingo/BingoGrid.svelte';
	import GoalInputModal from '$lib/components/bingo/GoalInputModal.svelte';
	import SaveIndicator from '$lib/components/ui/SaveIndicator.svelte';
	import ProgressDisplay from '$lib/components/bingo/ProgressDisplay.svelte';
	import { getProgressSummary, getBingoLinePositions } from '$lib/utils/bingo';
	import { celebrateBingo, celebratePerfect } from '$lib/utils/celebration';

	let isModalOpen = $state(false);
	let prevBingoCount = $state<number | null>(null);
	let prevIsPerfect = $state<boolean | null>(null);
	let selectedPosition = $state<CellPosition | null>(null);
	let isYearDialogOpen = $state(false);
	let selectedYear = $state(new Date().getFullYear());

	const board = $derived($currentBoard);
	const boards = $derived($boardStore.boards);
	const isSaving = $derived($boardStore.isSaving);

	const selectedCell = $derived(
		board && selectedPosition ? getCellByPosition(board, selectedPosition) : null
	);

	const progress = $derived(board ? getProgressSummary(board.cells) : null);
	const highlightedPositions = $derived(board ? getBingoLinePositions(board.cells) : []);

	const availableYears = $derived(() => {
		const currentYear = new Date().getFullYear();
		const years: number[] = [];
		for (let y = currentYear - 2; y <= currentYear + 1; y++) {
			if (!boards.some((b) => b.year === y)) {
				years.push(y);
			}
		}
		return years;
	});

	onMount(() => {
		initializeStore();
	});

	$effect(() => {
		if (!progress) return;

		// PERFECT達成時の演出（ビンゴより優先）
		if (progress.isPerfect && prevIsPerfect === false) {
			celebratePerfect();
		}
		// ビンゴ成立時の演出
		else if (
			prevBingoCount !== null &&
			progress.bingoCount > prevBingoCount &&
			!progress.isPerfect
		) {
			celebrateBingo();
		}

		prevBingoCount = progress.bingoCount;
		prevIsPerfect = progress.isPerfect;
	});

	function handleCellTap(position: CellPosition) {
		selectedPosition = position;
		isModalOpen = true;
	}

	function handleCellLongPress(position: CellPosition) {
		if (board) {
			toggleAchieved(board.id, position);
		}
	}

	function handleSave(goal: string) {
		if (board && selectedPosition) {
			updateCell(board.id, selectedPosition, goal);
		}
		isModalOpen = false;
		selectedPosition = null;
	}

	function handleClear() {
		if (board && selectedPosition) {
			updateCell(board.id, selectedPosition, '');
		}
		isModalOpen = false;
		selectedPosition = null;
	}

	function handleClose() {
		isModalOpen = false;
		selectedPosition = null;
	}

	function handleCreateBoard() {
		createBoard(selectedYear);
		isYearDialogOpen = false;
	}

	function handleYearChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		setCurrentBoard(select.value);
	}

	function openYearDialog() {
		const years = availableYears();
		if (years.length > 0) {
			selectedYear = years[0];
		}
		isYearDialogOpen = true;
	}
</script>

<svelte:head>
	<title>目標ビンゴ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm">
		<div class="max-w-md mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<h1 class="text-xl font-bold text-gray-900">目標ビンゴ</h1>
				<SaveIndicator {isSaving} />
			</div>
		</div>
	</header>

	<main class="max-w-md mx-auto px-4 py-6">
		{#if boards.length > 0}
			<div class="mb-4 flex gap-2">
				<select
					class="flex-1 p-2 border border-gray-300 rounded-lg bg-white"
					onchange={handleYearChange}
					value={board?.id ?? ''}
				>
					{#each boards as b (b.id)}
						<option value={b.id}>{b.year}年の目標</option>
					{/each}
				</select>
				{#if availableYears().length > 0}
					<button
						type="button"
						onclick={openYearDialog}
						class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
					>
						+ 新規
					</button>
				{/if}
			</div>
		{/if}

		{#if board}
			<BingoGrid
				{board}
				onCellTap={handleCellTap}
				onCellLongPress={handleCellLongPress}
				{highlightedPositions}
			/>

			{#if progress}
				<ProgressDisplay
					achieved={progress.achieved}
					total={progress.total}
					bingoCount={progress.bingoCount}
					hint={progress.hint}
					isPerfect={progress.isPerfect}
				/>
			{/if}
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-500 mb-4">ボードがありません</p>
				<button
					type="button"
					onclick={openYearDialog}
					class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
				>
					ビンゴを作成
				</button>
			</div>
		{/if}
	</main>
</div>

{#if isYearDialogOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="presentation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={() => (isYearDialogOpen = false)}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			role="dialog"
			aria-modal="true"
			class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6"
			onclick={(e) => e.stopPropagation()}
		>
			<h2 class="text-lg font-semibold mb-4">年度を選択</h2>
			<select
				bind:value={selectedYear}
				class="w-full p-2 border border-gray-300 rounded-lg bg-white mb-4"
			>
				{#each availableYears() as year (year)}
					<option value={year}>{year}年</option>
				{/each}
			</select>
			<div class="flex gap-3 justify-end">
				<button
					type="button"
					onclick={() => (isYearDialogOpen = false)}
					class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
				>
					キャンセル
				</button>
				<button
					type="button"
					onclick={handleCreateBoard}
					class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
				>
					作成
				</button>
			</div>
		</div>
	</div>
{/if}

{#if selectedPosition}
	<GoalInputModal
		isOpen={isModalOpen}
		position={selectedPosition}
		currentGoal={selectedCell?.goal ?? ''}
		onSave={handleSave}
		onClear={handleClear}
		onClose={handleClose}
	/>
{/if}

<style>
	.min-h-screen {
		min-height: 100vh;
	}

	.bg-gray-50 {
		background-color: #f9fafb;
	}

	.bg-white {
		background-color: white;
	}

	.shadow-sm {
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}

	.shadow-xl {
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.max-w-md {
		max-width: 28rem;
	}

	.max-w-sm {
		max-width: 24rem;
	}

	.mx-auto {
		margin-left: auto;
		margin-right: auto;
	}

	.px-4 {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.py-2 {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.py-4 {
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.py-6 {
		padding-top: 1.5rem;
		padding-bottom: 1.5rem;
	}

	.py-12 {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}

	.p-6 {
		padding: 1.5rem;
	}

	.flex {
		display: flex;
	}

	.flex-1 {
		flex: 1 1 0%;
	}

	.items-center {
		align-items: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	.justify-center {
		justify-content: center;
	}

	.justify-end {
		justify-content: flex-end;
	}

	.gap-2 {
		gap: 0.5rem;
	}

	.gap-3 {
		gap: 0.75rem;
	}

	.text-xl {
		font-size: 1.25rem;
	}

	.text-lg {
		font-size: 1.125rem;
	}

	.font-bold {
		font-weight: 700;
	}

	.font-semibold {
		font-weight: 600;
	}

	.text-gray-900 {
		color: #111827;
	}

	.text-sm {
		font-size: 0.875rem;
	}

	.text-gray-500 {
		color: #6b7280;
	}

	.text-gray-600 {
		color: #4b5563;
	}

	.mb-4 {
		margin-bottom: 1rem;
	}

	.w-full {
		width: 100%;
	}

	.p-2 {
		padding: 0.5rem;
	}

	.border {
		border-width: 1px;
	}

	.border-gray-300 {
		border-color: #d1d5db;
	}

	.rounded-lg {
		border-radius: 0.5rem;
	}

	.text-center {
		text-align: center;
	}

	.px-6 {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.py-3 {
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}

	.bg-primary {
		background-color: #4f46e5;
	}

	.text-white {
		color: white;
	}

	.hover\:bg-primary-dark:hover {
		background-color: #4338ca;
	}

	.hover\:bg-gray-100:hover {
		background-color: #f3f4f6;
	}

	.transition-colors {
		transition-property: background-color, border-color, color;
		transition-duration: 150ms;
	}

	.fixed {
		position: fixed;
	}

	.inset-0 {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.z-50 {
		z-index: 50;
	}

	.bg-black\/50 {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
