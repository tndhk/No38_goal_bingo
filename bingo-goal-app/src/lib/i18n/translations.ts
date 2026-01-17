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
		}
	}
};

export function t(locale: Locale): TranslationKeys {
	return translations[locale];
}

export default translations;
