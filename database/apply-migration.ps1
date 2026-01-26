# ============================================================================
# SCRIPT D'APPLICATION DE LA MIGRATION SQL - SUPABASE
# ============================================================================
# Ce script applique la migration 002_roles_and_rls.sql sur Supabase
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "POWALYZE - Migration Rôles & RLS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Vérifier que le fichier SQL existe
$migrationFile = "database/migrations/002_roles_and_rls.sql"
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Erreur: Fichier $migrationFile introuvable" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichier de migration trouvé: $migrationFile`n" -ForegroundColor Green

# Afficher les options
Write-Host "CHOISISSEZ VOTRE ACTION:" -ForegroundColor Yellow
Write-Host "  1. Afficher le contenu de la migration (preview)"
Write-Host "  2. Copier le SQL dans le presse-papiers"
Write-Host "  3. Ouvrir Supabase SQL Editor"
Write-Host "  4. Annuler`n"

$choice = Read-Host "Votre choix (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`n📄 CONTENU DE LA MIGRATION:" -ForegroundColor Cyan
        Write-Host "================================`n" -ForegroundColor Cyan
        Get-Content $migrationFile | Write-Host -ForegroundColor White
        Write-Host "`n================================" -ForegroundColor Cyan
        Write-Host "✅ Preview terminé" -ForegroundColor Green
    }
    "2" {
        $sqlContent = Get-Content $migrationFile -Raw
        Set-Clipboard -Value $sqlContent
        Write-Host "`n✅ SQL copié dans le presse-papiers!" -ForegroundColor Green
        Write-Host "`nProchaines étapes:" -ForegroundColor Yellow
        Write-Host "  1. Ouvrir Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
        Write-Host "  2. Aller dans SQL Editor" -ForegroundColor White
        Write-Host "  3. Coller le SQL (Ctrl+V)" -ForegroundColor White
        Write-Host "  4. Exécuter (Run/F5)" -ForegroundColor White
    }
    "3" {
        Write-Host "`n🌐 Ouverture de Supabase Dashboard..." -ForegroundColor Cyan
        Start-Process "https://supabase.com/dashboard"
        
        $sqlContent = Get-Content $migrationFile -Raw
        Set-Clipboard -Value $sqlContent
        Write-Host "✅ SQL également copié dans le presse-papiers" -ForegroundColor Green
        
        Write-Host "`nProchaines étapes:" -ForegroundColor Yellow
        Write-Host "  1. Sélectionner votre projet Powalyze" -ForegroundColor White
        Write-Host "  2. Aller dans 'SQL Editor'" -ForegroundColor White
        Write-Host "  3. Coller le SQL (Ctrl+V)" -ForegroundColor White
        Write-Host "  4. Exécuter (bouton 'Run' ou F5)" -ForegroundColor White
    }
    "4" {
        Write-Host "`n⚠️ Opération annulée" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "`n❌ Choix invalide" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "⚠️ VÉRIFICATIONS POST-MIGRATION" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Après avoir exécuté la migration, vérifiez:" -ForegroundColor White
Write-Host "  ✅ Colonne 'role' ajoutée dans la table 'profiles'" -ForegroundColor White
Write-Host "  ✅ Tables demo_* créées (demo_projects, demo_risks, demo_decisions)" -ForegroundColor White
Write-Host "  ✅ RLS activé sur toutes les tables" -ForegroundColor White
Write-Host "  ✅ Policies créées et actives" -ForegroundColor White
Write-Host "`n========================================`n" -ForegroundColor Cyan

Write-Host "✅ Script terminé avec succès!" -ForegroundColor Green
