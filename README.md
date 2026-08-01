# チサト -CHISATO- Official Site

歌い手・チサトのオフィシャルサイト。Next.js (App Router / TypeScript) 製。
キャラクター設定は `.agents/charSettings.md` を参照。

## デザインコンセプト: 「深夜のチサトの部屋」

引きこもりのチサトの薄暗い自室がサイト全体のモチーフ。光源はPCモニターのティールの光と窓の月明かりだけ、文字は白。各ページは部屋の場所に対応する:

- NEWS = 机の上のメモ (テープ留めのメモカード)
- 歌ってみたリクエスト = ドアの下から届く手紙
- ご依頼 = 部屋の隅の仕事机
- グッズ = 棚の上のコレクション

ヒーローにはCSS描画の窓・月・モニター(点滅)・浮遊するほこりを配置。カラーは `globals.css` の `:root` 変数で一括管理 (`--glow` がモニター光)。

## 機能

- **歌ってみたリクエスト** (`/request`): 曲名またはURLだけで送信可能。スパム対策のハニーポット付き
- **管理コンソール** (`/console/<秘密キー>`): リクエスト集計・依頼一覧のダッシュボード。**リスナーには非公開** (サイト内リンクなし + Googleログイン必須)
- **ご依頼** (`/commission`): 作詞作曲 / ミキシング / マスタリング / イラスト / MV制作 / コラボの依頼フォーム。制作実績(ポートフォリオ)は `src/data/portfolio.ts` に追記するだけで表示されます
- **グッズ紹介** (`/goods`)、**プロフィール** (`/about`)
- イラスト未完成の箇所は、掲載サイズの枠内に「描くべき構図・ポーズ」がテキスト表示されます (`IllustrationPlaceholder`)。イラスト完成後に `next/image` へ差し替えてください

## ローカルで動かす

```bash
npm install
npm run dev
```

http://localhost:3000 を開く。

**Supabase 未設定でもそのまま動きます。** その場合、リクエストはプロジェクト直下の `.data/` フォルダ (JSONファイル) に保存されます。ローカル確認用にはこれで十分です。

## Supabase を使う場合

1. https://supabase.com で無料アカウント・プロジェクト作成
2. ダッシュボード > SQL Editor で `supabase/schema.sql` の内容を実行
3. `.env.local.example` をコピーして `.env.local` を作成し、Project Settings > API の URL と `service_role` キーを設定

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

`service_role` キーはサーバー側でのみ使われ、ブラウザには渡りません。**Gitにコミットしないこと** (`.gitignore` 済み)。

## 管理コンソール (集計ダッシュボード)

リクエストの集計はリスナーには見せず、**管理者だけがアクセスできる非公開ページ**にまとめてあります。

**URL: `/console/<ADMIN_PATH_KEY>`** — サイト内のどこからもリンクされておらず、
キーが違う場合は 404 (存在しないページ) を返します。さらに Google ログインが必須で、
`ADMIN_EMAILS` に登録したアカウント以外はログインしても弾かれます。

| 画面 | 内容 |
|---|---|
| ダッシュボード | KPI 4枚 (総リクエスト / ユニーク楽曲 / 制作依頼 / 平均)、直近14日の推移グラフ、曲別・アーティスト別ランキング、最近のリクエスト |
| リクエスト一覧 | 全リクエストのテーブル (日時・曲名・URL・差出人・コメント) |
| 依頼一覧 | 制作依頼のテーブル + カテゴリ別件数 |
| (準備中) | アナリティクス / グッズ管理 / 設定 — サイドバーに枠だけ用意済み |

ページを追加するときは `src/app/console/[key]/` に作り、`src/components/admin/AdminShell.tsx` の `nav` に足すだけです。

### セットアップ手順

**1. 環境変数を用意**

`.env.local.example` を `.env.local` にコピー。`ADMIN_PATH_KEY` と `AUTH_SECRET` はサンプル値が入っていますが、本番では必ず生成し直してください。

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

**2. Google OAuth クライアントを作成** (無料)

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクト作成
2. 「APIとサービス > OAuth同意画面」→ 種類は **外部**、公開ステータスは**テスト**のままでOK (自分のアカウントをテストユーザーに追加)
3. 「認証情報 > 認証情報を作成 > OAuth クライアント ID」→ 種類 **ウェブアプリケーション**
4. **承認済みのリダイレクト URI** に以下を追加 (両方登録しておくと便利)
   - `http://localhost:3000/api/auth/google/callback`
   - `https://<本番ドメイン>/api/auth/google/callback`
5. 発行された **クライアント ID / クライアント シークレット** を `.env.local` に設定

**3. `ADMIN_EMAILS` に自分の Google アカウントのメールを設定** (カンマ区切りで複数可)

**4. `npm run dev` して `http://localhost:3000/console/<ADMIN_PATH_KEY>` を開く** → Googleでログイン

### セキュリティの仕組み

- 秘密URLのキーは**タイミング攻撃に強い比較** (`timingSafeEqual`) で照合
- セッションは **HMAC-SHA256 で署名した HttpOnly Cookie** (有効期限12時間)。改ざん不可
- OAuth の **state パラメータで CSRF 対策**、IDトークンは `aud` / `iss` / `exp` / `email_verified` を検証
- `robots.ts` と `noindex` で検索エンジンからも隠蔽
- 外部の認証ライブラリを使っていないため、依存追加もライセンス費用もゼロ

## 公開時のツールとコスト

| 項目 | サービス | コスト | 備考 |
|---|---|---|---|
| ホスティング | **Vercel** (Hobby) | 無料 | Next.jsと相性最良。デプロイはGitHub連携で自動。※Hobbyプランは非商用限定。グッズ販売ページ等を本格運用するならPro ($20/月) か下のCloudflareへ |
| ホスティング代替 | Cloudflare Pages / Workers | 無料 (商用可) | 無料枠が広い。Next.jsは `@opennextjs/cloudflare` 経由 |
| データベース | **Supabase** (Free) | 無料 | DB 500MB。**1週間アクセスがないとプロジェクトが一時停止**される点に注意 (ダッシュボードから再開可) |
| 管理者ログイン | **Google OAuth** | 無料 | Google Cloud のOAuthクライアントは無料。同意画面は「テスト」のままでよい |
| 独自ドメイン | Cloudflare Registrar / お名前.com 等 | 年 約1,000〜2,000円 (.com) | 唯一ほぼ必須の実費。`chisato-official.com` など |
| 画像配信 | Vercel / Cloudflare に含まれる | 無料 | イラストは `public/images/` に置くだけ |

**最小構成の月額: 0円 + ドメイン代 (年千円台) のみ。**

### 公開手順 (Vercel の場合)

1. GitHubにリポジトリを作成してpush
2. https://vercel.com でリポジトリをImport
3. 環境変数を設定: `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `ADMIN_PATH_KEY` / `AUTH_SECRET` / `ADMIN_EMAILS` / `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
4. Deploy。独自ドメインは Settings > Domains から接続
5. 本番ドメインのコールバックURLを Google Cloud の「承認済みのリダイレクト URI」に追加

### 公開前チェックリスト

- [ ] `src/app/layout.tsx` の `robots: { index: false }` を削除 (現在は検索エンジン拒否設定)
- [ ] `src/app/robots.ts` の `disallow` を `["/console/", "/api/"]` に変更 (現在は全ページ拒否)
- [ ] `ADMIN_PATH_KEY` と `AUTH_SECRET` を本番用に生成し直す
- [ ] Supabase を設定 (Vercel はファイル書き込みが永続化されないため、公開時は必須)
- [ ] プロフィール文・料金表・グッズ情報を実物に差し替え
- [ ] イラスト完成後、`IllustrationPlaceholder` を画像に差し替え
- [ ] 必要なら reCAPTCHA / Cloudflare Turnstile 追加 (現状はハニーポットのみ)

## 構成

```
src/
  app/
    (site)/                 # 公開サイト (ヘッダー・フッター付き)
      page.tsx              #   トップ
      about/                #   プロフィール (キャラ設定資料あり)
      request/              #   歌ってみたリクエスト (フォーム)
      commission/           #   ご依頼 (6カテゴリ + ポートフォリオ + フォーム)
      goods/                #   グッズ紹介
    console/[key]/          # 管理コンソール (秘密URL + Google認証)
      page.tsx              #   ダッシュボード
      requests/             #   リクエスト一覧
      commissions/          #   依頼一覧
      admin.css             #   管理画面専用スタイル
    api/requests/           # リクエストAPI (GET/POST)
    api/commissions/        # 依頼API (POST)
    api/auth/google/        # Googleログイン開始 + コールバック
    api/auth/logout/        # ログアウト
    robots.ts               # クローラ制御
  components/
    admin/                  # AdminShell (サイドバー) / LoginGate
    Header / Footer / IllustrationPlaceholder
  lib/
    store.ts                # データ層 (Supabase REST or ローカルJSON 自動切替)
    auth.ts                 # Google OAuth + セッション署名 (依存ライブラリなし)
    analytics.ts            # 集計ロジック (ランキング・日別推移)
  data/portfolio.ts         # 制作実績
supabase/schema.sql         # Supabase用テーブル定義
```
