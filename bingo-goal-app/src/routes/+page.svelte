<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		boardStore,
		currentBoard,
		initializeStore,
		createBoard,
		updateCell,
		setCurrentBoard,
		toggleAchieved
	} from '$lib/stores/boardStore';
	import { currentTheme } from '$lib/stores/themeStore';
	import { isAuthLoading, isAuthenticated } from '$lib/stores/authStore';
	import LandingPage from '$lib/components/landing/LandingPage.svelte';
	import type { CellPosition, BoardSize } from '$lib/types/bingo';
	import { getCellByPosition, generateBingoLines } from '$lib/types/bingo';
	import BingoGrid from '$lib/components/bingo/BingoGrid.svelte';
	import GoalInputModal from '$lib/components/bingo/GoalInputModal.svelte';
	import SaveIndicator from '$lib/components/ui/SaveIndicator.svelte';
	import ProgressDisplay from '$lib/components/bingo/ProgressDisplay.svelte';
	import { getProgressSummary, getBingoLinePositions } from '$lib/utils/bingo';
	import { celebrateBingo, celebratePerfect } from '$lib/utils/celebration';
	import ThemeSelector from '$lib/components/ui/ThemeSelector.svelte';
	import AuthButton from '$lib/components/ui/AuthButton.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { supabase } = data;

	let isModalOpen = $state(false);
	let prevBingoCount = $state<number | null>(null);
	let prevIsPerfect = $state<boolean | null>(null);
	let selectedPosition = $state<CellPosition | null>(null);
	let isNameDialogOpen = $state(false);
	let newBoardName = $state('');
	let selectedSize = $state<BoardSize>(3);

	const board = $derived($currentBoard);
	const boards = $derived($boardStore.boards);
	const isSaving = $derived($boardStore.isSaving);

	const selectedCell = $derived(
		board && selectedPosition ? getCellByPosition(board, selectedPosition) : null
	);

	const bingoLines = $derived(board ? generateBingoLines(board.size) : []);
	const progress = $derived(board ? getProgressSummary(board.cells, bingoLines) : null);
	const highlightedPositions = $derived(board ? getBingoLinePositions(board.cells, bingoLines) : []);
	const themeIcon = $derived($currentTheme.meta.icon);
	const authLoading = $derived($isAuthLoading);
	const authenticated = $derived($isAuthenticated);
	const showLanding = $derived(!authenticated && boards.length === 0 && !authLoading);

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
		createBoard(name, selectedSize);
		newBoardName = '';
		selectedSize = 3;
		isNameDialogOpen = false;
	}

	function handleBoardChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		setCurrentBoard(select.value);
	}

	function openNameDialog() {
		newBoardName = '';
		selectedSize = 3;
		isNameDialogOpen = true;
	}

	function handleToggleAchieved() {
		if (board && selectedPosition) {
			toggleAchieved(board.id, selectedPosition);
		}
	}
</script>

<svelte:head>
	<title>Bingo Planner</title>
</svelte:head>

{#if showLanding}
	<LandingPage {supabase} onCreateBoard={openNameDialog} />
{:else}
<div class="page-container">
	<!-- Ambient Background -->
	<div class="ambient-bg">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="orb orb-3"></div>
	</div>

	<div class="content-wrapper">
		<header class="header glass-panel">
			<div class="header-inner">
				<h1 class="brand">
					<span class="brand-icon">{themeIcon}</span>
					<span class="brand-text">Bingo Planner</span>
				</h1>
				<div class="actions">
					<SaveIndicator {isSaving} />
					<div class="divider"></div>
					<ThemeSelector />
					{#if !authLoading}
						<AuthButton {supabase} />
					{/if}
				</div>
			</div>
		</header>

		<main class="main-content">
			{#if boards.length > 0}
				<div class="controls glass-panel" in:fly={{ y: 20, duration: 400, delay: 100 }}>
					<div class="board-select-wrapper">
						<select
							class="board-select"
							onchange={handleBoardChange}
							value={board?.id ?? ''}
							aria-label="Select Board"
						>
							{#each boards as b (b.id)}
								<option value={b.id}>{b.name}</option>
							{/each}
						</select>
						<div class="select-icon">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M6 9l6 6 6-6"/>
							</svg>
						</div>
					</div>
					
					<button
						type="button"
						onclick={openNameDialog}
						class="btn-icon"
						aria-label="New Board"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 5v14M5 12h14"/>
						</svg>
					</button>

					<a href="/boards" class="btn-icon" aria-label="Manage Boards">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
						</svg>
					</a>
				</div>
			{/if}

			<div class="board-area">
				{#if board}
					<div in:scale={{ duration: 400, start: 0.95, easing: cubicOut }}>
						<BingoGrid
							{board}
							onCellTap={handleCellTap}
							onCellLongPress={handleCellLongPress}
							{highlightedPositions}
						/>
					</div>

					{#if progress}
						<div class="progress-section" in:fly={{ y: 20, duration: 400, delay: 200 }}>
							<ProgressDisplay
								achieved={progress.achieved}
								total={progress.total}
								bingoCount={progress.bingoCount}
								hint={progress.hint}
								isPerfect={progress.isPerfect}
							/>
						</div>
					{/if}
				{:else}
					<div class="empty-state glass-panel" in:scale={{ duration: 300, start: 0.9 }}>
						<div class="empty-icon-wrapper">
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M12 4v16m8-8H4" />
							</svg>
						</div>
						<h2 class="empty-title">Start Your Journey</h2>
						<p class="empty-desc">Create your first bingo board to track your goals.</p>
						<button
							type="button"
							onclick={openNameDialog}
							class="btn-primary-lg"
						>
							Create Board
						</button>
					</div>
				{/if}
			</div>
		</main>
	</div>
</div>
{/if}

{#if isNameDialogOpen}
	<div
		role="presentation"
		class="modal-backdrop"
		transition:fade={{ duration: 200 }}
		onclick={() => (isNameDialogOpen = false)}
	>
		<div
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			class="modal-card glass-panel"
			transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === 'Escape' && (isNameDialogOpen = false)}
		>
			<h2 class="modal-title">New Board</h2>
			
			<div class="input-group">
				<input
					type="text"
					bind:value={newBoardName}
					placeholder={`${new Date().getFullYear()} Goals`}
					class="text-input"
				/>
			</div>

			<div class="size-selector" role="group" aria-labelledby="grid-size-label">
				<span id="grid-size-label" class="section-label">Grid Size</span>
				<div class="grid-options">
					{#each [3, 4, 5] as size (size)}
						<button
							type="button"
							class="grid-option"
							class:selected={selectedSize === size}
							onclick={() => (selectedSize = size as BoardSize)}
						>
							<span class="grid-size">{size}x{size}</span>
							<span class="grid-count">{size * size} goals</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="modal-actions">
				<button
					type="button"
					onclick={() => (isNameDialogOpen = false)}
					class="btn-text"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={handleCreateBoard}
					class="btn-primary"
				>
					Create Board
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
	/* Layout & Container */
	.page-container {
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
		color: var(--theme-text); /* Fallback */
	}

	.content-wrapper {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* Ambient Background */
	.ambient-bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		background: radial-gradient(circle at 50% 0%, var(--theme-bg-grad-end), var(--theme-bg-grad-start));
		overflow: hidden;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.6;
		animation: float 10s ease-in-out infinite;
	}

	.orb-1 {
		width: 400px;
		height: 400px;
		background: var(--theme-primary);
		top: -100px;
		right: -100px;
		animation-delay: 0s;
	}

	.orb-2 {
		width: 300px;
		height: 300px;
		background: var(--theme-secondary);
		bottom: 10%;
		left: -50px;
		animation-delay: -2s;
	}

	.orb-3 {
		width: 200px;
		height: 200px;
		background: var(--theme-accent);
		top: 40%;
		right: 20%;
		animation-delay: -5s;
	}

	/* Header */
	.header {
		position: sticky;
		top: 1rem;
		margin: 0 1rem;
		border-radius: 1rem;
		padding: 0.75rem 1.25rem;
		margin-bottom: 2rem;
		z-index: 50;
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 64rem;
		margin: 0 auto;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--theme-text);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.divider {
		width: 1px;
		height: 1.5rem;
		background: var(--theme-border);
	}

	/* Main Content */
	.main-content {
		flex: 1;
		width: 100%;
		max-width: 32rem;
		margin: 0 auto;
		padding: 0 1rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Controls Bar */
	.controls {
		display: flex;
		gap: 0.75rem;
		padding: 0.5rem;
		border-radius: 1rem;
	}

	.board-select-wrapper {
		position: relative;
		flex: 1;
	}

	.board-select {
		width: 100%;
		appearance: none;
		background: transparent;
		border: none;
		padding: 0.75rem 1rem;
		padding-right: 2.5rem;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1rem;
		color: var(--theme-text);
		cursor: pointer;
	}
	
	.board-select:focus {
		outline: none;
	}

	.select-icon {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		opacity: 0.7;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		border-radius: 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid transparent;
		color: var(--theme-text);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-icon:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-1px);
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 3rem 2rem;
		border-radius: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.empty-icon-wrapper {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dim));
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
		box-shadow: 0 10px 30px -10px var(--theme-primary);
	}

	.empty-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
	}

	.empty-desc {
		color: var(--theme-text-muted);
		margin-bottom: 1rem;
	}

	.btn-primary-lg {
		padding: 1rem 2.5rem;
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dim));
		border: none;
		border-radius: 1rem;
		color: var(--theme-text-on-primary);
		font-weight: 600;
		font-size: 1.125rem;
		cursor: pointer;
		box-shadow: 0 4px 20px color-mix(in srgb, var(--theme-primary) 40%, transparent);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.btn-primary-lg:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px color-mix(in srgb, var(--theme-primary) 50%, transparent);
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.8); /* Much darker backdrop */
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.modal-card {
		width: 100%;
		max-width: 24rem;
		border-radius: 1.5rem;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		background: color-mix(in srgb, var(--theme-surface) 95%, black);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 2px solid var(--theme-border);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	}

	.modal-title {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 800;
		text-align: center;
		color: var(--theme-text);
		letter-spacing: -0.03em;
	}

	.text-input {
		width: 100%;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--theme-border);
		padding: 1.25rem;
		border-radius: 1rem;
		color: var(--theme-text);
		font-size: 1.25rem;
		font-weight: 600;
		text-align: center;
		transition: all 0.2s;
	}

	.text-input:focus {
		outline: none;
		border-color: var(--theme-primary);
		background: rgba(0, 0, 0, 0.4);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--theme-primary) 20%, transparent);
	}

	.section-label {
		display: block;
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--theme-text);
		margin-bottom: 1rem;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.grid-options {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.grid-option {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--theme-border);
		border-radius: 1rem;
		padding: 1rem 0.5rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		color: var(--theme-text);
	}

	.grid-option:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--theme-primary);
		transform: translateY(-2px);
	}

	.grid-option.selected {
		background: var(--theme-primary);
		border-color: transparent;
		color: var(--theme-text-on-primary);
		box-shadow: 0 8px 15px var(--theme-glow);
	}

	.grid-size {
		font-weight: 700;
		font-size: 1.125rem;
	}

	.grid-count {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.btn-text {
		flex: 1;
		padding: 0.875rem;
		background: transparent;
		border: none;
		color: var(--theme-text);
		font-weight: 600;
		cursor: pointer;
	}

	.btn-text:hover {
		color: var(--theme-text);
	}

	.btn-primary {
		flex: 1;
		padding: 0.875rem;
		background: var(--theme-primary);
		border: none;
		border-radius: 0.75rem;
		color: var(--theme-text-on-primary);
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 4px 15px var(--theme-glow);
		transition: all 0.2s;
	}

	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px var(--theme-glow);
	}
</style>
