# bingo_goal_app 総合開発仕様書

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | bingo_goal_app |
| 概要 | 目標ビンゴ管理Webアプリ |
| MVPリリース | 2026-01-31（完了） |
| プラットフォーム | Web（レスポンシブ、モバイルファースト） |
| フレームワーク | SvelteKit v2.49.1 |
| 現在のフェーズ | MVP + 認証/クラウド同期 完了 |

## 2. 技術スタック

### フロントエンド
- フレームワーク: SvelteKit v2.49.1
- Svelte: v5.45.6
- スタイリング: Tailwind CSS v4.1.18
- 状態管理: Svelte Store（$state, $derived）
- アニメーション: CSS Animations + canvas-confetti

### バックエンド/データ永続化
- 認証: Supabase Auth（Google OAuth）
- データベース: Supabase PostgreSQL
- ローカル: LocalStorage（未ログイン時）

### 開発環境
- 言語: TypeScript
- ビルド: Vite v7.2.6
- テスト: Vitest v4.0.17 + Testing Library
- Linter: ESLint
- Formatter: Prettier
- パッケージマネージャー: npm

## 3. デザイントークン

```typescript
const tokens = {
  colors: {
    primary: '#4F46E5',     // メインカラー（紫）
    secondary: '#10B981',   // サブカラー（緑）
    background: '#F9FAFB',  // 背景
    text: '#1F2937',        // テキスト
    achieved: '#10B981',    // 達成マス
    unachieved: '#E5E7EB',  // 未達成マス
    bingoLine: '#FBBF24',   // ビンゴライン
  },
  typography: {
    heading: { size: '24px', weight: 'bold' },
    body: { size: '16px', weight: 'regular' },
    caption: { size: '14px', weight: 'regular' },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1024px',
  },
};
```

## 4. データモデル

### 型定義

```typescript
// 年度
type Year = number; // 2025, 2026, ...

// マス位置
type CellPosition =
  | 'topLeft' | 'topCenter' | 'topRight'
  | 'middleLeft' | 'middleCenter' | 'middleRight'
  | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

// マス
interface Cell {
  position: CellPosition;
  goal: string;           // 目標テキスト（最大50文字）
  isAchieved: boolean;    // 達成状態
}

// ビンゴボード
interface BingoBoard {
  id: string;             // UUID
  year: Year;
  cells: Cell[];          // 9マス
  createdAt: Date;
  updatedAt: Date;
}

// ビンゴライン
type BingoLine =
  | 'row1' | 'row2' | 'row3'      // 横
  | 'col1' | 'col2' | 'col3'      // 縦
  | 'diag1' | 'diag2';            // 斜め

// アプリ状態
interface AppState {
  boards: BingoBoard[];
  currentBoardId: string | null;
  isSaving: boolean;
}
```

### LocalStorageスキーマ

```json
{
  "bingo_goal_app": {
    "boards": [...],
    "currentBoardId": "uuid",
    "version": "1.0"
  }
}
```

### Supabaseスキーマ

```sql
-- boards テーブル
CREATE TABLE boards (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- cells テーブル
CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  goal TEXT DEFAULT '',
  is_achieved BOOLEAN DEFAULT FALSE,
  UNIQUE(board_id, position)
);

-- インデックス
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_cells_board_id ON cells(board_id);

-- RLS（Row Level Security）
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own boards" ON boards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage cells of own boards" ON cells
  FOR ALL USING (board_id IN (SELECT id FROM boards WHERE user_id = auth.uid()));
```

## 4.5. アーキテクチャ

### ストレージアダプターパターン

```
StorageAdapter (interface)
├── load(): Promise<AppState | null>
├── save(state: AppState): Promise<void>
├── saveBoard(board: BingoBoard): Promise<void>
└── deleteBoard(boardId: string): Promise<void>

実装:
├── LocalStorageAdapter  # 未ログイン時
└── SupabaseAdapter      # ログイン時
```

### 認証フロー

```
1. 未ログイン
   └── LocalStorageAdapter でローカル保存

2. Google ログイン
   └── Supabase Auth で OAuth 認証

3. ログイン成功
   ├── SupabaseAdapter に切り替え
   ├── ローカルデータとクラウドデータをマージ
   └── マージ結果をクラウドに保存

4. ログアウト
   └── LocalStorageAdapter に戻す
```

### パフォーマンス最適化

- N+1問題対策: `select('*, cells(*)')` でリレーション一括取得
- バッチ保存: cells配列を一括upsert
- デバウンス: 500msで自動保存をバッチ化

## 5. 画面仕様

### SC001: ホーム画面（ビンゴボード）

**URL:** `/`

**コンポーネント構成:**
```
+----------------------------------+
|  [Logo]  [YearSelector]  [設定]  |  <- Header
+----------------------------------+
|                                  |
|   +-----+  +-----+  +-----+     |
|   |  1  |  |  2  |  |  3  |     |
|   +-----+  +-----+  +-----+     |
|   +-----+  +-----+  +-----+     |  <- BingoGrid
|   |  4  |  |  5  |  |  6  |     |
|   +-----+  +-----+  +-----+     |
|   +-----+  +-----+  +-----+     |
|   |  7  |  |  8  |  |  9  |     |
|   +-----+  +-----+  +-----+     |
|                                  |
|   5/9 達成  |  あと1マスでビンゴ! |  <- ProgressDisplay
|                                  |
+----------------------------------+
|  [新規作成]        [削除]        |  <- Footer
+----------------------------------+
```

**インタラクション:**
- マスをタップ → GoalInputModal表示
- マスを長押し → 達成/未達成トグル
- 年度セレクター → 年度切替 / BoardList表示

### SC002: 目標入力モーダル

**タイプ:** Modal

**コンポーネント構成:**
```
+---------------------------+
|  目標を入力 - 左上のマス   |
+---------------------------+
|                           |
|  +---------------------+  |
|  | テキスト入力         |  |
|  | (最大50文字)        |  |
|  +---------------------+  |
|  残り: 35文字             |
|                           |
+---------------------------+
|  [クリア] [キャンセル] [保存] |
+---------------------------+
```

### SC003: ビンゴ達成オーバーレイ

**タイプ:** Overlay

**表示条件:** ビンゴライン成立時

**演出:**
1. オーバーレイ背景（半透明黒）
2. 「BINGO!」テキスト（大きく、中央）
3. 紙吹雪パーティクル
4. 光るエフェクト
5. 複数ビンゴ時：「ダブルビンゴ達成!」
6. 全達成時：「PERFECT!」

### SC004: 年度選択画面

**URL:** `/boards`

**コンポーネント構成:**
```
+----------------------------------+
|  [戻る]    年度一覧              |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  |  2026年                    |  |
|  |  5/9達成  2BINGO!         |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  |  2025年                    |  |
|  |  9/9達成  PERFECT!        |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
|         [+ 新しい年度を作成]     |
+----------------------------------+
```

### SC005: 削除確認ダイアログ

**タイプ:** Dialog

```
+---------------------------+
|  ボードを削除しますか?     |
|                           |
|  2026年のビンゴボードを    |
|  削除します。              |
|  この操作は取り消せません。 |
|                           |
|  [キャンセル]    [削除]    |
+---------------------------+
```

## 6. コンポーネント仕様

### BingoGrid

**Props:**
```typescript
interface BingoGridProps {
  board: BingoBoard;
  onCellTap: (position: CellPosition) => void;
  onCellLongPress: (position: CellPosition) => void;
  highlightedLines: BingoLine[];
}
```

**責務:**
- 3x3グリッドのレンダリング
- 各マスの目標テキスト表示
- 達成/未達成の視覚的区別
- ビンゴラインのハイライト

### BingoCell

**Props:**
```typescript
interface BingoCellProps {
  cell: Cell;
  isHighlighted: boolean;
  onTap: () => void;
  onLongPress: () => void;
}
```

### GoalInputModal

**Props:**
```typescript
interface GoalInputModalProps {
  isOpen: boolean;
  position: CellPosition;
  currentGoal: string;
  onSave: (goal: string) => void;
  onClear: () => void;
  onClose: () => void;
}
```

### ProgressDisplay

**Props:**
```typescript
interface ProgressDisplayProps {
  achieved: number;      // 達成数
  total: number;         // 総マス数（9）
  bingoCount: number;    // ビンゴ数
  nearBingoHint: string | null;  // "あと1マスでビンゴ！"
}
```

### BingoCelebration

**Props:**
```typescript
interface BingoCelebrationProps {
  isVisible: boolean;
  bingoCount: number;
  isPerfect: boolean;
  onClose: () => void;
}
```

## 7. ビンゴ判定ロジック

```typescript
const BINGO_PATTERNS: Record<BingoLine, CellPosition[]> = {
  row1: ['topLeft', 'topCenter', 'topRight'],
  row2: ['middleLeft', 'middleCenter', 'middleRight'],
  row3: ['bottomLeft', 'bottomCenter', 'bottomRight'],
  col1: ['topLeft', 'middleLeft', 'bottomLeft'],
  col2: ['topCenter', 'middleCenter', 'bottomCenter'],
  col3: ['topRight', 'middleRight', 'bottomRight'],
  diag1: ['topLeft', 'middleCenter', 'bottomRight'],
  diag2: ['topRight', 'middleCenter', 'bottomLeft'],
};

function checkBingo(cells: Cell[]): BingoLine[] {
  const achievedPositions = new Set(
    cells.filter(c => c.isAchieved).map(c => c.position)
  );

  return Object.entries(BINGO_PATTERNS)
    .filter(([_, positions]) =>
      positions.every(pos => achievedPositions.has(pos))
    )
    .map(([line]) => line as BingoLine);
}
```

## 8. 受け入れ基準サマリー

### MVP必須機能

| 機能 | 受け入れ基準 | 状態 |
|------|------------|------|
| ボード作成 | 名前を入力して3x3/4x4/5x5ボードを生成 | 完了 |
| 目標入力 | マスタップで50文字まで入力可能 | 完了 |
| 達成マーク | 長押しでトグル、色が変わる | 完了 |
| 進捗表示 | X/N達成、ヒント表示 | 完了 |
| ビンゴ演出 | 揃った時にアニメーション | 完了 |
| 自動保存 | 変更が即座にLocalStorageに保存 | 完了 |
| ボード切替 | 複数ボードの管理 | 完了 |
| ボード削除 | 確認後に削除可能 | 完了 |

### 認証・クラウド同期機能

| 機能 | 受け入れ基準 | 状態 |
|------|------------|------|
| Googleログイン | OAuth認証でログイン可能 | 完了 |
| クラウド保存 | ログイン時はSupabaseに保存 | 完了 |
| データマージ | ローカル/クラウドデータを統合 | 完了 |
| アダプター切替 | 認証状態に応じて自動切替 | 完了 |

### 非機能要件

| 項目 | 基準 | 状態 |
|------|------|------|
| レスポンシブ | 375px〜1024px+対応 | 完了 |
| パフォーマンス | 初回ロード3秒以内 | 完了 |
| オフライン | LocalStorageで動作 | 完了 |
| アクセシビリティ | キーボード操作対応 | 完了 |
| N+1対策 | リレーション一括取得 | 完了 |
| バッチ保存 | cells一括upsert | 完了 |

## 9. テスト観点

### ユニットテスト
- ビンゴ判定ロジック
- 進捗計算
- LocalStorage操作

### 統合テスト
- ボード作成〜目標入力〜達成フロー
- 年度切替
- データ永続化

### E2Eテスト
- ユーザーシナリオ全体
- モバイル/デスクトップ表示
