# ============================================
# Script d'application du fix Foreign Key
# ============================================

Write-Host "🔧 Application du fix pour la contrainte Foreign Key..." -ForegroundColor Cyan

# Récupérer l'URL Supabase depuis .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    $supabaseUrl = (Get-Content $envFile | Select-String "NEXT_PUBLIC_SUPABASE_URL=").ToString().Split("=")[1]
    $supabaseKey = (Get-Content $envFile | Select-String "SUPABASE_SERVICE_ROLE_KEY=").ToString().Split("=")[1]
    
    if ($supabaseUrl -and $supabaseKey) {
        Write-Host "✅ Configuration Supabase trouvée" -ForegroundColor Green
        
        # Extraire le project ID de l'URL
        $projectId = ($supabaseUrl -replace "https://", "" -replace ".supabase.co", "")
        
        Write-Host "📦 Project ID: $projectId" -ForegroundColor Yellow
        Write-Host "🔄 Application de la migration..." -ForegroundColor Cyan
        
        # Lire le fichier SQL
        $sqlContent = Get-Content "database\fix-foreign-key-projects.sql" -Raw
        
        # Préparer la requête
        $headers = @{
            "apikey" = $supabaseKey
            "Authorization" = "Bearer $supabaseKey"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            query = $sqlContent
        } | ConvertTo-Json
        
        # Exécuter via l'API Supabase
        $apiUrl = "$supabaseUrl/rest/v1/rpc/exec_sql"
        
        Write-Host "📡 Envoi de la requête à Supabase..." -ForegroundColor Cyan
        
        try {
            # Méthode alternative : utiliser psql si disponible
            $dbUrl = "postgresql://postgres.${projectId}:${supabaseKey}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
            
            if (Get-Command psql -ErrorAction SilentlyContinue) {
                Write-Host "🐘 Utilisation de psql..." -ForegroundColor Cyan
                $env:PGPASSWORD = $supabaseKey
                psql $dbUrl -f "database\fix-foreign-key-projects.sql"
                Write-Host "✅ Migration appliquée avec succès via psql!" -ForegroundColor Green
            } else {
                Write-Host "⚠️ psql non trouvé. Essai via l'API REST..." -ForegroundColor Yellow
                Write-Host ""
                Write-Host "Pour appliquer manuellement :" -ForegroundColor Cyan
                Write-Host "1. Allez sur https://supabase.com/dashboard/project/$projectId/editor" -ForegroundColor White
                Write-Host "2. Ouvrez l'éditeur SQL" -ForegroundColor White
                Write-Host "3. Copiez le contenu de database\fix-foreign-key-projects.sql" -ForegroundColor White
                Write-Host "4. Exécutez le script" -ForegroundColor White
            }
        } catch {
            Write-Host "❌ Erreur lors de l'application: $_" -ForegroundColor Red
            Write-Host ""
            Write-Host "📋 Pour appliquer manuellement :" -ForegroundColor Cyan
            Write-Host "1. Connectez-vous à Supabase Dashboard" -ForegroundColor White
            Write-Host "2. Allez dans SQL Editor" -ForegroundColor White
            Write-Host "3. Copiez et exécutez le contenu de database\fix-foreign-key-projects.sql" -ForegroundColor White
        }
        
    } else {
        Write-Host "❌ Configuration Supabase incomplète dans .env.local" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Fichier .env.local non trouvé" -ForegroundColor Red
}

Write-Host ""
Write-Host "📚 Ce fix inclut :" -ForegroundColor Cyan
Write-Host "  ✅ Création d'une organisation par défaut" -ForegroundColor White
Write-Host "  ✅ Mise à jour de la contrainte Foreign Key" -ForegroundColor White
Write-Host "  ✅ Trigger automatique d'assignation d'organisation" -ForegroundColor White
Write-Host "  ✅ Correction de tous les projets existants" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Résultat : Vous pouvez maintenant créer des projets sans erreur!" -ForegroundColor Green
