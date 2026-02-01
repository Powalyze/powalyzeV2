-- ============================================
-- HOTFIX CRITIQUE: Récursion infinie dans memberships
-- Erreur: "infinite recursion detected in policy for relation memberships"
-- À exécuter IMMÉDIATEMENT dans Supabase SQL Editor
-- ============================================

-- 🔴 PROBLÈME:
-- Les policies sur memberships créent une récursion infinie
-- car toutes les autres tables (projects, risks, decisions, timeline_events, reports)
-- interrogent memberships dans leurs policies, mais memberships a des policies
-- qui créent une boucle de dépendance.

-- 🟢 SOLUTION:
-- Policies SIMPLES sur memberships qui utilisent UNIQUEMENT auth.uid()
-- SANS sous-requêtes, SANS joins, SANS référence à d'autres tables.

-- ============================================
-- ÉTAPE 1: Supprimer TOUTES les policies existantes sur memberships
-- ============================================

DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'memberships' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.memberships', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- ============================================
-- ÉTAPE 2: Créer des policies SIMPLES (pas de récursion)
-- ============================================

-- Policy SELECT: L'utilisateur peut voir ses propres memberships
CREATE POLICY memberships_select ON public.memberships
FOR SELECT 
USING (user_id = auth.uid());

-- Policy INSERT: L'utilisateur peut créer un membership pour lui-même
-- (En production, cette policy devrait être restreinte aux admins)
CREATE POLICY memberships_insert ON public.memberships
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Policy UPDATE: L'utilisateur peut mettre à jour ses propres memberships
CREATE POLICY memberships_update ON public.memberships
FOR UPDATE 
USING (user_id = auth.uid());

-- Policy DELETE: L'utilisateur peut supprimer ses propres memberships
-- (En production, seuls les owners devraient pouvoir faire ça)
CREATE POLICY memberships_delete ON public.memberships
FOR DELETE 
USING (user_id = auth.uid());

-- ============================================
-- ÉTAPE 3: Vérifier que RLS est activé
-- ============================================

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ÉTAPE 4: Vérification
-- ============================================

-- Compter les policies (doit être = 4)
SELECT 
  'memberships' as table_name,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'memberships' AND schemaname = 'public';

-- Afficher les policies créées
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'memberships' AND schemaname = 'public'
ORDER BY policyname;

-- ============================================
-- RÉSULTAT ATTENDU:
-- ============================================
-- policy_count = 4
-- 4 policies listées:
--   - memberships_select (SELECT)
--   - memberships_insert (INSERT)
--   - memberships_update (UPDATE)
--   - memberships_delete (DELETE)
--
-- ✅ Après exécution, rafraîchir le cockpit (Ctrl+Shift+R)
-- ✅ L'erreur "infinite recursion" devrait disparaître
-- ✅ Toutes les requêtes (projects, risks, decisions, timeline, reports) devraient fonctionner
