-- ============================================
-- PHASE 2 : ACTIVER RLS (Row Level Security)
-- À exécuter APRÈS la phase 1
-- ============================================

-- ACTIVER RLS SUR TOUTES LES TABLES
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('organizations', 'memberships', 'projects', 'risks', 'decisions', 'timeline_events', 'reports')
ORDER BY tablename;

-- RÉSULTAT ATTENDU: rowsecurity = true pour toutes les tables
