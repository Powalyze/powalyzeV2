-- ============================================================================
-- SCRIPT PRÉLIMINAIRE - CRÉATION DES TABLES MANQUANTES
-- ============================================================================
-- Ce script crée les tables nécessaires si elles n'existent pas
-- À exécuter AVANT FIX_SUPABASE_ORGANIZATIONS.sql
-- ============================================================================

-- 1️⃣ CRÉER LA TABLE organizations (si elle n'existe pas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2️⃣ CRÉER LA TABLE memberships (si elle n'existe pas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3️⃣ CRÉER LA TABLE profiles (si elle n'existe pas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4️⃣ ACTIVER RLS SUR TOUTES LES TABLES
-- ============================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5️⃣ CRÉER LES POLICIES DE BASE POUR organizations
-- ============================================================================
DROP POLICY IF EXISTS "organizations_select_member" ON organizations;
DROP POLICY IF EXISTS "organizations_insert_own" ON organizations;
DROP POLICY IF EXISTS "organizations_update_owner" ON organizations;

CREATE POLICY "organizations_select_member" 
ON organizations 
FOR SELECT 
USING (
    id IN (
        SELECT organization_id 
        FROM memberships 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "organizations_insert_own" 
ON organizations 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "organizations_update_owner" 
ON organizations 
FOR UPDATE 
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- 6️⃣ CRÉER LES POLICIES DE BASE POUR profiles
-- ============================================================================
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

CREATE POLICY "profiles_select_own" 
ON profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" 
ON profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" 
ON profiles 
FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 7️⃣ CRÉER UN TRIGGER POUR AUTO-CRÉER LE PROFILE À L'INSCRIPTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 8️⃣ CRÉER DES INDEX POUR LES PERFORMANCES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_organizations_owner 
ON organizations(owner_id);

CREATE INDEX IF NOT EXISTS idx_memberships_user 
ON memberships(user_id);

CREATE INDEX IF NOT EXISTS idx_memberships_org 
ON memberships(organization_id);

CREATE INDEX IF NOT EXISTS idx_profiles_email 
ON profiles(email);

-- ============================================================================
-- VÉRIFICATIONS
-- ============================================================================
SELECT 
    'organizations' AS table_name,
    COUNT(*) AS row_count
FROM organizations
UNION ALL
SELECT 
    'memberships' AS table_name,
    COUNT(*) AS row_count
FROM memberships
UNION ALL
SELECT 
    'profiles' AS table_name,
    COUNT(*) AS row_count
FROM profiles;

-- ============================================================================
-- FIN DU SCRIPT DE CRÉATION
-- ============================================================================
