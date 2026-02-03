-- ============================================
-- POWALYZE — SCHÉMA SQL PROPRE V2
-- ============================================
-- Date: 2026-02-02
-- Objectif: Reconstruction propre sans dette technique
-- Principes:
--   - Tables minimales
--   - Contraintes simples (PK, FK uniquement)
--   - ZÉRO contrainte UNIQUE complexe
--   - RLS simple par organization_id
--   - ZÉRO upsert/onConflict
-- ============================================

-- ============================================
-- NETTOYAGE PRÉALABLE (idempotence totale)
-- ============================================
-- Suppression de toutes les tables existantes avec CASCADE
-- Ordre: tables enfants vers tables parentes

DROP TABLE IF EXISTS webhook_logs CASCADE;
DROP TABLE IF EXISTS webhooks CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS ai_generations CASCADE;
DROP TABLE IF EXISTS project_objectives CASCADE;
DROP TABLE IF EXISTS scenarios CASCADE;
DROP TABLE IF EXISTS dependencies CASCADE;
DROP TABLE IF EXISTS project_resources CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS decisions CASCADE;
DROP TABLE IF EXISTS risks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- ============================================
-- 1. ORGANIZATIONS (tenant isolation)
-- ============================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "organizations_select" ON organizations;
CREATE POLICY "organizations_select" ON organizations
  FOR SELECT USING (true); -- Tout le monde peut voir (sera filtré par profiles)

-- ============================================
-- 2. PROFILES (utilisateurs + plan)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  plan TEXT DEFAULT 'demo' CHECK (plan IN ('demo', 'pro', 'enterprise')),
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 3. PROJECTS (cœur du cockpit)
-- ============================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on-hold', 'completed', 'cancelled')),
  health TEXT DEFAULT 'green' CHECK (health IN ('green', 'yellow', 'red')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL(15, 2),
  deadline DATE,
  starred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_by_org" ON projects;
CREATE POLICY "projects_by_org" ON projects
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "projects_insert_by_org" ON projects;
CREATE POLICY "projects_insert_by_org" ON projects
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "projects_update_by_org" ON projects;
CREATE POLICY "projects_update_by_org" ON projects
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "projects_delete_by_org" ON projects;
CREATE POLICY "projects_delete_by_org" ON projects
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_health ON projects(health);

-- ============================================
-- 4. RISKS (risques projet)
-- ============================================

CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT DEFAULT 'medium' CHECK (level IN ('low', 'medium', 'high', 'critical')),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  impact INTEGER CHECK (impact >= 0 AND impact <= 100),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'monitoring', 'mitigated', 'closed')),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mitigation_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "risks_by_org" ON risks;
CREATE POLICY "risks_by_org" ON risks
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_risks_org ON risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_risks_project ON risks(project_id);
CREATE INDEX IF NOT EXISTS idx_risks_level ON risks(level);

-- ============================================
-- 5. DECISIONS (décisions comité)
-- ============================================

CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  committee TEXT DEFAULT 'CODIR',
  decision_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deferred')),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  impacts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "decisions_by_org" ON decisions;
CREATE POLICY "decisions_by_org" ON decisions
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_decisions_org ON decisions(organization_id);
CREATE INDEX IF NOT EXISTS idx_decisions_project ON decisions(project_id);

-- ============================================
-- 6. RESOURCES (ressources projet)
-- ============================================

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'human' CHECK (type IN ('human', 'material', 'financial')),
  capacity DECIMAL(10, 2),
  unit TEXT,
  cost_per_unit DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "resources_by_org" ON resources;
CREATE POLICY "resources_by_org" ON resources
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_resources_org ON resources(organization_id);

-- ============================================
-- 7. PROJECT_RESOURCES (allocation ressources)
-- ============================================

CREATE TABLE project_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  allocated_amount DECIMAL(10, 2) NOT NULL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_resources_by_project" ON project_resources;
CREATE POLICY "project_resources_by_project" ON project_resources
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN profiles prof ON p.organization_id = prof.organization_id
      WHERE prof.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_project_resources_project ON project_resources(project_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_resource ON project_resources(resource_id);

-- ============================================
-- 8. DEPENDENCIES (dépendances projets)
-- ============================================

CREATE TABLE dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  target_project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'blocks' CHECK (type IN ('blocks', 'requires', 'relates-to')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dependencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dependencies_by_org" ON dependencies;
CREATE POLICY "dependencies_by_org" ON dependencies
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_dependencies_source ON dependencies(source_project_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_target ON dependencies(target_project_id);

-- ============================================
-- 9. REPORTS (rapports IA)
-- ============================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('executive', 'project', 'risk', 'resource')),
  title TEXT NOT NULL,
  content TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_by_org" ON reports;
CREATE POLICY "reports_by_org" ON reports
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_reports_org ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);

-- ============================================
-- 10. API_KEYS (API externe)
-- ============================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL, -- Stocké hashé
  key_prefix TEXT NOT NULL, -- Pour affichage (ex: "pk_abc...")
  permissions JSONB DEFAULT '[]'::jsonb,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "api_keys_by_org" ON api_keys;
CREATE POLICY "api_keys_by_org" ON api_keys
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- ============================================
-- 11. WEBHOOKS (webhooks sortants)
-- ============================================

CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT ARRAY[]::TEXT[],
  secret TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "webhooks_by_org" ON webhooks;
CREATE POLICY "webhooks_by_org" ON webhooks
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_webhooks_org ON webhooks(organization_id);

-- ============================================
-- 12. WEBHOOK_LOGS (historique webhooks)
-- ============================================

CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  response_status INTEGER,
  response_body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "webhook_logs_by_webhook" ON webhook_logs;
CREATE POLICY "webhook_logs_by_webhook" ON webhook_logs
  FOR ALL USING (
    webhook_id IN (
      SELECT w.id FROM webhooks w
      INNER JOIN profiles prof ON w.organization_id = prof.organization_id
      WHERE prof.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON webhook_logs(created_at DESC);

-- ============================================
-- TRIGGERS (updated_at automatique)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_organizations_updated_at ON organizations;
CREATE TRIGGER trigger_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_risks_updated_at ON risks;
CREATE TRIGGER trigger_risks_updated_at
  BEFORE UPDATE ON risks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_decisions_updated_at ON decisions;
CREATE TRIGGER trigger_decisions_updated_at
  BEFORE UPDATE ON decisions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_resources_updated_at ON resources;
CREATE TRIGGER trigger_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 13. SCENARIOS (scénarios projet)
-- ============================================

CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('optimistic', 'central', 'pessimistic')),
  name TEXT NOT NULL,
  description TEXT,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  delivery_date DATE,
  final_budget DECIMAL(15, 2),
  business_impacts JSONB DEFAULT '[]'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scenarios_by_org" ON scenarios;
CREATE POLICY "scenarios_by_org" ON scenarios
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_scenarios_org ON scenarios(organization_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_project ON scenarios(project_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_type ON scenarios(type);

DROP TRIGGER IF EXISTS trigger_scenarios_updated_at ON scenarios;
CREATE TRIGGER trigger_scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 14. PROJECT_OBJECTIVES (objectifs projet)
-- ============================================

CREATE TABLE project_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  measurable TEXT,
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_objectives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "objectives_by_project" ON project_objectives;
CREATE POLICY "objectives_by_project" ON project_objectives
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN profiles prof ON p.organization_id = prof.organization_id
      WHERE prof.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_objectives_project ON project_objectives(project_id);
CREATE INDEX IF NOT EXISTS idx_objectives_status ON project_objectives(status);

DROP TRIGGER IF EXISTS trigger_objectives_updated_at ON project_objectives;
CREATE TRIGGER trigger_objectives_updated_at
  BEFORE UPDATE ON project_objectives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 15. AI_GENERATIONS (traçabilité IA)
-- ============================================

CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'risk', 'decision', 'report', 'scenario', 'objective', 'portfolio')),
  entity_id UUID,
  generation_type TEXT NOT NULL,
  prompt_used TEXT,
  model TEXT,
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  tokens_used INTEGER,
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_generations_by_org" ON ai_generations;
CREATE POLICY "ai_generations_by_org" ON ai_generations
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_ai_generations_org ON ai_generations(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_entity ON ai_generations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created ON ai_generations(created_at DESC);

-- ============================================
-- FIN DU SCHÉMA
-- ============================================

-- Pour vérifier:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
