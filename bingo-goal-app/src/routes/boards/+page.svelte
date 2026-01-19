<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		boardStore,
		initializeStore,
		deleteBoard,
		setCurrentBoard,
		createBoard
	} from '$lib/stores/boardStore';
	import { currentTheme } from '$lib/stores/themeStore';
	import { localeStore } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';
	import { MAX_BOARDS } from '$lib/constants/tokens';
	import type { BoardSize } from '$lib/types/bingo';
	import BoardList from '$lib/components/bingo/BoardList.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';

	let isDeleteDialogOpen = $state(false);
	let boardToDelete = $state<{ id: string; name: string } | null>(null);
	let isNameDialogOpen = $state(false);
	let newBoardName = $state('');
	let selectedSize = $state<BoardSize>(3);

	const boards = $derived($boardStore.boards);
	const themeIcon = $derived($currentTheme.meta.icon);
	const locale = $derived($localeStore);
	const i18n = $derived(t(locale));
	const remainingBoards = $derived(MAX_BOARDS - boards.length);
	const isAtLimit = $derived(boards.length >= MAX_BOARDS);

	onMount(() => {
		initializeStore();
	});

	function handleSelectBoard(boardId: string) {
		setCurrentBoard(boardId);
		goto('/');
	}

	function handleDeleteRequest(boardId: string) {
		const board = boards.find((b) => b.id === boardId);
		if (board) {
			boardToDelete = { id: board.id, name: board.name };
			isDeleteDialogOpen = true;
		}
	}

	function handleDeleteConfirm() {
		if (boardToDelete) {
			deleteBoard(boardToDelete.id);
			boardToDelete = null;
		}
		isDeleteDialogOpen = false;
	}

	function handleDeleteCancel() {
		boardToDelete = null;
		isDeleteDialogOpen = false;
	}

	function openNameDialog() {
		newBoardName = '';
		selectedSize = 3;
		isNameDialogOpen = true;
	}

	function handleCreateBoard() {
		const name = newBoardName.trim() || i18n.boardModal.defaultName(new Date().getFullYear());
		createBoard(name, selectedSize);
		newBoardName = '';
		selectedSize = 3;
		isNameDialogOpen = false;
	}
</script>

<svelte:head>
	<title>My Bingoals - BinGoal!</title>
</svelte:head>

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
				<a href="/" class="btn-back" aria-label={i18n.common.backToHome}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
				</a>
				<h1 class="brand">
					<span class="brand-icon">{themeIcon}</span>
					<span class="brand-text">{i18n.boards.myBingoals}</span>
				</h1>
			</div>
		</header>

		<main class="main-content">
			{#if boards.length > 0}
				<div in:fly={{ y: 20, duration: 400, delay: 100 }}>
					<BoardList
						{boards}
						onSelectBoard={handleSelectBoard}
						onDeleteBoard={handleDeleteRequest}
					/>
				</div>
				<div class="new-board-section" in:fly={{ y: 20, duration: 400, delay: 200 }}>
					<button type="button" class="btn-primary-lg" onclick={openNameDialog} disabled={isAtLimit}>
						{i18n.boards.createNewBoard}
					</button>
					{#if isAtLimit}
						<p class="limit-message">{i18n.boards.limitReached}</p>
					{:else}
						<p class="remaining-message">{i18n.boards.remaining(remainingBoards)}</p>
					{/if}
				</div>
			{:else}
				<div class="empty-state glass-panel" in:scale={{ duration: 300, start: 0.9 }}>
					<div class="empty-icon-wrapper">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</div>
					<h2 class="empty-title">{i18n.boards.noBoardsYet}</h2>
					<p class="empty-desc">{i18n.main.createFirstBoardDesc}</p>
					<button type="button" class="btn-primary-lg" onclick={openNameDialog} disabled={isAtLimit}>
						{i18n.boards.createFirstBoard}
					</button>
					{#if isAtLimit}
						<p class="limit-message">{i18n.boards.limitReached}</p>
					{:else}
						<p class="remaining-message">{i18n.boards.remaining(remainingBoards)}</p>
					{/if}
				</div>
			{/if}
		</main>
	</div>
</div>

<Dialog
	isOpen={isDeleteDialogOpen}
	title={i18n.boards.deleteBoard}
	message={i18n.boards.deleteConfirm(boardToDelete?.name ?? '')}
	confirmLabel={i18n.common.delete}
	cancelLabel={i18n.common.cancel}
	variant="danger"
	onconfirm={handleDeleteConfirm}
	oncancel={handleDeleteCancel}
/>

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
			<h2 class="modal-title">{i18n.boardModal.newBoard}</h2>

			<div class="input-group">
				<input
					type="text"
					bind:value={newBoardName}
					placeholder={i18n.boardModal.defaultName(new Date().getFullYear())}
					class="text-input"
				/>
			</div>

			<div class="size-selector" role="group" aria-labelledby="grid-size-label">
				<span id="grid-size-label" class="section-label">{i18n.boardModal.gridSize}</span>
				<div class="grid-options">
					{#each [3, 4, 5] as size (size)}
						<button
							type="button"
							class="grid-option"
							class:selected={selectedSize === size}
							onclick={() => (selectedSize = size as BoardSize)}
						>
							<span class="grid-size">{size}x{size}</span>
							<span class="grid-count">{size * size} {i18n.boardModal.goals}</span>
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
					{i18n.common.cancel}
				</button>
				<button type="button" onclick={handleCreateBoard} class="btn-primary">
					{i18n.main.createBoard}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Layout & Container */
	.page-container {
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
		color: var(--theme-text);
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

	@keyframes float {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(10px, 20px); }
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
		gap: 1rem;
		max-width: 32rem;
		margin: 0 auto;
	}

	.btn-back {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid transparent;
		color: var(--theme-text);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-back:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-1px);
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

	.new-board-section {
		display: flex;
		flex-direction: column;
		align-items: center;
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

	.empty-icon-wrapper svg {
		color: var(--theme-text-on-primary);
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

	/* Buttons */
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

	.btn-primary-lg:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px color-mix(in srgb, var(--theme-primary) 50%, transparent);
	}

	.btn-primary-lg:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.limit-message {
		color: var(--theme-text-muted);
		font-size: 0.875rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	.remaining-message {
		color: var(--theme-text-muted);
		font-size: 0.875rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.8);
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
		background: color-mix(in srgb, var(--theme-surface) 98%, white);
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
		background: color-mix(in srgb, var(--theme-surface) 70%, var(--theme-text) 5%);
		border: 2px solid var(--theme-border);
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
		background: color-mix(in srgb, var(--theme-surface) 80%, var(--theme-text) 8%);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--theme-primary) 20%, transparent);
	}

	.text-input::placeholder {
		color: var(--theme-text-muted);
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
