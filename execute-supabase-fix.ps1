# ============================================================================
# SCRIPT D'EXÉCUTION AUTOMATIQUE SUR SUPABASE
# ============================================================================
# Ce script exécute FIX_SUPABASE_ORGANIZATIONS.sql sur votre base Supabase
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$SupabaseUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$ServiceRoleKey
)

Write-Host "🚀 Début de l'exécution du script SQL sur Supabase..." -ForegroundColor Cyan

# Lire le fichier SQL
$sqlScript = Get-Content "FIX_SUPABASE_ORGANIZATIONS.sql" -Raw

# Préparer la requête API
$headers = @{
    "apikey" = $ServiceRoleKey
    "Authorization" = "Bearer $ServiceRoleKey"
    "Content-Type" = "application/json"
}

$body = @{
    query = $sqlScript
} | ConvertTo-Json

$apiUrl = "$SupabaseUrl/rest/v1/rpc/exec_sql"

try {
    Write-Host "📡 Envoi du script SQL à Supabase..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body
    
    Write-Host "✅ Script exécuté avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Résultats:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
} catch {
    Write-Host "❌ Erreur lors de l'exécution:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host ""
        Write-Host "Détails:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
    
    exit 1
}

Write-Host ""
Write-Host "🎉 Terminé!" -ForegroundColor Green

# ============================================================================
# UTILISATION:
# ============================================================================
# .\execute-supabase-fix.ps1 -SupabaseUrl "https://xxx.supabase.co" -ServiceRoleKey "eyJ..."
# ============================================================================
