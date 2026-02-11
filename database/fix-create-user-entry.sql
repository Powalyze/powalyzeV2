-- ============================================
-- CRÉER ENTRÉE USER DANS TABLE USERS
-- ============================================
-- Date: 2026-02-04
-- Objectif: Synchroniser auth.users avec la table users
-- ============================================

DO $$
DECLARE
  v_auth_user_id UUID;
  v_auth_email TEXT;
  v_org_id UUID;
BEGIN
  -- Récupérer le premier utilisateur auth
  SELECT id, email INTO v_auth_user_id, v_auth_email
  FROM auth.users
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_auth_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Aucun utilisateur dans auth.users';
  END IF;
  
  RAISE NOTICE '✅ Auth user: % (%)', v_auth_email, v_auth_user_id;
  
  -- Récupérer la première organisation
  SELECT id INTO v_org_id
  FROM organizations
  ORDER BY created_at ASC
  LIMIT 1;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION '❌ Aucune organisation trouvée';
  END IF;
  
  RAISE NOTICE '✅ Organisation: %', v_org_id;
  
  -- Vérifier si l'utilisateur existe par email
  IF EXISTS (SELECT 1 FROM users WHERE email = v_auth_email) THEN
    RAISE NOTICE '✅ Utilisateur existe déjà par email dans la table users';
    
    -- Mettre à jour l'ID et tenant_id
    UPDATE users
    SET 
      id = v_auth_user_id,
      tenant_id = v_org_id,
      updated_at = CURRENT_TIMESTAMP
    WHERE email = v_auth_email;
    
    RAISE NOTICE '✅ Utilisateur mis à jour avec l''ID auth correct';
      
  ELSIF EXISTS (SELECT 1 FROM users WHERE id = v_auth_user_id) THEN
    RAISE NOTICE '✅ Utilisateur existe déjà par ID dans la table users';
    
    -- Mettre à jour tenant_id et email
    UPDATE users
    SET 
      email = v_auth_email,
      tenant_id = v_org_id,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = v_auth_user_id;
    
    RAISE NOTICE '✅ Utilisateur mis à jour';
    
  ELSE
    RAISE NOTICE '⚠️  Utilisateur n''existe pas dans users, création...';
    
    -- Créer l'entrée dans users
    INSERT INTO users (id, tenant_id, email, role)
    VALUES (v_auth_user_id, v_org_id, v_auth_email, 'client');
    
    RAISE NOTICE '✅ Utilisateur créé dans la table users';
  END IF;
  
  -- Vérification finale
  RAISE NOTICE '📊 Vérification:';
  RAISE NOTICE '  - Entrées dans users: %', (SELECT COUNT(*) FROM users WHERE id = v_auth_user_id);
  RAISE NOTICE '  - Tenant ID: %', (SELECT tenant_id FROM users WHERE id = v_auth_user_id LIMIT 1);
  
END $$;

-- Afficher le résultat
SELECT 
  u.id,
  u.email,
  u.tenant_id,
  u.role,
  o.name as organization_name
FROM users u
LEFT JOIN organizations o ON o.id = u.tenant_id
ORDER BY u.created_at DESC;
