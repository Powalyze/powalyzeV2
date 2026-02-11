-- ============================================
-- FIX FINAL : LIER PROJETS À L'UTILISATEUR
-- ============================================
-- Date: 2026-02-04
-- Objectif: Assurer que tous les projets sont visibles
-- ============================================

-- Étape 1: Récupérer l'ID de l'utilisateur auth
DO $$
DECLARE
  v_auth_user_id UUID;
  v_org_id UUID;
  v_projects_updated INT;
BEGIN
  -- Récupérer le premier utilisateur auth
  SELECT id INTO v_auth_user_id
  FROM auth.users
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_auth_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Aucun utilisateur trouvé dans auth.users';
  END IF;
  
  RAISE NOTICE '✅ Utilisateur auth trouvé: %', v_auth_user_id;
  
  -- Récupérer l'organisation de cet utilisateur (via la table users si elle existe)
  -- Sinon, utiliser la première organisation
  SELECT id INTO v_org_id
  FROM organizations
  ORDER BY created_at ASC
  LIMIT 1;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION '❌ Aucune organisation trouvée';
  END IF;
  
  RAISE NOTICE '✅ Organisation par défaut: %', v_org_id;
  
  -- Mettre à jour TOUS les projets pour qu'ils soient liés à cette organisation et cet utilisateur
  UPDATE projects
  SET 
    organization_id = v_org_id,
    user_id = v_auth_user_id,
    updated_at = CURRENT_TIMESTAMP
  WHERE organization_id IS NULL 
     OR user_id IS NULL
     OR user_id != v_auth_user_id;
  
  GET DIAGNOSTICS v_projects_updated = ROW_COUNT;
  
  RAISE NOTICE '✅ % projets mis à jour', v_projects_updated;
  
  -- Vérification finale
  RAISE NOTICE '📊 État final:';
  RAISE NOTICE '  - Organization ID: %', v_org_id;
  RAISE NOTICE '  - User ID: %', v_auth_user_id;
  RAISE NOTICE '  - Projets totaux: %', (SELECT COUNT(*) FROM projects);
  RAISE NOTICE '  - Projets avec org: %', (SELECT COUNT(*) FROM projects WHERE organization_id IS NOT NULL);
  RAISE NOTICE '  - Projets avec user: %', (SELECT COUNT(*) FROM projects WHERE user_id IS NOT NULL);
  RAISE NOTICE '  - Projets de cet utilisateur: %', (SELECT COUNT(*) FROM projects WHERE user_id = v_auth_user_id);
  
END $$;

-- Vérifier les projets après mise à jour
SELECT 
  id,
  name,
  organization_id,
  user_id,
  status,
  health,
  progress,
  owner,
  created_at
FROM projects
ORDER BY created_at DESC;

-- Afficher un résumé
SELECT 
  '✅ FIX TERMINÉ' as status,
  COUNT(*) as total_projects,
  COUNT(DISTINCT organization_id) as organizations,
  COUNT(DISTINCT user_id) as users
FROM projects;
