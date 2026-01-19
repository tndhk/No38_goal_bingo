# Data Models Codemap

**Last Updated:** 2026-01-19

## Domain Types (src/lib/types/bingo.ts)

### Core Types

```typescript
// ボードサイズ (3x3, 4x4, 5x5)
type BoardSize = 3 | 4 | 5

// セル位置 (テンプレートリテラル)
type CellPosition = `cell_${number}_${number}`
// 例: cell_0_0, cell_1_2, cell_4_4

// セル
type Cell = {
  position: CellPosition
  goal: string        // 目標テキスト
  isAchieved: boolean // 達成フラグ
}

// ビンゴライン
type BingoLine = {
  type: 'row' | 'column' | 'diagonal'
  positions: CellPosition[]
}

// ビンゴボード
type BingoBoard = {
  id: string          // UUID
  name: string        // ボード名
  size: BoardSize     // グリッドサイズ
  cells: Cell[]       // size x size 個のセル
  createdAt: Date
  updatedAt: Date
}

// アプリケーション状態
type AppState = {
  boards: BingoBoard[]
  currentBoardId: string | null
  isSaving: boolean
}
```

### Derived Types

```typescript
// 進捗サマリー
type ProgressSummary = {
  achieved: number    // 達成数
  total: number       // 全セル数
  bingoCount: number  // ビンゴライン数
  isPerfect: boolean  // 全達成フラグ
  hint: string | null // ヒントメッセージ
}
```

## Database Schema (Supabase)

### boards テーブル

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| user_id | UUID | FK → auth.users(id) |
| name | TEXT | NOT NULL |
| size | INTEGER | NOT NULL, CHECK (3,4,5) |
| created_at | TIMESTAMPTZ | default now() |
| updated_at | TIMESTAMPTZ | default now() |

### cells テーブル

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default gen_random_uuid() |
| board_id | UUID | FK → boards(id) ON DELETE CASCADE |
| position | TEXT | NOT NULL |
| goal | TEXT | default '' |
| is_achieved | BOOLEAN | default false |

## Type Mapping

### TypeScript ↔ Database

```
BingoBoard.id        ↔ boards.id
BingoBoard.name      ↔ boards.name
BingoBoard.size      ↔ boards.size
BingoBoard.createdAt ↔ boards.created_at
BingoBoard.updatedAt ↔ boards.updated_at
BingoBoard.cells     ↔ cells[] (via board_id)

Cell.position        ↔ cells.position
Cell.goal            ↔ cells.goal
Cell.isAchieved      ↔ cells.is_achieved
```

### Snake_case ↔ CamelCase 変換

```typescript
// DB → TypeScript
const board: BingoBoard = {
  id: row.id,
  name: row.name,
  size: row.size as BoardSize,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  cells: row.cells.map(c => ({
    position: c.position as CellPosition,
    goal: c.goal,
    isAchieved: c.is_achieved
  }))
}

// TypeScript → DB
const dbBoard = {
  id: board.id,
  name: board.name,
  size: board.size,
  created_at: board.createdAt.toISOString(),
  updated_at: board.updatedAt.toISOString()
}
```

## Data Validation

### Board Creation

```typescript
// サイズ検証
const validSizes: BoardSize[] = [3, 4, 5]
if (!validSizes.includes(size)) {
  throw new Error('Invalid board size')
}

// セル数検証
const expectedCells = size * size
if (cells.length !== expectedCells) {
  throw new Error('Invalid cell count')
}
```

### Cell Position

```typescript
// 位置フォーマット検証
const positionRegex = /^cell_\d+_\d+$/
if (!positionRegex.test(position)) {
  throw new Error('Invalid position format')
}
```

## State Transitions

### Board Lifecycle

```
Create → Edit → Save → Delete
  ↓       ↓      ↓
Empty   Update  Persist
Cells   Cell    to
        Goal/   Storage
        Achieved
```

### Storage State

```
Guest Mode:
  localStorage ──save──→ localStorage

Authenticated Mode:
  localStorage ──merge──→ Supabase
                  ↓
              clear local
                  ↓
  Supabase ←──sync──→ Supabase
```

## Migration (src/lib/utils/migration.ts)

### Legacy Position Format

```typescript
// 旧フォーマット (v1)
const legacyPosition = 'topLeft' | 'topCenter' | ...

// 新フォーマット (v2)
const newPosition = 'cell_0_0' | 'cell_0_1' | ...

// マイグレーション
const positionMap = {
  'topLeft': 'cell_0_0',
  'topCenter': 'cell_0_1',
  // ...
}
```

### Legacy Board Format

```typescript
// 旧フォーマット
{ year: 2024, goals: [...] }

// 新フォーマット
{ name: "2024 Goals", size: 3, cells: [...] }
```
