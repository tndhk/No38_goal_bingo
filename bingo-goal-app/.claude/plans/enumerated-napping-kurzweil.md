# LP テキスト修正 - アプリ名 & プレビューラベル

## 概要
- アプリ名を「Bingo Planner」から「BinGoal!」に変更
- プレビューグリッド下のラベル（「サンプルボード」）を削除

---

## 変更内容

### 1. アプリ名変更
「BinGoal!」= Bingo + Goal の造語

| 箇所 | 変更前 | 変更後 |
|------|--------|--------|
| ヘッダー | Bingo Planner | BinGoal! |

### 2. プレビューラベル削除
デモグリッド下の「サンプルボード / Sample Board」ラベルを削除

---

## 修正ファイル

| ファイル | 修正内容 |
|----------|----------|
| `src/lib/components/landing/LandingPage.svelte:35` | `Bingo Planner` → `BinGoal!` |
| `src/lib/components/landing/HeroSection.svelte:52` | preview-label 要素を削除 |
| `src/lib/i18n/translations.ts:21,56-57,100-101` | `preview.label` プロパティを削除 |

---

## 検証方法

1. `npm run dev` で開発サーバー起動
2. ヘッダーに「BinGoal!」と表示されることを確認
3. デモグリッド下にラベルが表示されないことを確認
4. JP/EN 切り替えで問題がないことを確認
