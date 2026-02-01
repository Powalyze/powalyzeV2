# ========================================
# SETUP ORGANISATION AUTOMATIQUE VIA API SUPABASE
# User ID: c7679d53-7d45-48c0-a901-b36aa1a27ccb
# ========================================

$ErrorActionPreference = "Stop"

# Configuration
$USER_ID = "c7679d53-7d45-48c0-a901-b36aa1a27ccb"
$ORG_NAME = "Organisation Fabrice"

# Lire les variables d'environnement
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SUPABASE_SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_SERVICE_KEY) {
    Write-Host "❌ Variables Supabase manquantes dans .env.local" -ForegroundColor Red
    Write-Host "   NEXT_PUBLIC_SUPABASE_URL: $SUPABASE_URL" -ForegroundColor Yellow
    Write-Host "   SUPABASE_SERVICE_ROLE_KEY: $(if($SUPABASE_SERVICE_KEY){'défini'}else{'manquant'})" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔧 Configuration Supabase" -ForegroundColor Cyan
Write-Host "   URL: $SUPABASE_URL" -ForegroundColor Gray
Write-Host "   User ID: $USER_ID" -ForegroundColor Gray
Write-Host ""

# Headers pour authentification
$headers = @{
    "apikey" = $SUPABASE_SERVICE_KEY
    "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

try {
    # ÉTAPE 1: Créer l'organisation
    Write-Host "📦 ÉTAPE 1: Création de l'organisation..." -ForegroundColor Yellow
    
    $orgBody = @{
        name = $ORG_NAME
        owner_id = $USER_ID
    } | ConvertTo-Json
    
    $orgResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/organizations" `
        -Method Post `
        -Headers $headers `
        -Body $orgBody
    
    $ORG_ID = $orgResponse.id
    
    Write-Host "✅ Organisation créée!" -ForegroundColor Green
    Write-Host "   ID: $ORG_ID" -ForegroundColor Gray
    Write-Host "   Nom: $($orgResponse.name)" -ForegroundColor Gray
    Write-Host ""
    
    # ÉTAPE 2: Créer le membership
    Write-Host "👤 ÉTAPE 2: Création du membership..." -ForegroundColor Yellow
    
    $membershipBody = @{
        organization_id = $ORG_ID
        user_id = $USER_ID
        role = "owner"
    } | ConvertTo-Json
    
    $membershipResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/memberships" `
        -Method Post `
        -Headers $headers `
        -Body $membershipBody
    
    Write-Host "✅ Membership créé!" -ForegroundColor Green
    Write-Host "   Organization ID: $($membershipResponse.organization_id)" -ForegroundColor Gray
    Write-Host "   User ID: $($membershipResponse.user_id)" -ForegroundColor Gray
    Write-Host "   Role: $($membershipResponse.role)" -ForegroundColor Gray
    Write-Host ""
    
    # ÉTAPE 3: Mettre à jour user_metadata
    Write-Host "🔄 ÉTAPE 3: Mise à jour user_metadata..." -ForegroundColor Yellow
    
    $updateBody = @{
        data = @{
            organization_id = $ORG_ID
        }
    } | ConvertTo-Json
    
    $updateResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID" `
        -Method Put `
        -Headers $headers `
        -Body $updateBody
    
    Write-Host "✅ User metadata mis à jour!" -ForegroundColor Green
    Write-Host ""
    
    # VÉRIFICATIONS
    Write-Host "🔍 VÉRIFICATIONS FINALES" -ForegroundColor Cyan
    Write-Host ""
    
    # Vérifier l'organisation
    $orgCheck = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/organizations?owner_id=eq.$USER_ID" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Organisation trouvée: $($orgCheck[0].name)" -ForegroundColor Green
    
    # Vérifier le membership
    $membershipCheck = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/memberships?user_id=eq.$USER_ID" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Membership trouvé: role=$($membershipCheck[0].role)" -ForegroundColor Green
    
    # Vérifier user_metadata
    $userCheck = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID" `
        -Method Get `
        -Headers $headers
    
    $metadataOrgId = $userCheck.user_metadata.organization_id
    Write-Host "✅ User metadata: organization_id=$metadataOrgId" -ForegroundColor Green
    Write-Host ""
    
    # RÉSUMÉ
    Write-Host "🎉 SETUP TERMINÉ AVEC SUCCÈS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 RÉSUMÉ:" -ForegroundColor Cyan
    Write-Host "   • Organisation ID: $ORG_ID" -ForegroundColor Gray
    Write-Host "   • Organization Name: $ORG_NAME" -ForegroundColor Gray
    Write-Host "   • User ID: $USER_ID" -ForegroundColor Gray
    Write-Host "   • Role: owner" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🚀 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
    Write-Host "   1. Se déconnecter de https://www.powalyze.com" -ForegroundColor Yellow
    Write-Host "   2. Se reconnecter (rafraîchir la session)" -ForegroundColor Yellow
    Write-Host "   3. Aller sur /cockpit" -ForegroundColor Yellow
    Write-Host "   4. Créer un projet test" -ForegroundColor Yellow
    Write-Host "   5. Vérifier que tout fonctionne!" -ForegroundColor Yellow
    Write-Host ""
    
    # Sauvegarder les IDs dans un fichier
    $outputFile = "organization-setup-result.txt"
    @"
Organisation Setup - $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
================================================

Organisation ID: $ORG_ID
Organization Name: $ORG_NAME
User ID: $USER_ID
Role: owner

Status: ✅ Terminé avec succès

Prochaines étapes:
1. Se déconnecter de https://www.powalyze.com
2. Se reconnecter
3. Tester le cockpit
"@ | Out-File -FilePath $outputFile -Encoding UTF8
    
    Write-Host "💾 Résultat sauvegardé dans: $outputFile" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "❌ ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Détails:" -ForegroundColor Yellow
    Write-Host $_.Exception.ToString() -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Solution alternative:" -ForegroundColor Cyan
    Write-Host "   Exécuter manuellement le fichier: setup-organization-c7679d53.sql" -ForegroundColor Yellow
    Write-Host "   dans Supabase SQL Editor" -ForegroundColor Yellow
    exit 1
}
