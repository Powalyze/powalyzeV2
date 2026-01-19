-- ============================================================
-- POWALYZE — SCHEMA COCKPIT CLIENT (SUPABASE)
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
-- drop table if exists organization_memberships cascade;
-- drop table if exists users cascade;
-- drop table if exists organizations cascade;

-- ============================================================
-- CRÉATION DES TABLES
-- ============================================================

-- Organizations
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  created_at timestamptz default now()
);

-- Organization Memberships
create table if not exists organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text check (role in ('owner', 'admin', 'member', 'viewer')) not null default 'member',
  status text check (status in ('active', 'invited')) not null default 'invited',
  invited_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Cockpit KPIs
create table if not exists cockpit_kpis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  label text not null,
  value numeric not null,
  unit text,
  trend text check (trend in ('up', 'down', 'flat')) not null,
  variation_pct numeric not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  critical boolean default false,
  created_at timestamptz default now()
);

-- Governance Signals
create table if not exists governance_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  pillar text check (pillar in ('Finance', 'People', 'Clients', 'Operations', 'Innovation')) not null,
  title text not null,
  description text not null,
  risk text check (risk in ('low', 'medium', 'high')) not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  confidence numeric check (confidence >= 0 and confidence <= 1) not null,
  suggested_action text not null,
  created_at timestamptz default now()
);

-- Scenarios
create table if not exists scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  label text not null,
  description text not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  impact_score numeric check (impact_score >= 0 and impact_score <= 100) not null,
  upside text not null,
  downside text not null,
  created_at timestamptz default now()
);

-- Executive Stories
create table if not exists executive_stories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  title text not null,
  narrative text not null,
  horizon text check (horizon in ('S1', 'S2', 'S3')) not null,
  focus_pillars text[] not null,
  recommended_next_steps text[] not null,
  created_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  description text,
  status text check (status in ('active', 'on_hold', 'closed')) not null default 'active',
  owner_id uuid references users(id),
  created_at timestamptz default now()
);

-- Risks
create table if not exists risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  project_id uuid references projects(id),
  title text not null,
  description text not null,
  level text check (level in ('low', 'medium', 'high')) not null,
  probability numeric check (probability >= 0 and probability <= 1) not null,
  impact numeric check (impact >= 0 and impact <= 1) not null,
  status text check (status in ('open', 'mitigated', 'closed')) not null default 'open',
  owner_id uuid references users(id),
  created_at timestamptz default now()
);

-- Decisions
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  title text not null,
  description text not null,
  committee text not null,
  date date not null,
  status text check (status in ('open', 'applied', 'archived')) not null default 'open',
  owner_id uuid references users(id),
  impacts text,
  created_at timestamptz default now()
);

-- Integrations
create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  type text check (type in ('powerbi', 'jira', 'sharepoint', 'sql', 'custom')) not null,
  name text not null,
  status text check (status in ('connected', 'pending', 'error')) not null default 'pending',
  config jsonb,
  created_at timestamptz default now()
);

-- Vue cockpit snapshot (optionnelle pour performance)
create materialized view if not exists cockpit_snapshot_latest as
select
  o.id as organization_id,
  o.name as organization_name,
  now() as snapshot_at,
  jsonb_agg(
    jsonb_build_object(
      'id', k.id,
      'label', k.label,
      'value', k.value,
      'unit', k.unit,
      'trend', k.trend,
      'variationPct', k.variation_pct,
      'horizon', k.horizon,
      'critical', k.critical
    )
  ) as kpis
from organizations o
left join cockpit_kpis k on k.organization_id = o.id
group by o.id, o.name;

-- Indexes pour performance
create index if not exists idx_org_memberships_org on organization_memberships(organization_id);
create index if not exists idx_org_memberships_user on organization_memberships(user_id);
create index if not exists idx_cockpit_kpis_org on cockpit_kpis(organization_id);
create index if not exists idx_governance_signals_org on governance_signals(organization_id);
create index if not exists idx_scenarios_org on scenarios(organization_id);
create index if not exists idx_executive_stories_org on executive_stories(organization_id);
create index if not exists idx_projects_org on projects(organization_id);
create index if not exists idx_risks_org on risks(organization_id);
create index if not exists idx_risks_project on risks(project_id);
create index if not exists idx_decisions_org on decisions(organization_id);
create index if not exists idx_integrations_org on integrations(organization_id);

-- Row Level Security (RLS) — À activer selon votre politique d'accès
-- alter table organizations enable row level security;
-- alter table users enable row level security;
-- alter table organization_memberships enable row level security;
-- etc.

-- Exemple de politique RLS (à adapter)
-- create policy "Users can view their organization data"
--   on cockpit_kpis for select
--   using (
--     exists (
--       select 1 from organization_memberships
--       where organization_id = cockpit_kpis.organization_id
--       and user_id = auth.uid()
--       and status = 'active'
--     )
--   );
