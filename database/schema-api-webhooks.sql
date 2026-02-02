-- ============================================
-- API & WEBHOOKS — External Integrations
-- ============================================

-- 1. API KEYS (déjà créée, extension)
-- ============================================

-- Table api_keys existe déjà, on ajoute les colonnes manquantes si nécessaire
alter table api_keys add column if not exists permissions text[] default array['read'];
alter table api_keys add column if not exists rate_limit int default 1000;
alter table api_keys add column if not exists rate_window text default '1h';
alter table api_keys add column if not exists last_used_ip text;
alter table api_keys add column if not exists usage_count int default 0;

-- Index performance
create index if not exists idx_api_keys_token_hash on api_keys(token_hash);
create index if not exists idx_api_keys_org_active on api_keys(organization_id, is_active);

-- RLS API Keys (déjà créée, vérification)
drop policy if exists "api_keys_by_org" on api_keys;
create policy "api_keys_by_org" on api_keys
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

drop policy if exists "api_keys_write_admin_only" on api_keys;
create policy "api_keys_write_admin_only" on api_keys
  for all using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() 
        and mode = 'admin'
        and plan != 'demo'
    )
  );

-- ============================================
-- 2. WEBHOOKS (Destinations pour événements)
-- ============================================

create table if not exists webhooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  url text not null,
  secret text not null,
  events text[] not null default array[]::text[],
  is_active boolean default true,
  retry_count int default 3,
  timeout_seconds int default 10,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_triggered_at timestamptz,
  constraint valid_url check (url ~ '^https?://'),
  constraint valid_events check (cardinality(events) > 0)
);

-- RLS Webhooks
alter table webhooks enable row level security;

create policy "webhooks_by_org" on webhooks
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

create policy "webhooks_write_admin_only" on webhooks
  for all using (
    organization_id = (
      select organization_id from profiles 
      where id = auth.uid() 
        and mode = 'admin'
        and plan != 'demo'
    )
  );

-- ============================================
-- 3. WEBHOOK LOGS (Historique des appels)
-- ============================================

create table if not exists webhook_logs (
  id uuid primary key default gen_random_uuid(),
  webhook_id uuid references webhooks(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  event_type text not null,
  payload jsonb not null,
  status_code int,
  response_body text,
  error_message text,
  duration_ms int,
  retry_attempt int default 0,
  created_at timestamptz default now()
);

-- RLS Webhook Logs
alter table webhook_logs enable row level security;

create policy "webhook_logs_by_org" on webhook_logs
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- Index performance
create index if not exists idx_webhook_logs_webhook on webhook_logs(webhook_id);
create index if not exists idx_webhook_logs_org_event on webhook_logs(organization_id, event_type);
create index if not exists idx_webhook_logs_created on webhook_logs(created_at desc);
create index if not exists idx_webhook_logs_status on webhook_logs(status_code);

-- ============================================
-- 4. API USAGE LOGS (Rate limiting & audit)
-- ============================================

create table if not exists api_usage_logs (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid references api_keys(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  endpoint text not null,
  method text not null,
  status_code int not null,
  duration_ms int,
  ip_address text,
  user_agent text,
  request_body jsonb,
  response_body jsonb,
  created_at timestamptz default now()
);

-- RLS API Usage Logs
alter table api_usage_logs enable row level security;

create policy "api_logs_by_org" on api_usage_logs
  for select using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );

-- Index performance
create index if not exists idx_api_usage_org_date on api_usage_logs(organization_id, created_at desc);
create index if not exists idx_api_usage_api_key on api_usage_logs(api_key_id);
create index if not exists idx_api_usage_endpoint on api_usage_logs(endpoint);

-- ============================================
-- 5. WEBHOOK EVENTS (Types d'événements)
-- ============================================

create table if not exists webhook_event_types (
  id uuid primary key default gen_random_uuid(),
  event_name text unique not null,
  category text not null,
  description text,
  schema jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Seed event types
insert into webhook_event_types (event_name, category, description) values
  ('project.created', 'project', 'Nouveau projet créé'),
  ('project.updated', 'project', 'Projet mis à jour'),
  ('project.deleted', 'project', 'Projet supprimé'),
  ('project.status_changed', 'project', 'Statut projet changé (GREEN/YELLOW/RED)'),
  ('risk.created', 'risk', 'Nouveau risque créé'),
  ('risk.escalated', 'risk', 'Risque escaladé (severity high/critical)'),
  ('risk.resolved', 'risk', 'Risque résolu'),
  ('decision.created', 'decision', 'Nouvelle décision créée'),
  ('decision.approved', 'decision', 'Décision approuvée'),
  ('decision.rejected', 'decision', 'Décision rejetée'),
  ('report.generated', 'report', 'Rapport généré (IA ou manuel)'),
  ('resource.overallocated', 'resource', 'Ressource sur-allouée (>100% FTE)'),
  ('sprint.completed', 'agile', 'Sprint terminé'),
  ('sprint.velocity_drop', 'agile', 'Vélocité sprint -20% vs moyenne')
on conflict (event_name) do nothing;

-- ============================================
-- 6. TRIGGERS (updated_at auto)
-- ============================================

create trigger update_webhooks_updated_at before update on webhooks
  for each row execute function update_updated_at_column();

-- ============================================
-- 7. FONCTIONS RPC — Webhooks
-- ============================================

-- Fonction: Trigger webhook
create or replace function trigger_webhook(
  p_organization_id uuid,
  p_event_type text,
  p_payload jsonb
)
returns void as $$
declare
  v_webhook record;
begin
  -- Pour chaque webhook actif qui écoute cet événement
  for v_webhook in
    select * from webhooks
    where organization_id = p_organization_id
      and is_active = true
      and p_event_type = any(events)
  loop
    -- Insérer dans les logs (sera traité par worker)
    insert into webhook_logs (
      webhook_id,
      organization_id,
      event_type,
      payload,
      retry_attempt
    ) values (
      v_webhook.id,
      p_organization_id,
      p_event_type,
      p_payload,
      0
    );

    -- Update last triggered
    update webhooks
    set last_triggered_at = now()
    where id = v_webhook.id;
  end loop;
end;
$$ language plpgsql security definer;

-- Fonction: Get API usage stats
create or replace function get_api_usage_stats(
  p_organization_id uuid,
  p_period_days int default 30
)
returns jsonb as $$
declare
  v_total_requests int;
  v_successful_requests int;
  v_failed_requests int;
  v_avg_duration_ms numeric;
  v_top_endpoints jsonb;
  v_result jsonb;
begin
  -- Total requests
  select count(*) into v_total_requests
  from api_usage_logs
  where organization_id = p_organization_id
    and created_at >= now() - (p_period_days || ' days')::interval;

  -- Successful requests (2xx)
  select count(*) into v_successful_requests
  from api_usage_logs
  where organization_id = p_organization_id
    and created_at >= now() - (p_period_days || ' days')::interval
    and status_code between 200 and 299;

  -- Failed requests
  v_failed_requests := v_total_requests - v_successful_requests;

  -- Average duration
  select round(avg(duration_ms), 2) into v_avg_duration_ms
  from api_usage_logs
  where organization_id = p_organization_id
    and created_at >= now() - (p_period_days || ' days')::interval;

  -- Top endpoints
  select jsonb_agg(row_to_json(t)::jsonb)
  into v_top_endpoints
  from (
    select endpoint, count(*) as requests
    from api_usage_logs
    where organization_id = p_organization_id
      and created_at >= now() - (p_period_days || ' days')::interval
    group by endpoint
    order by requests desc
    limit 5
  ) t;

  v_result := jsonb_build_object(
    'total_requests', v_total_requests,
    'successful_requests', v_successful_requests,
    'failed_requests', v_failed_requests,
    'success_rate', round((v_successful_requests::numeric / nullif(v_total_requests, 0)) * 100, 1),
    'avg_duration_ms', v_avg_duration_ms,
    'top_endpoints', coalesce(v_top_endpoints, '[]'::jsonb),
    'period_days', p_period_days
  );

  return v_result;
end;
$$ language plpgsql security definer;

-- Fonction: Get webhook stats
create or replace function get_webhook_stats(
  p_organization_id uuid,
  p_webhook_id uuid default null,
  p_period_days int default 30
)
returns jsonb as $$
declare
  v_total_triggers int;
  v_successful_triggers int;
  v_failed_triggers int;
  v_avg_duration_ms numeric;
  v_recent_logs jsonb;
  v_result jsonb;
begin
  -- Total triggers
  select count(*) into v_total_triggers
  from webhook_logs
  where organization_id = p_organization_id
    and (p_webhook_id is null or webhook_id = p_webhook_id)
    and created_at >= now() - (p_period_days || ' days')::interval;

  -- Successful triggers (2xx status)
  select count(*) into v_successful_triggers
  from webhook_logs
  where organization_id = p_organization_id
    and (p_webhook_id is null or webhook_id = p_webhook_id)
    and created_at >= now() - (p_period_days || ' days')::interval
    and status_code between 200 and 299;

  -- Failed triggers
  v_failed_triggers := v_total_triggers - v_successful_triggers;

  -- Average duration
  select round(avg(duration_ms), 2) into v_avg_duration_ms
  from webhook_logs
  where organization_id = p_organization_id
    and (p_webhook_id is null or webhook_id = p_webhook_id)
    and created_at >= now() - (p_period_days || ' days')::interval;

  -- Recent logs
  select jsonb_agg(row_to_json(t)::jsonb)
  into v_recent_logs
  from (
    select 
      id,
      event_type,
      status_code,
      duration_ms,
      created_at
    from webhook_logs
    where organization_id = p_organization_id
      and (p_webhook_id is null or webhook_id = p_webhook_id)
      and created_at >= now() - (p_period_days || ' days')::interval
    order by created_at desc
    limit 10
  ) t;

  v_result := jsonb_build_object(
    'total_triggers', v_total_triggers,
    'successful_triggers', v_successful_triggers,
    'failed_triggers', v_failed_triggers,
    'success_rate', round((v_successful_triggers::numeric / nullif(v_total_triggers, 0)) * 100, 1),
    'avg_duration_ms', v_avg_duration_ms,
    'recent_logs', coalesce(v_recent_logs, '[]'::jsonb),
    'period_days', p_period_days
  );

  return v_result;
end;
$$ language plpgsql security definer;

-- Fonction: Validate API key permissions
create or replace function validate_api_key(
  p_token_hash text,
  p_required_permission text default 'read'
)
returns table(
  valid boolean,
  organization_id uuid,
  permissions text[]
) as $$
begin
  return query
  select 
    case
      when ak.id is not null
        and ak.is_active = true
        and (ak.expires_at is null or ak.expires_at > now())
        and p.plan != 'demo'
        and (
          'admin' = any(ak.permissions)
          or p_required_permission = any(ak.permissions)
        )
      then true
      else false
    end as valid,
    ak.organization_id,
    ak.permissions
  from api_keys ak
  join profiles p on ak.organization_id = p.organization_id
  where ak.token_hash = p_token_hash
  limit 1;
end;
$$ language plpgsql security definer;

-- ============================================
-- 8. INDEXES supplémentaires (performance)
-- ============================================

create index if not exists idx_webhooks_org_active on webhooks(organization_id, is_active);
create index if not exists idx_webhooks_events on webhooks using gin(events);

-- ============================================
-- 9. COMMENTAIRES — Documentation
-- ============================================

comment on table api_keys is 'Clés API pour accès externe (REST API)';
comment on table webhooks is 'Webhooks configurés pour notifications événements';
comment on table webhook_logs is 'Historique des appels webhooks (audit + retry)';
comment on table api_usage_logs is 'Logs d''utilisation API (rate limiting, audit)';
comment on table webhook_event_types is 'Types d''événements disponibles pour webhooks';

comment on function trigger_webhook(uuid, text, jsonb) is 
  'Déclenche les webhooks abonnés à un événement donné';

comment on function get_api_usage_stats(uuid, int) is 
  'Retourne les statistiques d''utilisation API (période configurable)';

comment on function get_webhook_stats(uuid, uuid, int) is 
  'Retourne les statistiques d''un webhook (période configurable)';

comment on function validate_api_key(text, text) is 
  'Valide une clé API et vérifie les permissions';

-- ============================================
-- FIN SCHEMA API & WEBHOOKS
-- ============================================
