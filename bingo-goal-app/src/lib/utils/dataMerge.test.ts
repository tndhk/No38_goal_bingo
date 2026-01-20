import { describe, it, expect } from 'vitest';
import { mergeLocalDataToCloud, getBoardsToUpload } from './dataMerge';
import type { AppState, BingoBoard, BoardSize } from '$lib/types/bingo';
import { MAX_BOARDS } from '$lib/constants/tokens';

// MergeResult型（実装予定）
type MergeResult = {
	state: AppState;
	skippedBoards: BingoBoard[];
};

// ヘルパー関数: モックボード作成
function createMockBoard(overrides: Partial<BingoBoard> = {}): BingoBoard {
	const size: BoardSize = (overrides.size as BoardSize) || 3;
	return {
		id: `board-${Math.random().toString(36).substring(7)}`,
		name: 'Test Board',
		size,
		cells: [],
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
		...overrides
	};
}

// ヘルパー関数: モックAppState作成
function createMockState(boards: BingoBoard[]): AppState {
	return {
		boards,
		currentBoardId: boards[0]?.id || null,
		isSaving: false
	};
}

describe('dataMerge', () => {
	describe('mergeLocalDataToCloud', () => {
		describe('既存の動作（後方互換性）', () => {
			it('ローカルがnullの場合、クラウドを返す', () => {
				const cloudBoard = createMockBoard({ id: 'cloud-1', name: 'Cloud Board' });
				const cloudState = createMockState([cloudBoard]);

				const result = mergeLocalDataToCloud(null, cloudState);

				expect(result.boards).toHaveLength(1);
				expect(result.boards[0].id).toBe('cloud-1');
			});

			it('ローカルが空の場合、クラウドを返す', () => {
				const cloudBoard = createMockBoard({ id: 'cloud-1', name: 'Cloud Board' });
				const cloudState = createMockState([cloudBoard]);
				const localState = createMockState([]);

				const result = mergeLocalDataToCloud(localState, cloudState);

				expect(result.boards).toHaveLength(1);
				expect(result.boards[0].id).toBe('cloud-1');
			});

			it('クラウドがnullの場合、ローカルを返す', () => {
				const localBoard = createMockBoard({ id: 'local-1', name: 'Local Board' });
				const localState = createMockState([localBoard]);

				const result = mergeLocalDataToCloud(localState, null);

				expect(result.boards).toHaveLength(1);
				expect(result.boards[0].id).toBe('local-1');
			});

			it('クラウドが空の場合、ローカルを返す', () => {
				const localBoard = createMockBoard({ id: 'local-1', name: 'Local Board' });
				const localState = createMockState([localBoard]);
				const cloudState = createMockState([]);

				const result = mergeLocalDataToCloud(localState, cloudState);

				expect(result.boards).toHaveLength(1);
				expect(result.boards[0].id).toBe('local-1');
			});

			it('両方nullの場合、空の状態を返す', () => {
				const result = mergeLocalDataToCloud(null, null);

				expect(result.boards).toHaveLength(0);
				expect(result.currentBoardId).toBeNull();
				expect(result.isSaving).toBe(false);
			});

			it('同一IDのボードは重複しない（クラウド優先）', () => {
				const localBoard = createMockBoard({
					id: 'same-id',
					name: 'Local Version',
					updatedAt: new Date('2024-01-01')
				});
				const cloudBoard = createMockBoard({
					id: 'same-id',
					name: 'Cloud Version',
					updatedAt: new Date('2024-01-02')
				});
				const localState = createMockState([localBoard]);
				const cloudState = createMockState([cloudBoard]);

				const result = mergeLocalDataToCloud(localState, cloudState);

				expect(result.boards).toHaveLength(1);
				expect(result.boards[0].name).toBe('Cloud Version');
			});
		});

		describe('MAX_BOARDS制限（新機能）', () => {
			it('制限内なら全ボード保持、skippedBoardsは空', () => {
				// クラウド1個 + ローカル1個 = 2個（MAX_BOARDS=3以下）
				const cloudBoard = createMockBoard({
					id: 'cloud-1',
					name: 'Cloud Board',
					updatedAt: new Date('2024-01-01')
				});
				const localBoard = createMockBoard({
					id: 'local-1',
					name: 'Local Board',
					updatedAt: new Date('2024-01-02')
				});
				const cloudState = createMockState([cloudBoard]);
				const localState = createMockState([localBoard]);

				// 新しい戻り値の型を期待
				const result = mergeLocalDataToCloud(localState, cloudState) as unknown as MergeResult;

				expect(result.state.boards).toHaveLength(2);
				expect(result.skippedBoards).toHaveLength(0);
			});

			it('クラウド2個 + ローカル2個の場合、MAX_BOARDS=3に制限される', () => {
				// クラウドに2個、ローカルに2個（重複なし）= 合計4個
				// MAX_BOARDS=3のため3個に制限
				const cloudBoard1 = createMockBoard({
					id: 'cloud-1',
					name: 'Cloud Board 1',
					updatedAt: new Date('2024-01-04') // 最新
				});
				const cloudBoard2 = createMockBoard({
					id: 'cloud-2',
					name: 'Cloud Board 2',
					updatedAt: new Date('2024-01-01') // 最古
				});
				const localBoard1 = createMockBoard({
					id: 'local-1',
					name: 'Local Board 1',
					updatedAt: new Date('2024-01-03') // 2番目
				});
				const localBoard2 = createMockBoard({
					id: 'local-2',
					name: 'Local Board 2',
					updatedAt: new Date('2024-01-02') // 3番目
				});
				const cloudState = createMockState([cloudBoard1, cloudBoard2]);
				const localState = createMockState([localBoard1, localBoard2]);

				const result = mergeLocalDataToCloud(localState, cloudState) as unknown as MergeResult;

				expect(result.state.boards).toHaveLength(MAX_BOARDS);
				expect(result.skippedBoards).toHaveLength(1);
			});

			it('更新日時が新しいボードが優先される', () => {
				// 全ボードをupdatedAt降順でソートし、新しいものが保持される
				const cloudBoard1 = createMockBoard({
					id: 'cloud-1',
					name: 'Cloud Board 1 (newest)',
					updatedAt: new Date('2024-01-04')
				});
				const cloudBoard2 = createMockBoard({
					id: 'cloud-2',
					name: 'Cloud Board 2 (oldest)',
					updatedAt: new Date('2024-01-01')
				});
				const localBoard1 = createMockBoard({
					id: 'local-1',
					name: 'Local Board 1 (2nd)',
					updatedAt: new Date('2024-01-03')
				});
				const localBoard2 = createMockBoard({
					id: 'local-2',
					name: 'Local Board 2 (3rd)',
					updatedAt: new Date('2024-01-02')
				});
				const cloudState = createMockState([cloudBoard1, cloudBoard2]);
				const localState = createMockState([localBoard1, localBoard2]);

				const result = mergeLocalDataToCloud(localState, cloudState) as unknown as MergeResult;

				// 新しい順に3個保持: cloud-1, local-1, local-2
				const boardIds = result.state.boards.map((b) => b.id);
				expect(boardIds).toContain('cloud-1');
				expect(boardIds).toContain('local-1');
				expect(boardIds).toContain('local-2');
				// 最古のcloud-2がスキップされる
				expect(boardIds).not.toContain('cloud-2');
				expect(result.skippedBoards.map((b) => b.id)).toContain('cloud-2');
			});

			it('MAX_BOARDS定数が3であることを確認', () => {
				expect(MAX_BOARDS).toBe(3);
			});
		});
	});

	describe('getBoardsToUpload', () => {
		describe('既存の動作（後方互換性）', () => {
			it('ローカルがnullの場合、空配列を返す', () => {
				const cloudBoard = createMockBoard({ id: 'cloud-1' });
				const cloudState = createMockState([cloudBoard]);

				const result = getBoardsToUpload(null, cloudState);

				expect(result).toEqual([]);
			});

			it('ローカルが空の場合、空配列を返す', () => {
				const cloudBoard = createMockBoard({ id: 'cloud-1' });
				const cloudState = createMockState([cloudBoard]);
				const localState = createMockState([]);

				const result = getBoardsToUpload(localState, cloudState);

				expect(result).toEqual([]);
			});

			it('クラウドがnullの場合、全ローカルボードを返す', () => {
				const localBoard = createMockBoard({ id: 'local-1' });
				const localState = createMockState([localBoard]);

				const result = getBoardsToUpload(localState, null);

				expect(result).toHaveLength(1);
				expect(result[0].id).toBe('local-1');
			});

			it('クラウドが空の場合、全ローカルボードを返す', () => {
				const localBoard = createMockBoard({ id: 'local-1' });
				const localState = createMockState([localBoard]);
				const cloudState = createMockState([]);

				const result = getBoardsToUpload(localState, cloudState);

				expect(result).toHaveLength(1);
				expect(result[0].id).toBe('local-1');
			});

			it('クラウドに存在しないローカルボードのみを返す', () => {
				const localBoard1 = createMockBoard({ id: 'local-1' });
				const localBoard2 = createMockBoard({ id: 'cloud-1' }); // クラウドと同じID
				const cloudBoard = createMockBoard({ id: 'cloud-1' });
				const localState = createMockState([localBoard1, localBoard2]);
				const cloudState = createMockState([cloudBoard]);

				const result = getBoardsToUpload(localState, cloudState);

				expect(result).toHaveLength(1);
				expect(result[0].id).toBe('local-1');
			});
		});

		describe('MAX_BOARDS制限（新機能）', () => {
			it('クラウドが上限に達している場合は空配列を返す', () => {
				// クラウドに3個（MAX_BOARDS）ある場合、アップロード対象は0個
				const cloudBoard1 = createMockBoard({ id: 'cloud-1' });
				const cloudBoard2 = createMockBoard({ id: 'cloud-2' });
				const cloudBoard3 = createMockBoard({ id: 'cloud-3' });
				const localBoard = createMockBoard({ id: 'local-1' });
				const cloudState = createMockState([cloudBoard1, cloudBoard2, cloudBoard3]);
				const localState = createMockState([localBoard]);

				const result = getBoardsToUpload(localState, cloudState);

				expect(result).toEqual([]);
			});

			it('空きスロット分だけアップロード対象を返す', () => {
				// クラウドに1個なら、残り2個まで
				const cloudBoard = createMockBoard({
					id: 'cloud-1',
					updatedAt: new Date('2024-01-01')
				});
				const localBoard1 = createMockBoard({
					id: 'local-1',
					updatedAt: new Date('2024-01-03') // 新しい
				});
				const localBoard2 = createMockBoard({
					id: 'local-2',
					updatedAt: new Date('2024-01-02') // 中間
				});
				const localBoard3 = createMockBoard({
					id: 'local-3',
					updatedAt: new Date('2024-01-04') // 最新
				});
				const cloudState = createMockState([cloudBoard]);
				const localState = createMockState([localBoard1, localBoard2, localBoard3]);

				const result = getBoardsToUpload(localState, cloudState);

				// 空きスロット: MAX_BOARDS - 1 = 2
				expect(result).toHaveLength(2);
			});

			it('更新日時が新しいボードが優先的にアップロード対象になる', () => {
				const cloudBoard = createMockBoard({
					id: 'cloud-1',
					updatedAt: new Date('2024-01-01')
				});
				const localBoard1 = createMockBoard({
					id: 'local-1',
					name: 'Oldest Local',
					updatedAt: new Date('2024-01-02')
				});
				const localBoard2 = createMockBoard({
					id: 'local-2',
					name: 'Middle Local',
					updatedAt: new Date('2024-01-03')
				});
				const localBoard3 = createMockBoard({
					id: 'local-3',
					name: 'Newest Local',
					updatedAt: new Date('2024-01-04')
				});
				const cloudState = createMockState([cloudBoard]);
				const localState = createMockState([localBoard1, localBoard2, localBoard3]);

				const result = getBoardsToUpload(localState, cloudState);

				// 最新の2個がアップロード対象
				const uploadIds = result.map((b) => b.id);
				expect(uploadIds).toContain('local-3');
				expect(uploadIds).toContain('local-2');
				expect(uploadIds).not.toContain('local-1');
			});
		});
	});
});
