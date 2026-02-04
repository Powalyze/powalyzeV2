-- ============================================
-- SCHEMA COCKPIT EXECUTIVE - VERSION INITIALE
-- ============================================
-- Date: 2026-02-04
-- Objectif: Tables pour cockpit exécutif avec
--           connecteurs, IA narrative et automatisation
-- Compatible avec architecture Powalyze (organization_id)
-- ============================================

-- Projects (enhanced) - Ajoute colonnes manquantes à la table existante
ALTER TABLE projects ADD COLUMN IF NOT EXISTS strategic_alignment_score NUMERIC(5,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_planned NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_spent NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS capacity_needed NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS capacity_allocated NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS bu TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS external_source TEXT;

-- Capacities
CREATE TABLE IF NOT EXISTS capacities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team TEXT,
  skill TEXT,
  period DATE,
  capacity_available NUMERIC,
  capacity_used NUMERIC,
  saturation_risk NUMERIC,
  name TEXT,
  organization_id UUID NOT NULL,
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
  mitigation TEXT,
  organization_id UUID NOT NULL,
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
  organization_id UUID NOT NULL,
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
  organization_id UUID NOT NULL,
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
  organization_id UUID NOT NULL
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
  organization_id UUID NOT NULL,
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
  organization_id UUID NOT NULL,
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
  organization_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, organization_id)
);

-- Reports (automatisation)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content JSONB,
  status TEXT,
  recipients TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  period DATE,
  type TEXT, -- 'monthly', 'executive', 'custom'
  sent BOOLEAN DEFAULT FALSE,
  organization_id UUID NOT NULL
);

-- Executive Overview (VIEW)
CREATE OR REPLACE VIEW executive_overview AS
SELECT
  p.organization_id AS tenant_id,
  COUNT(*) FILTER (WHERE p.status IN ('planned','in_progress')) AS projects_active,
  AVG(p.strategic_alignment_score) AS strategic_alignment,
  SUM(p.budget_spent) AS budget_spent_total,
  SUM(p.budget_planned) AS budget_planned_total,
  (SUM(p.budget_spent) - SUM(p.budget_planned)) AS budget_variance,
  (SELECT COUNT(*) FROM decisions d WHERE d.organization_id = p.organization_id AND d.status = 'pending') AS decisions_pending,
  (SELECT COUNT(*) FROM risks r WHERE r.organization_id = p.organization_id AND r.severity > 70) AS risks_critical,
  (SELECT COUNT(*) FROM anomalies a WHERE a.organization_id = p.organization_id AND a.resolved = FALSE) AS anomalies_unresolved,
  NOW() AS generated_at
FROM projects p
GROUP BY p.organization_id;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_external ON projects(external_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_decisions_organization ON decisions(organization_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);
CREATE INDEX IF NOT EXISTS idx_risks_organization ON risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_organization ON anomalies(organization_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_resolved ON anomalies(resolved);
CREATE INDEX IF NOT EXISTS idx_connectors_organization ON connectors(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_organization ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_capacities_organization ON capacities(organization_id);

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
