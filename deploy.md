# WEB環境デプロイ手順

WEB環境で他のPCからアクセスできるようにデプロイする手順です。

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

## 4. Prismaスキーマの更新

本番環境用にPostgreSQLを使用するため、`prisma/schema.prisma`を更新：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 5. デプロイとマイグレーション

1. Vercelにデプロイ
2. データベースマイグレーション実行：
   ```bash
   npx prisma migrate deploy
   ```

## 6. アクセス確認

- デプロイ後、Vercelから提供されるURLにアクセス
- 別のPCからも同じURLで問題データが共有される

## 注意事項

- 本番環境では`DATABASE_URL`を必ず設定
- SQLiteは本番環境では推奨されない
- データベースの初期化後、既存の問題データを再インポートする必要がある場合がある