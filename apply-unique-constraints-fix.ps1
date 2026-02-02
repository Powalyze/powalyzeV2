# ============================================
# Script d'application du fix UNIQUE constraints
# ============================================
# Usage: .\apply-unique-constraints-fix.ps1
# ============================================

Write-Host "🔧 FIX: Application des contraintes UNIQUE manquantes" -ForegroundColor Cyan
Write-Host ""

# Vérifier que les variables d'environnement existent
$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ ERREUR: Variables d'environnement manquantes" -ForegroundColor Red
    Write-Host ""
    Write-Host "Assurez-vous que .env.local contient:" -ForegroundColor Yellow
    Write-Host "  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co"
    Write-Host "  SUPABASE_SERVICE_ROLE_KEY=xxx"
    Write-Host ""
    exit 1
}

# Extraire le project ref de l'URL Supabase
$projectRef = ($supabaseUrl -replace 'https://', '' -replace '.supabase.co', '')

Write-Host "📊 Configuration:" -ForegroundColor Yellow
Write-Host "  Project: $projectRef"
Write-Host "  URL: $supabaseUrl"
Write-Host ""

# Lire le fichier SQL
$sqlFile = "database/schema-fix-unique-constraints.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ ERREUR: Fichier $sqlFile introuvable" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $sqlFile -Raw

Write-Host "📄 Fichier SQL chargé: $sqlFile" -ForegroundColor Green
Write-Host ""

# Construire l'URL de l'API Supabase
$apiUrl = "$supabaseUrl/rest/v1/rpc/exec_sql"

# Note: Supabase ne permet pas d'exécuter du SQL arbitraire via l'API REST
# Il faut utiliser soit:
# 1. Le dashboard Supabase (SQL Editor)
# 2. Un client PostgreSQL (psql)

Write-Host "⚠️  INFORMATION IMPORTANTE" -ForegroundColor Yellow
Write-Host ""
Write-Host "L'API REST Supabase ne permet pas d'exécuter du SQL arbitraire." -ForegroundColor Yellow
Write-Host "Vous devez appliquer le schéma manuellement via:" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPTION 1 (Recommandée) - Dashboard Supabase:" -ForegroundColor Cyan
Write-Host "  1. Ouvrir https://supabase.com/dashboard/project/$projectRef/sql/new"
Write-Host "  2. Copier le contenu de $sqlFile"
Write-Host "  3. Cliquer 'Run'"
Write-Host ""
Write-Host "OPTION 2 - Client psql:" -ForegroundColor Cyan
Write-Host "  psql `"postgresql://postgres:[YOUR-PASSWORD]@db.$projectRef.supabase.co:5432/postgres`" -f $sqlFile"
Write-Host ""

# Ouvrir automatiquement le dashboard Supabase
$dashboardUrl = "https://supabase.com/dashboard/project/$projectRef/sql/new"
Write-Host "🌐 Ouverture du SQL Editor dans votre navigateur..." -ForegroundColor Green
Write-Host ""
Start-Process $dashboardUrl

# Afficher le SQL dans la console pour copier/coller facile
Write-Host "📋 Contenu SQL à copier/coller:" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor DarkGray
Write-Host $sqlContent -ForegroundColor White
Write-Host "======================================" -ForegroundColor DarkGray
Write-Host ""

Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "  1. Coller le SQL dans l'éditeur ouvert"
Write-Host "  2. Cliquer 'Run'"
Write-Host "  3. Vérifier que la table project_predictions est créée"
Write-Host "  4. Tester la création d'un projet dans l'application"
Write-Host ""
