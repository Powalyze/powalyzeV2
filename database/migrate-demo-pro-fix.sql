-- ====================================================================
-- MIGRATION: CORRECTION INVERSION DEMO/PRO
-- ====================================================================
-- Objectif: Déplacer les 12 projets actuels de 'projects' vers 'demo_projects'
--           et vider la table 'projects' pour le mode PRO
-- ====================================================================

BEGIN;

-- 1. SAUVEGARDE: Copier tous les projets actuels vers demo_projects
INSERT INTO demo_projects (
  id, user_id, project_id, name, description, status, priority,
  budget, spent, rag_status, progress, start_date, end_date,
  organization_id, created_at, updated_at
)
SELECT 
  id, user_id, project_id, name, description, status, priority,
  budget, spent, rag_status, progress, start_date, end_date,
  organization_id, created_at, updated_at
FROM projects
ON CONFLICT (id) DO NOTHING;

-- 2. MIGRER les risques associés vers demo_risks
INSERT INTO demo_risks (
  id, user_id, project_id, title, description, impact, probability,
  mitigation, status, organization_id, created_at, updated_at
)
SELECT 
  id, user_id, project_id, title, description, impact, probability,
  mitigation, status, organization_id, created_at, updated_at
FROM risks
ON CONFLICT (id) DO NOTHING;

-- 3. MIGRER les décisions vers demo_decisions
INSERT INTO demo_decisions (
  id, user_id, project_id, title, description, decision_maker,
  status, organization_id, created_at, updated_at
)
SELECT 
  id, user_id, project_id, title, description, decision_maker,
  status, organization_id, created_at, updated_at
FROM decisions
ON CONFLICT (id) DO NOTHING;

-- 4. MIGRER les anomalies vers demo_anomalies
INSERT INTO demo_anomalies (
  id, user_id, project_id, title, description, severity,
  status, organization_id, created_at, updated_at
)
SELECT 
  id, user_id, project_id, title, description, severity,
  status, organization_id, created_at, updated_at
FROM anomalies
ON CONFLICT (id) DO NOTHING;

-- 5. MIGRER les rapports vers demo_reports
INSERT INTO demo_reports (
  id, user_id, project_id, title, type, content,
  organization_id, created_at, updated_at
)
SELECT 
  id, user_id, project_id, title, type, content,
  organization_id, created_at, updated_at
FROM reports
ON CONFLICT (id) DO NOTHING;

-- 6. MIGRER les connecteurs vers demo_connectors
INSERT INTO demo_connectors (
  id, user_id, name, type, api_url, api_key, status,
  organization_id, created_at, updated_at
)
SELECT 
  id, user_id, name, type, api_url, api_key, status,
  organization_id, created_at, updated_at
FROM connectors
ON CONFLICT (id) DO NOTHING;

-- 7. VIDER les tables PRO (tables réelles)
DELETE FROM reports;
DELETE FROM connectors;
DELETE FROM anomalies;
DELETE FROM decisions;
DELETE FROM risks;
DELETE FROM projects;

-- 8. VÉRIFICATION
SELECT 'demo_projects count:' as table_name, COUNT(*) as count FROM demo_projects
UNION ALL
SELECT 'projects count:', COUNT(*) FROM projects
UNION ALL
SELECT 'demo_risks count:', COUNT(*) FROM demo_risks
UNION ALL
SELECT 'risks count:', COUNT(*) FROM risks
UNION ALL
SELECT 'demo_decisions count:', COUNT(*) FROM demo_decisions
UNION ALL
SELECT 'decisions count:', COUNT(*) FROM decisions
UNION ALL
SELECT 'demo_anomalies count:', COUNT(*) FROM demo_anomalies
UNION ALL
SELECT 'anomalies count:', COUNT(*) FROM anomalies
UNION ALL
SELECT 'demo_reports count:', COUNT(*) FROM demo_reports
UNION ALL
SELECT 'reports count:', COUNT(*) FROM reports
UNION ALL
SELECT 'demo_connectors count:', COUNT(*) FROM demo_connectors
UNION ALL
SELECT 'connectors count:', COUNT(*) FROM connectors;

COMMIT;

-- ====================================================================
-- RÉSULTAT ATTENDU:
-- - demo_projects contient les 12 projets + toutes les données associées
-- - projects est vide (0 projet)
-- - Toutes les tables demo_* contiennent les données
-- - Toutes les tables réelles sont vides
-- ====================================================================
