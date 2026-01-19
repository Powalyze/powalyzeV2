-- ============================================================
-- DÉSACTIVER RLS SUR TOUTES LES TABLES
-- ============================================================

ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_narratives DISABLE ROW LEVEL SECURITY;
ALTER TABLE committee_session_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE committee_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE executive_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE kpis DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;

-- Donner accès complet à service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Donner accès complet à anon
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Vérification
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '❌ RLS ACTIVÉ' ELSE '✅ RLS DÉSACTIVÉ' END as status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN (
    'activity_log', 'ai_narratives', 'committee_session_projects', 
    'committee_sessions', 'executive_decisions', 'kpi_history', 
    'kpis', 'portfolio_projects', 'profiles', 'project_comments',
    'project_decisions', 'project_milestones', 'project_risks', 
    'user_preferences', 'organizations', 'cockpit_kpis', 'projects'
  )
ORDER BY tablename;
