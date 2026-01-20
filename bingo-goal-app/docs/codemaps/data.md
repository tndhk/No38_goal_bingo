# Data Codemap

> Freshness: 2026-01-20

## Type Definitions

### Core Types

```typescript
// src/lib/types/bingo.ts

type BoardSize = 3 | 4 | 5;

type CellPosition = `cell_${number}_${number}`;

interface Cell {
  position: CellPosition;
  goal: string;
  isAchieved: boolean;
}

interface BingoLine {
  type: 'row' | 'column' | 'diagonal';
  positions: CellPosition[];
}

interface BingoBoard {
  id: string;
  name: string;
  size: BoardSize;
  cells: Cell[];
  createdAt: Date;
  updatedAt: Date;
}

interface AppState {
  boards: BingoBoard[];
  currentBoardId: string | null;
  isSaving: boolean;
}
```

### Store Types

```typescript
// src/lib/stores/boardStore.ts

type CreateBoardResult =
  | { success: true; boardId: string }
  | { success: false; errors: { name?: string; size?: string } };

type UpdateCellResult =
  | { success: true }
  | { success: false; error: string };

type MergeEvent = {
  type: 'MERGE_COMPLETE';
  skippedCount: number;
  skippedBoardNames: string[];
};

type MergeResult = {
  state: AppState;
  skippedBoards: BingoBoard[];
};
```

## Database Schema (Supabase)

### boards テーブル

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default: uuid_generate_v4() |
| user_id | uuid | FK → auth.users, NOT NULL |
| name | text | NOT NULL |
| size | smallint | NOT NULL, CHECK (3,4,5) |
| created_at | timestamptz | default: now() |
| updated_at | timestamptz | default: now() |

### cells テーブル

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default: uuid_generate_v4() |
| board_id | uuid | FK → boards.id ON DELETE CASCADE |
| position | text | NOT NULL |
| goal | text | default: '' |
| is_achieved | boolean | default: false |

### RLS Policies

```sql
-- boards: ユーザーは自分のボードのみアクセス可
CREATE POLICY "Users can CRUD own boards"
  ON boards FOR ALL
  USING (auth.uid() = user_id);

-- cells: ユーザーは自分のボードのセルのみアクセス可
CREATE POLICY "Users can CRUD own cells"
  ON cells FOR ALL
  USING (
    board_id IN (
      SELECT id FROM boards WHERE user_id = auth.uid()
    )
  );
```

## Validation Schemas

```typescript
// src/lib/validation/schemas.ts

goalSchema: z.string()
  .min(1)
  .max(50)
  .transform(val => val.trim());

boardNameSchema: z.string()
  .min(1)
  .max(100)
  .transform(val => val.trim());

boardSizeSchema: z.union([
  z.literal(3),
  z.literal(4),
  z.literal(5)
]);
```

## Constants

```typescript
// src/lib/constants/tokens.ts

MAX_BOARDS = 3  // ボード作成上限
```

## Storage Adapters

### LocalStorageAdapter

```
Key: 'bingo-goal-app-state'
Format: JSON (AppState)
```

### SupabaseAdapter

```
Load:
  1. boards テーブルから user_id でフィルタ
  2. cells をリレーション一括取得
  3. AppState に変換

Save:
  1. boards に upsert
  2. cells を削除 → 再挿入 (バッチ)

Delete:
  1. boards から削除 (CASCADE で cells も削除)
```

## Data Merge Logic

```typescript
// src/lib/utils/dataMerge.ts

mergeLocalDataToCloud(local, cloud, maxBoards):
  1. 両方null → 空のAppState
  2. localがnull/空 → cloudを返す
  3. cloudがnull/空 → localを返す (maxBoards制限)
  4. 両方存在:
     a. 同一IDはクラウド優先
     b. ローカル固有ボードを追加
     c. updatedAt降順でソート
     d. maxBoards個を保持、残りはskippedBoards

getBoardsToUpload(local, cloud, maxBoards):
  1. localがnull/空 → []
  2. cloudが上限 → []
  3. 空きスロット = maxBoards - cloudCount
  4. cloud未存在のローカルボードを新しい順で返す
```

## Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐
│ localStorage│     │  Supabase   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌──────────────────────────────────┐
│         StorageAdapter           │
│  load() / save() / delete()      │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│           boardStore             │
│                                  │
│  ┌─────────────────────────┐    │
│  │       AppState          │    │
│  │  ├─ boards[]            │    │
│  │  ├─ currentBoardId      │    │
│  │  └─ isSaving            │    │
│  └─────────────────────────┘    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│        UI Components             │
│  BingoGrid, BoardList, etc.      │
└──────────────────────────────────┘
```
