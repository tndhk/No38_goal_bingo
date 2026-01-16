# bingo_goal_app 開発ランブック

LLM（Claude Code）が実装時に参照するガイド

## 実装開始前チェックリスト

1. [ ] `dev_tasks.yaml` でタスクステータスを確認
2. [ ] 依存タスクが完了しているか確認
3. [ ] `total_development_spec.md` で仕様を確認
4. [ ] 関連する画面定義・コンポーネント仕様を把握

## フェーズ別実装ガイド

### Phase 1: 基盤構築

#### FND001-T1: 技術選定

**判断基準:**

| 観点 | SvelteKit | Next.js |
|------|-----------|---------|
| 学習コスト | 低（シンプル） | 中 |
| バンドルサイズ | 小 | 中 |
| エコシステム | 成長中 | 成熟 |
| 状態管理 | 組み込み | 追加ライブラリ必要 |
| 本プロジェクト適性 | 高（シンプルなSPA） | 中 |

**推奨:** SvelteKit（理由: 小規模SPA、組み込み状態管理、軽量）

**実行コマンド例（SvelteKit）:**
```bash
pnpm create svelte@latest bingo-goal-app
# 選択: Skeleton project, TypeScript, ESLint, Prettier, Playwright
cd bingo-goal-app
pnpm install
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### FND001-T2: ディレクトリ構成

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           # 汎用UI（Button, Modal, Dialog）
│   │   ├── bingo/        # ビンゴ固有（Grid, Cell, Celebration）
│   │   └── layout/       # レイアウト（Header, Footer）
│   ├── stores/           # Svelte Stores
│   ├── types/            # TypeScript型定義
│   ├── utils/            # ユーティリティ関数
│   └── constants/        # 定数（デザイントークン等）
├── routes/
│   ├── +page.svelte      # ホーム（ビンゴボード）
│   ├── +layout.svelte    # 共通レイアウト
│   └── boards/
│       └── +page.svelte  # ボード一覧
└── app.css               # グローバルスタイル
```

#### FND001-T3: デザイントークン

**ファイル:** `src/lib/constants/tokens.ts`

```typescript
export const colors = {
  primary: '#4F46E5',
  secondary: '#10B981',
  background: '#F9FAFB',
  text: '#1F2937',
  achieved: '#10B981',
  unachieved: '#E5E7EB',
  bingoLine: '#FBBF24',
} as const;

export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
} as const;
```

**tailwind.config.js拡張:**
```javascript
theme: {
  extend: {
    colors: {
      primary: '#4F46E5',
      achieved: '#10B981',
      unachieved: '#E5E7EB',
      'bingo-line': '#FBBF24',
    },
  },
},
```

### Phase 2: コア機能

#### ST001: ボード作成

**実装順序:**
1. 型定義（`src/lib/types/bingo.ts`）
2. ストア（`src/lib/stores/boardStore.ts`）
3. BingoGrid（`src/lib/components/bingo/BingoGrid.svelte`）
4. BingoCell（`src/lib/components/bingo/BingoCell.svelte`）

**型定義の注意点:**
```typescript
// 位置は配列インデックスではなくenumで管理
// これにより、ビンゴ判定ロジックが直感的になる
type CellPosition =
  | 'topLeft' | 'topCenter' | 'topRight'
  | 'middleLeft' | 'middleCenter' | 'middleRight'
  | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
```

**ストア実装パターン:**
```typescript
// src/lib/stores/boardStore.ts
import { writable, derived } from 'svelte/store';

function createBoardStore() {
  const { subscribe, set, update } = writable<AppState>({
    boards: [],
    currentBoardId: null,
    isSaving: false,
  });

  return {
    subscribe,
    createBoard: (year: number) => update(state => {
      const newBoard = createEmptyBoard(year);
      return {
        ...state,
        boards: [...state.boards, newBoard],
        currentBoardId: newBoard.id,
      };
    }),
    // ... other methods
  };
}

export const boardStore = createBoardStore();
export const currentBoard = derived(boardStore, $state =>
  $state.boards.find(b => b.id === $state.currentBoardId) ?? null
);
```

#### ST005: 目標入力

**モーダル実装ポイント:**
- アクセシビリティ: `aria-modal`, `role="dialog"`
- フォーカストラップ: モーダル内にフォーカスを閉じ込める
- 文字数カウント: リアルタイム表示

```svelte
<!-- GoalInputModal.svelte -->
<script lang="ts">
  export let isOpen = false;
  export let position: CellPosition;
  export let currentGoal = '';

  let inputValue = currentGoal;
  const MAX_LENGTH = 50;

  $: remaining = MAX_LENGTH - inputValue.length;
</script>

{#if isOpen}
  <div class="modal-backdrop" on:click={close}>
    <div class="modal" role="dialog" aria-modal="true">
      <input
        bind:value={inputValue}
        maxlength={MAX_LENGTH}
        placeholder="目標を入力..."
      />
      <span class:warning={remaining < 10}>
        残り: {remaining}文字
      </span>
    </div>
  </div>
{/if}
```

#### ST010: 自動保存

**デバウンス実装:**
```typescript
// src/lib/utils/storage.ts
const STORAGE_KEY = 'bingo_goal_app';
const DEBOUNCE_MS = 500;

let saveTimeout: number | null = null;

export function saveToStorage(state: AppState): void {
  if (saveTimeout) clearTimeout(saveTimeout);

  boardStore.update(s => ({ ...s, isSaving: true }));

  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        boards: state.boards,
        currentBoardId: state.currentBoardId,
        version: '1.0',
      }));
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      boardStore.update(s => ({ ...s, isSaving: false }));
    }
  }, DEBOUNCE_MS);
}
```

### Phase 3: 達成機能

#### ST006: 達成マーク

**長押し判定:**
```typescript
// src/lib/utils/longPress.ts
export function longPress(node: HTMLElement, duration = 500) {
  let timer: number;

  function handleMouseDown() {
    timer = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress'));
    }, duration);
  }

  function handleMouseUp() {
    clearTimeout(timer);
  }

  node.addEventListener('mousedown', handleMouseDown);
  node.addEventListener('mouseup', handleMouseUp);
  node.addEventListener('touchstart', handleMouseDown);
  node.addEventListener('touchend', handleMouseUp);

  return {
    destroy() {
      // cleanup
    },
  };
}
```

### Phase 4: ビンゴ演出

#### ST008: ビンゴ判定

**判定ロジック（純粋関数）:**
```typescript
// src/lib/utils/bingoChecker.ts
export const BINGO_PATTERNS: Record<BingoLine, CellPosition[]> = {
  row1: ['topLeft', 'topCenter', 'topRight'],
  row2: ['middleLeft', 'middleCenter', 'middleRight'],
  row3: ['bottomLeft', 'bottomCenter', 'bottomRight'],
  col1: ['topLeft', 'middleLeft', 'bottomLeft'],
  col2: ['topCenter', 'middleCenter', 'bottomCenter'],
  col3: ['topRight', 'middleRight', 'bottomRight'],
  diag1: ['topLeft', 'middleCenter', 'bottomRight'],
  diag2: ['topRight', 'middleCenter', 'bottomLeft'],
};

export function checkBingo(cells: Cell[]): BingoLine[] {
  const achieved = new Set(
    cells.filter(c => c.isAchieved).map(c => c.position)
  );

  return (Object.entries(BINGO_PATTERNS) as [BingoLine, CellPosition[]][])
    .filter(([, positions]) => positions.every(p => achieved.has(p)))
    .map(([line]) => line);
}

export function getNearBingoHint(cells: Cell[]): string | null {
  const achieved = new Set(
    cells.filter(c => c.isAchieved).map(c => c.position)
  );

  for (const [line, positions] of Object.entries(BINGO_PATTERNS)) {
    const count = positions.filter(p => achieved.has(p)).length;
    if (count === 2) {
      return 'あと1マスでビンゴ!';
    }
  }
  return null;
}
```

**紙吹雪アニメーション:**
- 軽量ライブラリ: `canvas-confetti`（推奨）
- または CSS @keyframes で自作

```typescript
// confetti使用例
import confetti from 'canvas-confetti';

export function celebrate() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}
```

## タスク完了チェックリスト

各タスク完了時に確認:

1. [ ] 受け入れ基準を全て満たしている
2. [ ] TypeScript型エラーなし
3. [ ] ESLint警告なし
4. [ ] モバイル表示で確認
5. [ ] `dev_tasks.yaml` のstatusを `completed` に更新

## トラブルシューティング

| 問題 | 対処 |
|------|------|
| LocalStorage容量超過 | 古いボードの自動削除検討 |
| 長押しがタップと競合 | タイマーとpreventDefault調整 |
| モーダルの背景スクロール | body overflow: hidden |
| アニメーションがカクつく | will-change, transform使用 |

## コミット規約

```
feat: 機能追加
fix: バグ修正
style: スタイル変更
refactor: リファクタリング
docs: ドキュメント
test: テスト
```

例:
```
feat(ST001): ビンゴボード作成機能を実装

- BingoGrid, BingoCellコンポーネント追加
- boardStore実装
- 年度選択UI追加
```
