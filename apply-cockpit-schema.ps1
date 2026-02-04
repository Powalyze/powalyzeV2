# Script PowerShell pour appliquer le schéma SQL via API Supabase
# Usage: .\apply-cockpit-schema.ps1

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SUPABASE_SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_SERVICE_KEY) {
    Write-Host "❌ Erreur: Variables d'environnement manquantes" -ForegroundColor Red
    Write-Host "Définissez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Application du schéma Cockpit Executive..." -ForegroundColor Cyan

# Lire le fichier SQL
$sqlContent = Get-Content -Path "database/schema-cockpit-executive.sql" -Raw

# Diviser en commandes individuelles (séparées par ;)
$commands = $sqlContent -split ";" | Where-Object { $_.Trim() -ne "" }

$successCount = 0
$errorCount = 0

foreach ($command in $commands) {
    $cleanCommand = $command.Trim()
    if ($cleanCommand -eq "" -or $cleanCommand.StartsWith("--")) {
        continue
    }

    try {
        $body = @{
            query = $cleanCommand
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" `
            -Method POST `
            -Headers @{
                "apikey" = $SUPABASE_SERVICE_KEY
                "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
                "Content-Type" = "application/json"
            } `
            -Body $body `
            -ErrorAction Stop

        $successCount++
        Write-Host "✓" -NoNewline -ForegroundColor Green
    }
    catch {
        $errorCount++
        Write-Host "✗" -NoNewline -ForegroundColor Red
        Write-Host ""
        Write-Host "Erreur sur la commande: $($cleanCommand.Substring(0, [Math]::Min(100, $cleanCommand.Length)))..." -ForegroundColor Yellow
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Succès: $successCount commandes" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "❌ Erreurs: $errorCount commandes" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Si des erreurs persistent, utilisez le SQL Editor de Supabase Dashboard" -ForegroundColor Yellow
}
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
