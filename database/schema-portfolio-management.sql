-- ============================================
-- GESTION MULTI-PROJETS — Resources, Dependencies, Reports
-- ============================================

-- 1. RESOURCES (Personnes/équipes)
-- ============================================

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  role text not null,
  email text,
  fte_available numeric default 1.0,
  team text,
  cost_per_day numeric default 0,
  is_demo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Resources
alter table resources enable row level security;

create policy "resources_by_org" on resources
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "resources_write_by_editor" on resources
  for insert with check (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

create policy "resources_update_by_editor" on resources
  for update using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

create policy "resources_delete_by_admin" on resources
  for delete using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode = 'admin'
    )
  );

-- ============================================
-- 2. RESOURCE ALLOCATIONS (Affectations projets)
-- ============================================

create table if not exists resource_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  resource_id uuid references resources(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  fte numeric default 0.5,
  start_date date,
  end_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Resource Allocations
alter table resource_allocations enable row level security;

create policy "allocations_by_org" on resource_allocations
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "allocations_write_by_editor" on resource_allocations
  for insert with check (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

create policy "allocations_update_by_editor" on resource_allocations
  for update using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

create policy "allocations_delete_by_editor" on resource_allocations
  for delete using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

-- ============================================
-- 3. PROJECT DEPENDENCIES (Dépendances inter-projets)
-- ============================================

create table if not exists project_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  depends_on_project_id uuid references projects(id) on delete cascade,
  type text check (type in ('FS','SS','FF','SF')) default 'FS',
  lag_days int default 0,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint no_self_dependency check (project_id != depends_on_project_id)
);

-- RLS Project Dependencies
alter table project_dependencies enable row level security;

create policy "dependencies_by_org" on project_dependencies
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "dependencies_write_by_editor" on project_dependencies
  for insert with check (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

create policy "dependencies_update_by_editor" on project_dependencies
  for update using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

create policy "dependencies_delete_by_editor" on project_dependencies
  for delete using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() and mode in ('admin','editor')
    )
  );

-- ============================================
-- 4. PORTFOLIO REPORTS (Rapports consolidés)
-- ============================================

create table if not exists portfolio_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  title text not null,
  report_type text check (report_type in ('executive','risk','budget','status','custom')) default 'executive',
  content jsonb,
  generated_by uuid references profiles(id),
  generated_at timestamptz default now(),
  period_start date,
  period_end date
);

-- RLS Portfolio Reports
alter table portfolio_reports enable row level security;

create policy "reports_by_org" on portfolio_reports
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "reports_insert_by_member" on portfolio_reports
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 5. TRIGGERS (updated_at auto)
-- ============================================

create trigger update_resources_updated_at before update on resources
  for each row execute function update_updated_at_column();

create trigger update_allocations_updated_at before update on resource_allocations
  for each row execute function update_updated_at_column();

create trigger update_dependencies_updated_at before update on project_dependencies
  for each row execute function update_updated_at_column();

-- ============================================
-- 6. FONCTIONS RPC — Portfolio
-- ============================================

-- Fonction: Calculer la charge d'une ressource
create or replace function get_resource_load(p_resource_id uuid)
returns numeric as $$
declare
  v_total_fte numeric;
  v_available_fte numeric;
  v_load numeric;
begin
  -- Récupérer FTE disponible
  select fte_available into v_available_fte
  from resources
  where id = p_resource_id;

  -- Calculer total FTE alloué
  select sum(fte) into v_total_fte
  from resource_allocations
  where resource_id = p_resource_id
    and (end_date is null or end_date >= current_date);

  v_total_fte := coalesce(v_total_fte, 0);
  v_available_fte := coalesce(v_available_fte, 1);

  v_load := (v_total_fte / v_available_fte) * 100;

  return v_load;
end;
$$ language plpgsql security definer;

-- Fonction: Détecter les dépendances critiques
create or replace function get_critical_dependencies(p_organization_id uuid)
returns table(
  dependency_id uuid,
  project_name text,
  depends_on_name text,
  type text,
  project_status text,
  blocking_status text
) as $$
begin
  return query
  select 
    pd.id as dependency_id,
    p1.name as project_name,
    p2.name as depends_on_name,
    pd.type,
    p1.status as project_status,
    p2.status as blocking_status
  from project_dependencies pd
  join projects p1 on pd.project_id = p1.id
  join projects p2 on pd.depends_on_project_id = p2.id
  where pd.organization_id = p_organization_id
    and (
      p2.status in ('at_risk','blocked')
      or p2.progress < 50
    );
end;
$$ language plpgsql security definer;

-- Fonction: Générer résumé portefeuille
create or replace function get_portfolio_summary(p_organization_id uuid)
returns jsonb as $$
declare
  v_total_projects int;
  v_green_projects int;
  v_yellow_projects int;
  v_red_projects int;
  v_total_budget numeric;
  v_total_spent numeric;
  v_overallocated_resources int;
  v_critical_dependencies int;
  v_result jsonb;
begin
  -- Nombre de projets par status
  select 
    count(*),
    count(*) filter (where rag_status = 'GREEN'),
    count(*) filter (where rag_status = 'YELLOW'),
    count(*) filter (where rag_status = 'RED')
  into v_total_projects, v_green_projects, v_yellow_projects, v_red_projects
  from projects
  where organization_id = p_organization_id;

  -- Budget total
  select 
    coalesce(sum(budget), 0),
    coalesce(sum(spent), 0)
  into v_total_budget, v_total_spent
  from projects
  where organization_id = p_organization_id;

  -- Ressources sur-allouées
  select count(*) into v_overallocated_resources
  from resources r
  where r.organization_id = p_organization_id
    and get_resource_load(r.id) > 100;

  -- Dépendances critiques
  select count(*) into v_critical_dependencies
  from get_critical_dependencies(p_organization_id);

  v_result := jsonb_build_object(
    'total_projects', v_total_projects,
    'green_projects', v_green_projects,
    'yellow_projects', v_yellow_projects,
    'red_projects', v_red_projects,
    'health_score', round((v_green_projects::numeric / nullif(v_total_projects, 0)) * 100, 1),
    'total_budget', v_total_budget,
    'total_spent', v_total_spent,
    'budget_consumed_pct', round((v_total_spent / nullif(v_total_budget, 0)) * 100, 1),
    'overallocated_resources', v_overallocated_resources,
    'critical_dependencies', v_critical_dependencies
  );

  return v_result;
end;
$$ language plpgsql security definer;

-- Fonction: Seed demo resources
create or replace function seed_demo_resources(p_organization_id uuid)
returns void as $$
declare
  v_resource1_id uuid;
  v_resource2_id uuid;
  v_resource3_id uuid;
  v_project1_id uuid;
  v_project2_id uuid;
begin
  -- Récupérer 2 projets demo
  select id into v_project1_id
  from projects
  where organization_id = p_organization_id
    and is_demo = true
  limit 1;

  select id into v_project2_id
  from projects
  where organization_id = p_organization_id
    and is_demo = true
    and id != v_project1_id
  limit 1;

  -- Créer 3 ressources demo
  insert into resources (organization_id, name, role, fte_available, team, is_demo)
  values 
    (p_organization_id, 'Sophie Martin', 'Lead Developer', 1.0, 'Engineering', true),
    (p_organization_id, 'Marc Dubois', 'Project Manager', 1.0, 'PMO', true),
    (p_organization_id, 'Julie Bernard', 'UX Designer', 0.8, 'Design', true)
  returning id into v_resource1_id;

  select id into v_resource2_id from resources 
  where organization_id = p_organization_id and name = 'Marc Dubois';

  select id into v_resource3_id from resources 
  where organization_id = p_organization_id and name = 'Julie Bernard';

  -- Créer allocations (sur-allocation sur resource1)
  if v_project1_id is not null and v_project2_id is not null then
    insert into resource_allocations (organization_id, resource_id, project_id, fte)
    values
      (p_organization_id, v_resource1_id, v_project1_id, 0.7),
      (p_organization_id, v_resource1_id, v_project2_id, 0.5),
      (p_organization_id, v_resource2_id, v_project1_id, 0.5),
      (p_organization_id, v_resource3_id, v_project2_id, 0.4);

    -- Créer 1 dépendance demo
    insert into project_dependencies (organization_id, project_id, depends_on_project_id, type)
    values (p_organization_id, v_project2_id, v_project1_id, 'FS');
  end if;
end;
$$ language plpgsql security definer;

-- ============================================
-- 7. INDEXES (performance)
-- ============================================

create index if not exists idx_resources_org on resources(organization_id);
create index if not exists idx_resources_team on resources(team);
create index if not exists idx_allocations_resource on resource_allocations(resource_id);
create index if not exists idx_allocations_project on resource_allocations(project_id);
create index if not exists idx_allocations_org on resource_allocations(organization_id);
create index if not exists idx_dependencies_project on project_dependencies(project_id);
create index if not exists idx_dependencies_depends on project_dependencies(depends_on_project_id);
create index if not exists idx_dependencies_org on project_dependencies(organization_id);
create index if not exists idx_reports_org on portfolio_reports(organization_id);
create index if not exists idx_reports_type on portfolio_reports(report_type);

-- ============================================
-- 8. COMMENTAIRES — Documentation
-- ============================================

comment on table resources is 'Personnes et équipes du portfolio';
comment on table resource_allocations is 'Affectations FTE par projet';
comment on table project_dependencies is 'Dépendances inter-projets (FS/SS/FF/SF)';
comment on table portfolio_reports is 'Rapports consolidés générés';

comment on function get_resource_load(uuid) is 
  'Calcule la charge % d''une ressource (FTE alloué / FTE disponible)';

comment on function get_critical_dependencies(uuid) is 
  'Retourne les dépendances où le projet bloquant est à risque';

comment on function get_portfolio_summary(uuid) is 
  'Génère un résumé JSON du portefeuille (santé, budget, alertes)';

-- ============================================
-- FIN SCHEMA PORTFOLIO MANAGEMENT
-- ============================================
