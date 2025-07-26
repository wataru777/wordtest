# 🚀 自動デプロイガイド

このプロジェクトには自動バージョン管理とデプロイ機能が実装されています。

## 🚀 基本デプロイ

### パッチバージョンアップ（推奨）
```bash
npm run deploy
```
- バージョンを 0.2.1 → 0.2.2 に自動アップ
- 変更をコミット
- GitHubにプッシュしてVercelで自動デプロイ

### マイナーバージョンアップ
```bash
npm run deploy:minor
```
- バージョンを 0.2.1 → 0.3.0 に自動アップ  
- 新機能追加時に使用

### メジャーバージョンアップ
```bash
npm run deploy:major
```
- バージョンを 0.2.1 → 1.0.0 に自動アップ
- 破壊的変更時に使用

## 📋 デプロイスクリプトの動作

1. **バージョンアップ**: package.jsonのバージョンを自動インクリメント
2. **ステージング**: すべての変更をgit addでステージ
3. **コミット**: 統一されたコミットメッセージで自動コミット
4. **プッシュ**: GitHubのmainブランチにプッシュ
5. **自動デプロイ**: VercelがGitHubのプッシュを検知して自動デプロイ

## 🔧 手動バージョン管理

必要に応じて手動でバージョン操作も可能：

```bash
# パッチバージョンのみ更新
npm run version:patch

# マイナーバージョンのみ更新  
npm run version:minor

# メジャーバージョンのみ更新
npm run version:major
```

## 📝 コミットメッセージ形式

自動デプロイ時のコミットメッセージ：
```
Deploy v0.2.1

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## ⚠️ 注意事項

- デプロイ前にローカルでテスト実行（`npm run build`）を推奨
- `deploy`スクリプトは未コミットの変更もすべて含める
- バージョン番号は自動管理されるため手動編集は避ける
- Vercelの環境変数設定が正しいことを確認する

---

# 🌐 初回環境構築手順

WEB環境で他のPCからアクセスできるようにデプロイする初回設定手順です。

## 1. Vercelアカウントの作成とプロジェクトの設定

1. [Vercel](https://vercel.com)でアカウントを作成
2. GitHubリポジトリをVercelにインポート
3. プロジェクトを作成

## 2. データベースの設定

### Option A: Vercel Postgres（推奨）

1. Vercelダッシュボードで「Storage」→「Create Database」
2. 「Postgres」を選択
3. データベース名を設定して作成
4. 「.env.local」タブで`DATABASE_URL`をコピー

### Option B: 他のPostgreSQLサービス

- [Supabase](https://supabase.com)
- [Railway](https://railway.app)  
- [Render](https://render.com)

## 3. 環境変数の設定

Vercelのプロジェクト設定で以下を設定：

```
DATABASE_URL=postgres://username:password@hostname:port/database
```

## 4. 初回デプロイ

```bash
npm run deploy
```

これで自動的にバージョン管理されたデプロイが実行されます！