# Contributing Guide

BinGoal! への貢献ガイドです。

## Development Workflow

### 1. 環境セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd bingo-goal-app

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集してSupabase認証情報を設定
```

### 2. 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

### 3. コード変更 → テスト → コミット

```bash
# 型チェック
npm run check

# ユニットテスト
npm run test:unit

# E2Eテスト
npm run test:e2e

# コミット
git add .
git commit -m "feat: 変更内容の説明"
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | 開発サーバーを起動（Vite） |
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルド結果をプレビュー |
| `npm run check` | TypeScript + Svelte 型チェック |
| `npm run check:watch` | 型チェック（ウォッチモード） |
| `npm run test` | ユニットテスト（ウォッチモード） |
| `npm run test:unit` | ユニットテスト（単発実行） |
| `npm run test:e2e` | E2Eテスト（Playwright） |
| `npm run test:e2e:ui` | E2Eテスト（UIモード） |
| `npm run lint` | リンター（未設定） |
| `npm run generate:icons` | アイコン生成スクリプト |

## Environment Variables

`.env.example` を `.env.local` にコピーして設定してください。

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Yes | Supabase プロジェクトURL |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase 匿名キー |
| `PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 測定ID |

### Supabase 設定手順

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. Project Settings > API から URL と anon key を取得
3. `.env.local` に設定
4. Authentication > Providers で Google OAuth を有効化（オプション）

## Testing Procedures

### ユニットテスト

Vitest + Testing Library を使用。

```bash
# ウォッチモード
npm run test

# 単発実行
npm run test:unit

# カバレッジ付き
npm run test:unit -- --coverage
```

テストファイルは `*.test.ts` の命名規則で作成。

### E2Eテスト

Playwright を使用。

```bash
# ヘッドレスモード
npm run test:e2e

# UIモード（デバッグに便利）
npm run test:e2e:ui

# 特定のテストファイル
npx playwright test e2e/board-limit.spec.ts

# デバッグモード
npx playwright test --debug
```

E2Eテストファイルは `e2e/` ディレクトリに配置。

## Project Structure

```
bingo-goal-app/
├── src/
│   ├── routes/           # SvelteKit ページルーティング
│   ├── lib/
│   │   ├── components/   # Svelte コンポーネント
│   │   │   ├── ui/       # 汎用UI（Button, Modal, Dialog等）
│   │   │   └── bingo/    # ビンゴ固有コンポーネント
│   │   ├── stores/       # Svelte ストア（状態管理）
│   │   ├── utils/        # ユーティリティ関数
│   │   ├── types/        # TypeScript 型定義
│   │   ├── constants/    # 定数（MAX_BOARDS等）
│   │   ├── i18n/         # 多言語対応
│   │   ├── supabase/     # Supabase 連携
│   │   └── validation/   # Zod スキーマ
│   └── hooks.server.ts   # サーバーサイド認証
├── e2e/                  # E2Eテスト（Playwright）
├── static/               # 静的アセット
├── docs/                 # ドキュメント
└── scripts/              # ビルドスクリプト
```

## Coding Standards

### TypeScript

- 厳格な型付けを使用
- `any` は避け、適切な型を定義
- Zod でランタイムバリデーション

### Svelte 5

- `$state`, `$derived`, `$effect` を使用
- コンポーネントは小さく保つ（200-400行）

### イミュータビリティ

オブジェクトは常にスプレッド演算子で新規作成:

```typescript
// Good
const newState = { ...state, value: newValue };

// Bad
state.value = newValue;
```

### テスト

- 最低80%のカバレッジ目標
- TDD推奨（テスト先行）
- E2Eはクリティカルフローに限定

## Branch Strategy

- `main`: プロダクション
- `feat/*`: 新機能
- `fix/*`: バグ修正
- `refactor/*`: リファクタリング

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`
