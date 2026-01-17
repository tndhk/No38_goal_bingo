import type { AppState, BingoBoard } from '$lib/types/bingo';

export function mergeLocalDataToCloud(
	localState: AppState | null,
	cloudState: AppState | null
): AppState {
	if (!localState || localState.boards.length === 0) {
		return (
			cloudState || {
				boards: [],
				currentBoardId: null,
				isSaving: false
			}
		);
	}

	if (!cloudState || cloudState.boards.length === 0) {
		return {
			...localState,
			isSaving: false
		};
	}

	const cloudBoardIds = new Set(cloudState.boards.map((b) => b.id));
	const newBoards: BingoBoard[] = [];

	for (const localBoard of localState.boards) {
		if (!cloudBoardIds.has(localBoard.id)) {
			newBoards.push(localBoard);
		}
	}

	const mergedBoards = [...cloudState.boards, ...newBoards];

	return {
		boards: mergedBoards,
		currentBoardId: cloudState.currentBoardId || localState.currentBoardId,
		isSaving: false
	};
}

export function getBoardsToUpload(
	localState: AppState | null,
	cloudState: AppState | null
): BingoBoard[] {
	if (!localState || localState.boards.length === 0) {
		return [];
	}

	if (!cloudState || cloudState.boards.length === 0) {
		return localState.boards;
	}

	const cloudBoardIds = new Set(cloudState.boards.map((b) => b.id));
	return localState.boards.filter((board) => !cloudBoardIds.has(board.id));
}
