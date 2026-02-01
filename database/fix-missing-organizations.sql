-- ============================================
-- FIX 5 - VÉRIFICATION & CORRECTION MEMBERSHIPS MANQUANTS
-- Script SQL pour diagnostiquer et corriger les problèmes d'organisation
-- Date: 30 Janvier 2026
-- ============================================

-- ============================================
-- DIAGNOSTIC: Vérifier les utilisateurs sans membership
-- ============================================

-- Lister tous les utilisateurs sans membership
SELECT 
  au.id as user_id,
  au.email,
  au.created_at,
  au.raw_user_meta_data->>'first_name' as first_name,
  au.raw_user_meta_data->>'last_name' as last_name,
  au.raw_user_meta_data->>'organization_id' as metadata_org_id
FROM auth.users au
LEFT JOIN memberships m ON m.user_id = au.id
WHERE m.id IS NULL
ORDER BY au.created_at DESC;

-- Compter les utilisateurs sans membership
SELECT COUNT(*) as users_without_membership
FROM auth.users au
LEFT JOIN memberships m ON m.user_id = au.id
WHERE m.id IS NULL;

-- Lister les utilisateurs avec organization_id dans metadata mais sans membership
SELECT 
  au.id as user_id,
  au.email,
  au.raw_user_meta_data->>'organization_id' as metadata_org_id
FROM auth.users au
WHERE 
  au.raw_user_meta_data->>'organization_id' IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM memberships m WHERE m.user_id = au.id
  );

-- ============================================
-- FIX: Créer automatiquement les organisations et memberships manquants
-- ============================================

-- Fonction pour créer organization + membership pour un utilisateur
CREATE OR REPLACE FUNCTION fix_missing_organization_for_user(target_user_id UUID)
RETURNS TABLE(organization_id UUID, membership_id UUID, status TEXT) AS $$
DECLARE
  new_org_id UUID;
  new_membership_id UUID;
  user_email TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_company TEXT;
  org_name TEXT;
  existing_membership UUID;
BEGIN
  -- Vérifier si l'utilisateur existe
  SELECT 
    email,
    raw_user_meta_data->>'first_name',
    raw_user_meta_data->>'last_name',
    raw_user_meta_data->>'company'
  INTO 
    user_email,
    user_first_name,
    user_last_name,
    user_company
  FROM auth.users
  WHERE id = target_user_id;

  IF user_email IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, NULL::UUID, 'ERROR: User not found'::TEXT;
    RETURN;
  END IF;

  -- Vérifier si l'utilisateur a déjà un membership
  SELECT id INTO existing_membership
  FROM memberships
  WHERE user_id = target_user_id
  LIMIT 1;

  IF existing_membership IS NOT NULL THEN
    RETURN QUERY SELECT NULL::UUID, existing_membership, 'SKIP: User already has membership'::TEXT;
    RETURN;
  END IF;

  -- Construire le nom de l'organisation
  IF user_company IS NOT NULL AND user_company != '' THEN
    org_name := user_company;
  ELSIF user_first_name IS NOT NULL AND user_last_name IS NOT NULL THEN
    org_name := 'Organisation de ' || user_first_name || ' ' || user_last_name;
  ELSE
    org_name := 'Organisation de ' || user_email;
  END IF;

  -- Créer l'organisation
  INSERT INTO organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;

  -- Créer le membership (owner)
  INSERT INTO memberships (organization_id, user_id, role)
  VALUES (new_org_id, target_user_id, 'owner')
  RETURNING id INTO new_membership_id;

  -- Mettre à jour user_metadata (si possible via trigger ou API)
  -- Note: Impossible de modifier auth.users.raw_user_meta_data directement en SQL
  -- Doit être fait via supabaseAdmin.auth.admin.updateUserById()

  RETURN QUERY SELECT new_org_id, new_membership_id, 'SUCCESS: Organization and membership created'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CORRECTION MANUELLE: Créer organization + membership pour UN utilisateur
-- ============================================

-- EXEMPLE D'UTILISATION:
-- Remplacez 'USER_ID_HERE' par l'ID réel de l'utilisateur

-- SELECT * FROM fix_missing_organization_for_user('USER_ID_HERE');

-- ============================================
-- CORRECTION EN MASSE: Créer pour TOUS les utilisateurs sans membership
-- ============================================

-- Fonction pour corriger TOUS les utilisateurs
CREATE OR REPLACE FUNCTION fix_all_missing_organizations()
RETURNS TABLE(user_id UUID, organization_id UUID, membership_id UUID, status TEXT) AS $$
DECLARE
  user_record RECORD;
  result RECORD;
BEGIN
  FOR user_record IN 
    SELECT au.id
    FROM auth.users au
    LEFT JOIN memberships m ON m.user_id = au.id
    WHERE m.id IS NULL
  LOOP
    FOR result IN 
      SELECT * FROM fix_missing_organization_for_user(user_record.id)
    LOOP
      RETURN QUERY SELECT 
        user_record.id,
        result.organization_id,
        result.membership_id,
        result.status;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- EXÉCUTER LA CORRECTION EN MASSE:
-- SELECT * FROM fix_all_missing_organizations();

-- ============================================
-- VÉRIFICATION POST-FIX
-- ============================================

-- Vérifier que tous les utilisateurs ont maintenant un membership
SELECT 
  COUNT(*) as users_with_membership
FROM auth.users au
INNER JOIN memberships m ON m.user_id = au.id;

-- Vérifier que chaque utilisateur a exactement 1 membership owner
SELECT 
  au.id as user_id,
  au.email,
  COUNT(m.id) as membership_count,
  COUNT(CASE WHEN m.role = 'owner' THEN 1 END) as owner_count
FROM auth.users au
LEFT JOIN memberships m ON m.user_id = au.id
GROUP BY au.id, au.email
HAVING COUNT(m.id) = 0 OR COUNT(CASE WHEN m.role = 'owner' THEN 1 END) = 0;

-- Lister les organizations créées avec leur owner
SELECT 
  o.id as organization_id,
  o.name,
  m.user_id as owner_user_id,
  au.email as owner_email,
  o.created_at
FROM organizations o
INNER JOIN memberships m ON m.organization_id = o.id AND m.role = 'owner'
INNER JOIN auth.users au ON au.id = m.user_id
ORDER BY o.created_at DESC;

-- ============================================
-- NETTOYAGE (OPTIONNEL)
-- ============================================

-- Supprimer les fonctions de fix si elles ne sont plus nécessaires
-- DROP FUNCTION IF EXISTS fix_missing_organization_for_user(UUID);
-- DROP FUNCTION IF EXISTS fix_all_missing_organizations();

-- ============================================
-- FIN SCRIPT FIX 5
-- ============================================
