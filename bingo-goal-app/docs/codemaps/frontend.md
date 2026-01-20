# Frontend Codemap

> Freshness: 2026-01-20

## Component Hierarchy

```
+layout.svelte
└── +page.svelte (Main)
    ├── LandingPage (未認証時)
    │   ├── HeroSection
    │   ├── FeaturesSection
    │   └── CTAButtons
    └── App (認証後)
        ├── Header
        │   ├── AuthButton
        │   ├── ThemeSelector
        │   └── LocaleToggle
        ├── ProgressDisplay
        ├── BingoGrid
        │   └── BingoCell (x9〜25)
        ├── GoalInputModal
        ├── Modal
        └── SaveIndicator

boards/+page.svelte
├── BoardList
├── Dialog (削除確認)
└── Modal (新規作成)
```

## Components

### Bingo Components

| Component | Path | Props | Description |
|-----------|------|-------|-------------|
| BingoCell | `bingo/BingoCell.svelte` | cell, isHighlighted, ontap, onlongpress | 単一セル表示 |
| BingoGrid | `bingo/BingoGrid.svelte` | board, onCellTap, onCellLongPress | グリッド全体 |
| BoardList | `bingo/BoardList.svelte` | boards, onSelectBoard, onDeleteBoard | ボード一覧 |
| GoalInputModal | `bingo/GoalInputModal.svelte` | isOpen, position, currentGoal, ... | 目標入力 |
| ProgressDisplay | `bingo/ProgressDisplay.svelte` | achieved, total, bingoCount, ... | 進捗表示 |

### UI Components

| Component | Path | Props | Description |
|-----------|------|-------|-------------|
| Button | `ui/Button.svelte` | variant, disabled, loading | 汎用ボタン |
| Modal | `ui/Modal.svelte` | isOpen, title, variant | モーダル |
| Dialog | `ui/Dialog.svelte` | isOpen, title, message, ... | 確認ダイアログ |
| SaveIndicator | `ui/SaveIndicator.svelte` | isSaving | 保存中表示 |
| AuthButton | `ui/AuthButton.svelte` | - | 認証ボタン |
| ThemeSelector | `ui/ThemeSelector.svelte` | - | テーマ選択 |
| LocaleToggle | `ui/LocaleToggle.svelte` | - | 言語切替 |

## Stores

### boardStore

```typescript
// State
type AppState = {
  boards: BingoBoard[];
  currentBoardId: string | null;
  isSaving: boolean;
};

// Actions
createBoard(name, size?) → CreateBoardResult
updateCell(boardId, position, goal) → UpdateCellResult
toggleAchieved(boardId, position) → void
deleteBoard(boardId) → Promise<void>
setCurrentBoard(boardId) → void
initializeStore() → Promise<void>

// Derived
currentBoard: Readable<BingoBoard | null>
mergeEvents: Writable<MergeEvent | null>
```

### authStore

```typescript
// State
type AuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

// Actions
signInWithGoogle(supabase) → Promise<void>
signOut(supabase) → Promise<void>

// Derived
isAuthenticated: Readable<boolean>
currentUser: Readable<User | null>
```

### themeStore

```typescript
// Themes: aurora, neon, midnight, glass
setTheme(id: ThemeId) → void
currentTheme: Readable<Theme>
```

### localeStore

```typescript
// Locales: ja, en
setLocale(locale: Locale) → void
```

## Routing

| Path | File | Description |
|------|------|-------------|
| `/` | `+page.svelte` | メインページ |
| `/boards` | `boards/+page.svelte` | ボード管理 |
| `/auth/callback` | `auth/callback/+server.ts` | OAuth コールバック |
| `/auth/error` | `auth/error/+page.svelte` | 認証エラー |
| `/privacy` | `privacy/+page.svelte` | プライバシー |
| `/terms` | `terms/+page.svelte` | 利用規約 |

## i18n

```typescript
// Supported: ja, en
t(locale).category.key

Categories:
├── hero, cta, features, preview
├── common, main, boardModal
├── boards, goal, progress
├── auth, seo, footer, privacy
```

## Themes

| ID | Name | Icon | Description |
|----|------|------|-------------|
| aurora | Aurora | 🌌 | Deep cosmic vibes |
| neon | Neon | ⚡ | Cyberpunk night |
| midnight | Midnight | 🌃 | Neon Pop vibes |
| glass | Candy | 🍬 | Sweet & Pop |
