-- MIGRATION : project_id obligatoire partout
-- Architecture cockpit centrée projet
-- Compatible avec le schéma existant en production
-- SÉCURISÉ : Gère les NULL existants automatiquement

-- ÉTAPE 0 : Créer un projet par défaut pour les orphelins (par organisation)
DO $$
DECLARE
  v_org_id UUID;
  v_default_project_id UUID;
  v_columns TEXT;
BEGIN
  -- Détecter les colonnes disponibles dans projects
  SELECT string_agg(column_name, ', ')
  INTO v_columns
  FROM information_schema.columns
  WHERE table_name = 'projects'
    AND column_name IN ('organization_id', 'name', 'description', 'sponsor', 'pm', 'budget', 
                        'status', 'rag_status', 'start_date', 'end_date', 'completion_percentage');
  
  RAISE NOTICE 'Colonnes projects disponibles: %', v_columns;
  
  -- Pour chaque organisation
  FOR v_org_id IN SELECT id FROM organizations LOOP
    
    -- Vérifier si projet par défaut existe
    SELECT id INTO v_default_project_id
    FROM projects
    WHERE organization_id = v_org_id
      AND name = '[MIGRATION] Éléments historiques'
    LIMIT 1;
    
    -- Si pas de projet par défaut, le créer avec colonnes minimales
    IF v_default_project_id IS NULL THEN
      INSERT INTO projects (
        organization_id,
        name,
        description,
        status,
        rag_status,
        start_date,
        end_date
      ) VALUES (
        v_org_id,
        '[MIGRATION] Éléments historiques',
        'Projet créé automatiquement pour regrouper les risques, décisions et actions sans projet assigné',
        'ACTIVE',
        'GRAY',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '1 year'
      )
      RETURNING id INTO v_default_project_id;
      
      RAISE NOTICE 'Projet par défaut créé pour organisation %: %', v_org_id, v_default_project_id;
    END IF;
    
    -- Assigner les risks orphelins
    UPDATE risks 
    SET project_id = v_default_project_id
    WHERE organization_id = v_org_id 
      AND project_id IS NULL;
    
    -- Assigner les decisions orphelines
    UPDATE decisions 
    SET project_id = v_default_project_id
    WHERE organization_id = v_org_id 
      AND project_id IS NULL;
    
    -- Assigner les actions orphelines
    UPDATE actions 
    SET project_id = v_default_project_id
    WHERE organization_id = v_org_id 
      AND project_id IS NULL;
      
  END LOOP;
  
  RAISE NOTICE 'Migration des orphelins terminée';
END $$;

-- ÉTAPE 1 : Rendre project_id obligatoire dans risks
ALTER TABLE risks 
ALTER COLUMN project_id SET NOT NULL;

-- ÉTAPE 2 : Rendre project_id obligatoire dans decisions
ALTER TABLE decisions 
ALTER COLUMN project_id SET NOT NULL;

-- ÉTAPE 3 : Rendre project_id obligatoire dans actions
ALTER TABLE actions 
ALTER COLUMN project_id SET NOT NULL;

-- ÉTAPE 4 : Créer table audit_logs pour traçabilité (nouveau)
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

-- Index pour audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_id ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- RLS pour audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_select_policy ON audit_logs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY audit_logs_insert_policy ON audit_logs
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

-- ÉTAPE 5 : Vérifier que reports a project_id (créé dans session précédente)
-- Si pas présent, l'ajouter
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reports' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE reports ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
    CREATE INDEX idx_reports_project_id ON reports(project_id);
  END IF;
END $$;

-- ÉTAPE 6 : Fonction helper pour logger les actions
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
  -- Récupérer l'utilisateur courant
  v_user_id := auth.uid();
  
  IF v_user_id IS NOT NULL THEN
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;
  END IF;
  
  -- Créer le log
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

COMMENT ON TABLE audit_logs IS 'Historique des actions dans le cockpit';
COMMENT ON FUNCTION log_cockpit_action IS 'Helper pour logger une action dans le cockpit';
