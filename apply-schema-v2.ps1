# ============================================
# APPLY SCHEMA V2 TO SUPABASE
# ============================================

$ErrorActionPreference = "Stop"

# Charger les variables d'environnement
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$serviceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl -or -not $serviceRoleKey) {
    Write-Host "❌ Variables d'environnement manquantes" -ForegroundColor Red
    Write-Host "Requis: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔄 Application du schéma SQL..." -ForegroundColor Cyan

# Lire le fichier SQL
$sqlContent = Get-Content "database\schema-v2-clean.sql" -Raw

# Appliquer via l'API REST Supabase
$headers = @{
    "apikey" = $serviceRoleKey
    "Authorization" = "Bearer $serviceRoleKey"
    "Content-Type" = "application/json"
}

$body = @{
    query = $sqlContent
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/rpc/exec_sql" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "✅ Schéma appliqué avec succès!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ La méthode RPC n'est pas disponible. Utilisation du SQL Editor manuel requis." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Instructions:" -ForegroundColor Cyan
    Write-Host "1. Ouvrir Supabase Dashboard: $supabaseUrl" -ForegroundColor White
    Write-Host "2. Aller dans SQL Editor" -ForegroundColor White
    Write-Host "3. Coller le contenu de database\schema-v2-clean.sql" -ForegroundColor White
    Write-Host "4. Exécuter le script" -ForegroundColor White
    Write-Host ""
    Write-Host "Le fichier schema-v2-clean.sql contient:" -ForegroundColor Yellow
    Write-Host "- 12 tables (organizations, profiles, projects, risks, decisions, etc.)" -ForegroundColor White
    Write-Host "- Policies RLS par organization_id" -ForegroundColor White
    Write-Host "- Triggers updated_at" -ForegroundColor White
    Write-Host "- Index de performance" -ForegroundColor White
}
