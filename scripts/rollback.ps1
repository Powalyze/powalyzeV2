# ============================================
# rollback.ps1
# Rollback Vercel deployment
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [string]$DeploymentId = "",
    [switch]$Force = $false
)

Write-Host "🔄 PACK 5 - Rollback Deployment" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️ WARNING: This will rollback to a previous deployment" -ForegroundColor Yellow
Write-Host ""

# ============================================
# 1. List recent deployments
# ============================================
if (!$DeploymentId) {
    Write-Host "📋 Fetching recent deployments..." -ForegroundColor Yellow
    Write-Host ""

    $DeploymentsOutput = vercel ls --prod 2>&1 | Out-String
    Write-Host $DeploymentsOutput

    Write-Host ""
    Write-Host "To rollback to a specific deployment, use:" -ForegroundColor Yellow
    Write-Host "  .\rollback.ps1 -DeploymentId '<deployment-id>'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or find the deployment URL in Vercel dashboard:" -ForegroundColor Yellow
    Write-Host "  https://vercel.com/powalyzes-projects/powalyze-v2" -ForegroundColor White
    
    exit 0
}

# ============================================
# 2. Confirmation
# ============================================
if (!$Force) {
    Write-Host "⚠️ ROLLBACK CONFIRMATION" -ForegroundColor Red
    Write-Host "You are about to rollback to deployment: $DeploymentId" -ForegroundColor Yellow
    Write-Host ""
    $confirmation = Read-Host "Type 'ROLLBACK' to continue"

    if ($confirmation -ne "ROLLBACK") {
        Write-Host "❌ Rollback cancelled" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔄 Starting rollback..." -ForegroundColor Yellow
Write-Host ""

# ============================================
# 3. Perform rollback
# ============================================
Write-Host "☁️ Rolling back Vercel deployment..." -ForegroundColor Yellow

$RollbackOutput = vercel rollback $DeploymentId 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Rollback failed:" -ForegroundColor Red
    Write-Host $RollbackOutput -ForegroundColor Red
    exit 1
}

Write-Host $RollbackOutput
Write-Host ""
Write-Host "✅ Rollback successful!" -ForegroundColor Green
Write-Host ""

# ============================================
# 4. Smoke tests
# ============================================
Write-Host "🧪 Running smoke tests on rolled back deployment..." -ForegroundColor Yellow

Start-Sleep -Seconds 10 # Wait for rollback to propagate

$ProductionURL = "https://www.powalyze.com"
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
    Write-Host "✅ All smoke tests passed after rollback" -ForegroundColor Green
} else {
    Write-Host "⚠️ $FailedTests smoke test(s) failed after rollback" -ForegroundColor Yellow
    Write-Host "⚠️ INVESTIGATE IMMEDIATELY" -ForegroundColor Red
}

Write-Host ""

# ============================================
# 5. Post-rollback actions
# ============================================
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 POST-ROLLBACK ACTIONS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Rollback complete" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Required actions:" -ForegroundColor Yellow
Write-Host "  1. ✅ Monitor production (15 min)" -ForegroundColor White
Write-Host "  2. 📢 Notify team: Slack #incidents" -ForegroundColor White
Write-Host "  3. 📧 Email users (if downtime > 5 min)" -ForegroundColor White
Write-Host "  4. 📝 Create post-mortem: docs/reports/POST-MORTEM-[DATE].md" -ForegroundColor White
Write-Host "  5. 🔍 Identify root cause" -ForegroundColor White
Write-Host "  6. 🛠️ Fix issue in VB" -ForegroundColor White
Write-Host "  7. 🧪 Re-test in staging" -ForegroundColor White
Write-Host "  8. 🚀 Re-deploy when ready" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful links:" -ForegroundColor Yellow
Write-Host "  Vercel Dashboard: https://vercel.com/powalyzes-projects/powalyze-v2" -ForegroundColor White
Write-Host "  Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host ""

Write-Host "✅ ROLLBACK SUCCESSFUL" -ForegroundColor Green
Write-Host "🚨 INVESTIGATE ROOT CAUSE IMMEDIATELY" -ForegroundColor Red
exit 0
