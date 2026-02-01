# Script pour exécuter la migration SQL via l'API Supabase
$supabaseUrl = "https://pqsgdwfsdnmozzoynefw.supabase.co"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU"

Write-Host "📊 Exécution de la migration SQL sur Supabase..." -ForegroundColor Cyan

# Lire le fichier SQL
$sqlContent = Get-Content -Path "database\migration-minimal.sql" -Raw

Write-Host ""
Write-Host "⚠️  L'API REST Supabase ne permet pas d'exécuter du SQL brut." -ForegroundColor Yellow
Write-Host ""
Write-Host "Options disponibles:" -ForegroundColor Green
Write-Host ""
Write-Host "Option 1: SQL Editor (Dashboard Supabase)" -ForegroundColor Cyan
Write-Host "  1. Copier le contenu de database\migration-minimal.sql" -ForegroundColor White
Write-Host "  2. Aller sur: https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw/editor/sql" -ForegroundColor White
Write-Host "  3. Créer une nouvelle requête et
 coller le SQL" -ForegroundColor White
Write-Host "  4. Cliquer sur 'Run'" -ForegroundColor White
Write-Host ""

Write-Host "Option 2: Supabase CLI" -ForegroundColor Cyan
Write-Host "  1. Installer Supabase CLI: npm install -g supabase" -ForegroundColor White
Write-Host "  2. Se connecter: npx supabase login" -ForegroundColor White
Write-Host "  3. Lier le projet: npx supabase link --project-ref pqsgdwfsdnmozzoynefw" -ForegroundColor White
Write-Host "  4. Exécuter: npx supabase db execute --file database\migration-minimal.sql" -ForegroundColor White
Write-Host ""

Write-Host "Option 3: PostgreSQL Client (psql)" -ForegroundColor Cyan
Write-Host "  1. Installer PostgreSQL depuis: https://www.postgresql.org/download/" -ForegroundColor White
Write-Host "  2. Exécuter: " -ForegroundColor White
Write-Host "     `$env:PGPASSWORD='$serviceKey'; psql -h db.pqsgdwfsdnmozzoynefw.supabase.co -U postgres -d postgres -f database\migration-minimal.sql" -ForegroundColor Gray
Write-Host ""

Write-Host "Voulez-vous ouvrir le SQL Editor dans le navigateur? (O/N)" -ForegroundColor Green
$response = Read-Host

if ($response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
    Write-Host "Ouverture du SQL Editor..." -ForegroundColor Cyan
    Start-Process "https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw/editor/sql"
    Write-Host ""
    Write-Host "📋 Contenu SQL copié dans le presse-papiers!" -ForegroundColor Green
    Set-Clipboard -Value $sqlContent
    Write-Host "Vous pouvez maintenant coller (Ctrl+V) dans le SQL Editor" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Script terminé" -ForegroundColor Green
