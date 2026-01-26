# ====================================================================
# SCRIPT DE MIGRATION: CORRECTION INVERSION DEMO/PRO
# ====================================================================
# Objectif: Exécuter la migration SQL pour déplacer les données
#           de 'projects' vers 'demo_projects' et vider PRO
# ====================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MIGRATION DEMO/PRO - CORRECTION INVERSION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Vérifier que psql est installé
$psqlExists = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlExists) {
    Write-Host "❌ ERREUR: psql n'est pas installé ou non accessible dans le PATH" -ForegroundColor Red
    Write-Host "`nInstallation PostgreSQL requise:" -ForegroundColor Yellow
    Write-Host "  - Télécharger depuis: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "  - Ou installer via Chocolatey: choco install postgresql" -ForegroundColor Yellow
    exit 1
}

# Charger les variables d'environnement depuis .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "📄 Lecture de $envFile..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Host "⚠️ Fichier $envFile introuvable, utilisation des variables système" -ForegroundColor Yellow
}

# Récupérer l'URL Supabase
$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseServiceKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl) {
    Write-Host "❌ ERREUR: NEXT_PUBLIC_SUPABASE_URL non défini" -ForegroundColor Red
    exit 1
}

# Extraire le PROJECT_REF depuis l'URL
# Format: https://PROJECT_REF.supabase.co
if ($supabaseUrl -match 'https://([^.]+)\.supabase\.co') {
    $projectRef = $matches[1]
    Write-Host "✅ Project Ref détecté: $projectRef" -ForegroundColor Green
} else {
    Write-Host "❌ Format d'URL Supabase invalide: $supabaseUrl" -ForegroundColor Red
    exit 1
}

# Construire la chaîne de connexion PostgreSQL Supabase
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
Write-Host "`n⚠️  ATTENTION: Mot de passe de la base de données requis" -ForegroundColor Yellow
Write-Host "Entrez le mot de passe 'postgres' de votre projet Supabase:" -ForegroundColor Yellow
Write-Host "(Disponible dans: Supabase Dashboard → Settings → Database → Connection string)" -ForegroundColor Gray

$securePassword = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$connectionString = "postgresql://postgres:$password@db.$projectRef.supabase.co:5432/postgres"

Write-Host "`n📊 Informations de connexion:" -ForegroundColor Cyan
Write-Host "  Host: db.$projectRef.supabase.co" -ForegroundColor Gray
Write-Host "  Port: 5432" -ForegroundColor Gray
Write-Host "  Database: postgres" -ForegroundColor Gray
Write-Host "  User: postgres" -ForegroundColor Gray

# Confirmation avant exécution
Write-Host "`n⚠️  AVERTISSEMENT: Cette migration va:" -ForegroundColor Yellow
Write-Host "  1. Copier tous les projets de 'projects' vers 'demo_projects'" -ForegroundColor Yellow
Write-Host "  2. Copier tous les risques, décisions, anomalies, rapports, connecteurs vers demo_*" -ForegroundColor Yellow
Write-Host "  3. VIDER toutes les tables PRO (projects, risks, decisions, anomalies, reports, connectors)" -ForegroundColor Yellow
Write-Host "`nCette opération est IRRÉVERSIBLE sans backup." -ForegroundColor Red

$confirmation = Read-Host "`nTaper 'OUI' pour continuer, ou 'NON' pour annuler"

if ($confirmation -ne "OUI") {
    Write-Host "`n❌ Migration annulée par l'utilisateur." -ForegroundColor Red
    exit 0
}

# Exécuter la migration
Write-Host "`n🚀 Exécution de la migration SQL..." -ForegroundColor Green

$sqlFile = "database\migrate-demo-pro-fix.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier SQL introuvable: $sqlFile" -ForegroundColor Red
    exit 1
}

# Exécuter psql
$env:PGPASSWORD = $password
psql $connectionString -f $sqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ MIGRATION RÉUSSIE!" -ForegroundColor Green
    Write-Host "`n📊 Vérification des résultats:" -ForegroundColor Cyan
    
    # Afficher un résumé
    $verifyQuery = @"
SELECT 'demo_projects' as table_name, COUNT(*) as count FROM demo_projects
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'demo_risks', COUNT(*) FROM demo_risks
UNION ALL SELECT 'risks', COUNT(*) FROM risks;
"@
    
    psql $connectionString -c $verifyQuery
    
    Write-Host "`n✅ État attendu:" -ForegroundColor Green
    Write-Host "  - demo_projects: ~12 projets (données DEMO)" -ForegroundColor Gray
    Write-Host "  - projects: 0 projet (PRO vierge)" -ForegroundColor Gray
    Write-Host "  - demo_risks: N risques (données DEMO)" -ForegroundColor Gray
    Write-Host "  - risks: 0 risque (PRO vierge)" -ForegroundColor Gray
    
} else {
    Write-Host "`n❌ ERREUR lors de la migration (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "Vérifiez les logs ci-dessus pour plus de détails." -ForegroundColor Yellow
    exit 1
}

# Nettoyage
$env:PGPASSWORD = $null

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "MIGRATION TERMINÉE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
