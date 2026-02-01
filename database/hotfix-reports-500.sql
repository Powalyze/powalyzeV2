-- ============================================
-- HOTFIX: Correction 500 sur /reports
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- 1️⃣ Ajouter la colonne organization_id si elle n'existe pas
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 2️⃣ Activer RLS
ALTER TABLE public.reports 
ENABLE ROW LEVEL SECURITY;

-- 3️⃣ Supprimer toutes les anciennes policies (au cas où)
DROP POLICY IF EXISTS reports_select ON public.reports;
DROP POLICY IF EXISTS reports_insert ON public.reports;
DROP POLICY IF EXISTS reports_update ON public.reports;
DROP POLICY IF EXISTS reports_delete ON public.reports;

-- 4️⃣ Créer les policies correctes
CREATE POLICY reports_select ON public.reports
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.memberships 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY reports_insert ON public.reports
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.memberships 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY reports_update ON public.reports
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.memberships 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY reports_delete ON public.reports
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.memberships 
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);

-- 5️⃣ Vérification
SELECT 
  'reports' as table_name,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'reports';

-- Vérifier la structure de la table
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'reports' 
  AND column_name = 'organization_id';

-- RÉSULTAT ATTENDU:
-- policy_count = 4
-- column_name = 'organization_id', data_type = 'uuid'
