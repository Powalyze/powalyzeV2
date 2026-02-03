-- ============================================
-- VÉRIFICATION DU SCHÉMA
-- ============================================
-- Exécutez ces requêtes pour vérifier l'état du schéma

-- 1. Lister toutes les tables créées
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. Vérifier les RLS (Row Level Security)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 3. Compter les lignes dans chaque table
SELECT 
  'organizations' as table_name, 
  COUNT(*) as count 
FROM organizations
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'risks', COUNT(*) FROM risks
UNION ALL
SELECT 'decisions', COUNT(*) FROM decisions
UNION ALL
SELECT 'resources', COUNT(*) FROM resources;
