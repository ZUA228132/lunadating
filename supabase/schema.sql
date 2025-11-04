-- SQL schema for the Telegram Dating App
-- Run this script in your Supabase dashboard under SQL Editor to create the necessary tables.

create extension if not exists "uuid-ossp";

-- Users table: stores core profile information.
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  telegram_id bigint not null unique,
  username text not null,
  full_name text,
  bio text,
  hobbies text,
  bad_habits text,
  height int,
  eye_colour text,
  gender text,
  preferred_gender text,
  photos jsonb default '[]',
  is_verified boolean default false,
  role text default 'user',
  created_at timestamptz not null default now()
);

-- Likes table: records swipe actions.  The combination of liker and liked enforces a single like record.
create table if not exists public.likes (
  id uuid primary key default uuid_generate_v4(),
  liker uuid references public.users (id) on delete cascade,
  liked uuid references public.users (id) on delete cascade,
  is_super boolean default false,
  created_at timestamptz not null default now(),
  constraint unique_like unique (liker, liked)
);

-- Matches table: pairs of users with mutual likes.
create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  user1 uuid references public.users (id) on delete cascade,
  user2 uuid references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_match unique (user1, user2)
);

-- Reports table: holds user reports.
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter uuid references public.users (id) on delete cascade,
  reported_user uuid references public.users (id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

-- Tickets table: support tickets opened by users.
create table if not exists public.tickets (
  id uuid primary key default uuid_generate_v4(),
  author uuid references public.users (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'open',
  answer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Badges table: special badges assigned by admins.
create table if not exists public.badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Subscription table: tracks premium subscriptions and expiry dates.
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users (id) on delete cascade,
  plan text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Indexes for faster lookups
create index if not exists idx_users_telegram_id on public.users (telegram_id);
create index if not exists idx_likes_liker on public.likes (liker);
create index if not exists idx_likes_liked on public.likes (liked);
create index if not exists idx_matches_user1 on public.matches (user1);
create index if not exists idx_matches_user2 on public.matches (user2);