-- Database schema for catalogo-whatsapp (Postgres / Neon).
-- Run once from the Neon SQL Editor or with: psql "$DATABASE_URL" -f schema.sql

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  category text not null default '',
  sizes text[] not null default '{}',
  image text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_created_idx on products (active, created_at desc);

create table if not exists settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null default 'Mi tienda',
  whatsapp_number text not null default '',
  currency text not null default 'ARS',
  updated_at timestamptz not null default now()
);

create table if not exists admin_credentials (
  id smallint primary key default 1 check (id = 1),
  password_hash text not null,
  created_at timestamptz not null default now()
);
