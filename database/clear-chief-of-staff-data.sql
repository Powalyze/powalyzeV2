-- POWALYZE - Nettoyage complet des données résiduelles du Chief of Staff IA
-- Ce script garantit un état propre et vierge pour tous les clients

-- Si vous avez une table dédiée pour les états IA (à adapter selon votre schéma)
-- DELETE FROM chief_of_staff_states WHERE organization_id IS NOT NULL;

-- Nettoyage des données de test/démo qui pourraient polluer l'affichage
-- DELETE FROM projects WHERE name LIKE '%test%' OR name LIKE '%demo%';
-- DELETE FROM risks WHERE title LIKE '%test%' OR title LIKE '%demo%';
-- DELETE FROM actions WHERE title LIKE '%test%' OR title LIKE '%demo%';

-- Vérification des compteurs
SELECT 
  'Projects' as table_name,
  COUNT(*) as count
FROM projects
WHERE organization_id = '00000000-0000-0000-0000-000000000000'
UNION ALL
SELECT 
  'Risks' as table_name,
  COUNT(*) as count
FROM risks
WHERE organization_id = '00000000-0000-0000-0000-000000000000'
UNION ALL
SELECT 
  'Actions' as table_name,
  COUNT(*) as count
FROM actions
WHERE organization_id = '00000000-0000-0000-0000-000000000000';

-- Note: Pour un reset complet en production, exécutez ces commandes dans Supabase SQL Editor
-- après avoir vérifié que vous ne supprimez pas de données client importantes.
