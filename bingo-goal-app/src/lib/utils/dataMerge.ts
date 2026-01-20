import type { AppState, BingoBoard } from '$lib/types/bingo';
import { MAX_BOARDS } from '$lib/constants/tokens';

export type MergeResult = {
	state: AppState;
	skippedBoards: BingoBoard[];
};

// 後方互換性を保つため、AppStateのプロパティも直接アクセス可能にする
export type MergeResultWithCompatibility = MergeResult & AppState;

function sortByUpdatedAtDesc(boards: BingoBoard[]): BingoBoard[] {
	return [...boards].sort(
		(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
	);
}

export function mergeLocalDataToCloud(
	localState: AppState | null,
	cloudState: AppState | null,
	maxBoards: number = MAX_BOARDS
): MergeResultWithCompatibility {
	// 両方nullの場合
	if (!localState && !cloudState) {
		const state: AppState = {
			boards: [],
			currentBoardId: null,
			isSaving: false
		};
		return {
			...state,
			state,
			skippedBoards: []
		};
	}

	// ローカルがnullまたは空の場合、クラウドを返す
	if (!localState || localState.boards.length === 0) {
		const cloudBoards = cloudState?.boards || [];
		const sortedBoards = sortByUpdatedAtDesc(cloudBoards);
		const skippedBoards = sortedBoards.slice(maxBoards);

		const state: AppState = cloudState || {
			boards: [],
			currentBoardId: null,
			isSaving: false
		};
		return {
			...state,
			state,
			skippedBoards
		};
	}

	// クラウドがnullまたは空の場合、ローカルを返す
	if (!cloudState || cloudState.boards.length === 0) {
		const sortedBoards = sortByUpdatedAtDesc(localState.boards);
		const keptBoards = sortedBoards.slice(0, maxBoards);
		const skippedBoards = sortedBoards.slice(maxBoards);

		const state: AppState = {
			boards: keptBoards,
			currentBoardId: localState.currentBoardId,
			isSaving: false
		};
		return {
			...state,
			state,
			skippedBoards
		};
	}

	// 両方存在する場合: クラウド優先でマージ
	const cloudBoardIds = new Set(cloudState.boards.map((b) => b.id));
	const newBoards: BingoBoard[] = [];

	for (const localBoard of localState.boards) {
		if (!cloudBoardIds.has(localBoard.id)) {
			newBoards.push(localBoard);
		}
	}

	const mergedBoards = [...cloudState.boards, ...newBoards];
	const sortedBoards = sortByUpdatedAtDesc(mergedBoards);

	// maxBoardsに制限
	const keptBoards = sortedBoards.slice(0, maxBoards);
	const skippedBoards = sortedBoards.slice(maxBoards);

	const state: AppState = {
		boards: keptBoards,
		currentBoardId: cloudState.currentBoardId || localState.currentBoardId,
		isSaving: false
	};

	return {
		...state,
		state,
		skippedBoards
	};
}

export function getBoardsToUpload(
	localState: AppState | null,
	cloudState: AppState | null,
	maxBoards: number = MAX_BOARDS
): BingoBoard[] {
	if (!localState || localState.boards.length === 0) {
		return [];
	}

	const cloudBoardCount = cloudState?.boards?.length || 0;

	// クラウドが上限に達している場合は空配列
	if (cloudBoardCount >= maxBoards) {
		return [];
	}

	// 空きスロット数を計算
	const availableSlots = maxBoards - cloudBoardCount;

	if (!cloudState || cloudState.boards.length === 0) {
		return sortByUpdatedAtDesc(localState.boards).slice(0, availableSlots);
	}

	const cloudBoardIds = new Set(cloudState.boards.map((b) => b.id));
	const newBoards = localState.boards.filter((board) => !cloudBoardIds.has(board.id));

	return sortByUpdatedAtDesc(newBoards).slice(0, availableSlots);
}
