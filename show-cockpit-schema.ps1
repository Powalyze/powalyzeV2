# Script PowerShell pour appliquer le schéma SQL Cockpit Executive
# Charge automatiquement .env.local et exécute le SQL

# Charger les variables depuis .env.local
if (Test-Path ".env.local") {
    Write-Host "📂 Chargement de .env.local..." -ForegroundColor Cyan
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  ✓ $key chargé" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ Fichier .env.local introuvable" -ForegroundColor Red
    Write-Host "Créez un fichier .env.local avec NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow
    exit 1
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SUPABASE_SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_SERVICE_KEY) {
    Write-Host ""
    Write-Host "❌ Variables manquantes dans .env.local:" -ForegroundColor Red
    if (-not $SUPABASE_URL) { Write-Host "  - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Yellow }
    if (-not $SUPABASE_SERVICE_KEY) { Write-Host "  - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow }
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Application du schéma Cockpit Executive" -ForegroundColor White
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Lire le fichier SQL
if (-not (Test-Path "database/schema-cockpit-executive.sql")) {
    Write-Host "❌ Fichier database/schema-cockpit-executive.sql introuvable" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content -Path "database/schema-cockpit-executive.sql" -Raw

Write-Host "📄 Fichier SQL chargé ($($sqlContent.Length) caractères)" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Méthode recommandée: Supabase SQL Editor" -ForegroundColor Yellow
Write-Host "   1. Allez sur https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "   2. Sélectionnez votre projet" -ForegroundColor Gray
Write-Host "   3. SQL Editor → New Query" -ForegroundColor Gray
Write-Host "   4. Collez le contenu ci-dessous et exécutez" -ForegroundColor Gray
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "DÉBUT DU SCHÉMA SQL" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host $sqlContent -ForegroundColor White
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "FIN DU SCHÉMA SQL" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Schéma prêt à être copié dans Supabase Dashboard" -ForegroundColor Green
Write-Host ""

# Option : Sauvegarder dans le presse-papier (si disponible)
try {
    Set-Clipboard -Value $sqlContent
    Write-Host "📋 Schéma copié dans le presse-papier !" -ForegroundColor Green
    Write-Host "   Vous pouvez le coller directement dans Supabase SQL Editor" -ForegroundColor Gray
} catch {
    Write-Host "ℹ️  Copiez manuellement le schéma ci-dessus" -ForegroundColor Cyan
}
