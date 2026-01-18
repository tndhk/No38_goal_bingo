import { describe, it, expect } from 'vitest';
import { t } from './translations';
import type { Locale } from '$lib/stores/localeStore';

describe('translations', () => {
	const locales: Locale[] = ['ja', 'en'];

	describe('existing translations', () => {
		it('should have hero translations for both locales', () => {
			expect(t('ja').hero.title).toBeDefined();
			expect(t('en').hero.title).toBeDefined();
		});

		it('should have cta translations for both locales', () => {
			expect(t('ja').cta.googleLogin).toBeDefined();
			expect(t('en').cta.googleLogin).toBeDefined();
		});
	});

	describe('common translations', () => {
		it('should have cancel translation', () => {
			expect(t('ja').common.cancel).toBe('キャンセル');
			expect(t('en').common.cancel).toBe('Cancel');
		});

		it('should have save translation', () => {
			expect(t('ja').common.save).toBe('保存');
			expect(t('en').common.save).toBe('Save');
		});

		it('should have delete translation', () => {
			expect(t('ja').common.delete).toBe('削除');
			expect(t('en').common.delete).toBe('Delete');
		});

		it('should have saving translation', () => {
			expect(t('ja').common.saving).toBe('保存中');
			expect(t('en').common.saving).toBe('Saving');
		});
	});

	describe('main page translations', () => {
		it('should have startJourney translation', () => {
			expect(t('ja').main.startJourney).toBe('目標を始めよう');
			expect(t('en').main.startJourney).toBe('Start Your Journey');
		});

		it('should have createFirstBoardDesc translation', () => {
			expect(t('ja').main.createFirstBoardDesc).toBeDefined();
			expect(t('en').main.createFirstBoardDesc).toBeDefined();
		});

		it('should have createBoard translation', () => {
			expect(t('ja').main.createBoard).toBe('ボード作成');
			expect(t('en').main.createBoard).toBe('Create Board');
		});
	});

	describe('board modal translations', () => {
		it('should have newBoard translation', () => {
			expect(t('ja').boardModal.newBoard).toBe('新規ボード');
			expect(t('en').boardModal.newBoard).toBe('New Board');
		});

		it('should have gridSize translation', () => {
			expect(t('ja').boardModal.gridSize).toBe('グリッドサイズ');
			expect(t('en').boardModal.gridSize).toBe('Grid Size');
		});

		it('should have goals translation', () => {
			expect(t('ja').boardModal.goals).toBe('個の目標');
			expect(t('en').boardModal.goals).toBe('goals');
		});

		it('should have defaultName function', () => {
			expect(t('ja').boardModal.defaultName(2024)).toBe('2024年の目標');
			expect(t('en').boardModal.defaultName(2024)).toBe('2024 Goals');
		});
	});

	describe('boards page translations', () => {
		it('should have myBingoals translation', () => {
			expect(t('ja').boards.myBingoals).toBe('マイビンゴール');
			expect(t('en').boards.myBingoals).toBe('My Bingoals');
		});

		it('should have noBoardsYet translation', () => {
			expect(t('ja').boards.noBoardsYet).toBe('ボードがありません');
			expect(t('en').boards.noBoardsYet).toBe('No Boards Yet');
		});

		it('should have createFirstBoard translation', () => {
			expect(t('ja').boards.createFirstBoard).toBe('最初のボードを作成');
			expect(t('en').boards.createFirstBoard).toBe('Create Your First Board');
		});

		it('should have createNewBoard translation', () => {
			expect(t('ja').boards.createNewBoard).toBe('+ 新しいボード');
			expect(t('en').boards.createNewBoard).toBe('+ Create New Board');
		});

		it('should have deleteBoard translation', () => {
			expect(t('ja').boards.deleteBoard).toBe('ボード削除');
			expect(t('en').boards.deleteBoard).toBe('Delete Board');
		});

		it('should have deleteConfirm function', () => {
			expect(t('ja').boards.deleteConfirm('テスト')).toContain('テスト');
			expect(t('en').boards.deleteConfirm('Test')).toContain('Test');
		});
	});

	describe('goal modal translations', () => {
		it('should have title translation', () => {
			expect(t('ja').goal.title).toBe('目標');
			expect(t('en').goal.title).toBe('Goal');
		});

		it('should have placeholder translation', () => {
			expect(t('ja').goal.placeholder).toBeDefined();
			expect(t('en').goal.placeholder).toBeDefined();
		});

		it('should have clear translation', () => {
			expect(t('ja').goal.clear).toBe('クリア');
			expect(t('en').goal.clear).toBe('Clear');
		});

		it('should have achieved translation', () => {
			expect(t('ja').goal.achieved).toBe('達成済み');
			expect(t('en').goal.achieved).toBe('Achieved');
		});

		it('should have markAchieved translation', () => {
			expect(t('ja').goal.markAchieved).toBe('達成');
			expect(t('en').goal.markAchieved).toBe('Mark achieved');
		});
	});

	describe('progress translations', () => {
		it('should have achieved translation', () => {
			expect(t('ja').progress.achieved).toBe('達成');
			expect(t('en').progress.achieved).toBe('achieved');
		});

		it('should have bingo translation', () => {
			expect(t('ja').progress.bingo).toBe('ビンゴ');
			expect(t('en').progress.bingo).toBe('BINGO');
		});

		it('should have perfect translation', () => {
			expect(t('ja').progress.perfect).toBe('パーフェクト');
			expect(t('en').progress.perfect).toBe('PERFECT');
		});
	});

	describe('auth translations', () => {
		it('should have errorTitle translation', () => {
			expect(t('ja').auth.errorTitle).toBe('認証エラー');
			expect(t('en').auth.errorTitle).toBe('Authentication Error');
		});

		it('should have errorDesc translation', () => {
			expect(t('ja').auth.errorDesc).toBeDefined();
			expect(t('en').auth.errorDesc).toBeDefined();
		});

		it('should have returnHome translation', () => {
			expect(t('ja').auth.returnHome).toBe('ホームに戻る');
			expect(t('en').auth.returnHome).toBe('Return Home');
		});
	});

	describe('all translations complete', () => {
		locales.forEach((locale) => {
			it(`should have all required keys for ${locale}`, () => {
				const trans = t(locale);
				// Existing
				expect(trans.hero).toBeDefined();
				expect(trans.cta).toBeDefined();
				expect(trans.features).toBeDefined();
				expect(trans.preview).toBeDefined();
				// New
				expect(trans.common).toBeDefined();
				expect(trans.main).toBeDefined();
				expect(trans.boardModal).toBeDefined();
				expect(trans.boards).toBeDefined();
				expect(trans.goal).toBeDefined();
				expect(trans.progress).toBeDefined();
				expect(trans.auth).toBeDefined();
			});
		});
	});
});
