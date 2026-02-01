-- ============================================
-- SCRIPT SQL DE VÉRIFICATION/CORRECTION
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Vérifier que la table users existe avec les bonnes colonnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'tenant_id'
  ) THEN
    -- Ajouter tenant_id si manquant
    ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    -- Ajouter role si manquant
    ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client', 'demo'));
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'pro_active'
  ) THEN
    -- Ajouter pro_active si manquant (NOUVEAU pour système 3 états)
    ALTER TABLE users ADD COLUMN pro_active BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- 2. Créer une organisation par défaut si elle n'existe pas
-- (utilise uniquement les colonnes minimales)
INSERT INTO organizations (id, name)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Organisation par défaut'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Vérifier la table projects (colonnes essentielles seulement)
DO $$
BEGIN
  -- Ajouter organization_id si manquant
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
  
  -- Ajouter user_id si manquant
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Créer les index nécessaires
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);

-- 5. Activer RLS sur les tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 6. Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS projects_isolation ON projects;
DROP POLICY IF EXISTS users_isolation ON users;

-- 7. Créer les policies RLS (simples)
CREATE POLICY projects_isolation ON projects
  FOR ALL
  USING (true);

CREATE POLICY users_isolation ON users
  FOR ALL
  USING (true);

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================

-- Afficher la structure actuelle
SELECT 
  'organizations' as table_name,
  COUNT(*) as row_count
FROM organizations
UNION ALL
SELECT 
  'users' as table_name,
  COUNT(*) as row_count
FROM users
UNION ALL
SELECT 
  'projects' as table_name,
  COUNT(*) as row_count
FROM projects;
