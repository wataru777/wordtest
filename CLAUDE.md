# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# WordTest クイズアプリケーション - Claude 開発ガイド

## プロジェクト概要

これは Next.js 15、React 19、TypeScript、Prisma、Tailwind CSS で構築された日本語の語句およびことわざクイズアプリケーションです。ユーザーは語句やことわざのクイズを受けることができ、管理画面やCSVインポート機能でカスタム問題を追加できます。

### リポジトリ情報
- **GitHubリポジトリ**: https://github.com/wataru777/wordtest
- **デプロイ**: GitHubリポジトリにプッシュすることでVercelに自動デプロイ
- **データベース**: VercelにNeonが接続されている

## 技術スタック

- **フレームワーク**: Next.js 15.3.5 (App Router)
- **フロントエンド**: React 19, TypeScript 5
- **データベース**: Neon (PostgreSQL) with Prisma ORM 6.11.1
- **スタイリング**: Tailwind CSS 4
- **デプロイ**: Vercel (GitHubと連携)
- **フォント**: Geist Sans & Mono

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── questions/      # 問題CRUDのAPIルート
│   │       └── route.ts
│   ├── globals.css         # グローバルスタイルとアニメーション
│   ├── layout.tsx         # フォント設定付きルートレイアウト
│   └── page.tsx           # メインアプリケーションエントリーポイント
├── components/            # Reactコンポーネント
│   ├── QuizApp.tsx       # メインアプリコンポーネント（状態管理）
│   ├── StartScreen.tsx   # クイズタイプ選択の初期画面
│   ├── QuizScreen.tsx    # シャッフルされた選択肢のクイズ画面
│   ├── ResultScreen.tsx  # スコア表示と成績評価
│   └── QuestionManager.tsx # 問題管理の管理画面
├── lib/
│   └── db.ts             # Prismaクライアント設定
├── types/
│   └── quiz.ts           # TypeScript型定義
└── utils/
    └── quizUtils.ts      # コアクイズロジックとデータユーティリティ
```

## データベーススキーマ

**Questionモデル** (Prisma経由のNeon PostgreSQL):
```prisma
model Question {
  id        String   @id @default(cuid())
  question  String   # [[]]で下線部のある問題文
  choices   String   # 回答選択肢のJSON配列
  correct   Int      # 正解の選択肢のインデックス（0ベース）
  type      String   # 'vocabulary' または 'proverb'
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 主要機能

### 1. クイズシステム
- **2つのクイズタイプ**: 語句とことわざ
- **ランダム選択**: クイズごとに10問をランダム選択
- **選択肢シャッフル**: 各問題の回答選択肢をランダム化
- **視覚的フィードバック**: アニメーション付きの即座のフィードバック（○/×記号）
- **成績評価システム**: パフォーマンスに基づくS/A/B/C評価（90%/70%/50%の閾値）

### 2. 問題管理
- **問題追加**: フォームベースの問題作成（3または4択）
- **CSVインポート**: 重複検出付きの一括インポート
- **編集/削除**: 既存問題の管理（元の問題はマーク付き）
- **問題フォーマット**: [[テキスト]]で下線テキストを作成

### 3. データストレージ
- **ハイブリッドストレージ**: クライアントサイドキャッシュ用localStorage + 永続化用Neon PostgreSQL
- **元の問題**: 内蔵の語句20問 + ことわざ20問
- **ユーザー問題**: データベースに保存されlocalStorageと同期されるカスタム問題

## 開発コマンド

```bash
# 開発
npm run dev              # 開発サーバー起動 (localhost:3000)
npm install              # 依存関係インストール

# ビルド & デプロイ
npm run build            # 本番用ビルド
npm start               # 本番サーバー起動

# データベース
npm run db:generate      # Prismaクライアント生成
npm run db:migrate       # データベースマイグレーション実行

# コード品質
npm run lint             # ESLintチェック
npm run typecheck        # TypeScriptタイプチェック (if available)
```

## APIエンドポイント

### Questions API (`/api/questions`)

**POST** - 新しい問題作成:
```json
{
  "question": "[[強調]]部分付きの問題文",
  "choices": ["正解", "不正解1", "不正解2", "不正解3"],
  "correct": 0,
  "type": "vocabulary" | "proverb"
}
```

**GET** - 問題取得:
```
/api/questions?type=vocabulary  # タイプでフィルター
/api/questions                  # 全問題取得
```

## コンポーネントアーキテクチャ

### 状態管理パターン
- **QuizApp.tsx**: 中央状態コンテナ
  - クイズ状態: 画面、問題、現在のインデックス、スコア
  - 画面ナビゲーション: start → quiz → result
  - 問題管理モーダルの切り替え

### データフロー
1. **開始**: ユーザーがクイズタイプを選択（語句/ことわざ）
2. **クイズロジック**: 
   - localStorage/元の問題からのフォールバックで問題を取得
   - 10問をシャッフルして選択
   - 各問題の選択肢をシャッフル
3. **回答処理**: 正解を追跡し、フィードバックを表示
4. **結果**: 成績を計算してパフォーマンスを表示

### 問題フォーマット
- **表示**: `[[テキスト]]`がUIで下線テキストになる
- **保存**: データベースでブラケット付きの生フォーマットを保持
- **レンダリング**: 正規表現置換で`dangerouslySetInnerHTML`を使用

## CSVインポートフォーマット

```csv
[[強調]]付きの問題文,正解,不正解1,不正解2,不正解3
この[[単語]]の意味は？,正しい意味,間違い1,間違い2,間違い3
```
- 最低4列（問題、正解、不正解2つ）
- 5列目は4択問題の場合はオプション
- 問題文による重複検出

## スタイリング規約

### Tailwind CSS使用法
- **カラースキーム**: インディゴプライマリ、グラデーション背景
- **タイポグラフィ**: 日本語フォントスタック（ヒラギノ角ゴ、メイリオ）
- **アニメーション**: フィードバック用のカスタムフェードイン、シェイクエフェクト
- **レスポンシブ**: sm:ブレークポイント付きのモバイルファーストデザイン

### 主要デザイン要素
- **グラデーション背景**: `from-indigo-500 to-purple-600`
- **カードスタイル**: `bg-white/95 backdrop-blur-sm rounded-3xl`
- **ボタン状態**: スケールと色の遷移付きホバーエフェクト
- **フィードバック**: 正解（緑）vs不正解（赤）の色分けレスポンス

## デプロイ設定

### GitHubからVercelへの自動デプロイ
- GitHubリポジトリ（https://github.com/wataru777/wordtest）にプッシュすると自動でVercelにデプロイされる
- Vercel Dashboardで環境変数やドメイン設定を管理

### 環境変数
```bash
DATABASE_URL=postgresql://user:pass@neon-host:port/db  # Neon PostgreSQLへの接続URL
```

### Vercel設定 (`vercel.json`)
```json
{
  "functions": {
    "src/app/api/questions/route.ts": { "maxDuration": 10 }
  }
}
```

### データベースマイグレーション
```bash
# 本番デプロイ（Vercelで自動実行される）
npx prisma migrate deploy
npx prisma generate
```

### デプロイワークフロー
1. ローカルで開発・テスト
2. GitHubリポジトリにコミット・プッシュ
3. Vercelが自動でビルド・デプロイ
4. Neonデータベースは常時接続可能

## 一般的な開発パターン

### 1. 新しい問題タイプの追加
1. `/src/types/quiz.ts`の`QuestionType`を更新
2. `/src/utils/quizUtils.ts`の`originalQuestions`に追加
3. QuestionManagerコンポーネントのUIドロップダウンを更新

### 2. 成績評価システムの修正
- `/src/utils/quizUtils.ts`の`getGrade()`関数を編集
- パーセンテージ閾値とコメントを調整

### 3. アニメーションのカスタマイズ
- `/src/app/globals.css`のCSSアニメーション
- 遷移とトランスフォーム用のTailwindクラス

## 開発ベストプラクティス

### TypeScript使用法
- 厳密な型チェック有効
- 全コンポーネントプロップスのインターフェース
- クイズデータ構造の型安全性

### 状態管理
- ローカルコンポーネント状態用のReactフック
- クライアントサイド永続化用のlocalStorage
- 共有/永続データ用のデータベース

### エラーハンドリング
- APIコールとJSON解析用のtry-catchブロック
- 元の問題への適切なフォールバック
- 日本語でのユーザーフレンドリーなエラーメッセージ

### パフォーマンス考慮事項
- 問題シャッフルはクライアントサイドで発生
- localStorageキャッシュがAPIコールを削減
- データベース用のPrismaクライアント接続プーリング

## 一般的な問題のトラブルシューティング

### 1. データベース接続
- `DATABASE_URL`環境変数を確認（Neon PostgreSQL接続URL）
- スキーマ変更後に`npx prisma migrate deploy`を実行
- Neonダッシュボードで接続状況を確認
- Vercel Dashboardで環境変数設定を確認

### 2. 問題が表示されない
- choices フィールドのJSONフォーマットを確認
- 問題タイプがenum値と一致することを確認
- choices配列の正しいインデックスを確認

### 3. CSVインポートの失敗
- CSVフォーマット（UTF-8エンコーディング）を検証
- 最低列要件を確認
- 解析を壊す特殊文字がないことを確認

### 4. LocalStorageの問題
- データが破損している場合はブラウザのlocalStorageをクリア
- コンソールでJSON解析エラーを確認
- 元の問題へのフォールバックが動作するはず

## ファイル場所リファレンス

### 設定ファイル
- `/package.json` - 依存関係とスクリプト
- `/tsconfig.json` - TypeScript設定
- `/next.config.ts` - Next.js設定
- `/prisma/schema.prisma` - データベーススキーマ
- `/vercel.json` - デプロイ設定

### コアアプリケーションファイル
- `/src/app/page.tsx` - アプリケーションエントリーポイント
- `/src/components/QuizApp.tsx` - メインアプリケーションロジック
- `/src/utils/quizUtils.ts` - コアクイズ関数とデータ
- `/src/lib/db.ts` - データベースクライアント設定
- `/src/types/quiz.ts` - 型定義

この日本語クイズアプリケーションは、TypeScriptを使った現代的なReactパターンに従い、型安全なデータベースアクセスにPrismaを使用し、教育ソフトウェア開発に適したクリーンなコンポーネントアーキテクチャを実装しています。