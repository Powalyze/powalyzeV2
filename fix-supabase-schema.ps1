# ============================================
# FIX SUPABASE SCHEMA - Ajouter organization_id et tables manquantes
# ============================================

Write-Host "🔧 FIX SUPABASE SCHEMA" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Charger les variables d'environnement
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ Fichier .env.local introuvable!" -ForegroundColor Red
    exit 1
}

# Parser .env.local
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

$SUPABASE_URL = $envVars["NEXT_PUBLIC_SUPABASE_URL"]
$SUPABASE_SERVICE_KEY = $envVars["SUPABASE_SERVICE_ROLE_KEY"]

if (-not $SUPABASE_URL -or -not $SUPABASE_SERVICE_KEY) {
    Write-Host "❌ Variables d'environnement manquantes!" -ForegroundColor Red
    Write-Host "   NEXT_PUBLIC_SUPABASE_URL: $($SUPABASE_URL -ne $null)" -ForegroundColor Yellow
    Write-Host "   SUPABASE_SERVICE_ROLE_KEY: $($SUPABASE_SERVICE_KEY -ne $null)" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔧 Configuration Supabase" -ForegroundColor Green
Write-Host "   URL: $SUPABASE_URL" -ForegroundColor Gray
Write-Host ""

# Lire le fichier SQL
$sqlFile = "database\schema-complete-rls-fix.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier $sqlFile introuvable!" -ForegroundColor Red
    exit 1
}

$sql = Get-Content $sqlFile -Raw

# Headers pour l'API Supabase
$headers = @{
    "apikey" = $SUPABASE_SERVICE_KEY
    "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
    "Content-Type" = "text/plain"
    "Prefer" = "return=minimal"
}

Write-Host "📦 Exécution du schéma SQL complet..." -ForegroundColor Yellow
Write-Host ""

try {
    # Exécuter le SQL via l'API REST de Supabase
    # Note: L'API REST ne supporte pas l'exécution SQL directe
    # On doit utiliser l'API PostgREST avec des requêtes RPC
    
    Write-Host "⚠️  IMPORTANT: L'API Supabase REST ne permet pas d'exécuter du SQL arbitraire." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 INSTRUCTIONS MANUELLES:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣  Allez sur: $SUPABASE_URL/project/_/sql" -ForegroundColor White
    Write-Host ""
    Write-Host "2️⃣  Copiez le contenu du fichier:" -ForegroundColor White
    Write-Host "    database\schema-complete-rls-fix.sql" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3️⃣  Collez-le dans l'éditeur SQL de Supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "4️⃣  Cliquez sur 'RUN' pour exécuter" -ForegroundColor White
    Write-Host ""
    Write-Host "⏱️  Durée estimée: 30-60 secondes" -ForegroundColor Gray
    Write-Host ""
    
    # Ouvrir le fichier SQL pour faciliter la copie
    Write-Host "📂 Ouverture du fichier SQL..." -ForegroundColor Green
    notepad.exe $sqlFile
    
    Write-Host ""
    Write-Host "✅ APRÈS EXÉCUTION DU SCHEMA:" -ForegroundColor Green
    Write-Host ""
    Write-Host "   1. Rafraîchissez la page https://www.powalyze.com/cockpit" -ForegroundColor White
    Write-Host "   2. Les erreurs 'column does not exist' devraient disparaître" -ForegroundColor White
    Write-Host "   3. Vous pourrez créer des projets normalement" -ForegroundColor White
    Write-Host ""
    
    # Créer un fichier de résumé
    $summaryFile = "schema-fix-instructions.txt"
    $summary = @"
SUPABASE SCHEMA FIX - Instructions
===================================

URL SUPABASE SQL EDITOR:
$SUPABASE_URL/project/_/sql

FICHIER A COPIER:
database\schema-complete-rls-fix.sql

ETAPES:
1. Ouvrir l'URL ci-dessus dans votre navigateur
2. Copier le contenu du fichier schema-complete-rls-fix.sql
3. Coller dans l'éditeur SQL
4. Cliquer sur RUN
5. Attendre 30-60 secondes
6. Rafraîchir https://www.powalyze.com/cockpit

CE QUE LE SCHEMA VA FAIRE:
- Ajouter la colonne organization_id à projects, risks, decisions
- Créer la table timeline_events (si elle n'existe pas)
- Créer la table reports (si elle n'existe pas)
- Activer RLS (Row Level Security) pour multi-tenant
- Créer 40+ policies de sécurité
- Ajouter des indexes pour les performances

Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@
    
    $summary | Out-File -FilePath $summaryFile -Encoding UTF8
    
    Write-Host "💾 Instructions sauvegardées dans: $summaryFile" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 PROCHAINE ÉTAPE:" -ForegroundColor Cyan
Write-Host "   Exécutez le schema dans Supabase SQL Editor" -ForegroundColor White
Write-Host "   puis testez /cockpit" -ForegroundColor White
Write-Host ""
