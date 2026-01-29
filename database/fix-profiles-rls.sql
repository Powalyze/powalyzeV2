-- ============================================
-- FIX: Désactiver RLS sur profiles pour permettre signup
-- À exécuter dans: Supabase Dashboard → SQL Editor
-- ============================================

-- Désactiver RLS temporairement
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- OU alternative: Recréer les policies correctement
-- DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;

-- Policy SELECT: Utilisateurs voient leur profil
-- CREATE POLICY "Users can view own profile" 
--   ON public.profiles FOR SELECT 
--   USING (auth.uid() = id);

-- Policy UPDATE: Utilisateurs modifient leur profil  
-- CREATE POLICY "Users can update own profile" 
--   ON public.profiles FOR UPDATE 
--   USING (auth.uid() = id);

-- Policy INSERT: Service role OU utilisateur authentifié peut insérer
-- CREATE POLICY "Enable insert during signup" 
--   ON public.profiles FOR INSERT 
--   WITH CHECK (
--     auth.uid() = id OR 
--     auth.jwt()->>'role' = 'service_role'
--   );

-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
