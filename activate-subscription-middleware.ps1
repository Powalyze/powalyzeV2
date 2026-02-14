# PowerShell Script to activate subscription middleware
# Usage: .\activate-subscription-middleware.ps1

Write-Host "🔐 Activation du middleware subscription" -ForegroundColor Cyan
Write-Host ""

# Check if files exist
if (-not (Test-Path "middleware.ts")) {
    Write-Host "❌ middleware.ts introuvable" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "middleware-subscription.ts")) {
    Write-Host "❌ middleware-subscription.ts introuvable" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichiers trouvés" -ForegroundColor Green
Write-Host ""

# Backup existing middleware
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "middleware-backup-$timestamp.ts"

Write-Host "📦 Création backup: $backupFile" -ForegroundColor Yellow
Copy-Item "middleware.ts" $backupFile
Write-Host "✅ Backup créé" -ForegroundColor Green
Write-Host ""

# Show diff preview
Write-Host "📊 Comparaison des middlewares:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ancien middleware (middleware.ts):" -ForegroundColor Yellow
$oldContent = Get-Content "middleware.ts" -TotalCount 10
$oldContent | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
Write-Host "  ..." -ForegroundColor Gray
Write-Host ""

Write-Host "Nouveau middleware (middleware-subscription.ts):" -ForegroundColor Green
$newContent = Get-Content "middleware-subscription.ts" -TotalCount 10
$newContent | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
Write-Host "  ..." -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  ATTENTION: Cette opération va:" -ForegroundColor Yellow
Write-Host "   1. Sauvegarder middleware.ts actuel → $backupFile" -ForegroundColor White
Write-Host "   2. Remplacer middleware.ts par middleware-subscription.ts" -ForegroundColor White
Write-Host "   3. Activer la protection des routes Pro" -ForegroundColor White
Write-Host ""
Write-Host "Impact:" -ForegroundColor Yellow
Write-Host "   ✅ Users avec subscription active → Accès normal" -ForegroundColor Green
Write-Host "   ⚠️  Users sans subscription → Redirect vers /pricing" -ForegroundColor Yellow
Write-Host "   ⚠️  Routes protégées: /cockpit/projets, /cockpit/risques, etc." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continuer? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Opération annulée." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔄 Remplacement du middleware..." -ForegroundColor Cyan

try {
    Copy-Item "middleware-subscription.ts" "middleware.ts" -Force
    Write-Host "✅ Middleware remplacé avec succès!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "   1. Vérifier que middleware.ts a bien été modifié" -ForegroundColor White
    Write-Host "   2. Tester en local: npm run dev" -ForegroundColor White
    Write-Host "   3. Builder: npm run build" -ForegroundColor White
    Write-Host "   4. Déployer: vercel --prod" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🧪 Test recommandé après déploiement:" -ForegroundColor Yellow
    Write-Host "   - User sans subscription essaie /cockpit/projets" -ForegroundColor White
    Write-Host "   - Devrait rediriger vers /pricing" -ForegroundColor White
    Write-Host ""
    
    Write-Host "⚠️  En cas de problème:" -ForegroundColor Yellow
    Write-Host "   Restaurer le backup:" -ForegroundColor White
    Write-Host "   cp $backupFile middleware.ts" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "✨ Middleware activé avec succès!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors du remplacement" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Restauration du backup..." -ForegroundColor Yellow
    Copy-Item $backupFile "middleware.ts" -Force
    Write-Host "✅ Backup restauré" -ForegroundColor Green
    exit 1
}

Write-Host ""
Write-Host "Fichiers créés:" -ForegroundColor Gray
Write-Host "  - $backupFile (backup ancien middleware)" -ForegroundColor Gray
Write-Host "  - middleware.ts (nouveau avec protection subscription)" -ForegroundColor Gray
Write-Host ""
