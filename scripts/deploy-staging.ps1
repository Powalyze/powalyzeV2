# ============================================
# deploy-staging.ps1
# Déploie sur environnement staging
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Branch = "staging",
    [switch]$SkipTests = $false,
    [switch]$Force = $false
)

Write-Host "🚀 PACK 5 - Deploy to Staging" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Branch: $Branch" -ForegroundColor White
Write-Host ""

$StartTime = Get-Date
$ErrorCount = 0

# ============================================
# 1. Vérifier que nous sommes dans le repo
# ============================================
if (!(Test-Path ".git")) {
    Write-Host "❌ Not in a git repository" -ForegroundColor Red
    exit 1
}

# ============================================
# 2. Vérifier branche actuelle
# ============================================
Write-Host "📍 Checking current branch..." -ForegroundColor Yellow

$CurrentBranch = git branch --show-current

if ($CurrentBranch -ne $Branch -and !$Force) {
    Write-Host "⚠️ Current branch: $CurrentBranch" -ForegroundColor Yellow
    Write-Host "⚠️ Target branch: $Branch" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Use -Force to deploy from current branch, or checkout $Branch first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Branch: $CurrentBranch" -ForegroundColor Green
Write-Host ""

# ============================================
# 3. Vérifier uncommitted changes
# ============================================
Write-Host "🔍 Checking for uncommitted changes..." -ForegroundColor Yellow

$GitStatus = git status --porcelain

if ($GitStatus -and !$Force) {
    Write-Host "⚠️ Uncommitted changes found:" -ForegroundColor Yellow
    Write-Host $GitStatus -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commit or stash changes before deploying" -ForegroundColor Yellow
    Write-Host "Or use -Force to deploy anyway" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ No uncommitted changes" -ForegroundColor Green
Write-Host ""

# ============================================
# 4. Pull latest
# ============================================
Write-Host "⬇️ Pulling latest changes..." -ForegroundColor Yellow

git pull origin $Branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git pull failed" -ForegroundColor Red
    $ErrorCount++
}

Write-Host "✅ Latest changes pulled" -ForegroundColor Green
Write-Host ""

# ============================================
# 5. Pre-deployment checks
# ============================================
if (!$SkipTests) {
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

    if ($ErrorCount -gt 0) {
        Write-Host "❌ Pre-deployment checks failed" -ForegroundColor Red
        Write-Host "Fix errors before deploying" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ All pre-deployment checks passed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⚠️ Skipping pre-deployment checks (use at your own risk)" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================
# 6. Deploy to Vercel
# ============================================
Write-Host "☁️ Deploying to Vercel..." -ForegroundColor Yellow

$DeployOutput = vercel --prod --yes 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel deployment failed:" -ForegroundColor Red
    Write-Host $DeployOutput -ForegroundColor Red
    exit 1
}

Write-Host $DeployOutput

# Extract URL from output
$StagingURL = ""
if ($DeployOutput -match "https://[^\s]+") {
    $StagingURL = $matches[0]
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green

if ($StagingURL) {
    Write-Host "🌐 Staging URL: $StagingURL" -ForegroundColor Cyan
}

Write-Host ""

# ============================================
# 7. Smoke tests (optionnel)
# ============================================
if ($StagingURL -and !$SkipTests) {
    Write-Host "🧪 Running smoke tests..." -ForegroundColor Yellow

    $TestRoutes = @("/", "/login", "/cockpit")
    $FailedTests = 0

    foreach ($route in $TestRoutes) {
        $testURL = "$StagingURL$route"
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
        Write-Host "⚠️ $FailedTests smoke test(s) failed" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================
# RÉSUMÉ
# ============================================
$EndTime = Get-Date
$TotalDuration = ($EndTime - $StartTime).TotalSeconds

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "📊 DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Branch: $CurrentBranch" -ForegroundColor White
Write-Host "Total time: $([math]::Round($TotalDuration, 2))s" -ForegroundColor White

if ($StagingURL) {
    Write-Host "Staging URL: $StagingURL" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test staging manually: $StagingURL" -ForegroundColor White
Write-Host "  2. Fill Deployment Log: docs/templates/DEPLOYMENT-LOG.md" -ForegroundColor White
Write-Host "  3. Notify Release Manager: Staging ready for validation" -ForegroundColor White
Write-Host ""

Write-Host "✅ STAGING DEPLOYMENT COMPLETE" -ForegroundColor Green
exit 0
