-- ============================================================
-- NETTOYER TOUTES LES DONNÉES
-- Exécuter ce script pour vider complètement la base
-- ============================================================

-- Supprimer TOUTES les données
DELETE FROM governance_signals;
DELETE FROM scenarios;
DELETE FROM executive_stories;
DELETE FROM ai_narratives;
DELETE FROM cockpit_kpis;
DELETE FROM risks;
DELETE FROM decisions;
DELETE FROM integrations;
DELETE FROM projects;
DELETE FROM organization_memberships;
DELETE FROM users;
DELETE FROM activity_log;
DELETE FROM committee_session_projects;
DELETE FROM committee_sessions;
DELETE FROM executive_decisions;
DELETE FROM kpi_history;
DELETE FROM kpis;
DELETE FROM portfolio_projects;
DELETE FROM profiles;
DELETE FROM project_comments;
DELETE FROM project_decisions;
DELETE FROM project_milestones;
DELETE FROM project_risks;
DELETE FROM user_preferences;

-- Vérification finale
SELECT 'TOUS LES TABLEAUX DOIVENT ÊTRE À 0' as message;

SELECT 
  'cockpit_kpis' as table_name, COUNT(*) as count FROM cockpit_kpis
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'risks', COUNT(*) FROM risks
UNION ALL SELECT 'decisions', COUNT(*) FROM decisions
UNION ALL SELECT 'kpis', COUNT(*) FROM kpis
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'organization_memberships', COUNT(*) FROM organization_memberships;
