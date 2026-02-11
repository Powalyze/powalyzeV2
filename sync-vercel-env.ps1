# Script de synchronisation des variables d'environnement Vercel
# Lit .env.local et ajoute toutes les variables à Vercel Production

Write-Host "`n🔧 SYNCHRONISATION VERCEL ENVIRONMENT VARIABLES`n" -ForegroundColor Cyan

# Lire le fichier .env.local
$envContent = Get-Content .env.local -Raw

# Extraire les variables
$vars = @{}
$envContent -split "`n" | ForEach-Object {
    if ($_ -match '^([^=]+)=(.+)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $vars[$key] = $value
    }
}

Write-Host "Variables trouvées dans .env.local:" -ForegroundColor Green
$vars.Keys | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }

Write-Host "`n🚀 Ajout des variables à Vercel Production...`n" -ForegroundColor Yellow

# Ajouter chaque variable à Vercel
foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    Write-Host "Ajout de $key..." -ForegroundColor Cyan
    
    # Utiliser echo pour passer la valeur via stdin
    $value | vercel env add $key production --force 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $key ajouté" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Erreur pour $key" -ForegroundColor Red
    }
}

Write-Host "`n✅ Synchronisation terminée !`n" -ForegroundColor Green
Write-Host "Vérifiez sur: https://vercel.com/powalyzes-projects/powalyze/settings/environment-variables`n" -ForegroundColor Blue
