# Script d'application de la migration integrations
# Date: 2026-02-13

Write-Host "🔄 Application de la migration integrations..." -ForegroundColor Cyan

# Charger les variables d'environnement
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^(.+?)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($name -eq 'DATABASE_URL') {
                $env:DATABASE_URL = $value
            }
        }
    }
}

if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL non trouvé dans .env.local" -ForegroundColor Red
    Write-Host "📝 Veuillez configurer DATABASE_URL ou appliquer manuellement via Supabase Dashboard" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Via Supabase Dashboard" -ForegroundColor Cyan
    Write-Host "  1. Allez sur https://supabase.com/dashboard" -ForegroundColor Gray
    Write-Host "  2. Ouvrez SQL Editor" -ForegroundColor Gray
    Write-Host "  3. Collez le contenu de database/migrations/add-integrations-table.sql" -ForegroundColor Gray
    Write-Host "  4. Cliquez Run" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Via psql" -ForegroundColor Cyan
    Write-Host '  psql $DATABASE_URL -f database/migrations/add-integrations-table.sql' -ForegroundColor Gray
    exit 1
}

# Vérifier si psql est disponible
$psqlAvailable = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlAvailable) {
    Write-Host "❌ psql non trouvé. Installation requise." -ForegroundColor Red
    Write-Host "📝 Appliquez manuellement via Supabase Dashboard (voir instructions ci-dessus)" -ForegroundColor Yellow
    exit 1
}

# Appliquer la migration
Write-Host "📊 Application du fichier de migration..." -ForegroundColor Green
psql $env:DATABASE_URL -f database/migrations/add-integrations-table.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration appliquée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Redémarrez votre serveur Next.js si nécessaire" -ForegroundColor Gray
    Write-Host "  2. Allez sur /cockpit/integrations" -ForegroundColor Gray
    Write-Host "  3. Testez la connexion d'une intégration" -ForegroundColor Gray
} else {
    Write-Host "❌ Erreur lors de l'application de la migration" -ForegroundColor Red
    Write-Host "📝 Vérifiez les erreurs ci-dessus ou appliquez manuellement" -ForegroundColor Yellow
    exit 1
}
