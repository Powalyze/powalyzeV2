-- Script pour vérifier les tables existantes dans Supabase
-- Exécutez ceci d'abord pour voir ce qui existe

SELECT 
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;

-- Vérifier si la table users existe
SELECT EXISTS (
  SELECT FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename = 'users'
) as users_table_exists;

-- Vérifier si auth.users existe
SELECT EXISTS (
  SELECT FROM pg_tables 
  WHERE schemaname = 'auth' 
  AND tablename = 'users'
) as auth_users_exists;
