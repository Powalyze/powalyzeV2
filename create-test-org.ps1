# ============================================
# CREATE TEST ORG & USER
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
    exit 1
}

Write-Host "🚀 Création organisation et utilisateur de test..." -ForegroundColor Cyan

# Créer une organisation
$orgId = [guid]::NewGuid().ToString()
$orgName = "Demo Corp"

Write-Host "📦 Création organisation: $orgName" -ForegroundColor Yellow

$headers = @{
    "apikey" = $serviceRoleKey
    "Authorization" = "Bearer $serviceRoleKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

$orgBody = @{
    id = $orgId
    name = $orgName
    slug = "demo-corp"
} | ConvertTo-Json

try {
    $org = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/organizations" -Method Post -Headers $headers -Body $orgBody
    Write-Host "✅ Organisation créée: $orgId" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erreur création org: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Créer un compte via https://www.powalyze.com/signup-v2" -ForegroundColor White
Write-Host "2. Le compte sera automatiquement en mode 'demo'" -ForegroundColor White
Write-Host "3. Tester navigation /cockpit/demo" -ForegroundColor White
Write-Host "4. Cliquer 'Passer en Mode Pro' depuis la page /upgrade" -ForegroundColor White
Write-Host "5. Créer un projet dans /cockpit/pro/projets/nouveau" -ForegroundColor White
Write-Host ""
Write-Host "🔗 URLs de test:" -ForegroundColor Yellow
Write-Host "- Signup: https://www.powalyze.com/signup-v2" -ForegroundColor White
Write-Host "- Login: https://www.powalyze.com/login-v2" -ForegroundColor White
Write-Host "- Demo: https://www.powalyze.com/cockpit/demo" -ForegroundColor White
Write-Host "- Pro: https://www.powalyze.com/cockpit/pro" -ForegroundColor White
