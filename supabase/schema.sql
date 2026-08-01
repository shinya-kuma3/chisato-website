-- チサトオフィシャルサイト用スキーマ
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行してください

-- 歌ってみたリクエスト
create table if not exists public.song_requests (
  id uuid primary key default gen_random_uuid(),
  song_title text not null,
  artist_name text,
  reference_url text,
  comment text,
  nickname text,
  created_at timestamptz not null default now()
);

-- 制作依頼 (作詞作曲 / イラスト / MV / コラボ)
create table if not exists public.commission_requests (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  contact text not null,
  details text not null,
  budget text,
  created_at timestamptz not null default now()
);

-- RLS を有効化 (service_role キー経由のサーバーアクセスのみ許可。
-- anon キーからは読み書き不可なので、キー漏洩以外でデータは触れない)
alter table public.song_requests enable row level security;
alter table public.commission_requests enable row level security;
