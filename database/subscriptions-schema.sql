-- ============================================================
-- POWALYZE — SCHEMA ABONNEMENTS PRO & ENTREPRISE
-- Extension du schema principal pour la gestion des plans
-- ============================================================

-- ============================================================
-- ENUMS POUR LES PLANS
-- ============================================================
do $$ begin
  create type subscription_plan as enum ('pro', 'enterprise', 'trial');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type subscription_status as enum ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type billing_interval as enum ('monthly', 'yearly');
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- TABLE: SUBSCRIPTIONS
-- Gestion des abonnements Pro et Entreprise
-- ============================================================
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Plan details
  plan subscription_plan not null default 'trial',
  status subscription_status not null default 'trialing',
  billing_interval billing_interval default 'monthly',
  
  -- Pricing
  price_monthly numeric not null default 29.00,
  price_yearly numeric not null default 24.00,
  currency text not null default 'EUR',
  
  -- Trial management
  trial_start timestamptz,
  trial_end timestamptz,
  trial_days integer default 14,
  
  -- Subscription dates
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  canceled_at timestamptz,
  
  -- Stripe integration (optional)
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  
  -- Enterprise specific
  is_enterprise boolean default false,
  enterprise_contact_email text,
  enterprise_quote_requested_at timestamptz,
  enterprise_onboarded_at timestamptz,
  
  -- Metadata
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: SUBSCRIPTION_FEATURES
-- Fonctionnalités par plan
-- ============================================================
create table if not exists subscription_features (
  id uuid primary key default gen_random_uuid(),
  plan subscription_plan not null,
  feature_key text not null,
  feature_name text not null,
  feature_description text,
  is_included boolean default true,
  limit_value integer,
  created_at timestamptz default now(),
  
  unique(plan, feature_key)
);

-- ============================================================
-- TABLE: ENTERPRISE_REQUESTS
-- Demandes de devis Entreprise
-- ============================================================
create table if not exists enterprise_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  
  -- Contact info
  email text not null,
  full_name text,
  company text,
  phone text,
  
  -- Request details
  message text,
  estimated_users integer,
  current_tools text[], -- ERP, CRM, etc.
  governance_needs text,
  
  -- Status
  status text check (status in ('pending', 'contacted', 'quoted', 'converted', 'declined')) default 'pending',
  assigned_to text,
  notes text,
  
  -- Timestamps
  created_at timestamptz default now(),
  contacted_at timestamptz,
  quoted_at timestamptz,
  converted_at timestamptz
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_subscriptions_user on subscriptions(user_id);
create index if not exists idx_subscriptions_plan on subscriptions(plan);
create index if not exists idx_subscriptions_status on subscriptions(status);
create index if not exists idx_subscriptions_stripe_customer on subscriptions(stripe_customer_id);
create index if not exists idx_subscription_features_plan on subscription_features(plan);
create index if not exists idx_enterprise_requests_status on enterprise_requests(status);
create index if not exists idx_enterprise_requests_user on enterprise_requests(user_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================
alter table subscriptions enable row level security;
alter table subscription_features enable row level security;
alter table enterprise_requests enable row level security;

-- Users can view their own subscription
create policy "Users can view own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- Users can view features for their plan
create policy "Anyone can view features"
  on subscription_features for select
  using (true);

-- Users can view their own enterprise requests
create policy "Users can view own enterprise requests"
  on enterprise_requests for select
  using (auth.uid() = user_id or email = (select email from auth.users where id = auth.uid()));

-- Users can create enterprise requests
create policy "Users can create enterprise requests"
  on enterprise_requests for insert
  with check (auth.uid() = user_id or true); -- Allow anonymous requests too

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Update updated_at automatically
create or replace function update_subscriptions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_subscriptions_updated_at on subscriptions;
create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_subscriptions_updated_at();

-- Update profile when subscription changes
create or replace function sync_profile_on_subscription_change()
returns trigger as $$
begin
  -- Update profile role based on subscription status
  if new.status = 'active' then
    if new.is_enterprise = true then
      update profiles 
      set role = 'pro-owner', pro_active = true
      where id = new.user_id;
    elsif new.plan = 'pro' then
      update profiles 
      set role = 'pro', pro_active = true
      where id = new.user_id;
    end if;
  elsif new.status = 'canceled' or new.status = 'past_due' then
    update profiles 
    set role = 'demo', pro_active = false
    where id = new.user_id;
  end if;
  
  return new;
end;
$$ language plpgsql;

drop trigger if exists sync_profile_on_subscription_change on subscriptions;
create trigger sync_profile_on_subscription_change
  after insert or update of status on subscriptions
  for each row execute function sync_profile_on_subscription_change();

-- ============================================================
-- SEED DATA: SUBSCRIPTION FEATURES
-- ============================================================

-- Clear existing features
truncate subscription_features;

-- PRO FEATURES
insert into subscription_features (plan, feature_key, feature_name, feature_description, is_included, limit_value) values
('pro', 'projects_unlimited', 'Projets illimités', 'Créez autant de projets que nécessaire', true, null),
('pro', 'risks_management', 'Gestion des risques', 'Suivi complet des risques', true, null),
('pro', 'decisions_tracking', 'Registre des décisions', 'Historique et suivi de toutes vos décisions', true, null),
('pro', 'ai_narratives', 'Narratifs exécutifs IA', 'Synthèses automatiques générées par IA', true, null),
('pro', 'reports_auto', 'Rapports automatiques', 'Rapports mensuels et synthèses', true, null),
('pro', 'exports_pdf', 'Exports PDF', 'Exportez vos vues et rapports', true, null),
('pro', 'multi_language', 'Multi-langues', 'Interface FR/EN/DE/NO/ES/IT', true, null),
('pro', 'support_standard', 'Support standard', 'Support par email', true, null),
('pro', 'users_limit', 'Utilisateurs', 'Nombre d''utilisateurs inclus', true, 10);

-- ENTERPRISE FEATURES (all Pro + more)
insert into subscription_features (plan, feature_key, feature_name, feature_description, is_included, limit_value) values
('enterprise', 'projects_unlimited', 'Projets illimités', 'Créez autant de projets que nécessaire', true, null),
('enterprise', 'risks_management', 'Gestion des risques', 'Suivi complet des risques', true, null),
('enterprise', 'decisions_tracking', 'Registre des décisions', 'Historique et suivi de toutes vos décisions', true, null),
('enterprise', 'ai_narratives', 'Narratifs exécutifs IA', 'Synthèses automatiques générées par IA', true, null),
('enterprise', 'reports_auto', 'Rapports automatiques', 'Rapports mensuels et synthèses', true, null),
('enterprise', 'exports_pdf', 'Exports PDF', 'Exportez vos vues et rapports', true, null),
('enterprise', 'multi_language', 'Multi-langues', 'Interface FR/EN/DE/NO/ES/IT', true, null),
('enterprise', 'connectors_advanced', 'Connecteurs avancés', 'ERP, CRM, API, outils projets', true, null),
('enterprise', 'governance_multi_team', 'Gouvernance multi-équipes', 'Gestion de plusieurs BU et équipes', true, null),
('enterprise', 'roles_advanced', 'Rôles & permissions avancées', 'COMEX, sponsors, PMO, membres', true, null),
('enterprise', 'support_priority', 'Support prioritaire', 'Support dédié avec SLA', true, null),
('enterprise', 'onboarding_custom', 'Onboarding personnalisé', 'Accompagnement sur mesure', true, null),
('enterprise', 'deployment_dedicated', 'Déploiement dédié', 'Option de déploiement sur infrastructure dédiée', true, null),
('enterprise', 'users_limit', 'Utilisateurs', 'Nombre illimité d''utilisateurs', true, null);

-- TRIAL FEATURES (same as Pro)
insert into subscription_features (plan, feature_key, feature_name, feature_description, is_included, limit_value)
select 'trial', feature_key, feature_name, feature_description, is_included, limit_value
from subscription_features
where plan = 'pro';

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Check if user has active subscription
create or replace function has_active_subscription(p_user_id uuid)
returns boolean as $$
declare
  v_active boolean;
begin
  select exists(
    select 1 from subscriptions
    where user_id = p_user_id
    and status in ('active', 'trialing')
    and (current_period_end is null or current_period_end > now())
  ) into v_active;
  
  return v_active;
end;
$$ language plpgsql security definer;

-- Get user's current plan
create or replace function get_user_plan(p_user_id uuid)
returns subscription_plan as $$
declare
  v_plan subscription_plan;
begin
  select plan into v_plan
  from subscriptions
  where user_id = p_user_id
  and status in ('active', 'trialing')
  order by created_at desc
  limit 1;
  
  return coalesce(v_plan, 'trial');
end;
$$ language plpgsql security definer;

-- Check if user has access to feature
create or replace function has_feature_access(p_user_id uuid, p_feature_key text)
returns boolean as $$
declare
  v_plan subscription_plan;
  v_has_access boolean;
begin
  v_plan := get_user_plan(p_user_id);
  
  select is_included into v_has_access
  from subscription_features
  where plan = v_plan
  and feature_key = p_feature_key;
  
  return coalesce(v_has_access, false);
end;
$$ language plpgsql security definer;

-- ============================================================
-- COMMENTS
-- ============================================================
comment on table subscriptions is 'Gestion des abonnements Pro et Entreprise';
comment on table subscription_features is 'Fonctionnalités disponibles par plan';
comment on table enterprise_requests is 'Demandes de devis Entreprise';
comment on function has_active_subscription is 'Vérifie si un utilisateur a un abonnement actif';
comment on function get_user_plan is 'Récupère le plan actuel d''un utilisateur';
comment on function has_feature_access is 'Vérifie si un utilisateur a accès à une fonctionnalité';
