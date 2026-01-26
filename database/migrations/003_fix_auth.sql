-- ============================================================================
-- MIGRATION 003: FIX AUTHENTIFICATION ET TRIGGER PROFILES
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. TRIGGER: Créer automatiquement un profil lors de l'inscription
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'demo', -- Par défaut, les nouveaux utilisateurs sont en mode demo
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. CORRIGER LES POLICIES PROFILES (utiliser id au lieu de user_id)
-- ============================================================================

-- Policy INSERT: Permettre la création de profil par le trigger
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  WITH CHECK (true);

COMMIT;

-- ============================================================================
-- MIGRATION TERMINÉE
-- ============================================================================
-- Résumé:
-- ✅ Trigger de création automatique de profil
-- ✅ Policy INSERT sur profiles
-- ============================================================================
