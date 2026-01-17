# 達成状態トグルボタンのラベル改善

## 概要
GoalInputModal の達成状態トグルボタンで「Not Achieved」という否定的な表現を、アクション指向の「Mark as Done」に変更する。

---

## 変更内容

| 状態 | 変更前 | 変更後 |
|------|--------|--------|
| 未達成 | Not Achieved | Mark as Done |
| 達成済み | Achieved | Done (変更なし可) |

---

## 修正ファイル

| ファイル | 行 | 修正内容 |
|----------|-----|----------|
| `src/lib/components/bingo/GoalInputModal.svelte:68` | 68 | `Not Achieved` → `Mark as Done` |

---

## 検証方法

1. `npm run dev` で開発サーバー起動
2. ボード上のセルをタップしてモーダルを開く
3. 未達成状態で「Mark as Done」と表示されることを確認
4. ボタンをタップして達成状態に切り替え、「Achieved」と表示されることを確認
