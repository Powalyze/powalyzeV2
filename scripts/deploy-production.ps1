# ============================================
# deploy-production.ps1
# Déploie en production (APRÈS APPROVAL)
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [string]$ApprovalFile = "",
    [switch]$Force = $false,
    [switch]$SkipApproval = $false
)

Write-Host "🚀 PACK 5 - Deploy to PRODUCTION" -ForegroundColor Red
Write-Host "==================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️ WARNING: This will deploy to PRODUCTION" -ForegroundColor Yellow
Write-Host "⚠️ Make sure you have Release Manager approval" -ForegroundColor Yellow
Write-Host ""

$StartTime = Get-Date
$ErrorCount = 0

# ============================================
# 1. Vérifier approval Release Manager
# ============================================
if (!$SkipApproval) {
    Write-Host "📋 Checking Release Manager approval..." -ForegroundColor Yellow

    if (!$ApprovalFile) {
        Write-Host ""
        Write-Host "❌ No approval file provided" -ForegroundColor Red
        Write-Host ""
        Write-Host "Usage: .\deploy-production.ps1 -ApprovalFile 'docs/reports/RELEASE-APPROVAL-[VERSION].md'" -ForegroundColor Yellow
        Write-Host "Or use -SkipApproval to bypass (NOT RECOMMENDED)" -ForegroundColor Yellow
        exit 1
    }

    if (!(Test-Path $ApprovalFile)) {
        Write-Host "❌ Approval file not found: $ApprovalFile" -ForegroundColor Red
        exit 1
    }

    # Lire le fichier d'approval
    $ApprovalContent = Get-Content $ApprovalFile -Raw

    # Vérifier si contient "GO PRODUCTION"
    if ($ApprovalContent -match "✅.*GO PRODUCTION") {
        Write-Host "✅ Release Manager approval found" -ForegroundColor Green
        Write-Host "   File: $ApprovalFile" -ForegroundColor Gray
    } else {
        Write-Host "❌ No GO PRODUCTION approval found in file" -ForegroundColor Red
        Write-Host ""
        Write-Host "The approval file must contain '✅ GO PRODUCTION'" -ForegroundColor Yellow
        Write-Host "Or use -Force to bypass (NOT RECOMMENDED)" -ForegroundColor Yellow
        
        if (!$Force) {
            exit 1
        }
    }
} else {
    Write-Host "⚠️ Skipping approval check (use at your own risk)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 2. Confirmation finale
# ============================================
if (!$Force) {
    Write-Host "⚠️ FINAL CONFIRMATION" -ForegroundColor Red
    Write-Host "This will deploy to PRODUCTION (www.powalyze.com)" -ForegroundColor Yellow
    Write-Host ""
    $confirmation = Read-Host "Type 'DEPLOY' to continue"

    if ($confirmation -ne "DEPLOY") {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Starting production deployment..." -ForegroundColor Green
Write-Host ""

# ============================================
# 3. Vérifier branche main
# ============================================
Write-Host "📍 Checking branch..." -ForegroundColor Yellow

$CurrentBranch = git branch --show-current

if ($CurrentBranch -ne "main" -and !$Force) {
    Write-Host "❌ Not on 'main' branch (current: $CurrentBranch)" -ForegroundColor Red
    Write-Host "   Checkout main first or use -Force" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Branch: $CurrentBranch" -ForegroundColor Green
Write-Host ""

# ============================================
# 4. Pull latest
# ============================================
Write-Host "⬇️ Pulling latest changes..." -ForegroundColor Yellow

git pull origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git pull failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Latest changes pulled" -ForegroundColor Green
Write-Host ""

# ============================================
# 5. Pre-deployment checks
# ============================================
Write-Host "🔍 Running pre-deployment checks..." -ForegroundColor Yellow
Write-Host ""

# Check environment
Write-Host "  🔧 Checking environment..." -ForegroundColor Cyan
& "$PSScriptRoot\check-env.ps1" -Mode "prod"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Environment check failed" -ForegroundColor Red
    $ErrorCount++
}
Write-Host ""

# Check build
Write-Host "  🏗️ Checking build..." -ForegroundColor Cyan
& "$PSScriptRoot\check-build.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build check failed" -ForegroundColor Red
    $ErrorCount++
}
Write-Host ""

if ($ErrorCount -gt 0 -and !$Force) {
    Write-Host "❌ Pre-deployment checks failed" -ForegroundColor Red
    Write-Host "Fix errors before deploying or use -Force" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All pre-deployment checks passed" -ForegroundColor Green
Write-Host ""

# ============================================
# 6. Deploy to Vercel Production
# ============================================
Write-Host "☁️ Deploying to Vercel PRODUCTION..." -ForegroundColor Yellow

$DeployOutput = vercel --prod --yes 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel deployment failed:" -ForegroundColor Red
    Write-Host $DeployOutput -ForegroundColor Red
    exit 1
}

Write-Host $DeployOutput

# Extract URL from output
$ProductionURL = ""
if ($DeployOutput -match "https://[^\s]+") {
    $ProductionURL = $matches[0]
}

Write-Host ""
Write-Host "✅ PRODUCTION DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green

if ($ProductionURL) {
    Write-Host "🌐 Production URL: $ProductionURL" -ForegroundColor Cyan
}

Write-Host ""

# ============================================
# 7. Initial smoke tests (15 min)
# ============================================
Write-Host "🧪 Running initial smoke tests..." -ForegroundColor Yellow

Start-Sleep -Seconds 10 # Wait for deployment to propagate

$TestRoutes = @("/", "/login", "/cockpit")
$FailedTests = 0

foreach ($route in $TestRoutes) {
    $testURL = "$ProductionURL$route"
    Write-Host "  Testing $testURL..." -ForegroundColor Gray

    try {
        $response = Invoke-WebRequest -Uri $testURL -Method GET -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "    ✅ $route (200 OK)" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️ $route ($($response.StatusCode))" -ForegroundColor Yellow
            $FailedTests++
        }
    } catch {
        Write-Host "    ❌ $route (Error: $($_.Exception.Message))" -ForegroundColor Red
        $FailedTests++
    }
}

Write-Host ""
if ($FailedTests -eq 0) {
    Write-Host "✅ All smoke tests passed" -ForegroundColor Green
} else {
    Write-Host "⚠️ $FailedTests smoke test(s) failed - INVESTIGATE IMMEDIATELY" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# RÉSUMÉ
# ============================================
$EndTime = Get-Date
$TotalDuration = ($EndTime - $StartTime).TotalSeconds

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "📊 PRODUCTION DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Branch: $CurrentBranch" -ForegroundColor White
Write-Host "Total time: $([math]::Round($TotalDuration, 2))s" -ForegroundColor White

if ($ProductionURL) {
    Write-Host "Production URL: $ProductionURL" -ForegroundColor Cyan
    Write-Host "Alias: https://www.powalyze.com" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎯 Post-deployment tasks:" -ForegroundColor Yellow
Write-Host "  1. Monitor Vercel Analytics (15 min)" -ForegroundColor White
Write-Host "  2. Monitor Supabase Logs (15 min)" -ForegroundColor White
Write-Host "  3. Check error tracking (if configured)" -ForegroundColor White
Write-Host "  4. Update Deployment Log: docs/reports/DEPLOYMENT-LOG-[VERSION].md" -ForegroundColor White
Write-Host "  5. Notify team: Slack #releases" -ForegroundColor White
Write-Host "  6. Publish Release Notes (external communication)" -ForegroundColor White
Write-Host "  7. Start 48h monitoring" -ForegroundColor White
Write-Host ""

Write-Host "✅ PRODUCTION DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "🚨 MONITORING ACTIVE - Stay alert for 48h" -ForegroundColor Yellow
exit 0
