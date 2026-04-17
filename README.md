# 学習記録アプリ

JavaScriptで作成した、学習記録を蓄積・管理するWebアプリです。

## 技術スタック

- React 19 + Vite
- Supabase（バックエンド・データベース）
- Jest + Testing Library（テスト）

## 環境設定

### 前提条件

- Node.js 18以上
- pnpm

### セットアップ

1. リポジトリをクローン

```bash
git clone <repository-url>
cd jisou-practice2
```

2. 依存パッケージをインストール

```bash
pnpm install
```

3. 環境変数を設定

`.env.example` をコピーして `.env` を作成し、Supabaseの接続情報を入力します。

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## 起動方法

### 開発サーバー

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開きます。

### テスト

```bash
pnpm test
```

### ビルド

```bash
pnpm build
```
