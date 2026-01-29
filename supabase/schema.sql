-- ============================================================
-- POWALYZE - SCHEMA PRO/DEMO - MULTI-TENANT avec organization_members
-- ============================================================

-- Drop existing tables (CASCADE supprime automatiquement les policies)
drop table if exists reports cascade;
drop table if exists decisions cascade;
drop table if exists risks cascade;
drop table if exists projects cascade;
drop table if exists invitations cascade;
drop table if exists organization_members cascade;
drop table if exists profiles cascade;
drop table if exists organizations cascade;

-- ======================
-- STEP 1: CREATE TABLES
-- ======================

-- ORGANIZATIONS TABLE
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now()
);

-- PROFILES TABLE
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  first_name text,
  last_name text,
  company text,
  mode text check (mode in ('demo', 'pro')),
  role text check (role in ('admin', 'member')) default 'member',
  organization_id uuid,
  created_at timestamp with time zone default now()
);

-- ORGANIZATION_MEMBERS TABLE
create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default now()
);

-- INVITATIONS TABLE
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade,
  email text not null,
  role text check (role in ('admin', 'member')) default 'member',
  status text check (status in ('pending', 'accepted', 'expired')) default 'pending',
  token text not null,
  created_at timestamp with time zone default now()
);

-- PROJECTS TABLE
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade,
  title text not null,
  status text,
  owner text,
  priority text,
  description text,
  progress integer default 0,
  budget numeric,
  created_at timestamptz default now()
);

-- RISKS TABLE
create table if not exists risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade,
  title text not null,
  description text,
  level text,
  owner text,
  created_at timestamptz default now()
);

-- DECISIONS TABLE
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade,
  title text not null,
  description text,
  status text,
  owner text,
  created_at timestamptz default now()
);

-- REPORTS TABLE
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade,
  title text not null,
  content text,
  scope text,
  report_date text,
  created_at timestamptz default now()
);

-- ======================
-- STEP 2: ENABLE RLS
-- ======================

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table organization_members enable row level security;
alter table invitations enable row level security;
alter table projects enable row level security;
alter table risks enable row level security;
alter table decisions enable row level security;
alter table reports enable row level security;

-- ======================
-- STEP 3: CREATE POLICIES
-- ======================

-- Organizations policies
create policy "org_select" on organizations
  for select using (auth.uid() = owner_id);

create policy "org_insert" on organizations
  for insert with check (auth.uid() = owner_id);

-- Profiles policies
create policy "profiles_select" on profiles
  for select using (auth.uid() = id);

create policy "profiles_insert" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update" on profiles
  for update using (auth.uid() = id);

-- Organization_members policies
create policy "org_members_select" on organization_members
  for select using (auth.uid() = user_id);

create policy "org_members_insert" on organization_members
  for insert with check (auth.uid() = user_id);

-- Invitations policies
create policy "inv_select" on invitations
  for select using (true);

create policy "inv_insert" on invitations
  for insert with check (true);

create policy "inv_update" on invitations
  for update using (true);

-- Projects policies (accès via organization_members)
create policy "projects_select" on projects
  for select using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = projects.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "projects_insert" on projects
  for insert with check (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = projects.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "projects_update" on projects
  for update using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = projects.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "projects_delete" on projects
  for delete using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = projects.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

-- Risks policies
create policy "risks_select" on risks
  for select using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = risks.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "risks_insert" on risks
  for insert with check (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = risks.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "risks_update" on risks
  for update using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = risks.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "risks_delete" on risks
  for delete using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = risks.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

-- Decisions policies
create policy "decisions_select" on decisions
  for select using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = decisions.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "decisions_insert" on decisions
  for insert with check (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = decisions.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "decisions_update" on decisions
  for update using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = decisions.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "decisions_delete" on decisions
  for delete using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = decisions.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

-- Reports policies
create policy "reports_select" on reports
  for select using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = reports.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "reports_insert" on reports
  for insert with check (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = reports.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "reports_update" on reports
  for update using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = reports.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "reports_delete" on reports
  for delete using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = reports.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );
