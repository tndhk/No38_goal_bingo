# LP化実装計画: bingo-goal-app トップページ

## 概要
トップページ（/）を認証状態に応じてLP/アプリを切り替える。

- 未ログイン + ボードなし → LP表示
- ログイン済み or ボードあり → 既存アプリ表示

## 設計方針
- kaku.today を参考にしたミニマリストデザイン
- 既存テーマシステム（Aurora/Neon/Midnight/Candy）活用
- シンプルスイッチ方式（条件分岐）で実装

---

## ファイル構成

```
src/lib/components/landing/   # 新規作成
├── LandingPage.svelte        # LP全体コンテナ
├── HeroSection.svelte        # ヒーロー（キャッチ+CTA）
├── FeaturesSection.svelte    # 機能紹介
└── CTAButtons.svelte         # CTAボタン群

src/routes/+page.svelte       # 条件分岐追加（既存）
```

---

## LP構成

### ヒーローセクション
- メインキャッチ: 「目標を、ビンゴで楽しく」
- サブコピー: 「9つのマスに目標を書くだけ。達成するたびにビンゴが揃う。」
- CTA: 「Googleでログイン」「ゲストで試す」
- ビンゴグリッドプレビュー（デモ用静的データ）

### 機能紹介セクション（3つ）
1. 自由な目標設定 - 3x3から5x5まで
2. ビンゴで達成感 - BINGO!演出
3. クラウド同期 - Google連携で安全保存

---

## 実装ステップ

| # | タスク |
|---|--------|
| 1 | landing/ ディレクトリ作成 |
| 2 | CTAButtons.svelte 作成 |
| 3 | HeroSection.svelte 作成 |
| 4 | FeaturesSection.svelte 作成 |
| 5 | LandingPage.svelte 作成 |
| 6 | +page.svelte に条件分岐追加 |
| 7 | スタイル調整・レスポンシブ |
| 8 | アニメーション微調整 |

---

## 条件分岐ロジック（+page.svelte）

```svelte
{#if authenticated || boards.length > 0}
  <!-- 既存アプリUI -->
{:else}
  <LandingPage {supabase} onCreateBoard={openNameDialog} />
{/if}
```

---

## テーマ対応
- LP表示時もThemeSelectorを配置
- テーマカスタマイズ可能なことをデモ

---

## CTA動作

### Googleでログイン
既存の `signInWithGoogle(supabase)` を呼び出し

### ゲストで試す
`onCreateBoard()` → 既存のボード作成ダイアログを開く
→ LocalStorageAdapterでローカル保存
→ アプリUIに切り替わる

---

## アニメーション
- ヒーロー: fly (y: 20) + stagger delay
- 機能紹介: IntersectionObserverでスクロール連動フェードイン
- 既存の `.orb` 背景アニメーション再利用

---

## Critical Files

- `src/routes/+page.svelte` - 条件分岐追加
- `src/lib/stores/authStore.ts` - isAuthenticated参照
- `src/lib/components/ui/AuthButton.svelte` - Googleログイン処理パターン
- `src/app.css` - テーマ変数定義
- `src/lib/themes/index.ts` - テーマ定義

---

## 検証方法

1. `npm run dev` で開発サーバー起動
2. 未ログイン状態でLP表示確認
3. 「ゲストで試す」→ ボード作成 → アプリUI表示
4. テーマ切り替えがLPに反映されることを確認
5. 各テーマでの表示確認
6. モバイルレスポンシブ確認
