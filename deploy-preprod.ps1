# PowerShell Script to deploy to Vercel Pre-production
# Usage: .\deploy-preprod.ps1

Write-Host "🚀 Déploiement Powalyze - Mode Tarifs Pro/Entreprise (Pré-production)" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host "✅ Vercel CLI found" -ForegroundColor Green
Write-Host ""

# Build locally first to check for errors
Write-Host "🔨 Building locally to verify..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Local build successful" -ForegroundColor Green
Write-Host ""

# Ask for confirmation
Write-Host "⚠️  ATTENTION: This will deploy to a SEPARATE Vercel project (pre-prod)" -ForegroundColor Yellow
Write-Host "   Production (powalyze.com) will NOT be affected" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continue? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Deployment cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚢 Deploying to Vercel (pre-production)..." -ForegroundColor Cyan
Write-Host ""

# Deploy to Vercel
# Note: First time will ask to link project or create new one
# Choose: Create new project → Name it "powalyze-preprod"
vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Copy the deployment URL above" -ForegroundColor White
    Write-Host "  2. Test /pricing page" -ForegroundColor White
    Write-Host "  3. Test enterprise request form" -ForegroundColor White
    Write-Host "  4. Test API endpoints" -ForegroundColor White
    Write-Host "  5. Validate with Product Owner" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Don't forget to:" -ForegroundColor Yellow
    Write-Host "  - Apply database/subscriptions-schema.sql to Supabase" -ForegroundColor White
    Write-Host "  - Configure environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Check errors above." -ForegroundColor Red
    exit 1
}
