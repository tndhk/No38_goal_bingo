# Architecture Codemap

> Freshness: 2026-01-20

## Overview

BinGoal! は SvelteKit ベースの目標ビンゴ管理Webアプリケーション。

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Svelte Stores   │  │   Components     │                │
│  │  ├─ boardStore   │  │  ├─ BingoGrid    │                │
│  │  ├─ authStore    │  │  ├─ BoardList    │                │
│  │  ├─ themeStore   │  │  └─ UI/*         │                │
│  │  └─ localeStore  │  └──────────────────┘                │
│  └────────┬─────────┘                                      │
│           │                                                 │
│  ┌────────▼─────────┐                                      │
│  │ Storage Adapter  │◄──── Strategy Pattern                │
│  ├──────────────────┤                                      │
│  │ LocalStorage     │  (未ログイン)                        │
│  │ Supabase         │  (ログイン後)                        │
│  └────────┬─────────┘                                      │
└───────────│─────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────┐
│                     Supabase (Backend)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │  PostgreSQL  │  │    RLS       │      │
│  │  (Google)    │  │  boards      │  │  Policies    │      │
│  │              │  │  cells       │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | SvelteKit | v2.49.1 |
| UI | Svelte 5 | v5.45.6 |
| Styling | Tailwind CSS | v4.1.18 |
| Backend | Supabase | - |
| Validation | Zod | v4.3.5 |
| Testing | Vitest + Playwright | v4.0.17 |

## Key Patterns

### Storage Adapter Pattern

```
StorageAdapter (interface)
├── load(): Promise<AppState | null>
├── save(state): Promise<void>
├── saveBoard(board): Promise<void>
└── deleteBoard(boardId): Promise<void>

Implementations:
├── LocalStorageAdapter  → localStorage
└── SupabaseAdapter      → Supabase PostgreSQL
```

### Data Flow

```
User Action
    │
    ▼
boardStore.update()
    │
    ▼
triggerAutoSave() ──► 500ms debounce
    │
    ▼
adapter.save()
    │
    ├── LocalStorage (未ログイン)
    └── Supabase (ログイン後)
```

### Auth Flow

```
1. 未ログイン → LocalStorageAdapter
2. Google Login → Supabase Auth
3. Login Success → SupabaseAdapter + データマージ
4. Logout → LocalStorageAdapter + データクリア
```

## Directory Structure

```
src/
├── routes/               # SvelteKit ルーティング
│   ├── +page.svelte      # メインページ
│   ├── boards/           # ボード管理
│   ├── auth/             # 認証コールバック
│   └── privacy|terms/    # 法的ページ
├── lib/
│   ├── components/       # Svelte コンポーネント
│   ├── stores/           # 状態管理
│   ├── utils/            # ユーティリティ
│   ├── types/            # 型定義
│   ├── i18n/             # 多言語対応
│   ├── themes/           # テーマ定義
│   ├── validation/       # Zodスキーマ
│   ├── constants/        # 定数 (MAX_BOARDS)
│   └── supabase/         # Supabase連携
└── hooks.server.ts       # サーバーサイド認証
```

## Business Rules

| Rule | Value | Location |
|------|-------|----------|
| Max Boards | 3 | `constants/tokens.ts` |
| Goal Max Length | 50 | `validation/schemas.ts` |
| Board Name Max | 100 | `validation/schemas.ts` |
| Auto-save Debounce | 500ms | `stores/boardStore.ts` |
| Board Sizes | 3x3, 4x4, 5x5 | `types/bingo.ts` |
