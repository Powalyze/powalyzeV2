-- MIGRATION SIMPLIFIÉE - SANS RLS (à ajouter après)
-- Testé sur schéma production réel

-- ========================================
-- ÉTAPE 1 : AJOUTER role DANS users
-- ========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(10) DEFAULT 'client' 
      CHECK (role IN ('admin', 'client', 'demo'));
    CREATE INDEX idx_users_role ON users(role);
    RAISE NOTICE '✅ role ajouté dans users';
  END IF;
END $$;

-- ========================================
-- ÉTAPE 2 : AJOUTER project_id DANS risks
-- ========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'risks' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE risks ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
    CREATE INDEX idx_risks_project_id ON risks(project_id);
    RAISE NOTICE '✅ project_id ajouté dans risks';
  END IF;
END $$;

-- ========================================
-- ÉTAPE 3 : CRÉER PROJETS PAR DÉFAUT
-- ========================================
DO $$
DECLARE
  v_org_id UUID;
  v_default_project_id UUID;
  v_owner_id UUID;
BEGIN
  FOR v_org_id IN SELECT id FROM organizations LOOP
    
    -- Trouver un user (UTILISE tenant_id)
    SELECT id INTO v_owner_id
    FROM users
    WHERE tenant_id = v_org_id
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_owner_id IS NULL THEN
      RAISE NOTICE '⚠️ SKIP organisation % (aucun user)', v_org_id;
      CONTINUE;
    END IF;
    
    -- Vérifier si projet existe
    SELECT id INTO v_default_project_id
    FROM projects
    WHERE organization_id = v_org_id
      AND name = '[MIGRATION] Éléments historiques'
    LIMIT 1;
    
    -- Créer projet si nécessaire
    IF v_default_project_id IS NULL THEN
      INSERT INTO projects (organization_id, user_id, name)
      VALUES (v_org_id, v_owner_id, '[MIGRATION] Éléments historiques')
      RETURNING id INTO v_default_project_id;
      
      RAISE NOTICE '✅ Projet créé pour org %', v_org_id;
    END IF;
    
    -- Assigner risks orphelins
    UPDATE risks 
    SET project_id = v_default_project_id
    WHERE organization_id = v_org_id 
      AND project_id IS NULL;
      
  END LOOP;
  
  RAISE NOTICE '✅ Migration des risks terminée';
END $$;

-- ========================================
-- ÉTAPE 4 : RENDRE project_id OBLIGATOIRE
-- ========================================
ALTER TABLE risks ALTER COLUMN project_id SET NOT NULL;

-- ========================================
-- ÉTAPE 5 : CRÉER TABLE reports (SANS RLS)
-- ========================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  
  processed_content JSONB DEFAULT '{}',
  
  summary TEXT,
  insights JSONB DEFAULT '[]',
  risks_detected JSONB DEFAULT '[]',
  decisions_suggested JSONB DEFAULT '[]',
  charts JSONB DEFAULT '[]',
  narrative TEXT,
  
  version INT DEFAULT 1,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_reports_org_id ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- ========================================
-- ÉTAPE 6 : CRÉER TABLE audit_logs (SANS RLS)
-- ========================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  user_id UUID,
  user_email TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_id ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ========================================
-- ÉTAPE 7 : FONCTION HELPER LOG
-- ========================================
CREATE OR REPLACE FUNCTION log_cockpit_action(
  p_organization_id UUID,
  p_project_id UUID,
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_user_id UUID;
  v_user_email TEXT;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NOT NULL THEN
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;
  END IF;
  
  INSERT INTO audit_logs (
    organization_id,
    project_id,
    action_type,
    entity_type,
    entity_id,
    description,
    metadata,
    user_id,
    user_email
  ) VALUES (
    p_organization_id,
    p_project_id,
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_description,
    p_metadata,
    v_user_id,
    v_user_email
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- RÉSUMÉ
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MIGRATION TERMINÉE !';
  RAISE NOTICE '========================================';
  RAISE NOTICE '1. role ajouté dans users';
  RAISE NOTICE '2. project_id ajouté dans risks';
  RAISE NOTICE '3. projets par défaut créés';
  RAISE NOTICE '4. project_id obligatoire dans risks';
  RAISE NOTICE '5. table reports créée';
  RAISE NOTICE '6. table audit_logs créée';
  RAISE NOTICE '7. fonction log_cockpit_action créée';
  RAISE NOTICE '========================================';
  RAISE NOTICE '⚠️ RLS policies à ajouter manuellement après';
END $$;
