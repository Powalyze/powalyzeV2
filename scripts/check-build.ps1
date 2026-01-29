# ============================================
# check-build.ps1
# Vérifie que le build production fonctionne
# ============================================

param(
    [switch]$Verbose = $false
)

Write-Host "🔍 PACK 5 - Build Check" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Variables
$ErrorCount = 0
$WarningCount = 0
$StartTime = Get-Date

# ============================================
# 1. Vérifier node_modules
# ============================================
Write-Host "📦 Checking node_modules..." -ForegroundColor Yellow

if (!(Test-Path "node_modules")) {
    Write-Host "❌ node_modules not found. Running npm install..." -ForegroundColor Red
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ node_modules found" -ForegroundColor Green
}

Write-Host ""

# ============================================
# 2. Vérifier TypeScript (strict mode)
# ============================================
Write-Host "🔍 Checking TypeScript (strict mode)..." -ForegroundColor Yellow

$TscOutput = npx tsc --noEmit 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript errors found:" -ForegroundColor Red
    Write-Host $TscOutput -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "✅ TypeScript: 0 errors" -ForegroundColor Green
}

Write-Host ""

# ============================================
# 3. Vérifier ESLint
# ============================================
Write-Host "🔍 Checking ESLint..." -ForegroundColor Yellow

$LintOutput = npm run lint 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ ESLint warnings found:" -ForegroundColor Yellow
    Write-Host $LintOutput -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "✅ ESLint: 0 warnings" -ForegroundColor Green
}

Write-Host ""

# ============================================
# 4. Build Production
# ============================================
Write-Host "🏗️ Building production..." -ForegroundColor Yellow

$BuildStartTime = Get-Date
$BuildOutput = npm run build 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed:" -ForegroundColor Red
    Write-Host $BuildOutput -ForegroundColor Red
    $ErrorCount++
} else {
    $BuildEndTime = Get-Date
    $BuildDuration = ($BuildEndTime - $BuildStartTime).TotalSeconds
    Write-Host "✅ Build succeeded in $($BuildDuration)s" -ForegroundColor Green
    
    if ($Verbose) {
        Write-Host ""
        Write-Host "Build output:" -ForegroundColor Cyan
        Write-Host $BuildOutput
    }
}

Write-Host ""

# ============================================
# 5. Vérifier .next/
# ============================================
Write-Host "📂 Checking build output..." -ForegroundColor Yellow

if (Test-Path ".next") {
    $NextSize = (Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "✅ .next/ directory: $([math]::Round($NextSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "❌ .next/ directory not found" -ForegroundColor Red
    $ErrorCount++
}

Write-Host ""

# ============================================
# 6. Vérifier console.log (optionnel)
# ============================================
Write-Host "🔍 Checking for console.log..." -ForegroundColor Yellow

$ConsoleLogFiles = Get-ChildItem -Path "app", "components", "lib" -Recurse -Filter "*.tsx", "*.ts" -ErrorAction SilentlyContinue | 
    Select-String -Pattern "console\.log" | 
    Select-Object -First 10

if ($ConsoleLogFiles) {
    Write-Host "⚠️ console.log found in:" -ForegroundColor Yellow
    $ConsoleLogFiles | ForEach-Object {
        Write-Host "  - $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
    }
    $WarningCount++
} else {
    Write-Host "✅ No console.log found" -ForegroundColor Green
}

Write-Host ""

# ============================================
# RÉSUMÉ
# ============================================
$EndTime = Get-Date
$TotalDuration = ($EndTime - $StartTime).TotalSeconds

Write-Host "=========================" -ForegroundColor Cyan
Write-Host "📊 RÉSUMÉ BUILD CHECK" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total time: $([math]::Round($TotalDuration, 2))s" -ForegroundColor White
Write-Host "Errors: $ErrorCount" -ForegroundColor $(if ($ErrorCount -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $WarningCount" -ForegroundColor $(if ($WarningCount -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($ErrorCount -eq 0) {
    Write-Host "✅ BUILD CHECK PASSED" -ForegroundColor Green
    Write-Host "Ready for QA ✨" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ BUILD CHECK FAILED" -ForegroundColor Red
    Write-Host "Fix errors before proceeding to QA" -ForegroundColor Red
    exit 1
}
