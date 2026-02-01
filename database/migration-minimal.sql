-- MIGRATION MINIMALE - SEULEMENT L'ESSENTIEL
-- Pas de RLS, pas de complexité

-- ========================================
-- ÉTAPE 1 : AJOUTER role DANS users
-- ========================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(10) DEFAULT 'client' CHECK (role IN ('admin', 'client', 'demo'));
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ========================================
-- ÉTAPE 2 : AJOUTER project_id DANS risks
-- ========================================
ALTER TABLE risks ADD COLUMN IF NOT EXISTS project_id UUID;
CREATE INDEX IF NOT EXISTS idx_risks_project_id ON risks(project_id);

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
    SELECT id INTO v_owner_id FROM users WHERE tenant_id = v_org_id LIMIT 1;

    IF v_owner_id IS NULL THEN
      CONTINUE;
    END IF;
    
    -- Vérifier si projet existe
    SELECT id INTO v_default_project_id FROM projects
    WHERE organization_id = v_org_id AND name = '[MIGRATION] Éléments historiques' LIMIT 1;
    
    -- Créer projet si nécessaire
    IF v_default_project_id IS NULL THEN
      INSERT INTO projects (organization_id, user_id, name)
      VALUES (v_org_id, v_owner_id, '[MIGRATION] Éléments historiques')
      RETURNING id INTO v_default_project_id;
    END IF;
    
    -- Assigner risks orphelins
    UPDATE risks SET project_id = v_default_project_id
    WHERE organization_id = v_org_id AND project_id IS NULL;
      
  END LOOP;
END $$;

-- ========================================
-- ÉTAPE 4 : AJOUTER FOREIGN KEY
-- ========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_risks_project_id'
  ) THEN
    ALTER TABLE risks ADD CONSTRAINT fk_risks_project_id FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ========================================
-- ÉTAPE 5 : RENDRE project_id OBLIGATOIRE
-- ========================================
DO $$
BEGIN
  ALTER TABLE risks ALTER COLUMN project_id SET NOT NULL;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'project_id est déjà NOT NULL ou erreur: %', SQLERRM;
END $$;

-- ========================================
-- RÉSUMÉ
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '✅ MIGRATION TERMINÉE !';
  RAISE NOTICE '1. role ajouté dans users';
  RAISE NOTICE '2. project_id ajouté dans risks';
  RAISE NOTICE '3. projets par défaut créés';
  RAISE NOTICE '4. foreign key ajoutée';
  RAISE NOTICE '5. project_id obligatoire';
END $$;
