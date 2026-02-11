# Script de correction des variables d'environnement Vercel pour Supabase
# Corrige l'erreur 401 due à une ancienne URL Supabase

$ErrorActionPreference = "Continue"

Write-Host "
╔═══════════════════════════════════════════════════════════╗
║  🔧 Fix Vercel Supabase Environment Variables            ║
║  Corrige l'erreur 401 avec ancienne URL Supabase          ║
╚═══════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Variables à mettre à jour (depuis .env.local)
$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://pqsgdwfsdnmozzoynefw.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.DRRnRPaUhPtCxYCM3TbT-mKJPGGYp0hFWrFf6PNYlqk"
    "SUPABASE_SERVICE_ROLE_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU"
}

$environments = @("production", "preview", "development")

Write-Host "📋 Variables à mettre à jour :" -ForegroundColor Yellow
foreach ($var in $envVars.Keys) {
    Write-Host "  • $var" -ForegroundColor Cyan
}
Write-Host ""

# Confirmation
$confirm = Read-Host "Continuer avec la mise à jour ? (o/N)"
if ($confirm -ne "o" -and $confirm -ne "O") {
    Write-Host "❌ Annulé par l'utilisateur." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Mise à jour des variables Vercel..." -ForegroundColor Yellow
Write-Host ""

foreach ($env in $environments) {
    Write-Host "═══ Environnement: $env ═══" -ForegroundColor Magenta
    
    foreach ($var in $envVars.Keys) {
        Write-Host "  🔹 $var" -ForegroundColor Cyan
        
        # Supprimer l'ancienne variable (ignorer les erreurs si elle n'existe pas)
        Write-Host "    Suppression..." -ForegroundColor DarkGray
        vercel env rm $var $env --yes 2>$null | Out-Null
        
        # Pause courte pour éviter les rate limits
        Start-Sleep -Milliseconds 500
        
        # Ajouter la nouvelle variable
        Write-Host "    Ajout..." -ForegroundColor DarkGray
        $value = $envVars[$var]
        $value | vercel env add $var $env | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✅ Mis à jour" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️  Erreur lors de la mise à jour" -ForegroundColor Yellow
        }
        
        Start-Sleep -Milliseconds 500
    }
    Write-Host ""
}

Write-Host "✅ Variables d'environnement mises à jour !" -ForegroundColor Green
Write-Host ""

# Proposer le redéploiement
Write-Host "🚀 Redéploiement nécessaire pour appliquer les changements." -ForegroundColor Yellow
$deploy = Read-Host "Redéployer maintenant en production ? (o/N)"

if ($deploy -eq "o" -or $deploy -eq "O") {
    Write-Host ""
    Write-Host "🚀 Déploiement vers production..." -ForegroundColor Cyan
    Write-Host ""
    
    npx vercel --prod --yes
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  ✅ Déploiement réussi !                                  ║" -ForegroundColor Green
        Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔍 Vérification à effectuer :" -ForegroundColor Yellow
        Write-Host "  1. Accéder à l'app : https://powalyze.vercel.app"
        Write-Host "  2. Ouvrir DevTools Console (F12)"
        Write-Host "  3. Tester l'authentification"
        Write-Host "  4. Vérifier qu'il n'y a plus d'erreur 401 Supabase"
        Write-Host ""
        Write-Host "✅ L'URL Supabase doit être : pqsgdwfsdnmozzoynefw.supabase.co" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Erreur lors du déploiement." -ForegroundColor Red
        Write-Host "Vérifiez les erreurs ci-dessus et réessayez avec :" -ForegroundColor Yellow
        Write-Host "  npx vercel --prod --yes"
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Pensez à redéployer manuellement :" -ForegroundColor Yellow
    Write-Host "  npx vercel --prod --yes" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ou depuis l'interface Vercel :" -ForegroundColor Yellow
    Write-Host "  Deployments → ... → Redeploy" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "📅 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor DarkGray
Write-Host "🔧 Fix by: GitHub Copilot AI" -ForegroundColor DarkGray
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
