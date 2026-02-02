-- ============================================
-- SCHEMA COMPLET POWALYZE — Configuration initiale SaaS
-- ============================================

-- 1. ORGANIZATIONS
-- ============================================

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  timezone text default 'Europe/Paris',
  currency text default 'EUR',
  language text default 'fr',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Organizations
alter table organizations enable row level security;

create policy "org_by_member" on organizations
  for select using (
    id = (select organization_id from profiles where id = auth.uid())
  );

create policy "org_update_by_admin" on organizations
  for update using (
    id in (
      select organization_id from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- 2. PROFILES (extension de auth.users)
-- ============================================

create type user_plan as enum ('demo', 'pro', 'enterprise');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id),
  plan user_plan default 'demo',
  pro_active boolean default false,
  role text check (role in ('admin','editor','viewer')) default 'admin',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Profiles
alter table profiles enable row level security;

create policy "profile_self" on profiles
  for select using (id = auth.uid());

create policy "profiles_by_org" on profiles
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 3. INVITATIONS
-- ============================================

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  email text not null,
  role text check (role in ('admin','editor','viewer')) not null,
  message text,
  token text not null unique,
  accepted boolean default false,
  created_at timestamptz default now()
);

-- RLS Invitations
alter table invitations enable row level security;

create policy "invitations_by_org" on invitations
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "invitations_insert_by_admin" on invitations
  for insert with check (
    organization_id in (
      select organization_id from profiles 
      where id = auth.uid() and role in ('admin', 'editor')
    )
  );

-- ============================================
-- 4. PROJECTS (ajout champs onboarding)
-- ============================================

alter table projects add column if not exists objectives text;
alter table projects add column if not exists owner_id uuid references profiles(id);
alter table projects add column if not exists start_date date;
alter table projects add column if not exists due_date date;
alter table projects add column if not exists budget numeric;
alter table projects add column if not exists tags text[];
alter table projects add column if not exists is_demo boolean default false;

-- RLS Projects
alter table projects enable row level security;

create policy "projects_by_org" on projects
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "projects_insert_by_member" on projects
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "projects_update_by_owner_or_admin" on projects
  for update using (
    owner_id = auth.uid() or 
    organization_id in (
      select organization_id from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- 5. DASHBOARD WIDGETS (personnalisation)
-- ============================================

create table if not exists dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  type text not null, -- 'projects', 'risks', 'decisions', 'powerbi', 'kpi', 'activity'
  position int not null default 0,
  enabled boolean default true,
  config jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Dashboard Widgets
alter table dashboard_widgets enable row level security;

create policy "widgets_self" on dashboard_widgets
  for all using (profile_id = auth.uid());

-- ============================================
-- 6. TRIGGERS (updated_at auto)
-- ============================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_organizations_updated_at before update on organizations
  for each row execute function update_updated_at_column();

create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_dashboard_widgets_updated_at before update on dashboard_widgets
  for each row execute function update_updated_at_column();

-- ============================================
-- 7. FONCTION RPC — Create Organization + Profile
-- ============================================

create or replace function create_organization_with_profile(
  p_user_id uuid,
  p_org_name text,
  p_plan user_plan default 'demo'
)
returns json as $$
declare
  v_org_id uuid;
  v_result json;
begin
  -- Vérifier si l'utilisateur a déjà une org
  if exists (select 1 from profiles where id = p_user_id) then
    raise exception 'User already has an organization';
  end if;

  -- Créer l'organisation
  insert into organizations (name)
  values (p_org_name)
  returning id into v_org_id;

  -- Créer le profil
  insert into profiles (id, organization_id, plan, pro_active, role)
  values (p_user_id, v_org_id, p_plan, (p_plan = 'pro'), 'admin');

  -- Retourner les infos
  select json_build_object(
    'organization_id', v_org_id,
    'plan', p_plan,
    'role', 'admin'
  ) into v_result;

  return v_result;
end;
$$ language plpgsql security definer;

-- ============================================
-- 8. SEED DEMO DATA (optionnel)
-- ============================================

-- Fonction pour créer des projets demo pour un user
create or replace function seed_demo_projects(p_profile_id uuid)
returns void as $$
declare
  v_org_id uuid;
begin
  -- Récupérer l'org du profil
  select organization_id into v_org_id
  from profiles where id = p_profile_id;

  -- Insérer 3 projets demo
  insert into projects (organization_id, name, description, status, rag_status, is_demo, owner_id)
  values
    (v_org_id, 'Projet Demo 1 — Transformation Digitale', 'Migration vers le cloud et modernisation des applications', 'en_cours', 'GREEN', true, p_profile_id),
    (v_org_id, 'Projet Demo 2 — CRM Interne', 'Déploiement d''un nouveau système CRM pour l''équipe commerciale', 'en_cours', 'YELLOW', true, p_profile_id),
    (v_org_id, 'Projet Demo 3 — Plateforme BI', 'Mise en place d''une plateforme Business Intelligence avec Power BI', 'planification', 'RED', true, p_profile_id);
end;
$$ language plpgsql security definer;

-- ============================================
-- 9. INDEXES (performance)
-- ============================================

create index if not exists idx_profiles_org on profiles(organization_id);
create index if not exists idx_invitations_org on invitations(organization_id);
create index if not exists idx_invitations_token on invitations(token);
create index if not exists idx_projects_org on projects(organization_id);
create index if not exists idx_projects_owner on projects(owner_id);
create index if not exists idx_dashboard_widgets_profile on dashboard_widgets(profile_id);

-- ============================================
-- FIN SCHEMA
-- ============================================
