# テーマセレクター改善 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** テーマ選択モーダルの背景透過問題を修正し、MidnightテーマをCandy風のPop路線にリデザインする

**Architecture:** ThemeSelectorコンポーネントの.dropdownスタイルを不透明背景に変更し、Midnightテーマの色定義をパステルカラーベースのポップなデザインに全面改修する。CSS変数とJavaScriptのテーマ定義を同期して更新する。

**Tech Stack:** SvelteKit, CSS Variables, TypeScript

---

## 問題点の分析

### 1. テーマ選択モーダルの背景透過問題
- `.dropdown`の背景が`var(--theme-surface)`を使用
- `--theme-surface`は半透明（rgba値）で定義されている
- `backdrop-filter: blur(12px)`でぼかしているが、下のコンテンツが透けて見える

### 2. Midnightテーマの視認性問題
- 現在: モノクロームのミニマリストダークテーマ
- Primary色が白系（#f8fafc）で、コントラストが低い
- 全体的に暗く地味な印象

---

## Task 1: テーマセレクターのドロップダウン背景を不透明化

**Files:**
- Modify: `bingo-goal-app/src/lib/components/ui/ThemeSelector.svelte:108-124`

**Step 1: ドロップダウンの背景スタイルを修正**

ThemeSelector.svelteの`.dropdown`クラスの背景を不透明に変更する。

```css
.dropdown {
	position: absolute;
	top: calc(100% + 0.5rem);
	right: 0;
	width: 18rem;
	background: color-mix(in srgb, var(--theme-bg-base) 95%, var(--theme-surface));
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border: 1px solid var(--theme-border);
	border-radius: 1rem;
	box-shadow:
		0 10px 25px rgba(0, 0, 0, 0.3),
		0 4px 10px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	z-index: 100;
	animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Step 2: 開発サーバーで確認**

Run: `cd bingo-goal-app && npm run dev`
Expected: localhost:5173でテーマセレクターを開き、背景が透けないことを確認

**Step 3: Commit**

```bash
git add bingo-goal-app/src/lib/components/ui/ThemeSelector.svelte
git commit -m "$(cat <<'EOF'
fix(ThemeSelector): ドロップダウン背景の透過問題を修正

背景にcolor-mixを使用して不透明度を高め、文字の視認性を改善

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Midnightテーマの色定義をPop路線に変更（CSS変数）

**Files:**
- Modify: `bingo-goal-app/src/app.css:97-116`

**Step 1: app.cssのMidnightテーマCSS変数を更新**

```css
[data-theme="midnight"] {
	/* Pop Midnight - 夜のネオンポップ */
	--theme-bg-base: #1a1a2e;
	--theme-bg-grad-start: #16213e;
	--theme-bg-grad-end: #0f0f23;

	--theme-primary: #ff6b9d;
	--theme-primary-dim: #c44569;
	--theme-secondary: #ffd93d;
	--theme-accent: #6bcb77;

	--theme-surface: rgba(26, 26, 46, 0.9);
	--theme-border: rgba(255, 107, 157, 0.25);
	--theme-text: #f8f8f8;
	--theme-text-muted: #b8b8d1;

	--theme-glow: rgba(255, 107, 157, 0.5);

	--theme-text-on-primary: #1a1a2e;
}
```

**Step 2: 開発サーバーで確認**

Run: `cd bingo-goal-app && npm run dev`
Expected: Midnightテーマを選択し、ピンク/イエロー/グリーンのポップな配色になっていることを確認

**Step 3: Commit**

```bash
git add bingo-goal-app/src/app.css
git commit -m "$(cat <<'EOF'
feat(theme): MidnightテーマをPop路線にリデザイン（CSS変数）

ミニマリストモノクロームからネオンポップへ変更
- Primary: ピンク (#ff6b9d)
- Secondary: イエロー (#ffd93d)
- Accent: グリーン (#6bcb77)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Midnightテーマの色定義をPop路線に変更（TypeScript）

**Files:**
- Modify: `bingo-goal-app/src/lib/themes/index.ts:73-106`

**Step 1: themes/index.tsのMidnightテーマ定義を更新**

```typescript
midnight: {
	meta: {
		id: 'midnight',
		name: 'Midnight',
		description: 'Neon Pop vibes',
		icon: '🌃'
	},
	colors: {
		primary: '#ff6b9d',
		primaryLight: '#ff8fb3',
		primaryDark: '#c44569',
		achieved: '#ffd93d',
		achievedLight: '#ffe066',
		achievedGlow: '#f4c430',
		pending: 'rgba(26, 26, 46, 0.9)',
		pendingBorder: 'rgba(255, 107, 157, 0.25)',
		bingo: '#6bcb77',
		bingoGlow: '#98d9a1',
		background: '#1a1a2e',
		surface: 'rgba(26, 26, 46, 0.9)',
		text: '#f8f8f8',
		textLight: '#b8b8d1'
	},
	fonts: {
		body: "'Inter', sans-serif",
		heading: "'Outfit', sans-serif",
		googleFontsUrl: ''
	},
	icon: {
		svgPath: 'M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2',
		viewBox: '0 0 24 24',
		clipPath: 'circle(50% at 50% 50%)'
	}
}
```

**Step 2: TypeScript型チェック**

Run: `cd bingo-goal-app && npm run check`
Expected: エラーなし

**Step 3: Commit**

```bash
git add bingo-goal-app/src/lib/themes/index.ts
git commit -m "$(cat <<'EOF'
feat(theme): MidnightテーマをPop路線にリデザイン（TypeScript定義）

- メタデータ更新: description, icon
- カラーパレット全面改修: ピンク/イエロー/グリーン
- アイコンSVG更新: 月+星のモチーフ

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: テーマ選択オプションのホバースタイル改善

**Files:**
- Modify: `bingo-goal-app/src/lib/components/ui/ThemeSelector.svelte:155-157`

**Step 1: theme-optionのホバー背景を改善**

現在の`rgba(255, 255, 255, 0.05)`はライトテーマ（Candy）では見えにくいため、テーマ対応に修正。

```css
.theme-option:hover {
	background: color-mix(in srgb, var(--theme-primary) 10%, transparent);
}
```

**Step 2: 開発サーバーで確認**

Run: `cd bingo-goal-app && npm run dev`
Expected: 各テーマでホバー効果が視認できることを確認

**Step 3: Commit**

```bash
git add bingo-goal-app/src/lib/components/ui/ThemeSelector.svelte
git commit -m "$(cat <<'EOF'
fix(ThemeSelector): テーマオプションのホバー効果を改善

ライトテーマでも視認できるようcolor-mixを使用

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: 全テーマでの視覚確認テスト

**Files:**
- Test: 手動確認（全4テーマ）

**Step 1: 各テーマでUIを確認**

確認項目:
- [ ] Aurora: テーマセレクター背景が透けない
- [ ] Neon: テーマセレクター背景が透けない
- [ ] Midnight: ポップな配色に変更されている、背景が透けない
- [ ] Candy: テーマセレクター背景が透けない

Run: `cd bingo-goal-app && npm run dev`

**Step 2: 問題があれば修正**

各テーマで視認性に問題があれば、個別に調整。

**Step 3: 最終確認後にコミット（必要な場合）**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(theme): テーマセレクターの最終調整

全テーマでの視覚確認完了

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## 変更ファイルまとめ

| ファイル | 変更内容 |
|---------|---------|
| `src/lib/components/ui/ThemeSelector.svelte` | ドロップダウン背景の不透明化、ホバー効果改善 |
| `src/app.css` | Midnightテーマ CSS変数の全面改修 |
| `src/lib/themes/index.ts` | Midnightテーマ TypeScript定義の全面改修 |

## 配色変更サマリー（Midnight）

| 項目 | Before | After |
|------|--------|-------|
| Primary | #f8fafc（白） | #ff6b9d（ピンク） |
| Secondary | #94a3b8（グレー） | #ffd93d（イエロー） |
| Accent | #ffffff（白） | #6bcb77（グリーン） |
| Background | #000000（黒） | #1a1a2e（ダークネイビー） |
| Description | "Minimalist dark" | "Neon Pop vibes" |
| Icon | 🌑 | 🌃 |
