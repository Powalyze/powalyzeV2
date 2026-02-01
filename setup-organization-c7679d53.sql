-- ========================================
-- SETUP ORGANISATION POUR FABRICE
-- User ID: c7679d53-7d45-48c0-a901-b36aa1a27ccb
-- Date: 30 janvier 2026
-- ========================================

-- ÉTAPE 1: Créer l'organisation
INSERT INTO organizations (name, owner_id)
VALUES ('Organisation Fabrice', 'c7679d53-7d45-48c0-a901-b36aa1a27ccb')
RETURNING *;

-- ⚠️ COPIER L'ID RETOURNÉ CI-DESSUS
-- Exemple: 12345678-1234-1234-1234-123456789012

-- ÉTAPE 2: Créer le membership (REMPLACER <ORG_ID> par l'ID copié ci-dessus)
-- INSERT INTO memberships (organization_id, user_id, role)
-- VALUES ('<ORG_ID>', 'c7679d53-7d45-48c0-a901-b36aa1a27ccb', 'owner')
-- RETURNING *;

-- ÉTAPE 3: Mettre à jour user_metadata (REMPLACER <ORG_ID> par l'ID copié)
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('organization_id', '<ORG_ID>')
-- WHERE id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';

-- ========================================
-- VÉRIFICATIONS
-- ========================================

-- Vérifier l'organisation créée
SELECT * FROM organizations WHERE owner_id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';

-- Vérifier le membership
SELECT * FROM memberships WHERE user_id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';

-- Vérifier user_metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'organization_id' as org_id_in_metadata
FROM auth.users
WHERE id = 'c7679d53-7d45-48c0-a901-b36aa1a27ccb';
