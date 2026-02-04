-- ============================================
-- SCHEMA COCKPIT EXECUTIVE - VERSION FINALE
-- ============================================
-- Date: 2026-02-04
-- Objectif: Tables pour cockpit exécutif avec
--           connecteurs, IA narrative et automatisation
-- Compatible avec architecture Powalyze (organization_id)
-- TOUTES LES COLONNES INCLUSES
-- ============================================

-- Projects (enhanced) - Ajoute colonnes manquantes à la table existante
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id UUID;
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

-- Cockpit Capacities
CREATE TABLE IF NOT EXISTS cockpit_capacities (
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

-- Cockpit Risks
CREATE TABLE IF NOT EXISTS cockpit_risks (
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

-- Cockpit Decisions
CREATE TABLE IF NOT EXISTS cockpit_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  owner TEXT,
  responsible TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending','validated','rejected','obsolete')),
  due_date DATE,
  impact_area TEXT,
  impact TEXT CHECK (impact IN ('low','medium','high','critical')),
  urgency TEXT CHECK (urgency IN ('low','medium','high','critical')),
  priority TEXT CHECK (priority IN ('low','medium','high','critical')),
  organization_id UUID NOT NULL,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cockpit Initiatives
CREATE TABLE IF NOT EXISTS cockpit_initiatives (
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

-- Cockpit Anomalies
CREATE TABLE IF NOT EXISTS cockpit_anomalies (
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

-- Cockpit Budgets
CREATE TABLE IF NOT EXISTS cockpit_budgets (
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

-- Cockpit Timeline
CREATE TABLE IF NOT EXISTS cockpit_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT,
  entity_id UUID,
  label TEXT,
  date DATE,
  type TEXT,
  organization_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cockpit Connectors
CREATE TABLE IF NOT EXISTS cockpit_connectors (
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

-- Cockpit Reports (automatisation)
CREATE TABLE IF NOT EXISTS cockpit_reports (
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

-- Cockpit Executive Overview (VIEW)
CREATE OR REPLACE VIEW cockpit_executive_overview AS
SELECT
  p.organization_id AS tenant_id,
  COUNT(*) FILTER (WHERE p.status IN ('planned','in_progress')) AS projects_active,
  AVG(p.strategic_alignment_score) AS strategic_alignment,
  SUM(p.budget_spent) AS budget_spent_total,
  SUM(p.budget_planned) AS budget_planned_total,
  (SUM(p.budget_spent) - SUM(p.budget_planned)) AS budget_variance,
  (SELECT COUNT(*) FROM cockpit_decisions d WHERE d.organization_id = p.organization_id AND d.status = 'pending') AS decisions_pending,
  (SELECT COUNT(*) FROM cockpit_risks r WHERE r.organization_id = p.organization_id AND r.severity > 70) AS risks_critical,
  (SELECT COUNT(*) FROM cockpit_anomalies a WHERE a.organization_id = p.organization_id AND a.resolved = FALSE) AS anomalies_unresolved,
  NOW() AS generated_at
FROM projects p
GROUP BY p.organization_id;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_bu ON projects(bu);
CREATE INDEX IF NOT EXISTS idx_projects_country ON projects(country);
CREATE INDEX IF NOT EXISTS idx_projects_external ON projects(external_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_org ON cockpit_decisions(organization_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_status ON cockpit_decisions(status);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_project_id ON cockpit_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_impact ON cockpit_decisions(impact);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_urgency ON cockpit_decisions(urgency);
CREATE INDEX IF NOT EXISTS idx_cockpit_decisions_created_by ON cockpit_decisions(created_by);
CREATE INDEX IF NOT EXISTS idx_cockpit_risks_org ON cockpit_risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_anomalies_org ON cockpit_anomalies(organization_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_anomalies_resolved ON cockpit_anomalies(resolved);
CREATE INDEX IF NOT EXISTS idx_cockpit_connectors_org ON cockpit_connectors(organization_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_reports_org ON cockpit_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_capacities_org ON cockpit_capacities(organization_id);
CREATE INDEX IF NOT EXISTS idx_cockpit_timeline_entity ON cockpit_timeline(entity_type, entity_id);

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

DROP TRIGGER IF EXISTS update_cockpit_decisions_updated_at ON cockpit_decisions;
CREATE TRIGGER update_cockpit_decisions_updated_at
  BEFORE UPDATE ON cockpit_decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cockpit_connectors_updated_at ON cockpit_connectors;
CREATE TRIGGER update_cockpit_connectors_updated_at
  BEFORE UPDATE ON cockpit_connectors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
