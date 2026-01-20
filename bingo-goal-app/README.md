# BinGoal!

目標ビンゴ管理Webアプリ。ビンゴ形式で目標を設定・達成を追跡できます。

## Features

- 3x3, 4x4, 5x5 のビンゴボードを作成
- 目標の設定と達成状況の管理
- ビンゴ達成時のお祝いアニメーション
- Google認証でクラウド同期
- ダークモード対応
- 多言語対応（日本語/英語）

## Quick Start

```bash
# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集

# 開発サーバーを起動
npm run dev
```

http://localhost:5173 でアプリにアクセス。

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルドプレビュー |
| `npm run check` | TypeScript型チェック |
| `npm run test` | ユニットテスト（watch） |
| `npm run test:unit` | ユニットテスト |
| `npm run test:e2e` | E2Eテスト |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Yes | Supabase URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Anon Key |
| `PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics ID |

## Tech Stack

- SvelteKit v2
- Svelte 5
- TypeScript
- Tailwind CSS v4
- Supabase (Auth + PostgreSQL)
- Vitest + Playwright

## Documentation

- [Contributing Guide](docs/CONTRIB.md) - 開発ワークフロー
- [Runbook](docs/RUNBOOK.md) - デプロイ・運用手順

## License

Private
