# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bingo_goal_app - 目標ビンゴ管理Webアプリ。AIPMフレームワークに基づく個人開発プロジェクト。

現在のフェーズ: Delivery（Phase 5 完了 - MVP + 認証/クラウド同期）

## Directory Structure

### ドキュメント
- **Flow/**: 作業中ドキュメント（タイムスタンプ付き: YYYYMM/YYYY-MM-DD/）
  - 1_sense/: マーケット調査
  - 2_focus/: 戦略定義（Lean Canvas, OKR, 市場規模）
  - 3_discovery/: 設計（ペルソナ, 課題定義, ストーリーマップ, UIワイヤーフレーム）
- **Stock/**: 完成ドキュメントのアーカイブ
- **.claude/settings.local.json**: プロジェクト固有のClaude権限設定

### アプリケーション
- **bingo-goal-app/**: SvelteKit アプリケーション
  - src/routes/: ページルーティング
    - +page.svelte: メインページ
    - boards/+page.svelte: ボード管理ページ
    - auth/callback/+server.ts: OAuth コールバック
    - auth/error/+page.svelte: 認証エラーページ
  - src/lib/components/: コンポーネント
    - ui/: 汎用UIコンポーネント（Button, Modal, Dialog, SaveIndicator, AuthButton）
    - bingo/: ビンゴ固有コンポーネント（BingoCell, BingoGrid, GoalInputModal, ProgressDisplay, BoardList）
  - src/lib/stores/: 状態管理
    - boardStore.ts: ボード状態管理（ストレージアダプター対応）
    - authStore.ts: 認証状態管理
  - src/lib/supabase/: Supabase 連携
    - client.ts: Supabaseクライアント生成
    - types.ts: Database型定義（boards, cells テーブル）
  - src/lib/utils/: ユーティリティ
    - storageAdapter.ts: ストレージアダプターインターフェース
    - localStorageAdapter.ts: LocalStorage実装
    - supabaseAdapter.ts: Supabase実装（リレーション一括取得、バッチ保存）
    - dataMerge.ts: ローカル/クラウドデータマージ
    - storage.ts, bingo.ts, celebration.ts
  - src/lib/types/: 型定義（bingo.ts）
  - src/lib/constants/: 定数（tokens.ts）
  - src/lib/actions/: Svelteアクション（longPress）
  - src/hooks.server.ts: サーバーサイド認証処理

## AIPM Workflow

このプロジェクトはAIPM（AI-driven Product Management）スキルを使用:

1. `/aipm-1-initialize` - プロジェクト初期化
2. `/aipm-2-research` - 市場調査・競合分析
3. `/aipm-3-strategy` - 戦略策定（Lean Canvas, OKR）
4. `/aipm-4-design` - 設計（ペルソナ, ストーリーマップ, UI）
5. `/aipm-5-development` - 実装・テスト

## Technical Stack

- Platform: Web（レスポンシブ、モバイルファースト）
- Framework: SvelteKit v2.49.1
- Svelte: v5.45.6
- Build: Vite v7.2.6
- CSS: Tailwind CSS v4.1.18
- Backend: Supabase（認証 + PostgreSQL）
- Test: Vitest v4.0.17 + Testing Library
- Design tokens: Primary #4F46E5, Success #10B981, Incomplete #E5E7EB, Bingo line #FBBF24

## Architecture

### ストレージアダプターパターン
```
StorageAdapter (interface)
├── LocalStorageAdapter  # 未ログイン時: localStorage に保存
└── SupabaseAdapter      # ログイン時: Supabase に保存
```

### 認証フロー
1. 未ログイン → LocalStorageAdapter でローカル保存
2. Google ログイン → Supabase Auth で認証
3. ログイン後 → SupabaseAdapter に切り替え、ローカルデータをマージ

### Supabase テーブル構造
- boards: id, user_id, name, size, created_at, updated_at
- cells: id, board_id, position, goal, is_achieved
- RLS: ユーザーは自分のデータのみアクセス可能

## Development Commands

```bash
cd bingo-goal-app

npm run dev        # 開発サーバー起動（http://localhost:5173）
npm run build      # プロダクションビルド
npm run preview    # ビルド結果のプレビュー
npm run test       # テスト実行（watch モード）
npm run test:unit  # テスト実行（単発）
npm run check      # TypeScript 型チェック
```

## Environment Variables

```bash
# bingo-goal-app/.env.local
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

設定手順:
1. Supabase プロジェクト作成
2. Project Settings > API から URL と anon key を取得
3. `.env.example` を `.env.local` にコピーして値を設定
4. Authentication > Providers で Google OAuth を有効化
