# PowerShell Script to test pricing page and user journey
# Usage: .\test-pricing-journey.ps1

Write-Host "🧪 Test de la page Tarifs et du parcours utilisateur" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://www.powalyze.com"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$url,
        [string]$description,
        [string]$method = "GET",
        [hashtable]$headers = @{},
        [string]$body = $null
    )
    
    Write-Host "Testing: $description" -ForegroundColor Yellow
    Write-Host "  URL: $url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            TimeoutSec = 30
        }
        
        if ($body) {
            $params.Body = $body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ PASS ($($response.StatusCode))" -ForegroundColor Green
            return @{
                Test = $description
                Status = "PASS"
                Code = $response.StatusCode
                Size = $response.RawContentLength
            }
        } else {
            Write-Host "  ⚠️  WARN ($($response.StatusCode))" -ForegroundColor Yellow
            return @{
                Test = $description
                Status = "WARN"
                Code = $response.StatusCode
            }
        }
    } catch {
        Write-Host "  ❌ FAIL ($($_.Exception.Message))" -ForegroundColor Red
        return @{
            Test = $description
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
    Write-Host ""
}

Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "TEST 1: Page Tarifs (/pricing)" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$testResults += Test-Endpoint `
    -url "$baseUrl/pricing" `
    -description "GET /pricing - Page tarifs accessible"

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "TEST 2: API Subscriptions (Public)" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Test enterprise request (public endpoint)
$enterprisePayload = @{
    email = "test.$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    fullName = "Test User"
    company = "Test Corp"
    message = "Test automatique - $(Get-Date)"
} | ConvertTo-Json

$testResults += Test-Endpoint `
    -url "$baseUrl/api/subscriptions/request-enterprise" `
    -description "POST /api/subscriptions/request-enterprise - Demande Entreprise" `
    -method "POST" `
    -body $enterprisePayload

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "TEST 3: Pages connexes" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$testResults += Test-Endpoint `
    -url "$baseUrl/" `
    -description "GET / - Page d'accueil"

$testResults += Test-Endpoint `
    -url "$baseUrl/signup" `
    -description "GET /signup - Page inscription"

$testResults += Test-Endpoint `
    -url "$baseUrl/login" `
    -description "GET /login - Page connexion"

$testResults += Test-Endpoint `
    -url "$baseUrl/cockpit" `
    -description "GET /cockpit - Cockpit (devrait rediriger si non-auth)"

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "RÉSULTATS" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$warned = ($testResults | Where-Object { $_.Status -eq "WARN" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $testResults.Count

Write-Host "Total: $total tests" -ForegroundColor White
Write-Host "✅ Passed: $passed" -ForegroundColor Green
if ($warned -gt 0) {
    Write-Host "⚠️  Warnings: $warned" -ForegroundColor Yellow
}
if ($failed -gt 0) {
    Write-Host "❌ Failed: $failed" -ForegroundColor Red
}
Write-Host ""

# Detailed results
Write-Host "Détails:" -ForegroundColor Gray
foreach ($result in $testResults) {
    $statusIcon = switch ($result.Status) {
        "PASS" { "✅" }
        "WARN" { "⚠️ " }
        "FAIL" { "❌" }
    }
    
    $statusColor = switch ($result.Status) {
        "PASS" { "Green" }
        "WARN" { "Yellow" }
        "FAIL" { "Red" }
    }
    
    Write-Host "  $statusIcon $($result.Test)" -ForegroundColor $statusColor
    if ($result.Code) {
        Write-Host "     Status: $($result.Code)" -ForegroundColor Gray
    }
    if ($result.Size) {
        Write-Host "     Size: $([math]::Round($result.Size / 1024, 2)) KB" -ForegroundColor Gray
    }
    if ($result.Error) {
        Write-Host "     Error: $($result.Error)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "PARCOURS UTILISATEUR - Checklist manuelle" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

Write-Host "À tester manuellement:" -ForegroundColor Yellow
Write-Host ""
Write-Host "□ 1. Utilisateur NON connecté" -ForegroundColor White
Write-Host "     → Accéder à /pricing" -ForegroundColor Gray
Write-Host "     → Toggle mensuel/annuel fonctionne" -ForegroundColor Gray
Write-Host "     → Boutons 'Démarrer avec Pro' → /signup?plan=pro" -ForegroundColor Gray
Write-Host "     → Formulaire Entreprise se soumet correctement" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 2. Utilisateur CONNECTÉ sans abonnement" -ForegroundColor White
Write-Host "     → Se connecter via /login" -ForegroundColor Gray
Write-Host "     → Accéder à /cockpit → Voir cockpit vide avec CTA" -ForegroundColor Gray
Write-Host "     → Essayer /cockpit/projets → Redirect vers /pricing" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 3. Utilisateur avec TRIAL actif" -ForegroundColor White
Write-Host "     → Démarrer un trial via API" -ForegroundColor Gray
Write-Host "     → Accéder à /cockpit/projets → Accès complet" -ForegroundColor Gray
Write-Host "     → Toutes les pages Pro accessibles" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 4. Utilisateur PRO actif" -ForegroundColor White
Write-Host "     → Activer abonnement Pro" -ForegroundColor Gray
Write-Host "     → /cockpit → Auto-redirect vers /cockpit/projets" -ForegroundColor Gray
Write-Host "     → Badge 'Pro' visible dans UI" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 5. Client ENTREPRISE" -ForegroundColor White
Write-Host "     → Créer subscription enterprise" -ForegroundColor Gray
Write-Host "     → Badge 'Entreprise' visible" -ForegroundColor Gray
Write-Host "     → Modules avancés accessibles" -ForegroundColor Gray
Write-Host ""

Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✨ Tous les tests automatiques ont réussi!" -ForegroundColor Green
    Write-Host "   Continuez avec les tests manuels ci-dessus." -ForegroundColor Gray
} else {
    Write-Host "⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus." -ForegroundColor Yellow
}

Write-Host ""
