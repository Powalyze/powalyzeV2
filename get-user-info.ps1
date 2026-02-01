# Script pour récupérer les informations utilisateur
$SUPABASE_URL = "https://phfeteiholkfiredgero.supabase.co"
$SERVICE_KEY = "sb_secret_rTiv2wz2YRNBQL6_cpZoGQ_oiz7zWvw"
$USER_ID = "c7679d53-7d45-48c0-a901-b36aa1a27ccb"

Write-Host "=== Recherche des informations utilisateur ===" -ForegroundColor Cyan
Write-Host ""

# Récupérer l'utilisateur
$headers = @{
    "apikey" = $SERVICE_KEY
    "Authorization" = "Bearer $SERVICE_KEY"
    "Content-Type" = "application/json"
}

# Essayer auth.users via admin API
$authUrl = "$SUPABASE_URL/auth/v1/admin/users/$USER_ID"
Write-Host "Requête auth: $authUrl" -ForegroundColor Gray

try {
    $authResponse = Invoke-RestMethod -Uri $authUrl -Method Get -Headers $headers
    
    if ($authResponse -and $authResponse.id) {
        Write-Host "✅ Utilisateur auth trouvé!" -ForegroundColor Green
        Write-Host "ID: $($authResponse.id)" -ForegroundColor Yellow
        Write-Host "Email: $($authResponse.email)" -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    Write-Host "Erreur auth: $($_.Exception.Message)" -ForegroundColor Red
}

# Essayer la table users
$userUrl = "$SUPABASE_URL/rest/v1/users?id=eq.$USER_ID&select=*"
Write-Host "Requête users table: $userUrl" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $userUrl -Method Get -Headers $headers
    
    if ($response -and $response.Count -gt 0) {
        $user = $response[0]
        Write-Host "✅ Utilisateur trouvé!" -ForegroundColor Green
        Write-Host ""
        Write-Host "ID: $($user.id)" -ForegroundColor Yellow
        Write-Host "Email: $($user.email)" -ForegroundColor Yellow
        Write-Host "Role: $($user.role)" -ForegroundColor Yellow
        Write-Host "Tenant ID (organization_id): $($user.tenant_id)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "=== URL COMPLÈTE POUR SE CONNECTER ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Vercel (HTTPS sécurisé):" -ForegroundColor Green
        Write-Host "https://powalyze-v2-ppesicbe5-powalyzes-projects.vercel.app/cockpit/client?userId=$($user.id)&organizationId=$($user.tenant_id)" -ForegroundColor White
        Write-Host ""
        Write-Host "Domaine (après résolution SSL):" -ForegroundColor Yellow
        Write-Host "https://powalyze.com/cockpit/client?userId=$($user.id)&organizationId=$($user.tenant_id)" -ForegroundColor White
    } else {
        Write-Host "❌ Utilisateur non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
