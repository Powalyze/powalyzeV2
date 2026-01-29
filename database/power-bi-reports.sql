-- =====================================================
-- Power BI Embedded - Table des rapports
-- =====================================================
-- Cette table stocke les métadonnées des rapports Power BI
-- importés dans Powalyze via Power BI Embedded API
-- =====================================================

-- Table principale des rapports Power BI
CREATE TABLE IF NOT EXISTS powerbi_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relation avec les projets
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL,
  
  -- Métadonnées du rapport
  report_name TEXT NOT NULL,
  report_description TEXT,
  
  -- IDs Power BI (critiques pour l'API)
  powerbi_report_id TEXT NOT NULL UNIQUE,
  powerbi_dataset_id TEXT,
  powerbi_workspace_id TEXT NOT NULL,
  
  -- Informations techniques
  file_size BIGINT, -- Taille du fichier .pbix en bytes
  page_count INTEGER DEFAULT 1,
  
  -- Métadonnées temporelles
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_refreshed_at TIMESTAMPTZ,
  
  -- Métadonnées utilisateur
  created_by UUID,
  
  -- Status du rapport
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'error')),
  
  -- Données additionnelles (JSON flexible)
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_powerbi_reports_project ON powerbi_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_powerbi_reports_org ON powerbi_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_powerbi_reports_workspace ON powerbi_reports(powerbi_workspace_id);
CREATE INDEX IF NOT EXISTS idx_powerbi_reports_status ON powerbi_reports(status);
CREATE INDEX IF NOT EXISTS idx_powerbi_reports_created ON powerbi_reports(created_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_powerbi_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_powerbi_reports_updated_at
  BEFORE UPDATE ON powerbi_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_powerbi_reports_updated_at();

-- Row Level Security (RLS)
ALTER TABLE powerbi_reports ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs ne voient que les rapports de leur organisation
CREATE POLICY powerbi_reports_isolation ON powerbi_reports
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id', TRUE)::uuid);

-- Commentaires
COMMENT ON TABLE powerbi_reports IS 'Stocke les métadonnées des rapports Power BI Embedded importés dans Powalyze';
COMMENT ON COLUMN powerbi_reports.powerbi_report_id IS 'ID unique du rapport dans Power BI Service';
COMMENT ON COLUMN powerbi_reports.powerbi_dataset_id IS 'ID du dataset associé au rapport';
COMMENT ON COLUMN powerbi_reports.powerbi_workspace_id IS 'ID du workspace Power BI contenant le rapport';
COMMENT ON COLUMN powerbi_reports.metadata IS 'Données JSON flexibles pour informations additionnelles (embed URLs, thumbnails, etc.)';
