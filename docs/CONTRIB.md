# Contributing Guide

**Generated from:** package.json, .env.example
**Last Updated:** 2026-01-19

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase アカウント（認証機能を使用する場合）

## Environment Setup

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd No38_/bingo-goal-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example` を `.env.local` にコピーして値を設定:

```bash
cp .env.example .env.local
```

| 変数名 | 必須 | 説明 | 形式 |
|--------|------|------|------|
| `PUBLIC_SUPABASE_URL` | Yes | Supabase プロジェクト URL | `https://xxxxx.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase 匿名キー | JWT 形式 |
| `PUBLIC_ANALYTICS_ID` | No | アナリティクス ID（将来用） | - |
| `PUBLIC_APP_URL` | No | アプリケーション URL（将来用） | - |

Supabase の設定値は Project Settings > API から取得できます。

## Available Scripts

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 (Vite) - http://localhost:5173 |
| `npm run build` | プロダクションビルド (Vite) |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run prepare` | SvelteKit 同期（自動実行） |
| `npm run check` | TypeScript 型チェック |
| `npm run check:watch` | TypeScript 型チェック（監視モード） |
| `npm run test` | ユニットテスト実行（Vitest 監視モード） |
| `npm run test:unit` | ユニットテスト実行（単発） |
| `npm run test:e2e` | E2E テスト実行（Playwright） |
| `npm run test:e2e:ui` | E2E テスト実行（Playwright UI モード） |
| `npm run lint` | リンター実行（未設定） |

## Development Workflow

### 1. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開く。

### 2. コード変更

- `src/routes/` - ページルーティング
- `src/lib/components/` - Svelte コンポーネント
- `src/lib/stores/` - 状態管理
- `src/lib/utils/` - ユーティリティ関数

### 3. 型チェック

```bash
npm run check
```

### 4. テスト実行

```bash
# ユニットテスト（監視モード）
npm run test

# ユニットテスト（単発）
npm run test:unit

# E2E テスト
npm run test:e2e
```

### 5. ビルド確認

```bash
npm run build && npm run preview
```

## Testing Procedures

### ユニットテスト

- フレームワーク: Vitest
- テストライブラリ: Testing Library (Svelte)
- 場所: `src/**/*.test.ts`

```bash
# 全テスト実行
npm run test:unit

# 特定ファイルのみ
npx vitest run src/lib/utils/bingo.test.ts

# カバレッジ
npx vitest run --coverage
```

### E2E テスト

- フレームワーク: Playwright
- 場所: `tests/` または `e2e/`

```bash
# ヘッドレス実行
npm run test:e2e

# UI モード（インタラクティブ）
npm run test:e2e:ui

# 特定ブラウザのみ
npx playwright test --project=chromium
```

## Tech Stack

| 技術 | バージョン | 用途 |
|------|-----------|------|
| SvelteKit | ^2.49.1 | フレームワーク |
| Svelte | ^5.45.6 | UIライブラリ |
| Vite | ^7.2.6 | ビルドツール |
| Tailwind CSS | ^4.1.18 | スタイリング |
| TypeScript | ^5.9.3 | 型システム |
| Supabase | ^2.90.1 | 認証 + DB |
| Vitest | ^4.0.17 | ユニットテスト |
| Playwright | ^1.57.0 | E2E テスト |

## Code Style

- Svelte 5 の Runes 構文を使用（`$state`, `$derived`, `$effect`）
- イミュータブルな状態更新
- 小さなファイルに分割（200-400行目安）
- エラーハンドリング必須
- 入力バリデーション必須

## Commit Guidelines

Conventional Commits 形式を使用:

```
<type>: <description>

<optional body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`
