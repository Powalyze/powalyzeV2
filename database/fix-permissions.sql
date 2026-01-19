-- ============================================================
-- FIX COMPLET DES PERMISSIONS SUPABASE
-- ============================================================

-- 1. DÉSACTIVER RLS SUR TOUTES LES TABLES
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE cockpit_kpis DISABLE ROW LEVEL SECURITY;
ALTER TABLE governance_signals DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE executive_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE risks DISABLE ROW LEVEL SECURITY;
ALTER TABLE decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE integrations DISABLE ROW LEVEL SECURITY;

-- 2. DONNER TOUTES LES PERMISSIONS AU RÔLE ANON
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- 3. DONNER TOUTES LES PERMISSIONS AU RÔLE AUTHENTICATED
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- 4. DONNER TOUTES LES PERMISSIONS AU RÔLE SERVICE_ROLE
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- 5. VÉRIFICATION : Afficher le statut RLS
SELECT 
  tablename, 
  CASE WHEN rowsecurity THEN '❌ RLS ACTIVÉ' ELSE '✅ RLS DÉSACTIVÉ' END as status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('organizations', 'cockpit_kpis', 'projects', 'risks', 'decisions', 'integrations')
ORDER BY tablename;

-- 6. VÉRIFICATION : Tester une requête
SELECT COUNT(*) as total_organizations FROM organizations;
SELECT COUNT(*) as total_kpis FROM cockpit_kpis;
