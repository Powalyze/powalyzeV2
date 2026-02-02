-- ============================================
-- FIX: Contraintes UNIQUE manquantes
-- ============================================
-- Date: 2026-02-02
-- Objet: Corriger l'erreur "no unique or exclusion constraint matching the ON CONFLICT specification"
--
-- Problème identifié:
-- 1. project_predictions: table manquante (utilisée par lib/supabase-cockpit.ts)
-- 2. Potentiellement d'autres tables avec upsert sans contrainte UNIQUE
-- ============================================

-- ============================================
-- 1. TABLE project_predictions (MANQUANTE)
-- ============================================
-- Utilisée par saveProjectPrediction() dans lib/supabase-cockpit.ts
-- Fait un upsert avec onConflict: 'project_id'
-- DONC project_id DOIT être UNIQUE

CREATE TABLE IF NOT EXISTS project_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confidence DECIMAL(5, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  summary TEXT NOT NULL,
  risks JSONB DEFAULT '[]'::jsonb,
  opportunities JSONB DEFAULT '[]'::jsonb,
  recommended_actions JSONB DEFAULT '[]'::jsonb,
  project_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS project_predictions
ALTER TABLE project_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_predictions_by_org" ON project_predictions
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "project_predictions_insert_by_org" ON project_predictions
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "project_predictions_update_by_org" ON project_predictions
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_project_predictions_org ON project_predictions(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_predictions_project ON project_predictions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_predictions_analyzed_at ON project_predictions(analyzed_at DESC);

-- ============================================
-- 2. VÉRIFICATION: api_keys.token_hash (déjà UNIQUE dans schema-api-webhooks.sql)
-- ============================================
-- La table api_keys existe déjà avec token_hash UNIQUE, pas de changement nécessaire

-- ============================================
-- 3. VÉRIFICATION: webhooks (pas de contrainte UNIQUE nécessaire)
-- ============================================
-- La table webhooks n'utilise pas upsert, pas de changement nécessaire

-- ============================================
-- 4. AJOUT: Contrainte UNIQUE pour éviter doublons projets par nom/org (OPTIONNEL)
-- ============================================
-- Empêche de créer 2 projets avec le même nom dans la même organisation
-- ATTENTION: À activer seulement si souhaité par l'utilisateur

-- ALTER TABLE projects
--   ADD CONSTRAINT projects_org_name_unique UNIQUE (organization_id, name);

-- Si vous voulez activer cette contrainte, décommentez les 2 lignes ci-dessus
-- Impact: Un utilisateur ne pourra plus créer 2 projets avec le même nom
-- dans la même organisation (comportement recommandé pour éviter la confusion)

-- ============================================
-- 5. AJOUT: Contrainte UNIQUE pour api_usage_logs (si besoin de déduplication)
-- ============================================
-- Si vous voulez éviter de logger 2 fois exactement la même requête API
-- (même clé, même endpoint, même timestamp), décommentez:

-- ALTER TABLE api_usage_logs
--   ADD CONSTRAINT api_usage_logs_dedup UNIQUE (api_key_id, endpoint, created_at);

-- ============================================
-- 6. TRIGGER: Mise à jour automatique de updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à project_predictions
DROP TRIGGER IF EXISTS update_project_predictions_updated_at ON project_predictions;
CREATE TRIGGER update_project_predictions_updated_at
  BEFORE UPDATE ON project_predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN DU FIX
-- ============================================

-- Pour vérifier que tout est OK, exécutez:
-- SELECT * FROM project_predictions LIMIT 1;
-- 
-- Pour tester un upsert:
-- INSERT INTO project_predictions (project_id, organization_id, confidence, summary)
-- VALUES ('existing-project-id', 'existing-org-id', 85, 'Test prediction')
-- ON CONFLICT (project_id) DO UPDATE SET
--   confidence = EXCLUDED.confidence,
--   summary = EXCLUDED.summary,
--   analyzed_at = NOW();
