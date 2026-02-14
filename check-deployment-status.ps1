# PowerShell Script - Quick deployment check
# Usage: .\check-deployment-status.ps1

Write-Host ""
Write-Host "🔍 VÉRIFICATION ÉTAT DÉPLOIEMENT PRICING" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Gray
Write-Host ""

$baseUrl = "https://www.powalyze.com"
$allGood = $true

# Function to check file exists
function Check-File {
    param([string]$path, [string]$description)
    Write-Host "📄 $description" -ForegroundColor Yellow -NoNewline
    if (Test-Path $path) {
        Write-Host " ✅" -ForegroundColor Green
        return $true
    } else {
        Write-Host " ❌ MANQUANT" -ForegroundColor Red
        return $false
    }
}

# Function to check URL
function Check-URL {
    param([string]$url, [string]$description)
    Write-Host "🌐 $description" -ForegroundColor Yellow -NoNewline
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ ($($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host " ⚠️  ($($response.StatusCode))" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host " ❌ ERREUR" -ForegroundColor Red
        return $false
    }
}

Write-Host "1️⃣  FICHIERS LOCAUX" -ForegroundColor Cyan
Write-Host "-"*60 -ForegroundColor Gray

$allGood = $allGood -and (Check-File "database\subscriptions-schema.sql" "Schema SQL subscriptions")
$allGood = $allGood -and (Check-File "app\pricing\page.tsx" "Page pricing")
$allGood = $allGood -and (Check-File "components\EnterpriseRequestForm.tsx" "Formulaire Entreprise")
$allGood = $allGood -and (Check-File "app\api\subscriptions\check\route.ts" "API check subscription")
$allGood = $allGood -and (Check-File "app\api\subscriptions\start-trial\route.ts" "API start trial")
$allGood = $allGood -and (Check-File "app\api\subscriptions\request-enterprise\route.ts" "API demande Entreprise")
$allGood = $allGood -and (Check-File "app\api\stripe\create-checkout-session\route.ts" "API Stripe checkout")
$allGood = $allGood -and (Check-File "app\api\stripe\webhook\route.ts" "API Stripe webhook")
$allGood = $allGood -and (Check-File "middleware-subscription.ts" "Middleware subscription")
$allGood = $allGood -and (Check-File "STRIPE_INTEGRATION_GUIDE.md" "Guide Stripe")

Write-Host ""
Write-Host "2️⃣  PAGES PRODUCTION" -ForegroundColor Cyan
Write-Host "-"*60 -ForegroundColor Gray

$allGood = $allGood -and (Check-URL "$baseUrl/" "Page d'accueil")
$allGood = $allGood -and (Check-URL "$baseUrl/pricing" "Page pricing")
$allGood = $allGood -and (Check-URL "$baseUrl/signup" "Page inscription")
$allGood = $allGood -and (Check-URL "$baseUrl/login" "Page connexion")

Write-Host ""
Write-Host "3️⃣  CONFIGURATION" -ForegroundColor Cyan
Write-Host "-"*60 -ForegroundColor Gray

# Check .env.local
Write-Host "🔑 Fichier .env.local" -ForegroundColor Yellow -NoNewline
if (Test-Path ".env.local") {
    Write-Host " ✅" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    
    # Check Supabase config
    Write-Host "   └─ NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Gray -NoNewline
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=https://") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $allGood = $false
    }
    
    Write-Host "   └─ SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Gray -NoNewline
    if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $allGood = $false
    }
    
    # Check Stripe config (optional)
    Write-Host "   └─ STRIPE_SECRET_KEY" -ForegroundColor Gray -NoNewline
    if ($envContent -match "STRIPE_SECRET_KEY=sk_") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ⏳ PAS CONFIGURÉ (optionnel)" -ForegroundColor Yellow
    }
    
} else {
    Write-Host " ⚠️  PAS TROUVÉ" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4️⃣  SCRIPTS UTILITAIRES" -ForegroundColor Cyan
Write-Host "-"*60 -ForegroundColor Gray

Check-File "apply-subscriptions-schema.ps1" "Script application DB"
Check-File "test-pricing-journey.ps1" "Script tests"
Check-File "activate-subscription-middleware.ps1" "Script activation middleware"

Write-Host ""
Write-Host "="*60 -ForegroundColor Gray
Write-Host ""

if ($allGood) {
    Write-Host "✅ TOUT EST EN PLACE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Appliquer schema DB: .\apply-subscriptions-schema.ps1" -ForegroundColor White
    Write-Host "  2. Tester production: .\test-pricing-journey.ps1" -ForegroundColor White
    Write-Host "  3. Configurer Stripe: Voir STRIPE_INTEGRATION_GUIDE.md" -ForegroundColor White
    Write-Host "  4. Activer middleware: .\activate-subscription-middleware.ps1" -ForegroundColor White
} else {
    Write-Host "⚠️  CERTAINS ÉLÉMENTS MANQUENT" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Vérifiez les ❌ ci-dessus et corrigez avant de continuer." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 Documentation complète:" -ForegroundColor Gray
Write-Host "   - TODO_FINALISATION.md (liste rapide)" -ForegroundColor Gray
Write-Host "   - RECAPITULATIF_FINAL.md (détails complets)" -ForegroundColor Gray
Write-Host "   - STRIPE_INTEGRATION_GUIDE.md (guide Stripe)" -ForegroundColor Gray
Write-Host "   - ARCHITECTURE_COMPLETE_PRICING.md (architecture)" -ForegroundColor Gray
Write-Host ""
