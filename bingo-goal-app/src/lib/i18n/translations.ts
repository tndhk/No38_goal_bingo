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
	seo: {
		title: string;
		description: string;
		ogTitle: string;
		ogDescription: string;
	};
	footer: {
		privacy: string;
		terms: string;
	};
	privacy: {
		title: string;
		lastUpdated: string;
		sections: Array<{ heading: string; content: string }>;
	};
	terms: {
		title: string;
		lastUpdated: string;
		sections: Array<{ heading: string; content: string }>;
	};
	error: {
		notFound: string;
		notFoundDesc: string;
		genericTitle: string;
		genericDesc: string;
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
		},
		seo: {
			title: 'BinGoal! - 目標をビンゴで楽しく達成',
			description: '目標をビンゴ形式で管理するWebアプリ。3x3から5x5のグリッドに目標を設定し、達成するたびにBINGO!演出で楽しく継続。Googleログインでクラウド同期対応。',
			ogTitle: 'BinGoal! - 目標をビンゴで楽しく達成',
			ogDescription: '9つのマスに目標を書いて、達成するたびにビンゴが揃う。楽しく目標管理を始めよう。'
		},
		footer: {
			privacy: 'プライバシーポリシー',
			terms: '利用規約'
		},
		privacy: {
			title: 'プライバシーポリシー',
			lastUpdated: '最終更新日: 2025年1月',
			sections: [
				{
					heading: '1. 収集する情報',
					content: '当サービスでは、Googleアカウントでログインした場合に以下の情報を収集します：メールアドレス、表示名、プロフィール画像URL。これらはユーザー認証とサービス提供のために使用されます。'
				},
				{
					heading: '2. 情報の使用目的',
					content: '収集した情報は、ユーザー認証、ビンゴボードデータのクラウド同期、サービスの改善のために使用されます。'
				},
				{
					heading: '3. データの保存',
					content: 'ユーザーデータはSupabase（PostgreSQL）に安全に保存されます。データは暗号化され、適切なアクセス制御が実施されています。'
				},
				{
					heading: '4. 第三者サービス',
					content: '当サービスは認証にGoogle OAuth、データ保存にSupabaseを使用しています。これらのサービスは各社のプライバシーポリシーに従って運営されています。'
				},
				{
					heading: '5. Cookieの使用',
					content: '当サービスでは認証トークンの保存にCookieを使用します。これはサービスの正常な動作に必要です。'
				},
				{
					heading: '6. お問い合わせ',
					content: 'プライバシーに関するお問い合わせは、GitHubリポジトリのIssueからご連絡ください。'
				}
			]
		},
		terms: {
			title: '利用規約',
			lastUpdated: '最終更新日: 2025年1月',
			sections: [
				{
					heading: '1. サービス概要',
					content: 'BinGoal!は、目標をビンゴ形式で管理するWebアプリケーションです。ユーザーは目標を設定し、達成状況を追跡できます。'
				},
				{
					heading: '2. アカウント',
					content: 'Googleアカウントでログインすることで、データをクラウドに保存できます。ゲストモードではデータはローカルストレージに保存されます。'
				},
				{
					heading: '3. ユーザーの責任',
					content: 'ユーザーは自身のアカウントのセキュリティを維持し、入力するコンテンツに責任を持つものとします。'
				},
				{
					heading: '4. 禁止事項',
					content: 'サービスの悪用、不正アクセス、他のユーザーへの迷惑行為は禁止されています。'
				},
				{
					heading: '5. 免責事項',
					content: '当サービスは現状有姿で提供されます。データの損失や利用に起因する損害について、運営者は責任を負いません。'
				},
				{
					heading: '6. サービスの変更・終了',
					content: '運営者はサービスの内容を予告なく変更、または終了する権利を有します。'
				},
				{
					heading: '7. 準拠法',
					content: '本規約は日本法に準拠し、日本の裁判所を専属的合意管轄裁判所とします。'
				}
			]
		},
		error: {
			notFound: 'ページが見つかりません',
			notFoundDesc: 'お探しのページは存在しないか、移動した可能性があります。',
			genericTitle: 'エラーが発生しました',
			genericDesc: '問題が発生しました。しばらくしてからもう一度お試しください。',
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
		},
		seo: {
			title: 'BinGoal! - Achieve Goals the Bingo Way',
			description: 'A goal management web app with a bingo twist. Set goals in 3x3 to 5x5 grids and celebrate each achievement with BINGO! animations. Cloud sync with Google login.',
			ogTitle: 'BinGoal! - Achieve Goals the Bingo Way',
			ogDescription: 'Write your goals in 9 squares and get BINGO when you achieve them. Start your fun goal journey today.'
		},
		footer: {
			privacy: 'Privacy Policy',
			terms: 'Terms of Service'
		},
		privacy: {
			title: 'Privacy Policy',
			lastUpdated: 'Last updated: January 2025',
			sections: [
				{
					heading: '1. Information We Collect',
					content: 'When you sign in with Google, we collect: email address, display name, and profile picture URL. This information is used for user authentication and service delivery.'
				},
				{
					heading: '2. How We Use Information',
					content: 'Collected information is used for user authentication, cloud synchronization of bingo board data, and service improvement.'
				},
				{
					heading: '3. Data Storage',
					content: 'User data is securely stored in Supabase (PostgreSQL). Data is encrypted and appropriate access controls are implemented.'
				},
				{
					heading: '4. Third-Party Services',
					content: 'Our service uses Google OAuth for authentication and Supabase for data storage. These services operate under their respective privacy policies.'
				},
				{
					heading: '5. Cookies',
					content: 'We use cookies to store authentication tokens. This is necessary for the proper functioning of the service.'
				},
				{
					heading: '6. Contact',
					content: 'For privacy-related inquiries, please contact us through our GitHub repository Issues.'
				}
			]
		},
		terms: {
			title: 'Terms of Service',
			lastUpdated: 'Last updated: January 2025',
			sections: [
				{
					heading: '1. Service Overview',
					content: 'BinGoal! is a web application for managing goals in a bingo format. Users can set goals and track their achievement status.'
				},
				{
					heading: '2. Accounts',
					content: 'By signing in with Google, you can save your data to the cloud. In guest mode, data is saved to local storage.'
				},
				{
					heading: '3. User Responsibilities',
					content: 'Users are responsible for maintaining the security of their accounts and the content they input.'
				},
				{
					heading: '4. Prohibited Activities',
					content: 'Service abuse, unauthorized access, and harassment of other users are prohibited.'
				},
				{
					heading: '5. Disclaimer',
					content: 'The service is provided "as is". We are not responsible for data loss or damages arising from use of the service.'
				},
				{
					heading: '6. Service Changes',
					content: 'We reserve the right to modify or discontinue the service without prior notice.'
				},
				{
					heading: '7. Governing Law',
					content: 'These terms are governed by Japanese law, with Japanese courts having exclusive jurisdiction.'
				}
			]
		},
		error: {
			notFound: 'Page Not Found',
			notFoundDesc: 'The page you are looking for does not exist or has been moved.',
			genericTitle: 'Something Went Wrong',
			genericDesc: 'An error occurred. Please try again later.',
			returnHome: 'Return Home'
		}
	}
};

export function t(locale: Locale): TranslationKeys {
	return translations[locale];
}
