# デプロイ手順

## GitHub Pagesでのデプロイ

1. **GitHubにプッシュ**
   ```bash
   git push origin main
   ```

2. **GitHub Pagesの有効化**
   - GitHubリポジトリページに移動
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

3. **デプロイ確認**
   - 数分後にhttps://wataru777.github.io/wordtest/wordtest.htmlでアクセス可能

## 他のデプロイオプション

### Netlify Drop（簡単）
1. https://app.netlify.com/drop にアクセス
2. wordtest.htmlファイルをドラッグ＆ドロップ
3. 即座にデプロイ完了

### Vercel（推奨）
1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. リポジトリを選択してデプロイ

## 現在のファイル状態
- wordtest.html: CSV登録機能付きクイズアプリ
- 最新コミット: 928cf9a Add CSV import functionality for questions
- リモートリポジトリ: https://github.com/wataru777/wordtest.git