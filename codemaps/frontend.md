# Frontend Codemap

**Last Updated:** 2026-01-19

## Component Hierarchy

```
+layout.svelte (Root)
├── Header
│   ├── Brand + Icon
│   ├── SaveIndicator
│   ├── LocaleToggle
│   ├── ThemeSelector
│   └── AuthButton
│
├── +page.svelte (Main)
│   ├── LandingPage (guest view)
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   └── CTAButtons
│   │
│   └── Game View (board selected)
│       ├── Controls (board select, create)
│       ├── BingoGrid
│       │   └── BingoCell[N x N]
│       ├── ProgressDisplay
│       ├── GoalInputModal
│       └── Create Board Dialog
│
└── boards/+page.svelte (Management)
    ├── BoardList
    │   └── BoardCard[...]
    ├── Create Board Dialog
    └── Delete Confirm Dialog
```

## Components

### UI Components (src/lib/components/ui/)

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| Button.svelte | Styled button | variant, size, disabled |
| Modal.svelte | Modal container | isOpen, onClose |
| Dialog.svelte | Confirmation dialog | isOpen, title, callbacks |
| SaveIndicator.svelte | Save status display | isSaving |
| AuthButton.svelte | Login/logout toggle | - |
| LocaleToggle.svelte | Language switcher | - |
| ThemeSelector.svelte | Theme picker | - |

### Bingo Components (src/lib/components/bingo/)

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| BingoGrid.svelte | N x N grid container | board, onCellTap, highlightedPositions |
| BingoCell.svelte | Individual cell | cell, isHighlighted, ontap, onlongpress |
| GoalInputModal.svelte | Goal editor | isOpen, position, currentGoal, callbacks |
| ProgressDisplay.svelte | Stats & badges | achieved, total, bingoCount, hint |
| BoardList.svelte | Board cards list | boards, onSelectBoard, onDeleteBoard |

### Landing Components (src/lib/components/landing/)

| Component | Purpose |
|-----------|---------|
| LandingPage.svelte | Full landing page |
| HeroSection.svelte | Hero with tagline |
| FeaturesSection.svelte | Feature cards |
| CTAButtons.svelte | Call-to-action buttons |

## Stores (src/lib/stores/)

```
boardStore.ts
├── boards: BingoBoard[]
├── currentBoardId: string | null
├── isSaving: boolean
├── Actions: createBoard, updateCell, deleteBoard, etc.
└── Derived: currentBoard

authStore.ts
├── session: Session | null
├── user: User | null
├── Actions: setSession, signIn, signOut
└── Derived: isAuthenticated, currentUser

themeStore.ts
├── themeId: string
└── Derived: currentTheme

localeStore.ts
├── locale: 'ja' | 'en'
└── Provider: t(locale)
```

## Routes

| Route | File | Purpose |
|-------|------|---------|
| / | +page.svelte | Main page (landing/game) |
| /boards | boards/+page.svelte | Board management |
| /auth/callback | auth/callback/+server.ts | OAuth callback |
| /auth/error | auth/error/+page.svelte | Auth error display |

## Styling

### Design Tokens (src/lib/constants/tokens.ts)

```
Primary: #4F46E5 (indigo)
Success: #10B981 (green)
Incomplete: #E5E7EB (gray)
Bingo Line: #FBBF24 (amber)
```

### Theme System (src/lib/themes/)

```
data-theme attribute → CSS variables
├── --theme-primary
├── --theme-surface
├── --theme-text
├── --theme-border
└── etc.
```

## Actions (src/lib/actions/)

| Action | Purpose |
|--------|---------|
| longPress.ts | Long-press gesture detection |

## I18n (src/lib/i18n/)

```
translations.ts
├── ja: Japanese translations
├── en: English translations
└── t(locale): Translation function
```

## Import Graph

```
+page.svelte
├── $lib/stores/boardStore
├── $lib/stores/authStore
├── $lib/components/bingo/*
├── $lib/components/ui/*
├── $lib/components/landing/*
├── $lib/utils/bingo
└── $lib/utils/celebration

BingoGrid.svelte
├── BingoCell.svelte
├── $lib/types/bingo
└── $lib/actions/longPress

boardStore.ts
├── $lib/utils/storageAdapter
├── $lib/utils/localStorageAdapter
├── $lib/utils/supabaseAdapter
├── $lib/utils/dataMerge
└── $lib/types/bingo
```
