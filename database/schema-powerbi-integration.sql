-- ============================================
-- POWER BI INTEGRATION — API Keys & Logs
-- ============================================

-- 1. API KEYS (tokens d'accès API)
-- ============================================

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null default 'Power BI Integration',
  token_hash text not null unique,
  last_4 text not null, -- Derniers 4 caractères pour affichage
  created_by uuid references profiles(id),
  last_used_at timestamptz,
  expires_at timestamptz default (now() + interval '1 year'),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS API Keys
alter table api_keys enable row level security;

create policy "api_keys_by_org" on api_keys
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "api_keys_insert_by_admin" on api_keys
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid() and mode = 'admin')
  );

create policy "api_keys_delete_by_admin" on api_keys
  for delete using (
    organization_id = (select organization_id from profiles where id = auth.uid() and mode = 'admin')
  );

-- ============================================
-- 2. API LOGS (tracking des appels API)
-- ============================================

create table if not exists api_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  api_key_id uuid references api_keys(id) on delete set null,
  endpoint text not null,
  method text not null,
  status_code int,
  response_time_ms int,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- RLS API Logs
alter table api_logs enable row level security;

create policy "api_logs_by_org" on api_logs
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- Index pour performance
create index if not exists idx_api_keys_org on api_keys(organization_id);
create index if not exists idx_api_keys_token_hash on api_keys(token_hash) where is_active = true;
create index if not exists idx_api_logs_org on api_logs(organization_id);
create index if not exists idx_api_logs_created_at on api_logs(created_at desc);

-- ============================================
-- 3. POWER BI MODELS (fichiers .pbix)
-- ============================================

create table if not exists powerbi_models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  file_url text not null,
  preview_image_url text,
  category text check (category in ('executive','portfolio','risk','financial')) not null,
  is_pro_only boolean default false,
  downloads_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Power BI Models (public read)
alter table powerbi_models enable row level security;

create policy "powerbi_models_public_read" on powerbi_models
  for select using (true);

-- Index
create index if not exists idx_powerbi_models_category on powerbi_models(category);

-- ============================================
-- FIN SCHEMA POWER BI
-- ============================================
