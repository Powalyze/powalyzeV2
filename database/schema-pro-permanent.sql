-- ============================================
-- BLOC UNIQUE — MODE PRO PERMANENT (BACKEND)
-- ============================================
-- Date: 2026-02-02
-- Objectif: Forcer tous les comptes en mode Pro par défaut
--           + Fix contraintes UNIQUE (project_predictions)
-- ============================================

-- ============================================
-- PARTIE 1: FIX CONTRAINTES UNIQUE (project_predictions)
-- ============================================

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

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_project_predictions_updated_at ON project_predictions;
CREATE TRIGGER update_project_predictions_updated_at
  BEFORE UPDATE ON project_predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PARTIE 2: MODE PRO PERMANENT (profiles)
-- ============================================

-- Ajout des colonnes si elles n'existent pas
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'pro';

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS pro_active BOOLEAN DEFAULT true;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'admin';

-- Forcer les valeurs par défaut pour nouveaux comptes
ALTER TABLE profiles
ALTER COLUMN plan SET DEFAULT 'pro';

ALTER TABLE profiles
ALTER COLUMN pro_active SET DEFAULT true;

ALTER TABLE profiles
ALTER COLUMN mode SET DEFAULT 'admin';

-- Mettre à jour TOUS les comptes existants en mode Pro
UPDATE profiles
SET 
  plan = 'pro',
  pro_active = true,
  mode = 'admin'
WHERE plan IS NULL OR plan != 'pro';

-- ============================================
-- PARTIE 3: VÉRIFICATION
-- ============================================

-- Vérifier que tout est OK
DO $$
BEGIN
  -- Check project_predictions table
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'project_predictions') THEN
    RAISE NOTICE '✅ Table project_predictions créée';
  ELSE
    RAISE EXCEPTION '❌ Table project_predictions manquante';
  END IF;

  -- Check UNIQUE constraint on project_id
  IF EXISTS (
    SELECT FROM pg_constraint 
    WHERE conname = 'project_predictions_project_id_key' 
    AND contype = 'u'
  ) THEN
    RAISE NOTICE '✅ Contrainte UNIQUE sur project_id présente';
  ELSE
    RAISE EXCEPTION '❌ Contrainte UNIQUE manquante';
  END IF;

  -- Check profiles columns
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'plan'
  ) THEN
    RAISE NOTICE '✅ Colonne profiles.plan créée';
  ELSE
    RAISE EXCEPTION '❌ Colonne profiles.plan manquante';
  END IF;

  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'pro_active'
  ) THEN
    RAISE NOTICE '✅ Colonne profiles.pro_active créée';
  ELSE
    RAISE EXCEPTION '❌ Colonne profiles.pro_active manquante';
  END IF;

  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'mode'
  ) THEN
    RAISE NOTICE '✅ Colonne profiles.mode créée';
  ELSE
    RAISE EXCEPTION '❌ Colonne profiles.mode manquante';
  END IF;

  RAISE NOTICE '✅ TOUS LES CHECKS PASSÉS - MODE PRO PERMANENT ACTIVÉ';
END $$;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Pour vérifier manuellement:
-- SELECT id, email, plan, pro_active, mode FROM profiles LIMIT 10;
-- SELECT * FROM project_predictions LIMIT 1;
