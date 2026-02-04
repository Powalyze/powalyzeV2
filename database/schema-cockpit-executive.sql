-- ============================================
-- SCHEMA COCKPIT EXECUTIVE - VERSION INITIALE
-- ============================================
-- Date: 2026-02-04
-- Objectif: Tables pour cockpit exécutif avec
--           connecteurs, IA narrative et automatisation
-- ============================================

-- Projects (enhanced)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner TEXT,
  status TEXT CHECK (status IN ('planned','in_progress','on_hold','done','cancelled')),
  start_date DATE,
  end_date DATE,
  strategic_alignment_score NUMERIC(5,2),
  risk_level TEXT,
  budget_planned NUMERIC,
  budget_spent NUMERIC,
  capacity_needed NUMERIC,
  capacity_allocated NUMERIC,
  bu TEXT,
  country TEXT,
  tags TEXT[],
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capacities
CREATE TABLE IF NOT EXISTS capacities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team TEXT,
  skill TEXT,
  period DATE,
  capacity_available NUMERIC,
  capacity_used NUMERIC,
  saturation_risk NUMERIC,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risks
CREATE TABLE IF NOT EXISTS risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  probability NUMERIC(5,2),
  impact NUMERIC(5,2),
  severity NUMERIC(5,2),
  owner TEXT,
  status TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decisions
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  owner TEXT,
  status TEXT CHECK (status IN ('pending','validated','rejected','obsolete')),
  due_date DATE,
  impact_area TEXT,
  priority TEXT CHECK (priority IN ('low','medium','high','critical')),
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiatives
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  owner TEXT,
  status TEXT,
  linked_projects UUID[],
  expected_impact TEXT,
  horizon TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anomalies
CREATE TABLE IF NOT EXISTS anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  entity_type TEXT,
  entity_id UUID,
  description TEXT,
  severity TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolution TEXT,
  tenant_id UUID NOT NULL
);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT,
  period DATE,
  planned NUMERIC,
  actual NUMERIC,
  variance NUMERIC,
  variance_reason TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline
CREATE TABLE IF NOT EXISTS timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT,
  entity_id UUID,
  label TEXT,
  date DATE,
  type TEXT,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connectors
CREATE TABLE IF NOT EXISTS connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'file', 'api', 'crm', 'erp', 'jira', 'monday'
  config JSONB,
  status TEXT CHECK (status IN ('active','error','pending','inactive')),
  last_sync TIMESTAMPTZ,
  sync_frequency TEXT, -- 'hourly', 'daily', 'weekly', 'monthly'
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports (automatisation)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  period DATE,
  type TEXT, -- 'monthly', 'executive', 'custom'
  sent BOOLEAN DEFAULT FALSE,
  tenant_id UUID NOT NULL
);

-- Executive Overview (VIEW)
CREATE OR REPLACE VIEW executive_overview AS
SELECT
  p.tenant_id,
  COUNT(*) FILTER (WHERE p.status IN ('planned','in_progress')) AS projects_active,
  AVG(p.strategic_alignment_score) AS strategic_alignment,
  SUM(p.budget_spent) AS budget_spent_total,
  SUM(p.budget_planned) AS budget_planned_total,
  (SUM(p.budget_spent) - SUM(p.budget_planned)) AS budget_variance_total,
  (SELECT COUNT(*) FROM decisions d WHERE d.tenant_id = p.tenant_id AND d.status = 'pending') AS decisions_pending,
  (SELECT COUNT(*) FROM risks r WHERE r.tenant_id = p.tenant_id AND r.severity > 70) AS risks_critical,
  (SELECT COUNT(*) FROM anomalies a WHERE a.tenant_id = p.tenant_id AND a.resolved = FALSE) AS anomalies_unresolved,
  NOW() AS generated_at
FROM projects p
GROUP BY p.tenant_id;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_decisions_tenant ON decisions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);
CREATE INDEX IF NOT EXISTS idx_risks_tenant ON risks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_tenant ON anomalies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_resolved ON anomalies(resolved);
CREATE INDEX IF NOT EXISTS idx_connectors_tenant ON connectors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reports_tenant ON reports(tenant_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_decisions_updated_at ON decisions;
CREATE TRIGGER update_decisions_updated_at
  BEFORE UPDATE ON decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_connectors_updated_at ON connectors;
CREATE TRIGGER update_connectors_updated_at
  BEFORE UPDATE ON connectors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
