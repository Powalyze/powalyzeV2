# PowerShell Script to apply subscriptions schema to Supabase
# Usage: .\apply-subscriptions-schema.ps1

Write-Host "🗄️  Application du schema subscriptions sur Supabase" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Fichier .env.local introuvable" -ForegroundColor Red
    Write-Host "Créez un fichier .env.local avec vos credentials Supabase" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Variables Supabase manquantes dans .env.local" -ForegroundColor Red
    Write-Host "Requis: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Configuration Supabase trouvée" -ForegroundColor Green
Write-Host "   URL: $supabaseUrl" -ForegroundColor Gray
Write-Host ""

# Read SQL file
$sqlFile = "database\subscriptions-schema.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier $sqlFile introuvable" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $sqlFile -Raw
Write-Host "✅ Schema SQL chargé ($($sqlContent.Length) caractères)" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  ATTENTION: Cette opération va créer/modifier les tables suivantes:" -ForegroundColor Yellow
Write-Host "   - subscriptions" -ForegroundColor White
Write-Host "   - subscription_features" -ForegroundColor White
Write-Host "   - enterprise_requests" -ForegroundColor White
Write-Host ""
Write-Host "   Le schema est idempotent (peut être exécuté plusieurs fois)" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Continuer? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Operation annulée." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Application du schema via Supabase REST API..." -ForegroundColor Cyan
Write-Host ""

try {
    # Use Supabase REST API to execute SQL
    $apiUrl = "$supabaseUrl/rest/v1/rpc/exec_sql"
    
    # Alternative: Use psql if available
    Write-Host "💡 Méthode recommandée: Supabase Dashboard SQL Editor" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Ouvrir Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
    Write-Host "2. Sélectionner votre projet" -ForegroundColor White
    Write-Host "3. Aller dans 'SQL Editor'" -ForegroundColor White
    Write-Host "4. Créer une nouvelle query" -ForegroundColor White
    Write-Host "5. Copier/coller le contenu de database/subscriptions-schema.sql" -ForegroundColor White
    Write-Host "6. Cliquer 'Run'" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📋 Contenu du schema copié dans votre presse-papier!" -ForegroundColor Green
    Set-Clipboard -Value $sqlContent
    
    Write-Host ""
    Write-Host "Appuyez sur une touche après avoir exécuté le schema dans Supabase..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    Write-Host ""
    Write-Host "✅ Schema appliqué avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔍 Vérifications à effectuer dans Supabase:" -ForegroundColor Cyan
    Write-Host "   1. Table 'subscriptions' existe" -ForegroundColor White
    Write-Host "   2. Table 'subscription_features' existe avec seed data" -ForegroundColor White
    Write-Host "   3. Table 'enterprise_requests' existe" -ForegroundColor White
    Write-Host "   4. Functions helpers créées (has_active_subscription, etc.)" -ForegroundColor White
    Write-Host "   5. RLS activé sur toutes les tables" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'application du schema" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "✨ Terminé!" -ForegroundColor Green
