-- =====================================================
-- SCHEMA: MODULE RAPPORTS UNIVERSALISÉ
-- Version: 1.0
-- Date: 2026-01-31
-- =====================================================

-- Table: reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Fichier source
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, excel, csv, word, powerpoint, json, image, text
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  
  -- Contenu analysé
  processed_content JSONB, -- Contenu extrait structuré
  summary TEXT, -- Résumé exécutif IA
  insights JSONB, -- Insights clés [{title, description, priority}]
  charts JSONB, -- Données graphiques [{type, data, config}]
  sections JSONB, -- Sections [{title, content, order}]
  recommendations JSONB, -- Recommandations [{title, description, priority}]
  risks JSONB, -- Risques identifiés [{title, description, severity}]
  decisions JSONB, -- Décisions possibles [{title, description, impact}]
  
  -- Métadonnées
  metadata JSONB, -- {author, created_date, modified_date, tags, etc}
  version INTEGER DEFAULT 1,
  parent_report_id UUID REFERENCES reports(id), -- Pour versioning
  
  -- Status
  status TEXT DEFAULT 'processing', -- processing, ready, error
  error_message TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_organization ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_project ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_parent ON reports(parent_report_id);

-- RLS Policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports from their organization"
  ON reports FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reports in their organization"
  ON reports FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reports in their organization"
  ON reports FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete reports in their organization"
  ON reports FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_reports_updated_at();

-- Storage bucket pour les fichiers
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload reports to their organization"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reports' AND
    auth.uid() IN (
      SELECT user_id FROM memberships WHERE organization_id = (storage.foldername(name))[1]::uuid
    )
  );

CREATE POLICY "Users can view reports from their organization"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reports' AND
    auth.uid() IN (
      SELECT user_id FROM memberships WHERE organization_id = (storage.foldername(name))[1]::uuid
    )
  );

CREATE POLICY "Users can update reports in their organization"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'reports' AND
    auth.uid() IN (
      SELECT user_id FROM memberships WHERE organization_id = (storage.foldername(name))[1]::uuid
    )
  );

CREATE POLICY "Users can delete reports in their organization"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'reports' AND
    auth.uid() IN (
      SELECT user_id FROM memberships WHERE organization_id = (storage.foldername(name))[1]::uuid
    )
  );
