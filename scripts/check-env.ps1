# ============================================
# check-env.ps1
# Vérifie les variables d'environnement
# ============================================

param(
    [switch]$Verbose = $false,
    [ValidateSet("demo", "prod")]
    [string]$Mode = "demo"
)

Write-Host "🔍 PACK 5 - Environment Check" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor White
Write-Host ""

# Variables
$ErrorCount = 0
$WarningCount = 0

# ============================================
# 1. Vérifier fichiers .env
# ============================================
Write-Host "📂 Checking .env files..." -ForegroundColor Yellow

$EnvFiles = @(".env.local", ".env.production", ".env")

foreach ($envFile in $EnvFiles) {
    if (Test-Path $envFile) {
        Write-Host "✅ Found: $envFile" -ForegroundColor Green
    }
}

if (!(Test-Path ".env.local")) {
    Write-Host "⚠️ .env.local not found. Using default values." -ForegroundColor Yellow
    $WarningCount++
}

Write-Host ""

# ============================================
# 2. Charger variables d'environnement
# ============================================
Write-Host "🔧 Loading environment variables..." -ForegroundColor Yellow

$EnvVars = @{}

if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            $EnvVars[$key] = $value
        }
    }
}

Write-Host "Loaded $($EnvVars.Count) variables" -ForegroundColor White
Write-Host ""

# ============================================
# 3. Variables DEMO mode (optionnelles)
# ============================================
if ($Mode -eq "demo") {
    Write-Host "🎭 DEMO MODE - Optional variables" -ForegroundColor Yellow
    Write-Host "No Supabase required for DEMO mode" -ForegroundColor White
    Write-Host "✅ DEMO mode ready" -ForegroundColor Green
    Write-Host ""
}

# ============================================
# 4. Variables PROD mode (obligatoires)
# ============================================
if ($Mode -eq "prod") {
    Write-Host "🚀 PROD MODE - Required variables" -ForegroundColor Yellow
    Write-Host ""

    # Supabase
    Write-Host "📊 Supabase Configuration:" -ForegroundColor Cyan
    
    $SupabaseVars = @(
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY"
    )

    foreach ($var in $SupabaseVars) {
        if ($EnvVars.ContainsKey($var)) {
            $value = $EnvVars[$var]
            if ($value -and $value.Length -gt 0) {
                $maskedValue = $value.Substring(0, [Math]::Min(10, $value.Length)) + "***"
                Write-Host "  ✅ $var = $maskedValue" -ForegroundColor Green
            } else {
                Write-Host "  ❌ $var is empty" -ForegroundColor Red
                $ErrorCount++
            }
        } else {
            Write-Host "  ❌ $var not found" -ForegroundColor Red
            $ErrorCount++
        }
    }
    Write-Host ""

    # OpenAI / Azure OpenAI
    Write-Host "🤖 AI Configuration:" -ForegroundColor Cyan
    
    $hasOpenAI = $EnvVars.ContainsKey("OPENAI_API_KEY") -and $EnvVars["OPENAI_API_KEY"]
    $hasAzureOpenAI = $EnvVars.ContainsKey("AZURE_OPENAI_API_KEY") -and $EnvVars["AZURE_OPENAI_API_KEY"]

    if ($hasOpenAI) {
        $key = $EnvVars["OPENAI_API_KEY"]
        $maskedKey = $key.Substring(0, [Math]::Min(10, $key.Length)) + "***"
        Write-Host "  ✅ OPENAI_API_KEY = $maskedKey" -ForegroundColor Green
    } elseif ($hasAzureOpenAI) {
        $key = $EnvVars["AZURE_OPENAI_API_KEY"]
        $maskedKey = $key.Substring(0, [Math]::Min(10, $key.Length)) + "***"
        Write-Host "  ✅ AZURE_OPENAI_API_KEY = $maskedKey" -ForegroundColor Green
        
        # Vérifier autres vars Azure OpenAI
        $azureVars = @("AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_DEPLOYMENT_NAME")
        foreach ($var in $azureVars) {
            if ($EnvVars.ContainsKey($var)) {
                Write-Host "  ✅ $var configured" -ForegroundColor Green
            } else {
                Write-Host "  ❌ $var missing" -ForegroundColor Red
                $ErrorCount++
            }
        }
    } else {
        Write-Host "  ⚠️ No AI configuration found (OpenAI or Azure OpenAI)" -ForegroundColor Yellow
        $WarningCount++
    }
    Write-Host ""

    # JWT Secret
    Write-Host "🔐 Authentication:" -ForegroundColor Cyan
    
    if ($EnvVars.ContainsKey("JWT_SECRET")) {
        $secret = $EnvVars["JWT_SECRET"]
        if ($secret -eq "change-in-production") {
            Write-Host "  ⚠️ JWT_SECRET is default value. Change in production!" -ForegroundColor Yellow
            $WarningCount++
        } elseif ($secret.Length -lt 32) {
            Write-Host "  ⚠️ JWT_SECRET too short (< 32 chars)" -ForegroundColor Yellow
            $WarningCount++
        } else {
            Write-Host "  ✅ JWT_SECRET configured" -ForegroundColor Green
        }
    } else {
        Write-Host "  ❌ JWT_SECRET not found" -ForegroundColor Red
        $ErrorCount++
    }
    Write-Host ""
}

# ============================================
# 5. Power BI (optionnel)
# ============================================
Write-Host "📊 Power BI Configuration (optional):" -ForegroundColor Cyan

$PowerBIVars = @(
    "POWERBI_CLIENT_ID",
    "POWERBI_CLIENT_SECRET",
    "POWERBI_TENANT_ID"
)

$PowerBICount = 0
foreach ($var in $PowerBIVars) {
    if ($EnvVars.ContainsKey($var) -and $EnvVars[$var]) {
        $PowerBICount++
    }
}

if ($PowerBICount -eq $PowerBIVars.Count) {
    Write-Host "  ✅ Power BI fully configured" -ForegroundColor Green
} elseif ($PowerBICount -gt 0) {
    Write-Host "  ⚠️ Power BI partially configured ($PowerBICount/$($PowerBIVars.Count))" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "  ℹ️ Power BI not configured (optional)" -ForegroundColor Gray
}

Write-Host ""

# ============================================
# 6. Vérifier Vercel CLI (si déploiement)
# ============================================
Write-Host "☁️ Checking Vercel CLI..." -ForegroundColor Yellow

$VercelVersion = vercel --version 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Vercel CLI installed: $($VercelVersion.Trim())" -ForegroundColor Green
} else {
    Write-Host "⚠️ Vercel CLI not installed. Run: npm i -g vercel" -ForegroundColor Yellow
    $WarningCount++
}

Write-Host ""

# ============================================
# 7. Verbose: Afficher toutes les variables
# ============================================
if ($Verbose) {
    Write-Host "📋 All environment variables:" -ForegroundColor Cyan
    $EnvVars.GetEnumerator() | Sort-Object Name | ForEach-Object {
        $key = $_.Key
        $value = $_.Value
        if ($value.Length -gt 50) {
            $value = $value.Substring(0, 50) + "..."
        }
        Write-Host "  $key = $value" -ForegroundColor Gray
    }
    Write-Host ""
}

# ============================================
# RÉSUMÉ
# ============================================
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "📊 RÉSUMÉ ENVIRONMENT CHECK" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Mode: $Mode" -ForegroundColor White
Write-Host "Errors: $ErrorCount" -ForegroundColor $(if ($ErrorCount -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $WarningCount" -ForegroundColor $(if ($WarningCount -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($ErrorCount -eq 0) {
    Write-Host "✅ ENVIRONMENT CHECK PASSED" -ForegroundColor Green
    if ($Mode -eq "demo") {
        Write-Host "Ready for DEMO mode ✨" -ForegroundColor Green
    } else {
        Write-Host "Ready for PROD deployment ✨" -ForegroundColor Green
    }
    exit 0
} else {
    Write-Host "❌ ENVIRONMENT CHECK FAILED" -ForegroundColor Red
    Write-Host "Fix errors before deployment" -ForegroundColor Red
    exit 1
}
