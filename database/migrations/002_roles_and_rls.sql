-- ============================================================================
-- MIGRATION 002: SYSTÈME DE RÔLES DEMO/PRO + RLS COMPLET
-- ============================================================================
-- Description: Ajout colonne role, tables demo, policies RLS strictes
-- Date: 2026-01-26
-- Author: Powalyze DevOps
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. AJOUT COLONNE ROLE DANS PROFILES
-- ============================================================================

-- Ajouter colonne role si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'demo' CHECK (role IN ('demo', 'pro', 'admin'));
    CREATE INDEX idx_profiles_role ON profiles(role);
  END IF;
END $$;

-- Mettre à jour les profils existants (demo par défaut)
UPDATE profiles SET role = 'demo' WHERE role IS NULL;

-- ============================================================================
-- 2. CRÉATION TABLES DEMO (PRÉFIXE demo_)
-- ============================================================================

-- Table demo_projects (projets démo)
CREATE TABLE IF NOT EXISTS demo_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED')),
  rag_status TEXT DEFAULT 'GREEN' CHECK (rag_status IN ('GREEN', 'YELLOW', 'RED')),
  budget NUMERIC(12,2) DEFAULT 0,
  spent NUMERIC(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table demo_risks (risques démo)
CREATE TABLE IF NOT EXISTS demo_risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES demo_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  probability TEXT DEFAULT 'MEDIUM' CHECK (probability IN ('LOW', 'MEDIUM', 'HIGH')),
  impact TEXT DEFAULT 'MEDIUM' CHECK (impact IN ('LOW', 'MEDIUM', 'HIGH')),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MITIGATED', 'CLOSED')),
  mitigation_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table demo_decisions (décisions démo)
CREATE TABLE IF NOT EXISTS demo_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES demo_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  decision_date DATE DEFAULT CURRENT_DATE,
  decision_maker TEXT,
  impact TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_demo_projects_user ON demo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_projects_org ON demo_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_demo_risks_user ON demo_risks(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_risks_project ON demo_risks(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_decisions_user ON demo_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_decisions_project ON demo_decisions(project_id);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) - PROFILES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Utilisateurs peuvent voir leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Utilisateurs peuvent mettre à jour leur propre profil (SAUF role)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM profiles WHERE user_id = auth.uid()));

-- Policy: Admins peuvent tout voir et modifier
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) - TABLES DEMO
-- ============================================================================

-- RLS demo_projects
ALTER TABLE demo_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Demo users can view own demo projects" ON demo_projects;
CREATE POLICY "Demo users can view own demo projects"
  ON demo_projects FOR SELECT
  USING (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'demo'
    )
  );

DROP POLICY IF EXISTS "Demo users can insert own demo projects" ON demo_projects;
CREATE POLICY "Demo users can insert own demo projects"
  ON demo_projects FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'demo'
    )
  );

DROP POLICY IF EXISTS "Demo users can update own demo projects" ON demo_projects;
CREATE POLICY "Demo users can update own demo projects"
  ON demo_projects FOR UPDATE
  USING (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'demo'
    )
  );

DROP POLICY IF EXISTS "Demo users can delete own demo projects" ON demo_projects;
CREATE POLICY "Demo users can delete own demo projects"
  ON demo_projects FOR DELETE
  USING (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'demo'
    )
  );

-- RLS demo_risks
ALTER TABLE demo_risks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Demo users can manage own demo risks" ON demo_risks;
CREATE POLICY "Demo users can manage own demo risks"
  ON demo_risks FOR ALL
  USING (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'demo'
    )
  );

-- RLS demo_decisions
ALTER TABLE demo_decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Demo users can manage own demo decisions" ON demo_decisions;
CREATE POLICY "Demo users can manage own demo decisions"
  ON demo_decisions FOR ALL
  USING (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'demo'
    )
  );

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) - TABLES PRO (PRODUCTION)
-- ============================================================================

-- RLS projects (production)
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pro users can view own org projects" ON projects;
CREATE POLICY "Pro users can view own org projects"
  ON projects FOR SELECT
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('pro', 'admin')
    )
  );

DROP POLICY IF EXISTS "Pro users can manage own org projects" ON projects;
CREATE POLICY "Pro users can manage own org projects"
  ON projects FOR ALL
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('pro', 'admin')
    )
  );

-- RLS risks (production)
ALTER TABLE IF EXISTS risks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pro users can manage own org risks" ON risks;
CREATE POLICY "Pro users can manage own org risks"
  ON risks FOR ALL
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('pro', 'admin')
    )
  );

-- RLS decisions (production)
ALTER TABLE IF EXISTS decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pro users can manage own org decisions" ON decisions;
CREATE POLICY "Pro users can manage own org decisions"
  ON decisions FOR ALL
  USING (
    organization_id = (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('pro', 'admin')
    )
  );

-- ============================================================================
-- 6. FONCTION HELPER: GET USER ROLE
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE user_id = user_uuid LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- 7. TRIGGER: UPDATE updated_at AUTOMATIQUE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_demo_projects_updated_at ON demo_projects;
CREATE TRIGGER update_demo_projects_updated_at
  BEFORE UPDATE ON demo_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_demo_risks_updated_at ON demo_risks;
CREATE TRIGGER update_demo_risks_updated_at
  BEFORE UPDATE ON demo_risks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_demo_decisions_updated_at ON demo_decisions;
CREATE TRIGGER update_demo_decisions_updated_at
  BEFORE UPDATE ON demo_decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. DONNÉES DEMO INITIALES (SEED)
-- ============================================================================

-- Insérer des projets démo pour tous les utilisateurs demo existants
INSERT INTO demo_projects (organization_id, user_id, name, description, status, rag_status, budget, spent, completion_percentage)
SELECT 
  organization_id,
  user_id,
  'Projet Démo ' || ROW_NUMBER() OVER (PARTITION BY user_id),
  'Projet de démonstration créé automatiquement',
  'ACTIVE',
  'GREEN',
  100000,
  25000,
  30
FROM profiles
WHERE role = 'demo'
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- MIGRATION TERMINÉE
-- ============================================================================
-- Résumé:
-- ✅ Colonne role ajoutée (demo/pro/admin)
-- ✅ Tables demo_* créées (projects, risks, decisions)
-- ✅ RLS activé sur profiles avec policies strictes
-- ✅ RLS activé sur tables demo (demo users only)
-- ✅ RLS activé sur tables pro (pro users only)
-- ✅ Fonction helper get_user_role()
-- ✅ Triggers updated_at automatiques
-- ✅ Seed data demo initiale
-- ============================================================================
