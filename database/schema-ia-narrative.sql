-- ============================================
-- IA NARRATIVE & RAPPORTS — Settings & Prompts
-- ============================================

-- 1. AI SETTINGS (Configuration IA)
-- ============================================

create table if not exists ai_settings (
  organization_id uuid primary key references organizations(id) on delete cascade,
  enabled boolean default false,
  model text check (model in ('gpt4','claude','azure')) default 'gpt4',
  tone text check (tone in ('formel','executif','technique')) default 'executif',
  updated_at timestamptz default now()
);

-- RLS AI Settings
alter table ai_settings enable row level security;

create policy "ai_settings_by_org" on ai_settings
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "ai_settings_upsert_by_admin" on ai_settings
  for all using (
    organization_id = (select organization_id from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 2. AI PROMPTS (Prompts personnalisés)
-- ============================================

create table if not exists ai_prompts (
  organization_id uuid references organizations(id) on delete cascade,
  type text check (type in ('global','comex','risks','decisions','kpi')) not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (organization_id, type)
);

-- RLS AI Prompts
alter table ai_prompts enable row level security;

create policy "ai_prompts_by_org" on ai_prompts
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "ai_prompts_upsert_by_admin" on ai_prompts
  for all using (
    organization_id = (select organization_id from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 3. AI GENERATIONS (Historique des rapports)
-- ============================================

create table if not exists ai_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  type text check (type in ('comex','risk_analysis','project_summary','kpi_alert','custom')) not null,
  prompt_used text,
  input_data jsonb,
  output_content text,
  model_used text,
  tone_used text,
  generation_time_ms int,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- RLS AI Generations
alter table ai_generations enable row level security;

create policy "ai_generations_by_org" on ai_generations
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "ai_generations_insert_by_member" on ai_generations
  for insert with check (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- ============================================
-- 4. TRIGGERS & FUNCTIONS
-- ============================================

create trigger update_ai_settings_updated_at before update on ai_settings
  for each row execute function update_updated_at_column();

create trigger update_ai_prompts_updated_at before update on ai_prompts
  for each row execute function update_updated_at_column();

-- Function: Get default prompts
create or replace function get_default_ai_prompts()
returns jsonb as $$
begin
  return jsonb_build_object(
    'global', 'Vous êtes un assistant IA spécialisé en gestion de portefeuille de projets. Analysez les données fournies et produisez des synthèses claires et actionnables.',
    'comex', 'Rédige un brief exécutif de 500 mots maximum, en mettant l''accent sur les décisions à prendre et les risques financiers. Utilise un ton factuel et précis. Structurez en 4 sections : Synthèse, Projets Critiques, Top Risques, Recommandations.',
    'risks', 'Analyse les risques fournis et identifie les 5 plus critiques. Pour chaque risque, évalue la probabilité d''occurrence, l''impact potentiel et recommande des actions de mitigation concrètes.',
    'decisions', 'Synthétise les décisions stratégiques récentes en identifiant leur impact sur le portefeuille, les dépendances entre décisions et les actions de suivi nécessaires.',
    'kpi', 'Analyse les KPI fournis et détecte les dérives significatives. Pour chaque dérive, identifie la cause probable, l''impact sur les objectifs et recommande des actions correctives.'
  );
end;
$$ language plpgsql immutable;

-- Function: Get AI settings with defaults
create or replace function get_ai_settings_with_defaults(p_organization_id uuid)
returns jsonb as $$
declare
  v_settings record;
  v_result jsonb;
begin
  select * into v_settings
  from ai_settings
  where organization_id = p_organization_id;

  if not found then
    -- Return defaults
    v_result := jsonb_build_object(
      'enabled', false,
      'model', 'gpt4',
      'tone', 'executif'
    );
  else
    v_result := jsonb_build_object(
      'enabled', v_settings.enabled,
      'model', v_settings.model,
      'tone', v_settings.tone
    );
  end if;

  return v_result;
end;
$$ language plpgsql security definer;

-- ============================================
-- 5. INDEXES (performance)
-- ============================================

create index if not exists idx_ai_generations_org on ai_generations(organization_id);
create index if not exists idx_ai_generations_created_at on ai_generations(created_at desc);
create index if not exists idx_ai_generations_type on ai_generations(type);

-- ============================================
-- FIN SCHEMA IA NARRATIVE
-- ============================================
