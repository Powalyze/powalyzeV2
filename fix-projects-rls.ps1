# Script de diagnostic RLS pour projects
# Usage: .\fix-projects-rls.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTIC RLS PROJECTS" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SUPABASE_SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_SERVICE_KEY) {
    Write-Host "❌ Variables d'environnement manquantes!" -ForegroundColor Red
    Write-Host "Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Configuration trouvée" -ForegroundColor Green
Write-Host "  URL: $SUPABASE_URL" -ForegroundColor Gray
Write-Host ""

# Fonction pour exécuter du SQL
function Invoke-SupabaseSQL {
    param(
        [string]$Query,
        [string]$Description
    )
    
    Write-Host "🔍 $Description..." -ForegroundColor Yellow
    
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        query = $Query
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/execute_sql" -Method Post -Headers $headers -Body $body
        Write-Host "  ✓ Exécuté avec succès" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "  ⚠️ Erreur: $_" -ForegroundColor Red
        return $null
    }
}

# 1. Vérifier la structure de la table
Write-Host ""
Write-Host "ÉTAPE 1: Vérifier la structure de la table projects" -ForegroundColor Cyan
Write-Host "-----------------------------------------------" -ForegroundColor Gray

$structureQuery = @"
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
  AND column_name IN ('id', 'owner_id', 'organization_id', 'created_at')
ORDER BY ordinal_position;
"@

Invoke-SupabaseSQL -Query $structureQuery -Description "Structure de la table"

# 2. Vérifier les policies RLS
Write-Host ""
Write-Host "ÉTAPE 2: Vérifier les policies RLS actuelles" -ForegroundColor Cyan
Write-Host "-----------------------------------------------" -ForegroundColor Gray

$policiesQuery = @"
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'projects';
"@

Invoke-SupabaseSQL -Query $policiesQuery -Description "Policies RLS"

# 3. Compter les projets
Write-Host ""
Write-Host "ÉTAPE 3: Compter les projets dans la base" -ForegroundColor Cyan
Write-Host "-----------------------------------------------" -ForegroundColor Gray

$countQuery = @"
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN owner_id IS NOT NULL THEN 1 END) as with_owner,
  COUNT(CASE WHEN owner_id IS NULL THEN 1 END) as without_owner
FROM projects;
"@

Invoke-SupabaseSQL -Query $countQuery -Description "Statistiques des projets"

# 4. Script de correction
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SCRIPT DE CORRECTION SQL" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$fixSQL = @"
-- =====================================
-- FIX RLS POUR PROJECTS (owner_id)
-- =====================================

-- 1. S'assurer que la colonne owner_id existe
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS owner_id UUID;

-- 2. Désactiver temporairement RLS
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- 3. Supprimer toutes les policies existantes
DROP POLICY IF EXISTS "projects_select" ON projects;
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete" ON projects;
DROP POLICY IF EXISTS "projects_delete_own" ON projects;

-- 4. Réactiver RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 5. Créer les nouvelles policies (basées sur owner_id UNIQUEMENT)
CREATE POLICY "projects_select_own"
ON projects FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "projects_insert_own"
ON projects FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "projects_update_own"
ON projects FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "projects_delete_own"
ON projects FOR DELETE
USING (owner_id = auth.uid());

-- 6. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);

-- FIN DU SCRIPT
"@

Write-Host "Copiez et exécutez ce SQL dans Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
Write-Host $fixSQL -ForegroundColor White
Write-Host ""

# Sauvegarder dans un fichier
$fixSQL | Out-File -FilePath "fix-projects-rls.sql" -Encoding UTF8
Write-Host "✓ Script sauvegardé dans: fix-projects-rls.sql" -ForegroundColor Green
Write-Host ""

# 7. Vérification finale
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "PROCHAINES ÉTAPES" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ouvrez Supabase SQL Editor" -ForegroundColor White
Write-Host "2. Collez le contenu de fix-projects-rls.sql" -ForegroundColor White
Write-Host "3. Exécutez le script" -ForegroundColor White
Write-Host "4. Vérifiez que vos projets ont un owner_id:" -ForegroundColor White
Write-Host "   SELECT id, name, owner_id FROM projects;" -ForegroundColor Gray
Write-Host "5. Si owner_id est NULL, mettez-le à jour:" -ForegroundColor White
Write-Host "   UPDATE projects SET owner_id = auth.uid() WHERE owner_id IS NULL;" -ForegroundColor Gray
Write-Host "6. Testez l'accès: GET /api/projects" -ForegroundColor White
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✓ Diagnostic terminé!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
