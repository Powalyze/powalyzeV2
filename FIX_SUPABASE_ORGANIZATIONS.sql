-- ============================================================================
-- SCRIPT DE CORRECTION URGENTE - PROBLÈMES ORGANIZATIONS & MEMBERSHIPS
-- ============================================================================
-- Ce script corrige les erreurs 406, 409, 400 et la boucle infinie
-- Date: 2026-01-14
-- ============================================================================

-- 1️⃣ AJOUTER LA COLONNE organization_id À profiles (si elle n'existe pas)
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'organization_id'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
        
        RAISE NOTICE '✅ Colonne organization_id ajoutée à profiles';
    ELSE
        RAISE NOTICE '✅ Colonne organization_id existe déjà dans profiles';
    END IF;
END $$;

-- 2️⃣ CRÉER UN INDEX POUR AMÉLIORER LES PERFORMANCES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id 
ON profiles(organization_id);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id 
ON memberships(user_id);

CREATE INDEX IF NOT EXISTS idx_memberships_org_id 
ON memberships(organization_id);

-- 3️⃣ SUPPRIMER LES DOUBLONS DANS memberships (garder le plus ancien)
-- ============================================================================
DO $$ 
BEGIN
    DELETE FROM memberships
    WHERE id NOT IN (
        SELECT DISTINCT ON (user_id, organization_id) id
        FROM memberships
        ORDER BY user_id, organization_id, created_at ASC
    );
    
    RAISE NOTICE '✅ Doublons supprimés dans memberships';
END $$;

-- 4️⃣ AJOUTER UNE CONTRAINTE UNIQUE POUR ÉVITER LES DOUBLONS FUTURS
-- ============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'memberships_user_org_unique'
    ) THEN
        ALTER TABLE memberships 
        ADD CONSTRAINT memberships_user_org_unique 
        UNIQUE (user_id, organization_id);
        
        RAISE NOTICE '✅ Contrainte UNIQUE ajoutée sur memberships';
    ELSE
        RAISE NOTICE '✅ Contrainte UNIQUE existe déjà sur memberships';
    END IF;
END $$;

-- 5️⃣ CORRIGER LES RLS POLICIES SUR memberships (AUTORISER SELECT)
-- ============================================================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "memberships_select_own" ON memberships;
DROP POLICY IF EXISTS "memberships_insert_own" ON memberships;
DROP POLICY IF EXISTS "memberships_update_own" ON memberships;

-- Policy SELECT: Autoriser la lecture de ses propres memberships
CREATE POLICY "memberships_select_own" 
ON memberships 
FOR SELECT 
USING (user_id = auth.uid());

-- Policy INSERT: Autoriser la création uniquement par l'utilisateur lui-même
CREATE POLICY "memberships_insert_own" 
ON memberships 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Policy UPDATE: Autoriser la mise à jour de ses propres memberships
CREATE POLICY "memberships_update_own" 
ON memberships 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DO $$ 
BEGIN
    RAISE NOTICE '✅ RLS policies mises à jour sur memberships';
END $$;

-- 6️⃣ ACTIVER RLS SUR LA TABLE memberships (si pas déjà fait)
-- ============================================================================
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- 7️⃣ SYNCHRONISER profiles.organization_id AVEC memberships
-- ============================================================================
DO $$ 
BEGIN
    -- Mettre à jour profiles.organization_id avec la première organisation de chaque user
    UPDATE profiles p
    SET organization_id = (
        SELECT m.organization_id 
        FROM memberships m 
        WHERE m.user_id = p.id 
        ORDER BY m.created_at ASC 
        LIMIT 1
    )
    WHERE p.organization_id IS NULL;
    
    RAISE NOTICE '✅ profiles.organization_id synchronisé avec memberships';
END $$;

-- 8️⃣ NETTOYER LES ORGANISATIONS ORPHELINES (sans membres)
-- ============================================================================
DO $$ 
BEGIN
    DELETE FROM organizations
    WHERE id NOT IN (
        SELECT DISTINCT organization_id 
        FROM memberships
    )
    AND created_at < NOW() - INTERVAL '1 hour'; -- Seulement celles créées il y a plus d'1h
    
    RAISE NOTICE '✅ Organisations orphelines supprimées';
END $$;

-- 9️⃣ CRÉER UNE FONCTION POUR GÉRER L'AUTO-SETUP UTILISATEUR
-- ============================================================================
CREATE OR REPLACE FUNCTION ensure_user_setup()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- Vérifier si l'utilisateur a déjà un membership
    IF NOT EXISTS (
        SELECT 1 FROM memberships WHERE user_id = NEW.id
    ) THEN
        -- Créer une nouvelle organisation
        INSERT INTO organizations (name, owner_id)
        VALUES (
            NEW.email || '''s Organization',
            NEW.id
        )
        RETURNING id INTO new_org_id;
        
        -- Créer le membership
        INSERT INTO memberships (user_id, organization_id, role)
        VALUES (NEW.id, new_org_id, 'owner');
        
        -- Mettre à jour profiles
        UPDATE profiles 
        SET organization_id = new_org_id 
        WHERE id = NEW.id;
        
        RAISE NOTICE 'Auto-setup: Organisation créée pour user %', NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10️⃣ CRÉER UN TRIGGER POUR L'AUTO-SETUP
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_ensure_user_setup ON profiles;

CREATE TRIGGER trigger_ensure_user_setup
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION ensure_user_setup();

DO $$ 
BEGIN
    RAISE NOTICE '✅ Trigger auto-setup créé sur profiles';
END $$;

-- ============================================================================
-- VÉRIFICATIONS FINALES
-- ============================================================================

-- Compter les utilisateurs sans organisation
SELECT 
    COUNT(*) AS users_sans_org,
    'Utilisateurs sans organization_id' AS description
FROM profiles
WHERE organization_id IS NULL;

-- Compter les doublons restants (devrait être 0)
SELECT 
    COUNT(*) AS doublons,
    'Doublons dans memberships (devrait être 0)' AS description
FROM (
    SELECT user_id, organization_id, COUNT(*) 
    FROM memberships 
    GROUP BY user_id, organization_id 
    HAVING COUNT(*) > 1
) AS duplicates;

-- Lister les policies actives
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    'Policy active' AS description
FROM pg_policies
WHERE tablename = 'memberships';

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
-- RÉSULTAT ATTENDU :
-- ✅ profiles a la colonne organization_id
-- ✅ RLS policies correctes sur memberships (SELECT autorisé)
-- ✅ Contrainte UNIQUE sur (user_id, organization_id)
-- ✅ Doublons supprimés
-- ✅ Auto-setup automatique pour nouveaux users
-- ============================================================================
