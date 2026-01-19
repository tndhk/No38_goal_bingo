# Architecture Codemap

**Last Updated:** 2026-01-19

## Project Overview

SvelteKit ベースの目標ビンゴ管理Webアプリケーション。ストレージアダプターパターンによるオフライン/オンライン対応。

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │ Components  │  │    UI Components    │  │
│  │ +page.svelte│  │  (bingo/)   │  │       (ui/)         │  │
│  │ boards/     │  │ BingoGrid   │  │ Button, Modal       │  │
│  │ auth/       │  │ BingoCell   │  │ Dialog, SaveIndicator│ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      State Management                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ boardStore  │  │  authStore  │  │ themeStore/locale   │  │
│  │  (CRUD)     │  │ (session)   │  │   (preferences)     │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │
└─────────┼────────────────┼──────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Storage Abstraction                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              StorageAdapter (interface)                 │ │
│  │  ┌─────────────────────┐  ┌─────────────────────────┐  │ │
│  │  │ LocalStorageAdapter │  │    SupabaseAdapter      │  │ │
│  │  │   (offline/guest)   │  │   (authenticated)       │  │ │
│  │  └─────────────────────┘  └─────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                     External Services                        │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │     localStorage    │  │         Supabase            │   │
│  │    (browser API)    │  │   (Auth + PostgreSQL)       │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
bingo-goal-app/src/
├── routes/                    # SvelteKit pages
│   ├── +layout.svelte        # Root layout (header, auth)
│   ├── +layout.ts            # Client-side load
│   ├── +layout.server.ts     # Server-side load
│   ├── +page.svelte          # Main page
│   ├── boards/+page.svelte   # Board management
│   └── auth/
│       ├── callback/         # OAuth callback
│       └── error/            # Auth error
├── lib/
│   ├── components/
│   │   ├── ui/               # Generic UI
│   │   ├── bingo/            # Domain-specific
│   │   └── landing/          # Landing page
│   ├── stores/               # State management
│   ├── utils/                # Business logic
│   ├── supabase/             # Supabase client
│   ├── types/                # TypeScript types
│   ├── themes/               # Theme definitions
│   ├── i18n/                 # Internationalization
│   ├── constants/            # Design tokens
│   └── actions/              # Svelte actions
└── hooks.server.ts           # Server middleware
```

## Key Patterns

### 1. Storage Adapter Pattern
インターフェースによる抽象化でオフライン/オンラインを透過的に切り替え

### 2. Debounced Auto-Save
500ms デバウンスで自動保存、UI に保存状態を表示

### 3. Reactive State (Svelte 5)
`$state`, `$derived`, `$effect` による宣言的な状態管理

### 4. CSS Variable Theming
`data-theme` 属性と CSS 変数によるインスタントテーマ切り替え

### 5. Immutable Updates
スプレッド演算子による不変更新パターン

## Data Flow

```
User Action → Store Update → Debounce → Storage Adapter → Persist
                    ↓
              Derived Stores → Component Re-render
```

## Security Measures

- Server-side session validation (hooks.server.ts)
- Row Level Security (Supabase RLS)
- CSRF protection
- Security headers (X-Frame-Options, CSP, etc.)
