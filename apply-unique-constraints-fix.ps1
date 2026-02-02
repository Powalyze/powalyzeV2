# ============================================
# Script d'application du fix UNIQUE constraints
# ============================================
# Usage: .\apply-unique-constraints-fix.ps1
# ============================================

Write-Host "🔧 FIX: Application des contraintes UNIQUE manquantes" -ForegroundColor Cyan
Write-Host ""

# Lire le fichier SQL
$sqlFile = "database/schema-fix-unique-constraints.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ ERREUR: Fichier $sqlFile introuvable" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $sqlFile -Raw

Write-Host "📄 Fichier SQL chargé: $sqlFile" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  INSTRUCTIONS D'APPLICATION" -ForegroundColor Yellow
Write-Host ""
Write-Host "ÉTAPE 1 - Ouvrir le SQL Editor Supabase:" -ForegroundColor Cyan
Write-Host "  1. Aller sur https://supabase.com/dashboard"
Write-Host "  2. Sélectionner votre projet Powalyze"
Write-Host "  3. Cliquer sur 'SQL Editor' dans la barre latérale"
Write-Host "  4. Cliquer 'New Query'"
Write-Host ""
Write-Host "ÉTAPE 2 - Copier/coller le SQL ci-dessous:" -ForegroundColor Cyan
Write-Host ""

# Afficher le SQL dans la console pour copier/coller facile
Write-Host "📋 SQL À COPIER (appuyez sur Ctrl+C pour arrêter l'affichage):" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor DarkGray
Write-Host $sqlContent -ForegroundColor White
Write-Host "======================================" -ForegroundColor DarkGray
Write-Host ""

Write-Host "ÉTAPE 3 - Exécuter:" -ForegroundColor Cyan
Write-Host "  1. Coller le SQL dans l'éditeur Supabase"
Write-Host "  2. Cliquer 'Run' (ou F5)"
Write-Host "  3. Vérifier que le message de succès apparaît"
Write-Host ""

Write-Host "ÉTAPE 4 - Vérifier que ça a fonctionné:" -ForegroundColor Cyan
Write-Host "  Dans le même SQL Editor, exécutez:"
Write-Host ""
Write-Host "  SELECT * FROM project_predictions LIMIT 1;" -ForegroundColor White
Write-Host ""
Write-Host "  Si aucune erreur → ✅ Fix réussi !" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Pour plus de détails, consultez:" -ForegroundColor Yellow
Write-Host "   database/FIX-UNIQUE-CONSTRAINTS.md"
Write-Host ""
