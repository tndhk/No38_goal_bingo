import type { Locale } from '$lib/stores/localeStore';

export type TranslationKeys = {
	hero: {
		title: string;
		titleHighlight: string;
		titleSuffix: string;
		subtitle: string;
	};
	cta: {
		googleLogin: string;
		guestMode: string;
		loading: string;
	};
	features: Array<{
		icon: 'grid' | 'star' | 'cloud';
		title: string;
		description: string;
	}>;
	preview: {
		goals: string[];
	};
	common: {
		cancel: string;
		save: string;
		delete: string;
		saving: string;
		backToHome: string;
		manageBoards: string;
	};
	main: {
		startJourney: string;
		createFirstBoardDesc: string;
		createBoard: string;
	};
	boardModal: {
		newBoard: string;
		gridSize: string;
		goals: string;
		defaultName: (year: number) => string;
	};
	boards: {
		myBingoals: string;
		noBoardsYet: string;
		createFirstBoard: string;
		createNewBoard: string;
		deleteBoard: string;
		deleteConfirm: (name: string) => string;
	};
	goal: {
		title: string;
		placeholder: string;
		clear: string;
		achieved: string;
		markAchieved: string;
	};
	progress: {
		achieved: string;
		bingo: string;
		perfect: string;
	};
	auth: {
		errorTitle: string;
		errorDesc: string;
		returnHome: string;
	};
};

const translations: Record<Locale, TranslationKeys> = {
	ja: {
		hero: {
			title: '目標を、',
			titleHighlight: 'ビンゴ',
			titleSuffix: 'で楽しく',
			subtitle: '9つのマスに目標を書くだけ。\n達成するたびにビンゴが揃う。'
		},
		cta: {
			googleLogin: 'Googleでログイン',
			guestMode: 'ゲストで試す',
			loading: '読み込み中...'
		},
		features: [
			{
				icon: 'grid',
				title: '自由な目標設定',
				description: '3x3から5x5まで。仕事、趣味、健康...何でもOK'
			},
			{
				icon: 'star',
				title: 'BINGO!の達成感',
				description: '縦・横・斜めが揃うと演出でお祝い'
			},
			{
				icon: 'cloud',
				title: 'クラウド同期',
				description: 'Googleログインでどこからでもアクセス'
			}
		],
		preview: {
			goals: [
				'本を12冊読む',
				'5km走る',
				'ギターを習う',
				'10万円貯金',
				'BINGO!',
				'新レシピに挑戦',
				'朝のルーティン',
				'日記を書く',
				'毎日瞑想'
			]
		},
		common: {
			cancel: 'キャンセル',
			save: '保存',
			delete: '削除',
			saving: '保存中',
			backToHome: 'ホームに戻る',
			manageBoards: 'ビンゴ管理'
		},
		main: {
			startJourney: '目標を始めよう',
			createFirstBoardDesc: '最初のビンゴボードを作成して、目標達成の旅を始めましょう',
			createBoard: 'ビンゴ作成'
		},
		boardModal: {
			newBoard: '新規ビンゴ',
			gridSize: 'グリッドサイズ',
			goals: '個の目標',
			defaultName: (year: number) => `${year}年の目標`
		},
		boards: {
			myBingoals: 'マイビンゴール',
			noBoardsYet: 'ビンゴがありません',
			createFirstBoard: '最初のビンゴを作成',
			createNewBoard: '+ 新しいビンゴ',
			deleteBoard: 'ビンゴ削除',
			deleteConfirm: (name: string) =>
				`「${name}」を削除しますか？この操作は元に戻せません。`
		},
		goal: {
			title: '目標',
			placeholder: '目標を入力...',
			clear: 'クリア',
			achieved: '達成済み',
			markAchieved: '達成'
		},
		progress: {
			achieved: '達成',
			bingo: 'ビンゴ',
			perfect: 'パーフェクト'
		},
		auth: {
			errorTitle: '認証エラー',
			errorDesc: '問題が発生しました。もう一度お試しください。',
			returnHome: 'ホームに戻る'
		}
	},
	en: {
		hero: {
			title: 'Goals, ',
			titleHighlight: 'Bingo',
			titleSuffix: ' Style',
			subtitle: 'Write your goals in 9 squares.\nComplete them, get BINGO!'
		},
		cta: {
			googleLogin: 'Google Login',
			guestMode: 'Guest Mode',
			loading: 'Loading...'
		},
		features: [
			{
				icon: 'grid',
				title: 'Flexible Goals',
				description: '3x3 to 5x5 grids. Work, hobbies, health - anything goes.'
			},
			{
				icon: 'star',
				title: 'BINGO! Moments',
				description: 'Complete a row, column, or diagonal for celebration effects.'
			},
			{
				icon: 'cloud',
				title: 'Cloud Sync',
				description: 'Sign in with Google to save and access from any device.'
			}
		],
		preview: {
			goals: [
				'Read 12 books',
				'Run 5km',
				'Learn guitar',
				'Save $1000',
				'BINGO!',
				'Cook new recipe',
				'Morning routine',
				'Write journal',
				'Meditate daily'
			]
		},
		common: {
			cancel: 'Cancel',
			save: 'Save',
			delete: 'Delete',
			saving: 'Saving',
			backToHome: 'Back to home',
			manageBoards: 'Manage Boards'
		},
		main: {
			startJourney: 'Start Your Journey',
			createFirstBoardDesc: 'Create your first bingo board and start achieving your goals',
			createBoard: 'Create Board'
		},
		boardModal: {
			newBoard: 'New Board',
			gridSize: 'Grid Size',
			goals: 'goals',
			defaultName: (year: number) => `${year} Goals`
		},
		boards: {
			myBingoals: 'My Bingoals',
			noBoardsYet: 'No Boards Yet',
			createFirstBoard: 'Create Your First Board',
			createNewBoard: '+ Create New Board',
			deleteBoard: 'Delete Board',
			deleteConfirm: (name: string) =>
				`Delete "${name}"? This action cannot be undone.`
		},
		goal: {
			title: 'Goal',
			placeholder: 'Enter your goal...',
			clear: 'Clear',
			achieved: 'Achieved',
			markAchieved: 'Mark achieved'
		},
		progress: {
			achieved: 'achieved',
			bingo: 'BINGO',
			perfect: 'PERFECT'
		},
		auth: {
			errorTitle: 'Authentication Error',
			errorDesc: 'Something went wrong. Please try again.',
			returnHome: 'Return Home'
		}
	}
};

export function t(locale: Locale): TranslationKeys {
	return translations[locale];
}

export default translations;
