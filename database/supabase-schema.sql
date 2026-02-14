-- ============================================================
-- POWALYZE — SCHEMA COCKPIT CLIENT (SUPABASE)
-- Architecture simplifiée - Ownership basé sur auth.users
-- ============================================================

-- ⚠️ IMPORTANT: Si vous avez des tables existantes, supprimez-les d'abord
-- Décommentez ces lignes pour nettoyer l'ancienne structure :

-- drop materialized view if exists cockpit_snapshot_latest cascade;
-- drop table if exists integrations cascade;
-- drop table if exists decisions cascade;
-- drop table if exists risks cascade;
-- drop table if exists projects cascade;
-- drop table if exists executive_stories cascade;
-- drop table if exists scenarios cascade;
-- drop table if exists governance_signals cascade;
-- drop table if exists cockpit_kpis cascade;
-- drop table if exists connectors cascade;

-- ============================================================
-- EXTENSION REQUISE
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILS UTILISATEURS (Extension de auth.users)
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('demo', 'pro', 'pro-owner', 'pro-member', 'admin')) default 'demo',
  pro_active boolean default false,
  tenant_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS pour profiles
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ============================================================
-- TABLES COCKPIT (Ownership simple via owner_id)
-- ============================================================

-- Cockpit KPIs
create table if not exists cockpit_kpis (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  value numeric not null,
  unit text,
  trend text check (trend in ('up', 'down', 'flat')) not null,
  variation_pct numeric not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  critical boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Governance Signals
create table if not exists governance_signals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  pillar text check (pillar in ('Finance', 'People', 'Clients', 'Operations', 'Innovation')) not null,
  title text not null,
  description text not null,
  risk text check (risk in ('low', 'medium', 'high')) not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  confidence numeric check (confidence >= 0 and confidence <= 1) not null,
  suggested_action text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Scenarios
create table if not exists scenarios (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  description text not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  impact_score numeric check (impact_score >= 0 and impact_score <= 100) not null,
  upside text not null,
  downside text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Executive Stories
create table if not exists executive_stories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  narrative text not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  focus_pillars text[] not null,
  recommended_next_steps text[] not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text check (status in ('planned', 'in_progress', 'on_hold', 'done', 'cancelled')) not null default 'planned',
  health text check (health in ('green', 'yellow', 'red')) default 'green',
  progress integer default 0 check (progress >= 0 and progress <= 100),
  owner text,
  start_date text,
  end_date text,
  deadline text,
  starred boolean default false,
  budget_planned numeric,
  budget_spent numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Risks
create table if not exists risks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text not null,
  level text check (level in ('low', 'medium', 'high', 'critical')) not null,
  probability numeric check (probability >= 0 and probability <= 1) not null,
  impact numeric check (impact >= 0 and impact <= 1) not null,
  status text check (status in ('open', 'mitigated', 'closed')) not null default 'open',
  owner text,
  mitigation text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Decisions
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  description text not null,
  committee text not null,
  date date not null,
  status text check (status in ('pending', 'approved', 'rejected', 'applied')) not null default 'pending',
  decision_maker text,
  impacts text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Connectors (anciennement Integrations)
create table if not exists connectors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text,
  connector_type text check (connector_type in ('file', 'powerbi', 'jira', 'sharepoint', 'sql', 'api')) not null,
  name text not null,
  status text check (status in ('connected', 'pending', 'error', 'active')) not null default 'pending',
  config jsonb,
  metadata jsonb,
  last_sync timestamptz,
  last_sync_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes pour performance
create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_cockpit_kpis_owner on cockpit_kpis(owner_id);
create index if not exists idx_governance_signals_owner on governance_signals(owner_id);
create index if not exists idx_scenarios_owner on scenarios(owner_id);
create index if not exists idx_executive_stories_owner on executive_stories(owner_id);
create index if not exists idx_projects_owner on projects(owner_id);
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_risks_owner on risks(owner_id);
create index if not exists idx_risks_project on risks(project_id);
create index if not exists idx_decisions_owner on decisions(owner_id);
create index if not exists idx_decisions_project on decisions(project_id);
create index if not exists idx_connectors_user on connectors(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Politique simple par utilisateur
-- ============================================================

-- RLS pour les tables cockpit (les utilisateurs ne voient que leurs propres données)
alter table cockpit_kpis enable row level security;
alter table governance_signals enable row level security;
alter table scenarios enable row level security;
alter table executive_stories enable row level security;
alter table projects enable row level security;
alter table risks enable row level security;
alter table decisions enable row level security;
alter table connectors enable row level security;

-- Politiques RLS: Accès complet aux propres données
create policy "Users manage own kpis"
  on cockpit_kpis for all
  using (auth.uid() = owner_id);

create policy "Users manage own signals"
  on governance_signals for all
  using (auth.uid() = owner_id);

create policy "Users manage own scenarios"
  on scenarios for all
  using (auth.uid() = owner_id);

create policy "Users manage own stories"
  on executive_stories for all
  using (auth.uid() = owner_id);

create policy "Users manage own projects"
  on projects for all
  using (auth.uid() = owner_id);

create policy "Users manage own risks"
  on risks for all
  using (auth.uid() = owner_id);

create policy "Users manage own decisions"
  on decisions for all
  using (auth.uid() = owner_id);

create policy "Users manage own connectors"
  on connectors for all
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS pour updated_at automatique
-- ============================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Appliquer le trigger à toutes les tables avec updated_at
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

drop trigger if exists update_cockpit_kpis_updated_at on cockpit_kpis;
create trigger update_cockpit_kpis_updated_at before update on cockpit_kpis
  for each row execute function update_updated_at_column();

drop trigger if exists update_governance_signals_updated_at on governance_signals;
create trigger update_governance_signals_updated_at before update on governance_signals
  for each row execute function update_updated_at_column();

drop trigger if exists update_scenarios_updated_at on scenarios;
create trigger update_scenarios_updated_at before update on scenarios
  for each row execute function update_updated_at_column();

drop trigger if exists update_executive_stories_updated_at on executive_stories;
create trigger update_executive_stories_updated_at before update on executive_stories
  for each row execute function update_updated_at_column();

drop trigger if exists update_projects_updated_at on projects;
create trigger update_projects_updated_at before update on projects
  for each row execute function update_updated_at_column();

drop trigger if exists update_risks_updated_at on risks;
create trigger update_risks_updated_at before update on risks
  for each row execute function update_updated_at_column();

drop trigger if exists update_decisions_updated_at on decisions;
create trigger update_decisions_updated_at before update on decisions
  for each row execute function update_updated_at_column();

drop trigger if exists update_connectors_updated_at on connectors;
create trigger update_connectors_updated_at before update on connectors
  for each row execute function update_updated_at_column();
