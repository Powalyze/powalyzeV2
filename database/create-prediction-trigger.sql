-- Trigger automatique pour déclencher l'analyse ProjectPredictor
-- Quand un projet est créé ou modifié, un webhook appelle l'API de prédiction

-- Note: Ce trigger nécessite l'extension pg_net pour faire des appels HTTP
-- Si pg_net n'est pas disponible, utiliser une Edge Function à la place

-- Option 1: Trigger avec pg_net (si extension disponible)
-- CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION trigger_project_prediction()
RETURNS TRIGGER AS $$
DECLARE
  project_data jsonb;
  base_url text;
BEGIN
  -- Construire le payload JSON pour l'API
  project_data := jsonb_build_object(
    'project_id', NEW.id,
    'name', NEW.name,
    'owner_role', COALESCE(NEW.owner_role, 'Unknown'),
    'budget', NEW.budget,
    'deadline', NEW.deadline,
    'status', NEW.status,
    'complexity', COALESCE(NEW.complexity, 'medium'),
    'team_size', NEW.team_size,
    'dependencies', COALESCE(NEW.dependencies, '[]'::jsonb),
    'context', COALESCE(NEW.description, ''),
    'objectives', COALESCE(NEW.objectives, '[]'::jsonb)
  );

  -- URL de production Powalyze
  base_url := 'https://www.powalyze.com/api/ai/project-prediction';

  -- Envoyer la requête HTTP async (ne pas bloquer l'insert/update)
  -- Note: Requiert l'extension pg_net
  -- PERFORM net.http_post(
  --   url := base_url,
  --   body := project_data
  -- );

  -- Pour l'instant, on log juste l'événement
  RAISE NOTICE 'Project % should be analyzed by ProjectPredictor', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger sur INSERT et UPDATE
DROP TRIGGER IF EXISTS trigger_project_prediction_on_change ON projects;

CREATE TRIGGER trigger_project_prediction_on_change
  AFTER INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_project_prediction();

COMMENT ON FUNCTION trigger_project_prediction() IS 'Déclenche automatiquement l''analyse ProjectPredictor quand un projet est créé ou modifié';

-- ============================================================
-- ALTERNATIVE: Edge Function (recommandée pour Supabase)
-- ============================================================

-- Si pg_net n'est pas disponible, créer une Edge Function:
--
-- 1. Créer supabase/functions/project-predictor-webhook/index.ts:
--
-- import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
-- 
-- serve(async (req) => {
--   const { record } = await req.json()
--   
--   const projectInput = {
--     project_id: record.id,
--     name: record.name,
--     owner_role: record.owner_role || "Unknown",
--     budget: record.budget,
--     deadline: record.deadline,
--     status: record.status,
--     complexity: record.complexity || "medium",
--     team_size: record.team_size,
--     dependencies: record.dependencies || [],
--     context: record.description || "",
--     objectives: record.objectives || []
--   }
--   
--   const response = await fetch("https://www.powalyze.com/api/ai/project-prediction", {
--     method: "POST",
--     headers: { "Content-Type": "application/json" },
--     body: JSON.stringify(projectInput)
--   })
--   
--   return new Response(JSON.stringify({ success: response.ok }), {
--     headers: { "Content-Type": "application/json" }
--   })
-- })
--
-- 2. Déployer: supabase functions deploy project-predictor-webhook
--
-- 3. Créer le webhook dans Supabase Dashboard:
--    Database > Webhooks > Create a new hook
--    Table: projects
--    Events: INSERT, UPDATE
--    HTTP Request: POST https://your-project.supabase.co/functions/v1/project-predictor-webhook

-- ============================================================
-- MÉTHODE SIMPLE: Trigger frontend (recommandée pour MVP)
-- ============================================================

-- Avantage: Pas besoin d'extension, pas de config serveur
-- Inconvénient: Nécessite action utilisateur
--
-- Implémentation dans CockpitRoot.tsx:
--
-- const handleCreateProject = async (projectData) => {
--   const newProject = await createProject(projectData);
--   await analyzeProject(newProject); // Déclenché automatiquement après création
-- };

-- ============================================================
-- INSTRUCTIONS D'ACTIVATION
-- ============================================================

-- 1. Activer pg_net (si disponible):
--    - Dashboard Supabase > Database > Extensions
--    - Rechercher "pg_net" et activer
--    - Décommenter les lignes PERFORM net.http_post ci-dessus
--
-- 2. OU Créer Edge Function (recommandé):
--    - Voir instructions ci-dessus
--    - Créer webhook dans Dashboard
--
-- 3. OU Utiliser trigger frontend (MVP):
--    - Déjà implémenté dans CockpitRoot.tsx
--    - Appeler analyzeProject() après createProject()
