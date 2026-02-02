-- ============================================
-- SCHEMA AGILE COMPLET — Sprints, Stories, Velocity
-- ============================================

-- 0. AGILE SETTINGS (Méthodologie)
-- ============================================

create table if not exists agile_settings (
  organization_id uuid primary key references organizations(id),
  methodology text check (methodology in ('scrum','kanban','hybride')) default 'scrum',
  sprint_duration_weeks int default 2,
  ceremonies jsonb default '{"daily":true,"review":true,"retro":true}'::jsonb,
  updated_at timestamptz default now()
);

-- RLS Agile Settings
alter table agile_settings enable row level security;

create policy "agile_settings_by_org" on agile_settings
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "agile_settings_upsert_by_admin" on agile_settings
  for all using (
    organization_id = (select organization_id from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 1. EPICS (Fonctionnalités majeures)
-- ============================================

create table if not exists epics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  project_id uuid references projects(id),
  name text not null,
  description text,
  color text default '#D4AF37',
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Epics
alter table epics enable row level security;

create policy "epics_by_org" on epics
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "epics_insert_by_member" on epics
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 2. SPRINTS
-- ============================================

create table if not exists sprints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  project_id uuid references projects(id),
  name text not null,
  goal text,
  start_date date,
  end_date date,
  duration_weeks int default 2,
  status text check (status in ('not_started','active','completed')) default 'not_started',
  is_demo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Sprints
alter table sprints enable row level security;

create policy "sprints_by_org" on sprints
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "sprints_insert_by_member" on sprints
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "sprints_update_by_member" on sprints
  for update using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 3. USER STORIES
-- ============================================

create table if not exists user_stories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  project_id uuid references projects(id),
  sprint_id uuid references sprints(id),
  epic_id uuid references epics(id),
  title text not null,
  description text,
  story_points int default 0,
  priority int default 0,
  status text check (status in ('todo','doing','done')) default 'todo',
  assignee_id uuid references profiles(id),
  position int default 0,
  is_demo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS User Stories
alter table user_stories enable row level security;

create policy "stories_by_org" on user_stories
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "stories_insert_by_member" on user_stories
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "stories_update_by_member" on user_stories
  for update using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 4. VELOCITY (historique des sprints)
-- ============================================

create table if not exists velocity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  project_id uuid references projects(id),
  sprint_id uuid references sprints(id),
  planned_points int default 0,
  completed_points int default 0,
  created_at timestamptz default now()
);

-- RLS Velocity
alter table velocity enable row level security;

create policy "velocity_by_org" on velocity
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "velocity_insert_by_member" on velocity
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 5. RETROSPECTIVES
-- ============================================

create table if not exists retrospectives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  sprint_id uuid references sprints(id),
  category text check (category in ('went_well','to_improve','action_items')) not null,
  content text not null,
  author_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- RLS Retrospectives
alter table retrospectives enable row level security;

create policy "retrospectives_by_org" on retrospectives
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "retrospectives_insert_by_member" on retrospectives
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 6. TRIGGERS (updated_at auto)
-- ============================================

create trigger update_epics_updated_at before update on epics
  for each row execute function update_updated_at_column();

create trigger update_sprints_updated_at before update on sprints
  for each row execute function update_updated_at_column();

create trigger update_user_stories_updated_at before update on user_stories
  for each row execute function update_updated_at_column();

-- ============================================
-- 7. FONCTIONS RPC — Agile
-- ============================================

-- Fonction: Calculer la vélocité moyenne
create or replace function get_average_velocity(
  p_organization_id uuid,
  p_project_id uuid,
  p_limit int default 3
)
returns numeric as $$
declare
  v_avg numeric;
begin
  select avg(completed_points) into v_avg
  from velocity
  where organization_id = p_organization_id
    and project_id = p_project_id
  order by created_at desc
  limit p_limit;

  return coalesce(v_avg, 0);
end;
$$ language plpgsql security definer;

-- Fonction: Calculer le burndown d'un sprint
create or replace function get_burndown_data(p_sprint_id uuid)
returns json as $$
declare
  v_total_points int;
  v_completed_points int;
  v_remaining_points int;
  v_result json;
begin
  -- Total story points du sprint
  select sum(story_points) into v_total_points
  from user_stories
  where sprint_id = p_sprint_id;

  -- Points complétés
  select sum(story_points) into v_completed_points
  from user_stories
  where sprint_id = p_sprint_id and status = 'done';

  v_remaining_points := coalesce(v_total_points, 0) - coalesce(v_completed_points, 0);

  select json_build_object(
    'total_points', coalesce(v_total_points, 0),
    'completed_points', coalesce(v_completed_points, 0),
    'remaining_points', v_remaining_points
  ) into v_result;

  return v_result;
end;
$$ language plpgsql security definer;

-- Fonction: Terminer un sprint et enregistrer vélocité
create or replace function complete_sprint(p_sprint_id uuid)
returns json as $$
declare
  v_sprint record;
  v_completed_points int;
  v_planned_points int;
  v_result json;
begin
  -- Récupérer le sprint
  select * into v_sprint from sprints where id = p_sprint_id;

  if not found then
    raise exception 'Sprint not found';
  end if;

  -- Calculer points complétés
  select sum(story_points) into v_completed_points
  from user_stories
  where sprint_id = p_sprint_id and status = 'done';

  -- Calculer points planifiés
  select sum(story_points) into v_planned_points
  from user_stories
  where sprint_id = p_sprint_id;

  -- Mettre à jour le sprint
  update sprints set status = 'completed' where id = p_sprint_id;

  -- Enregistrer vélocité
  insert into velocity (organization_id, project_id, sprint_id, planned_points, completed_points)
  values (v_sprint.organization_id, v_sprint.project_id, p_sprint_id, 
          coalesce(v_planned_points, 0), coalesce(v_completed_points, 0));

  select json_build_object(
    'sprint_id', p_sprint_id,
    'planned_points', coalesce(v_planned_points, 0),
    'completed_points', coalesce(v_completed_points, 0)
  ) into v_result;

  return v_result;
end;
$$ language plpgsql security definer;

-- Fonction: Seed demo agile data
create or replace function seed_demo_agile_data(
  p_profile_id uuid,
  p_project_id uuid
)
returns void as $$
declare
  v_org_id uuid;
  v_sprint_id uuid;
  v_epic1_id uuid;
  v_epic2_id uuid;
begin
  -- Récupérer l'org
  select organization_id into v_org_id
  from profiles where id = p_profile_id;

  -- Créer 2 epics demo
  insert into epics (organization_id, project_id, name, color)
  values 
    (v_org_id, p_project_id, 'Epic 1 — Authentification', '#3DD68C'),
    (v_org_id, p_project_id, 'Epic 2 — Dashboard', '#D4AF37')
  returning id into v_epic1_id;

  select id into v_epic2_id from epics 
  where organization_id = v_org_id 
    and project_id = p_project_id 
    and name = 'Epic 2 — Dashboard';

  -- Créer 1 sprint demo actif
  insert into sprints (organization_id, project_id, name, goal, status, is_demo, start_date, end_date)
  values (v_org_id, p_project_id, 'Sprint Demo 1', 'Livrer les fonctionnalités d''authentification', 
          'active', true, current_date - interval '7 days', current_date + interval '7 days')
  returning id into v_sprint_id;

  -- Créer 10 stories demo
  insert into user_stories (organization_id, project_id, sprint_id, epic_id, title, story_points, status, is_demo)
  values
    (v_org_id, p_project_id, v_sprint_id, v_epic1_id, 'US-1 : Login utilisateur', 5, 'done', true),
    (v_org_id, p_project_id, v_sprint_id, v_epic1_id, 'US-2 : Mot de passe oublié', 3, 'done', true),
    (v_org_id, p_project_id, v_sprint_id, v_epic1_id, 'US-3 : Session persistante', 2, 'doing', true),
    (v_org_id, p_project_id, v_sprint_id, v_epic2_id, 'US-4 : Dashboard principal', 8, 'doing', true),
    (v_org_id, p_project_id, v_sprint_id, v_epic2_id, 'US-5 : Graphiques KPI', 5, 'todo', true),
    (v_org_id, p_project_id, null, v_epic1_id, 'US-6 : 2FA', 3, 'todo', true),
    (v_org_id, p_project_id, null, v_epic2_id, 'US-7 : Exports PDF', 3, 'todo', true),
    (v_org_id, p_project_id, null, v_epic2_id, 'US-8 : Filtres avancés', 2, 'todo', true),
    (v_org_id, p_project_id, null, v_epic1_id, 'US-9 : Gestion permissions', 5, 'todo', true),
    (v_org_id, p_project_id, null, v_epic2_id, 'US-10 : Notifications', 3, 'todo', true);

  -- Enregistrer vélocité fictive pour 3 sprints précédents
  insert into velocity (organization_id, project_id, sprint_id, planned_points, completed_points)
  values
    (v_org_id, p_project_id, gen_random_uuid(), 30, 28),
    (v_org_id, p_project_id, gen_random_uuid(), 32, 30),
    (v_org_id, p_project_id, gen_random_uuid(), 28, 26);
end;
$$ language plpgsql security definer;

-- ============================================
-- 8. INDEXES (performance)
-- ============================================

create index if not exists idx_epics_org on epics(organization_id);
create index if not exists idx_epics_project on epics(project_id);
create index if not exists idx_sprints_org on sprints(organization_id);
create index if not exists idx_sprints_project on sprints(project_id);
create index if not exists idx_user_stories_org on user_stories(organization_id);
create index if not exists idx_user_stories_project on user_stories(project_id);
create index if not exists idx_user_stories_sprint on user_stories(sprint_id);
create index if not exists idx_velocity_org on velocity(organization_id);
create index if not exists idx_velocity_sprint on velocity(sprint_id);
create index if not exists idx_retrospectives_org on retrospectives(organization_id);
create index if not exists idx_retrospectives_sprint on retrospectives(sprint_id);

-- ============================================
-- FIN SCHEMA AGILE
-- ============================================
