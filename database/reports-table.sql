-- Table pour les rapports Power BI importés
-- À exécuter dans Supabase SQL Editor

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  report_name text not null,
  powerbi_report_id text not null,
  powerbi_dataset_id text,
  powerbi_workspace_id text not null,
  created_at timestamptz not null default now()
);

-- Index pour les requêtes par project_id
create index if not exists reports_project_id_idx on public.reports (project_id);

-- Index pour les requêtes par powerbi_report_id
create index if not exists reports_powerbi_report_id_idx on public.reports (powerbi_report_id);

-- RLS (Row Level Security) - à adapter selon votre stratégie de sécurité
alter table public.reports enable row level security;

-- Politique RLS de base (exemple - à personnaliser)
create policy "Enable read access for authenticated users" 
  on public.reports for select 
  using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" 
  on public.reports for insert 
  with check (auth.role() = 'authenticated');
