# Script de configuration de la clé OpenAI pour Powalyze
# Corrige l'erreur "Invalid API key" pour les fonctions IA

$ErrorActionPreference = "Stop"

Write-Host "
╔═══════════════════════════════════════════════════════════╗
║  🤖 Configuration OpenAI API Key                          ║
║  Active les fonctions IA de Powalyze                      ║
╚═══════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Fonction pour valider le format de la clé OpenAI
function Test-OpenAIKey {
    param([string]$Key)
    
    if ([string]::IsNullOrWhiteSpace($Key)) {
        return $false
    }
    
    # OpenAI keys start with sk- or sk-proj-
    if ($Key -match '^sk-[a-zA-Z0-9\-_]{20,}$') {
        return $true
    }
    
    return $false
}

# Vérifier la configuration actuelle
Write-Host "🔍 Vérification de la configuration actuelle..." -ForegroundColor Yellow
Write-Host ""

$envFilePath = ".\.env.local"
$currentKey = ""

if (Test-Path $envFilePath) {
    $envContent = Get-Content $envFilePath -Raw
    if ($envContent -match 'OPENAI_API_KEY=(.*)') {
        $currentKey = $matches[1].Trim()
    }
}

if ($currentKey -eq "sk-proj-VOTRE_VRAIE_CLE_ICI" -or [string]::IsNullOrWhiteSpace($currentKey)) {
    Write-Host "❌ Clé OpenAI non configurée (placeholder détecté)" -ForegroundColor Red
} else {
    Write-Host "✅ Clé OpenAI détectée : $($currentKey.Substring(0, 15))..." -ForegroundColor Green
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""

# Demander où configurer la clé
Write-Host "📍 Où voulez-vous configurer la clé OpenAI ?" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1 - Développement local (.env.local)" -ForegroundColor White
Write-Host "  2 - Production Vercel (environnements cloud)" -ForegroundColor White
Write-Host "  3 - Les deux (local + Vercel)" -ForegroundColor White
Write-Host "  4 - Annuler" -ForegroundColor DarkGray
Write-Host ""

$choice = Read-Host "Votre choix (1-4)"

if ($choice -eq "4") {
    Write-Host "❌ Opération annulée." -ForegroundColor Red
    exit 0
}

# Demander la clé OpenAI
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "🔑 Obtenir une clé OpenAI :" -ForegroundColor Yellow
Write-Host "  1. Aller sur: https://platform.openai.com/api-keys" -ForegroundColor Cyan
Write-Host "  2. Se connecter (créer un compte si nécessaire)" -ForegroundColor Cyan
Write-Host "  3. Cliquer sur 'Create new secret key'" -ForegroundColor Cyan
Write-Host "  4. Copier la clé (commence par sk-proj- ou sk-)" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  La clé ne sera affichée qu'une seule fois !" -ForegroundColor Yellow
Write-Host ""

$apiKey = Read-Host "Entrez votre clé OpenAI (ou Entrée pour annuler)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ Aucune clé fournie. Annulation." -ForegroundColor Red
    exit 1
}

# Valider le format
if (-not (Test-OpenAIKey $apiKey)) {
    Write-Host ""
    Write-Host "⚠️  Format de clé invalide !" -ForegroundColor Yellow
    Write-Host "Les clés OpenAI commencent par 'sk-' ou 'sk-proj-'" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continuer quand même ? (o/N)"
    if ($continue -ne "o" -and $continue -ne "O") {
        Write-Host "❌ Annulé." -ForegroundColor Red
        exit 1
    }
}

# Configuration locale
if ($choice -eq "1" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "═══ Configuration locale (.env.local) ═══" -ForegroundColor Magenta
    
    if (-not (Test-Path $envFilePath)) {
        Write-Host "❌ Fichier .env.local introuvable !" -ForegroundColor Red
        Write-Host "Créez le fichier d'abord ou exécutez ce script depuis c:\powalyze\" -ForegroundColor Yellow
        exit 1
    }
    
    $envContent = Get-Content $envFilePath -Raw
    
    # Remplacer ou ajouter OPENAI_API_KEY
    if ($envContent -match 'OPENAI_API_KEY=.*') {
        $envContent = $envContent -replace 'OPENAI_API_KEY=.*', "OPENAI_API_KEY=$apiKey"
        Write-Host "  ✅ Clé OpenAI mise à jour" -ForegroundColor Green
    } else {
        $envContent += "`nOPENAI_API_KEY=$apiKey`n"
        Write-Host "  ✅ Clé OpenAI ajoutée" -ForegroundColor Green
    }
    
    Set-Content -Path $envFilePath -Value $envContent -NoNewline
    
    Write-Host ""
    Write-Host "  🔄 Redémarrez le serveur de développement :" -ForegroundColor Yellow
    Write-Host "     npm run dev" -ForegroundColor Cyan
}

# Configuration Vercel
if ($choice -eq "2" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "═══ Configuration Vercel (Production) ═══" -ForegroundColor Magenta
    Write-Host ""
    
    # Vérifier si Vercel CLI est disponible
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
    if (-not $vercelInstalled) {
        Write-Host "❌ Vercel CLI non installé !" -ForegroundColor Red
        Write-Host ""
        Write-Host "Installer avec : npm i -g vercel" -ForegroundColor Yellow
        Write-Host "Ou configurer manuellement via : https://vercel.com" -ForegroundColor Cyan
        exit 1
    }
    
    $environments = @("production", "preview", "development")
    
    foreach ($env in $environments) {
        Write-Host "  🔹 Environnement: $env" -ForegroundColor Cyan
        
        # Supprimer l'ancienne clé (ignorer les erreurs)
        vercel env rm OPENAI_API_KEY $env --yes 2>$null | Out-Null
        
        # Ajouter la nouvelle clé
        $apiKey | vercel env add OPENAI_API_KEY $env | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✅ Configuré" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️  Erreur" -ForegroundColor Yellow
        }
        
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host ""
    Write-Host "  🚀 Redéploiement nécessaire..." -ForegroundColor Yellow
    $deploy = Read-Host "  Redéployer maintenant ? (o/N)"
    
    if ($deploy -eq "o" -or $deploy -eq "O") {
        Write-Host ""
        Write-Host "  🚀 Déploiement en cours..." -ForegroundColor Cyan
        npx vercel --prod --yes
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "  ✅ Déploiement réussi !" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "  ❌ Erreur lors du déploiement" -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "  ℹ️  Pensez à redéployer manuellement :" -ForegroundColor Yellow
        Write-Host "     npx vercel --prod --yes" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "🎉 Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Tests à effectuer :" -ForegroundColor Yellow

if ($choice -eq "1" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "  Local:" -ForegroundColor Cyan
    Write-Host "  1. Redémarrer : npm run dev" -ForegroundColor White
    Write-Host "  2. Tester : http://localhost:3000/api/debug/check-keys" -ForegroundColor White
    Write-Host "  3. Utiliser IA : http://localhost:3000/committee-prep" -ForegroundColor White
}

if ($choice -eq "2" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "  Production:" -ForegroundColor Cyan
    Write-Host "  1. Vérifier : https://www.powalyze.com/api/debug/check-keys" -ForegroundColor White
    Write-Host "  2. Tester IA : https://www.powalyze.com/committee-prep" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Les fonctions IA suivantes sont maintenant activées :" -ForegroundColor Green
Write-Host "  • Chief of Staff (actions stratégiques)" -ForegroundColor White
Write-Host "  • Committee Prep (rapports COMEX)" -ForegroundColor White
Write-Host "  • Executive Narratives (synthèses IA)" -ForegroundColor White
Write-Host "  • Project Predictor (prédictions risques)" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "📅 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor DarkGray
Write-Host "🤖 Fix by: GitHub Copilot AI" -ForegroundColor DarkGray
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
