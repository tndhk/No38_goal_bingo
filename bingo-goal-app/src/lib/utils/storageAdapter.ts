import type { AppState, BingoBoard } from '$lib/types/bingo';

export interface StorageAdapter {
	load(): Promise<AppState | null>;
	save(state: AppState): Promise<void>;
	saveBoard(board: BingoBoard): Promise<void>;
	deleteBoard(boardId: string): Promise<void>;
}
