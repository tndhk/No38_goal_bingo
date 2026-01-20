# Runbook

BinGoal! の運用・デプロイ手順書です。

## Deployment Procedures

### 本番デプロイ

#### 1. プリフライトチェック

```bash
# 依存関係の更新
npm install

# 型チェック
npm run check

# ユニットテスト
npm run test:unit

# E2Eテスト
npm run test:e2e

# ビルド確認
npm run build
npm run preview
```

#### 2. デプロイ実行

SvelteKit は `@sveltejs/adapter-auto` を使用しており、デプロイ先に応じて自動で適切なアダプターが選択されます。

**Vercel:**
```bash
# Vercel CLI でデプロイ
npx vercel --prod
```

**Netlify:**
```bash
# Netlify CLI でデプロイ
npx netlify deploy --prod
```

**Cloudflare Pages:**
```bash
# Cloudflare Pages でデプロイ
npx wrangler pages deploy .svelte-kit/cloudflare
```

#### 3. デプロイ後確認

- [ ] トップページが表示される
- [ ] ボード作成・編集が動作する
- [ ] 認証（ログイン/ログアウト）が動作する
- [ ] データが正しく保存される

### 環境変数設定

デプロイ先のプラットフォームで以下の環境変数を設定:

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Yes | Supabase プロジェクトURL |
| `PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase 匿名キー |
| `PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 測定ID |

## Monitoring and Alerts

### ヘルスチェック

アプリケーションのヘルスチェック:

```bash
curl -I https://your-domain.com/
# 200 OK を確認
```

### Supabase ダッシュボード

- [Supabase Dashboard](https://supabase.com/dashboard)
- Database > Tables で boards, cells テーブルを確認
- Authentication > Users でユーザー数を確認
- Edge Functions のログを確認（使用している場合）

### Google Analytics

- [Google Analytics](https://analytics.google.com/)
- リアルタイムユーザー数
- ページビュー
- イベントトラッキング

## Common Issues and Fixes

### 1. ビルドエラー: TypeScript型エラー

**症状:**
```
error TS2345: Argument of type '...' is not assignable to parameter of type '...'
```

**対処:**
```bash
# 型チェックを実行して詳細を確認
npm run check

# node_modules を再インストール
rm -rf node_modules package-lock.json
npm install
```

### 2. Supabase 認証エラー

**症状:**
- ログインボタンを押しても何も起きない
- "Invalid API key" エラー

**対処:**
1. `.env.local` の `PUBLIC_SUPABASE_URL` と `PUBLIC_SUPABASE_ANON_KEY` を確認
2. Supabase ダッシュボードで API キーが有効か確認
3. Google OAuth の設定を確認（Authentication > Providers）

### 3. データが保存されない

**症状:**
- ボードを作成しても保存されない
- リロードするとデータが消える

**対処:**
1. ブラウザの DevTools > Application > Local Storage を確認
2. ログイン状態を確認（ログイン中は Supabase に保存）
3. Supabase の RLS（Row Level Security）ポリシーを確認

### 4. E2Eテスト失敗

**症状:**
```
Timeout waiting for element
```

**対処:**
1. 開発サーバーが起動しているか確認
2. `playwright.config.ts` の `baseURL` を確認
3. タイムアウト値を増やす:
```typescript
await expect(element).toBeVisible({ timeout: 10000 });
```

### 5. ボード作成数制限エラー

**症状:**
- 「上限に達しました」と表示されるが、ボードは3個未満

**対処:**
1. LocalStorage をクリア: DevTools > Application > Local Storage > Clear All
2. ログアウト → ログインし直す
3. `MAX_BOARDS` 定数を確認: `src/lib/constants/tokens.ts`

## Rollback Procedures

### 即座にロールバック

**Vercel:**
```bash
# 直前のデプロイにロールバック
npx vercel rollback
```

**手動ロールバック:**
```bash
# 直前のコミットに戻す
git revert HEAD
git push origin main

# または特定のコミットに戻す
git checkout <commit-hash>
git push origin main --force  # 注意: force push
```

### データベースロールバック

Supabase ダッシュボードから:
1. Database > Backups
2. Point-in-time Recovery を選択
3. 復元するタイムスタンプを指定

**注意:** データベースのロールバックはユーザーデータに影響します。

## Performance Optimization

### ビルドサイズ確認

```bash
npm run build
# .svelte-kit/output のサイズを確認
```

### バンドル分析

```bash
# vite-bundle-visualizer をインストール（オプション）
npm install -D rollup-plugin-visualizer
# vite.config.ts に追加して分析
```

## Security Checklist

- [ ] 環境変数がコミットされていないか確認
- [ ] Supabase RLS ポリシーが正しく設定されているか
- [ ] ユーザー入力が適切にバリデーションされているか
- [ ] HTTPS が有効になっているか
- [ ] CORS 設定が適切か

## Contact

問題が解決しない場合:
1. GitHub Issues で報告
2. ログを添付（個人情報は除去）
3. 再現手順を記載
