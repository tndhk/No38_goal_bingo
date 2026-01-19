# Operations Runbook

**Generated from:** package.json, .env.example
**Last Updated:** 2026-01-19

## Deployment Procedures

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase プロジェクト（本番環境用）
- デプロイ先プラットフォーム（Vercel, Netlify, Cloudflare Pages など）

### 1. ビルド

```bash
cd bingo-goal-app
npm ci                 # クリーンインストール
npm run check          # 型チェック
npm run test:unit      # ユニットテスト
npm run build          # プロダクションビルド
```

ビルド成果物は `.svelte-kit/output` に出力されます。

### 2. 環境変数の設定

本番環境で以下の環境変数を設定:

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `PUBLIC_SUPABASE_URL` | Yes | 本番 Supabase URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | 本番 Supabase 匿名キー |

### 3. デプロイ

#### Vercel

```bash
npx vercel --prod
```

または Vercel Dashboard で Git 連携。

#### Netlify

```bash
npx netlify deploy --prod
```

#### 手動デプロイ

1. `npm run build` 実行
2. `build/` ディレクトリを静的ホスティングにアップロード

### 4. デプロイ後確認

- [ ] トップページが表示される
- [ ] Google ログインが機能する
- [ ] ボード作成・編集ができる
- [ ] データがSupabaseに保存される

## Supabase Setup

### 本番環境の準備

1. Supabase Dashboard でプロジェクト作成
2. Authentication > Providers で Google OAuth を有効化
3. Google Cloud Console で OAuth 2.0 クライアントを作成
4. Authorized redirect URIs に `https://<your-domain>/auth/callback` を追加

### データベースマイグレーション

```sql
-- boards テーブル
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  size INTEGER NOT NULL CHECK (size IN (3, 4, 5)),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- cells テーブル
CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  goal TEXT DEFAULT '',
  is_achieved BOOLEAN DEFAULT false
);

-- RLS ポリシー
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own boards"
  ON boards FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access cells of own boards"
  ON cells FOR ALL
  USING (board_id IN (SELECT id FROM boards WHERE user_id = auth.uid()));
```

## Monitoring and Alerts

### ヘルスチェック

- エンドポイント: `/` (トップページ)
- 期待レスポンス: HTTP 200

### Supabase ダッシュボード

- Database > Tables でデータ確認
- Authentication > Users でユーザー一覧
- Logs > API Logs で API リクエストログ

### 監視項目

| 項目 | 閾値 | アクション |
|------|------|----------|
| ページ読み込み時間 | > 3秒 | パフォーマンス調査 |
| API エラー率 | > 1% | ログ確認、Supabase 状態確認 |
| 認証失敗 | 連続5回以上 | OAuth 設定確認 |

## Common Issues and Fixes

### 1. 認証エラー

症状: Google ログイン後に `/auth/error` にリダイレクト

原因と対処:
- Supabase の Google OAuth 設定を確認
- Google Cloud Console の Authorized redirect URIs を確認
- `PUBLIC_SUPABASE_URL` と `PUBLIC_SUPABASE_ANON_KEY` が正しいか確認

### 2. データが保存されない

症状: ボード作成・編集後にデータが消える

原因と対処:
- ブラウザの localStorage が有効か確認（ゲストモード）
- Supabase RLS ポリシーが正しく設定されているか確認
- ブラウザコンソールでエラーを確認

### 3. ビルドエラー

症状: `npm run build` が失敗

原因と対処:
```bash
# 型エラーの場合
npm run check

# 依存関係の問題の場合
rm -rf node_modules package-lock.json
npm install
```

### 4. E2E テスト失敗

症状: Playwright テストがタイムアウト

原因と対処:
```bash
# ブラウザを再インストール
npx playwright install

# デバッグモードで実行
npm run test:e2e:ui
```

## Rollback Procedures

### 1. アプリケーションロールバック

#### Vercel

```bash
# 以前のデプロイにロールバック
vercel rollback
```

または Dashboard > Deployments から以前のデプロイを選択して "Promote to Production"

#### Netlify

Dashboard > Deploys から以前のデプロイを選択して "Publish deploy"

### 2. データベースロールバック

Supabase は自動バックアップを提供（Pro プラン以上）:

1. Dashboard > Database > Backups
2. 復元したいバックアップを選択
3. "Restore" をクリック

手動バックアップ:
```bash
# エクスポート
pg_dump -h <host> -U postgres -d postgres > backup.sql

# インポート
psql -h <host> -U postgres -d postgres < backup.sql
```

### 3. 設定ロールバック

環境変数の変更を元に戻す:

1. デプロイプラットフォームの設定画面を開く
2. 以前の環境変数値に戻す
3. 再デプロイを実行

## Emergency Contacts

- Supabase Status: https://status.supabase.com/
- Vercel Status: https://www.vercel-status.com/
- Netlify Status: https://www.netlifystatus.com/
