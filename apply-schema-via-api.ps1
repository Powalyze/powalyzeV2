# Script pour appliquer le schéma via l'API Supabase
$supabaseUrl = "https://pqsgdwfsdnmozzoynefw.supabase.co"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU"

# Lire le schéma SQL
$schema = Get-Content -Path "supabase\schema.sql" -Raw

Write-Host "📊 Application du schéma sur Supabase..." -ForegroundColor Cyan

# Note: L'API REST Supabase ne permet pas d'exécuter du SQL brut pour des raisons de sécurité
# Il faut utiliser le SQL Editor dans le dashboard Supabase ou l'outil CLI

Write-Host ""
Write-Host "⚠️  Pour appliquer le schéma, vous devez :" -ForegroundColor Yellow
Write-Host "1. Aller sur: https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw/editor/sql" -ForegroundColor White
Write-Host "2. Créer une nouvelle requête SQL" -ForegroundColor White
Write-Host "3. Copier-coller le contenu de supabase\schema.sql" -ForegroundColor White
Write-Host "4. Cliquer sur 'Run'" -ForegroundColor White
Write-Host ""
Write-Host "Ou utilisez la commande:" -ForegroundColor Yellow
Write-Host "npx supabase db push" -ForegroundColor Cyan
Write-Host ""

# Alternative: Ouvrir le fichier dans le navigateur
Write-Host "Voulez-vous ouvrir le SQL Editor dans votre navigateur? (O/N)" -ForegroundColor Green
$response = Read-Host
if ($response -eq "O" -or $response -eq "o") {
    Start-Process "https://supabase.com/dashboard/project/pqsgdwfsdnmozzoynefw/editor/sql"
}
