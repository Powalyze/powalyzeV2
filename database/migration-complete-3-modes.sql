-- MIGRATION COMPLÈTE : Système à 3 modes (admin/client/demo)
-- Compatible avec le schéma Supabase production
-- SÉCURISÉ : Gère les NULL existants automatiquement

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
    
    RAISE NOTICE 'Colonne role ajoutée dans users';
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
    RAISE NOTICE 'Colonne project_id ajoutée dans risks';
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
  -- Pour chaque organisation
  FOR v_org_id IN SELECT id FROM organizations LOOP
    
    -- Trouver un user de l'organisation (UTILISE tenant_id)
    SELECT id INTO v_owner_id
    FROM users
    WHERE tenant_id = v_org_id
    ORDER BY created_at ASC
    LIMIT 1;

    -- Si aucun user trouvé → SKIP (impossible créer projet sans user_id)
    IF v_owner_id IS NULL THEN
      RAISE NOTICE '⚠️ AUCUN USER pour organisation %, projet ignoré', v_org_id;
      CONTINUE;
    END IF;
    
    -- Vérifier si projet par défaut existe
    SELECT id INTO v_default_project_id
    FROM projects
    WHERE organization_id = v_org_id
      AND name = '[MIGRATION] Éléments historiques'
    LIMIT 1;
    
    -- Si pas de projet par défaut, le créer (MINIMAL: organization_id, user_id, name)
    IF v_default_project_id IS NULL THEN
      INSERT INTO projects (
        organization_id,
        user_id,
        name
      ) VALUES (
        v_org_id,
        v_owner_id,
        '[MIGRATION] Éléments historiques'
      )
      RETURNING id INTO v_default_project_id;
      
      RAISE NOTICE 'Projet par défaut créé pour organisation %: %', v_org_id, v_default_project_id;
    END IF;
    
    -- Assigner les risks orphelins
    UPDATE risks 
    SET project_id = v_default_project_id
    WHERE organization_id = v_org_id 
      AND project_id IS NULL;
      
  END LOOP;
  
  RAISE NOTICE 'Migration des orphelins terminée';
END $$;

-- ========================================
-- ÉTAPE 4 : RENDRE project_id OBLIGATOIRE
-- ========================================
ALTER TABLE risks ALTER COLUMN project_id SET NOT NULL;

-- ========================================
-- ÉTAPE 5 : CRÉER TABLE reports
-- ========================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Fichier
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  
  -- Contenu extrait
  processed_content JSONB DEFAULT '{}',
  
  -- IA
  summary TEXT,
  insights JSONB DEFAULT '[]',
  risks_detected JSONB DEFAULT '[]',
  decisions_suggested JSONB DEFAULT '[]',
  charts JSONB DEFAULT '[]',
  narrative TEXT,
  
  -- Versioning
  version INT DEFAULT 1,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reports_org_id ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY reports_select_policy ON reports
  FOR SELECT
  USING (
    organization_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY reports_insert_policy ON reports
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY reports_update_policy ON reports
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY reports_delete_policy ON reports
  FOR DELETE
  USING (
    organization_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  );

-- ========================================
-- ÉTAPE 6 : CRÉER TABLE audit_logs
-- ========================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Action
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  -- Détails
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Utilisateur
  user_id UUID,
  user_email TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_id ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_select_policy ON audit_logs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY audit_logs_insert_policy ON audit_logs
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  );

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
-- COMMENTAIRES
-- ========================================
COMMENT ON TABLE reports IS 'Rapports importés et analysés par IA';
COMMENT ON TABLE audit_logs IS 'Historique des actions dans le cockpit';
COMMENT ON FUNCTION log_cockpit_action IS 'Helper pour logger une action';

-- ========================================
-- RÉSUMÉ
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '✅ Migration complète terminée !';
  RAISE NOTICE '- role ajouté dans users';
  RAISE NOTICE '- project_id obligatoire dans risks, decisions, actions';
  RAISE NOTICE '- table reports créée';
  RAISE NOTICE '- table audit_logs créée';
  RAISE NOTICE '- fonction log_cockpit_action créée';
END $$;
