# Script de déploiement Vercel - Correction complète
Write-Host "🚀 Démarrage du processus de déploiement Vercel" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Vérifier que le build fonctionne localement
Write-Host "📦 Étape 1: Vérification du build local..." -ForegroundColor Yellow
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build local réussi" -ForegroundColor Green
} else {
    Write-Host "❌ Échec du build local - Arrêt" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Étape 2: Nettoyage de la configuration Vercel..." -ForegroundColor Yellow

# Supprimer les configurations Vercel corrompues
Remove-Item -Path ".\.vercel" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\com.vercel.cli" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\.vercel" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Configuration nettoyée" -ForegroundColor Green
Write-Host ""

# Étape 3: Déploiement
Write-Host "🌐 Étape 3: Déploiement sur Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Choisissez les options suivantes:" -ForegroundColor Cyan
Write-Host "  - Setup project? Y" -ForegroundColor White
Write-Host "  - Scope: powalyzes-projects" -ForegroundColor White  
Write-Host "  - Link to existing project? Y" -ForegroundColor White
Write-Host "  - Project name: powalyze-v2" -ForegroundColor White
Write-Host "  - Override settings? N" -ForegroundColor White
Write-Host ""

# Lancer le déploiement interactif
npx vercel@latest --prod

Write-Host ""
Write-Host "📋 Étape 4: Variables d'environnement à vérifier sur Vercel Dashboard" -ForegroundColor Yellow
Write-Host "   URL: https://vercel.com/powalyzes-projects/powalyze-v2/settings/environment-variables"
Write-Host ""
Write-Host "   Variables requises (Production):" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL = https://pqsgdwfsdnmozzoynefw.supabase.co" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi..." -ForegroundColor Gray
Write-Host ""
