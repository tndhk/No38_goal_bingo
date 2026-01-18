import type { SupabaseClient } from '@supabase/supabase-js';
import type { StorageAdapter } from './storageAdapter';
import type { AppState, BingoBoard, Cell, BoardSize, CellPosition } from '$lib/types/bingo';
import type { Database } from '$lib/supabase/types';

type BoardRow = Database['public']['Tables']['boards']['Row'];
type CellRow = Database['public']['Tables']['cells']['Row'];
type BoardInsert = Database['public']['Tables']['boards']['Insert'];
type CellInsert = Database['public']['Tables']['cells']['Insert'];

type BoardWithCells = BoardRow & { cells: CellRow[] };

function cellRowToCell(cell: CellRow): Cell {
	return {
		position: cell.position as CellPosition,
		goal: cell.goal,
		isAchieved: cell.is_achieved
	};
}

function boardRowToBingoBoard(boardData: BoardWithCells): BingoBoard {
	return {
		id: boardData.id,
		name: boardData.name,
		size: boardData.size as BoardSize,
		cells: (boardData.cells || []).map(cellRowToCell),
		createdAt: new Date(boardData.created_at),
		updatedAt: new Date(boardData.updated_at)
	};
}

function bingoBoardToBoardInsert(board: BingoBoard, userId: string): BoardInsert {
	return {
		id: board.id,
		user_id: userId,
		name: board.name,
		size: board.size,
		created_at: board.createdAt.toISOString(),
		updated_at: board.updatedAt.toISOString()
	};
}

function cellToCellInsert(cell: Cell, boardId: string): CellInsert {
	return {
		board_id: boardId,
		position: cell.position,
		goal: cell.goal,
		is_achieved: cell.isAchieved
	};
}

export function createSupabaseAdapter(
	supabase: SupabaseClient<Database>,
	userId: string
): StorageAdapter {
	return {
		async load(): Promise<AppState | null> {
			try {
				const { data: boardsData, error: boardsError } = await supabase
					.from('boards')
					.select('*, cells(*)')
					.eq('user_id', userId)
					.order('created_at', { ascending: false })
					.returns<BoardWithCells[]>();

				if (boardsError) {
					console.error('Failed to load boards from Supabase:', boardsError);
					return null;
				}

				if (!boardsData || boardsData.length === 0) {
					return {
						boards: [],
						currentBoardId: null,
						isSaving: false
					};
				}

				const boards = boardsData.map(boardRowToBingoBoard);

				return {
					boards,
					currentBoardId: boards.length > 0 ? boards[0].id : null,
					isSaving: false
				};
			} catch (error) {
				console.error('Failed to load from Supabase:', error);
				return null;
			}
		},

		async save(state: AppState): Promise<void> {
			try {
				for (const board of state.boards) {
					await this.saveBoard(board);
				}
			} catch (error) {
				console.error('Failed to save to Supabase:', error);
			}
		},

		async saveBoard(board: BingoBoard): Promise<void> {
			try {
				const boardData = bingoBoardToBoardInsert(board, userId);

				const { error: upsertError } = await supabase
					.from('boards')
					.upsert(boardData, { onConflict: 'id' });

				if (upsertError) {
					console.error('Failed to upsert board:', upsertError);
					return;
				}

				const cellsData = board.cells.map((cell) => cellToCellInsert(cell, board.id));

				const { error: cellsError } = await supabase
					.from('cells')
					.upsert(cellsData, { onConflict: 'board_id,position' });

				if (cellsError) {
					console.error('Failed to upsert cells:', cellsError);
				}
			} catch (error) {
				console.error('Failed to save board to Supabase:', error);
			}
		},

		async deleteBoard(boardId: string): Promise<void> {
			try {
				const { error } = await supabase.from('boards').delete().eq('id', boardId);

				if (error) {
					console.error('Failed to delete board from Supabase:', error);
				}
			} catch (error) {
				console.error('Failed to delete board from Supabase:', error);
			}
		}
	};
}
