-- Table pour stocker les prédictions IA des projets
-- Permet le cache intelligent et la persistance des analyses

CREATE TABLE IF NOT EXISTS project_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Metadata
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  summary TEXT NOT NULL,
  
  -- Risks (JSON array)
  risks JSONB NOT NULL DEFAULT '[]',
  
  -- Opportunities (JSON array)
  opportunities JSONB NOT NULL DEFAULT '[]',
  
  -- Recommended Actions (JSON array)
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  
  -- Project snapshot at analysis time (for audit)
  project_snapshot JSONB NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure only one active prediction per project
  UNIQUE(project_id)
);

-- Index pour recherche rapide par project_id
CREATE INDEX IF NOT EXISTS idx_project_predictions_project_id 
ON project_predictions(project_id);

-- Index pour recherche par date d'analyse
CREATE INDEX IF NOT EXISTS idx_project_predictions_analyzed_at 
ON project_predictions(analyzed_at DESC);

-- Index pour recherche par confiance
CREATE INDEX IF NOT EXISTS idx_project_predictions_confidence 
ON project_predictions(confidence DESC);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_project_predictions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_predictions_updated_at
  BEFORE UPDATE ON project_predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_project_predictions_updated_at();

-- RLS (Row Level Security) policies
ALTER TABLE project_predictions ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent lire leurs propres prédictions
CREATE POLICY "Users can view their own project predictions"
  ON project_predictions
  FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent créer des prédictions pour leurs projets
CREATE POLICY "Users can create predictions for their own projects"
  ON project_predictions
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent mettre à jour leurs propres prédictions
CREATE POLICY "Users can update their own project predictions"
  ON project_predictions
  FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent supprimer leurs propres prédictions
CREATE POLICY "Users can delete their own project predictions"
  ON project_predictions
  FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Commentaires pour documentation
COMMENT ON TABLE project_predictions IS 'Stocke les analyses prédictives IA (ProjectPredictor) pour chaque projet';
COMMENT ON COLUMN project_predictions.project_id IS 'Référence au projet analysé';
COMMENT ON COLUMN project_predictions.analyzed_at IS 'Date et heure de l''analyse par l''IA';
COMMENT ON COLUMN project_predictions.confidence IS 'Niveau de confiance de l''IA (0-1)';
COMMENT ON COLUMN project_predictions.summary IS 'Résumé exécutif de l''analyse';
COMMENT ON COLUMN project_predictions.risks IS 'Array JSON des risques identifiés';
COMMENT ON COLUMN project_predictions.opportunities IS 'Array JSON des opportunités détectées';
COMMENT ON COLUMN project_predictions.recommended_actions IS 'Array JSON des actions recommandées';
COMMENT ON COLUMN project_predictions.project_snapshot IS 'Snapshot du projet au moment de l''analyse (audit trail)';
