# Script PowerShell pour exécuter la migration SQL via Supabase
# Usage: .\execute-migration.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 MIGRATION : Architecture cockpit centrée projet" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier les variables d'environnement
if (-not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "❌ ERREUR : Variable SUPABASE_SERVICE_ROLE_KEY non définie" -ForegroundColor Red
    Write-Host ""
    Write-Host "Définissez-la avec :" -ForegroundColor Yellow
    Write-Host '$env:SUPABASE_SERVICE_ROLE_KEY = "votre-service-role-key"' -ForegroundColor Yellow
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR : Variable NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    Write-Host ""
    Write-Host "Définissez-la avec :" -ForegroundColor Yellow
    Write-Host '$env:NEXT_PUBLIC_SUPABASE_URL = "https://xxx.supabase.co"' -ForegroundColor Yellow
    exit 1
}

# Lire le fichier SQL
$sqlFile = Join-Path $PSScriptRoot "migration-project-id-mandatory.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ ERREUR : Fichier $sqlFile introuvable" -ForegroundColor Red
    exit 1
}

Write-Host "📖 Lecture du fichier SQL..." -ForegroundColor Yellow
$sqlContent = Get-Content $sqlFile -Raw

# Construire l'URL de l'API
$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$apiUrl = "$supabaseUrl/rest/v1/rpc/exec_sql"

# Headers
$headers = @{
    "apikey" = $env:SUPABASE_SERVICE_ROLE_KEY
    "Authorization" = "Bearer $env:SUPABASE_SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
}

# Body
$body = @{
    query = $sqlContent
} | ConvertTo-Json

Write-Host "🔄 Exécution de la migration..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body
    
    Write-Host "✅ MIGRATION RÉUSSIE !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Résultats :" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    
} catch {
    Write-Host "❌ ERREUR lors de l'exécution :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Détails :" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "💡 SOLUTION ALTERNATIVE :" -ForegroundColor Cyan
    Write-Host "1. Ouvrez Supabase Dashboard" -ForegroundColor White
    Write-Host "2. Allez dans SQL Editor" -ForegroundColor White
    Write-Host "3. Copiez-collez le contenu de:" -ForegroundColor White
    Write-Host "   $sqlFile" -ForegroundColor Yellow
    Write-Host "4. Cliquez sur 'Run'" -ForegroundColor White
    
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ Migration terminée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Vérifier les projets créés dans Supabase" -ForegroundColor White
Write-Host "2. Tester la création de risques/décisions (project_id requis)" -ForegroundColor White
Write-Host "3. Mettre à jour les composants UI pour ajouter le sélecteur de projet" -ForegroundColor White
