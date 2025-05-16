# 学生名鑑アプリ - 長岡技術科学大学 電気電子情報工学専攻

長岡技術科学大学の電気電子情報工学専攻向けの学生名鑑ウェブアプリケーションです。学生の基本情報、出身、趣味などのプロフィールを管理し、検索・閲覧できます。

## 機能

- Google認証によるログイン（@stn.nagaokaut.ac.jpドメインのみ）
- 学生一覧表示（検索・フィルタリング機能付き）
- 詳細なプロフィール表示
- 管理者向け：学生情報の追加・編集・削除
- レスポンシブデザイン（PC・タブレット・スマートフォン対応）
- ダークモード対応

## 技術スタック

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS（長岡技科大カラーに対応）
- Prisma ORM
- PostgreSQL
- NextAuth.js（認証）
- React Hook Form + Zod（フォーム処理）
- Cloudinary（画像アップロード）
- Lucide / Heroicons（アイコン）

## セットアップ

### 前提条件

- Node.js（v18.0.0以上）
- npm（v8.0.0以上）
- PostgreSQLデータベース

### 環境変数の設定

`.env`ファイルに以下の環境変数を設定してください：

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/student_directory?schema=public"

# Authentication - Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Admin (Optional)
ADMIN_EMAIL="admin@stn.nagaokaut.ac.jp"

# Cloudinary (for image upload)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### インストールと起動

```bash
# 依存関係のインストール
npm install

# Prismaクライアントの生成
npm run prisma:generate

# データベースマイグレーション
npm run prisma:migrate

# 開発サーバーの起動
npm run dev
```

### 学生データのシード

CSVからデータをインポートする場合は、`prisma/students.csv`ファイルを編集し、以下のコマンドを実行してください：

```bash
npm run db:seed
```

CSVファイルは以下の形式で作成してください：

```
fullName,studentId,birthDate,hometown,almaMater,targetCourse,...
```

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにコードをプッシュします
2. Vercelにログインし、「Import Project」を選択
3. GitHubリポジトリを選択
4. 環境変数を設定
5. デプロイを実行

## ライセンスと注意事項

- このアプリケーションは長岡技術科学大学の内部利用を目的としています
- 学生情報は適切なセキュリティ対策の下で管理してください
- 個人情報保護法に基づき、学生からの同意を得た上でデータを登録・利用してください
