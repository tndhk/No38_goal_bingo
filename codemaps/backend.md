# Backend Codemap

**Last Updated:** 2026-01-19

## Overview

バックエンドは主に Supabase (BaaS) に依存。SvelteKit のサーバーサイド機能で認証フローとセキュリティを処理。

## Server-Side Files

### hooks.server.ts
サーバーミドルウェア。全リクエストで実行。

```
機能:
├── Supabase サーバークライアント生成
├── セッション検証 (safeGetSession)
├── event.locals への session/user 設定
└── セキュリティヘッダー追加
    ├── X-Frame-Options: DENY
    ├── X-Content-Type-Options: nosniff
    ├── Referrer-Policy: strict-origin-when-cross-origin
    └── X-XSS-Protection: 1; mode=block
```

### +layout.server.ts
サーバーサイドレイアウトロード。

```
機能:
├── event.locals から session/user 取得
└── クライアントへ渡すデータ返却
```

### auth/callback/+server.ts
OAuth コールバックハンドラ。

```
フロー:
1. URL から code パラメータ取得
2. supabase.auth.exchangeCodeForSession()
3. 成功: ルートへリダイレクト
4. 失敗: /auth/error へリダイレクト
```

## Supabase Integration

### Client Setup (src/lib/supabase/client.ts)

```typescript
// Browser client
createBrowserClient(url, anonKey)

// Server client
createServerClient(url, anonKey, {
  cookies: { get, set, remove }
})
```

### Database Schema

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

## Storage Adapters

### StorageAdapter Interface (src/lib/utils/storageAdapter.ts)

```typescript
interface StorageAdapter {
  load(): Promise<AppState | null>
  save(state: AppState): Promise<void>
  saveBoard(board: BingoBoard): Promise<void>
  deleteBoard(boardId: string): Promise<void>
}
```

### LocalStorageAdapter (src/lib/utils/localStorageAdapter.ts)

```
ストレージキー: bingo-goal-app-state
機能:
├── load(): localStorage から JSON パース
├── save(): JSON シリアライズして保存
├── saveBoard(): フルステート保存
└── deleteBoard(): フルステート保存
```

### SupabaseAdapter (src/lib/utils/supabaseAdapter.ts)

```
機能:
├── load(): boards + cells をリレーション一括取得
├── save(): Promise.allSettled で並列保存
├── saveBoard(): upsert (board + cells)
└── deleteBoard(): カスケード削除
```

## Authentication Flow

```
1. User clicks "Login with Google"
   ↓
2. supabase.auth.signInWithOAuth({ provider: 'google' })
   ↓
3. Redirect to Google → Consent → Callback URL
   ↓
4. /auth/callback receives code
   ↓
5. exchangeCodeForSession() sets cookie
   ↓
6. +layout.ts detects session
   ↓
7. boardStore switches to SupabaseAdapter
   ↓
8. Data merge: local → cloud
```

## Data Merge Logic (src/lib/utils/dataMerge.ts)

```
mergeLocalDataToCloud(local, cloud):
├── local にのみ存在するボードを特定
├── cloud のボードをベースに
├── local 専用ボードを追加
└── currentBoardId は cloud 優先

getBoardsToUpload(local, cloud):
└── local にあって cloud にないボードを返却
```

## API Patterns

### Read (Load)

```typescript
// リレーション一括取得
const { data } = await supabase
  .from('boards')
  .select('*, cells(*)')
  .eq('user_id', userId)
```

### Write (Save)

```typescript
// Board upsert
await supabase
  .from('boards')
  .upsert({ id, user_id, name, size })

// Cells upsert (batch)
await supabase
  .from('cells')
  .upsert(cells.map(c => ({ board_id, ...c })))
```

### Delete

```typescript
// Cascade delete (RLS enforced)
await supabase
  .from('boards')
  .delete()
  .eq('id', boardId)
```
