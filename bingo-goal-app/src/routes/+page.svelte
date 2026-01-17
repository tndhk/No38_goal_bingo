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
	let isNameDialogOpen = $state(false);
	let newBoardName = $state('');

	const board = $derived($currentBoard);
	const boards = $derived($boardStore.boards);
	const isSaving = $derived($boardStore.isSaving);

	const selectedCell = $derived(
		board && selectedPosition ? getCellByPosition(board, selectedPosition) : null
	);

	const progress = $derived(board ? getProgressSummary(board.cells) : null);
	const highlightedPositions = $derived(board ? getBingoLinePositions(board.cells) : []);

	onMount(() => {
		initializeStore();
	});

	$effect(() => {
		if (!progress) return;

		if (progress.isPerfect && prevIsPerfect === false) {
			celebratePerfect();
		}
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
		const name = newBoardName.trim() || `${new Date().getFullYear()} Goals`;
		createBoard(name);
		newBoardName = '';
		isNameDialogOpen = false;
	}

	function handleBoardChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		setCurrentBoard(select.value);
	}

	function openNameDialog() {
		newBoardName = '';
		isNameDialogOpen = true;
	}

	function handleToggleAchieved() {
		if (board && selectedPosition) {
			toggleAchieved(board.id, selectedPosition);
		}
	}
</script>

<svelte:head>
	<title>Forest Planner</title>
</svelte:head>

<div class="page">
	<!-- Background decorations -->
	<div class="bg-decoration bg-decoration-1"></div>
	<div class="bg-decoration bg-decoration-2"></div>
	<div class="bg-decoration bg-decoration-3"></div>

	<header class="header">
		<div class="header-content">
			<h1 class="title">
				<svg class="title-icon" fill="currentColor" viewBox="0 0 24 24">
					<path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
				</svg>
				Forest Planner
			</h1>
			<div class="header-actions">
				<SaveIndicator {isSaving} />
				<a href="/boards" class="boards-link" aria-label="View all boards">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
					</svg>
				</a>
			</div>
		</div>
	</header>

	<main class="main">
		{#if boards.length > 0}
			<div class="board-selector">
				<select
					class="select"
					onchange={handleBoardChange}
					value={board?.id ?? ''}
				>
					{#each boards as b (b.id)}
						<option value={b.id}>{b.name}</option>
					{/each}
				</select>
				<button
					type="button"
					onclick={openNameDialog}
					class="btn-new"
				>
					+ New
				</button>
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
			<div class="empty-state">
				<div class="empty-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</div>
				<p class="empty-text">No boards yet</p>
				<button
					type="button"
					onclick={openNameDialog}
					class="btn-create"
				>
					Create Bingo
				</button>
			</div>
		{/if}
	</main>
</div>

{#if isNameDialogOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="presentation"
		class="dialog-backdrop"
		onclick={() => (isNameDialogOpen = false)}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			role="dialog"
			aria-modal="true"
			class="dialog"
			onclick={(e) => e.stopPropagation()}
		>
			<h2 class="dialog-title">New Board</h2>
			<input
				type="text"
				bind:value={newBoardName}
				placeholder={`${new Date().getFullYear()} Goals`}
				class="dialog-input"
			/>
			<div class="dialog-actions">
				<button
					type="button"
					onclick={() => (isNameDialogOpen = false)}
					class="btn-ghost"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={handleCreateBoard}
					class="btn-primary"
				>
					Create
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
		isAchieved={selectedCell?.isAchieved ?? false}
		onSave={handleSave}
		onClear={handleClear}
		onClose={handleClose}
		onToggleAchieved={handleToggleAchieved}
	/>
{/if}

<style>
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #FDFBF7 0%, #F7F3EC 50%, #F0EBE1 100%);
		position: relative;
		overflow: hidden;
	}

	/* Background decorations - Leaf silhouettes */
	.bg-decoration {
		position: fixed;
		z-index: 0;
		pointer-events: none;
		opacity: 0.08;
	}

	.bg-decoration-1 {
		width: 200px;
		height: 200px;
		background: #4A7C23;
		top: -50px;
		right: -50px;
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(25deg);
	}

	.bg-decoration-2 {
		width: 150px;
		height: 150px;
		background: #2D5016;
		bottom: 15%;
		left: -40px;
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(-15deg);
	}

	.bg-decoration-3 {
		width: 120px;
		height: 120px;
		background: #7CB342;
		bottom: 40%;
		right: -30px;
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(45deg);
	}

	/* Header */
	.header {
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		box-shadow:
			0 4px 20px rgba(45, 80, 22, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		position: relative;
		z-index: 10;
	}

	.header-content {
		max-width: 28rem;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: white;
		letter-spacing: -0.01em;
		font-family: 'Caveat', 'Zen Kurenaido', cursive;
	}

	.title-icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.boards-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		color: white;
		transition: background 0.15s ease-out;
	}

	.boards-link:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.boards-link svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Main */
	.main {
		max-width: 28rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		position: relative;
		z-index: 1;
	}

	/* Board selector */
	.board-selector {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.select {
		flex: 1;
		padding: 0.75rem 1rem;
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		border: 2px solid #D4C4B0;
		border-radius: 0.75rem;
		font-weight: 600;
		color: #3D3024;
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: 'Caveat', 'Zen Kurenaido', cursive;
		font-size: 1.125rem;
	}

	.select:focus {
		outline: none;
		border-color: #4A7C23;
		box-shadow: 0 0 0 3px rgba(74, 124, 35, 0.15);
	}

	.btn-new {
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-new:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.empty-icon {
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1rem;
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 4px 12px rgba(61, 48, 36, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid #D4C4B0;
	}

	.empty-icon svg {
		width: 2rem;
		height: 2rem;
		color: #8B6F47;
	}

	.empty-text {
		color: #6B5C4C;
		font-weight: 500;
		margin-bottom: 1.5rem;
	}

	.btn-create {
		padding: 0.875rem 2rem;
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-create:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
	}

	/* Dialog */
	.dialog-backdrop {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(61, 48, 36, 0.4);
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	.dialog {
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		border-radius: 1rem;
		box-shadow:
			0 24px 48px rgba(61, 48, 36, 0.12),
			0 8px 16px rgba(61, 48, 36, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		max-width: 24rem;
		width: 100%;
		margin: 0 1rem;
		padding: 1.5rem;
		animation: modalEnter 0.25s ease-out;
		border: 1px solid #D4C4B0;
	}

	.dialog-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #2D5016;
		font-family: 'Caveat', 'Zen Kurenaido', cursive;
	}

	.dialog-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		border: 2px solid #D4C4B0;
		border-radius: 0.75rem;
		font-weight: 500;
		color: #3D3024;
		margin-bottom: 1rem;
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.dialog-input::placeholder {
		color: #8B6F47;
	}

	.dialog-input:focus {
		outline: none;
		border-color: #4A7C23;
		box-shadow: 0 0 0 3px rgba(74, 124, 35, 0.15);
	}

	.dialog-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn-ghost {
		padding: 0.625rem 1.25rem;
		background: transparent;
		color: #6B5C4C;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-ghost:hover {
		background: rgba(45, 80, 22, 0.08);
	}

	.btn-primary {
		padding: 0.625rem 1.25rem;
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes modalEnter {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
