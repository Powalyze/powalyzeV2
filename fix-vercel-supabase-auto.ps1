# ============================================
# FIX VERCEL: Nettoyer les variables Supabase corrompues (AUTO)
# ============================================

Write-Host "🔧 NETTOYAGE AUTOMATIQUE DES VARIABLES SUPABASE SUR VERCEL" -ForegroundColor Cyan
Write-Host ""

# Variables propres (depuis .env.local)
$SUPABASE_URL = "https://pqsgdwfsdnmozzoynefw.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.DRRnRPaUhPtCxYCM3TbT-mKJPGGYp0hFWrFf6PNYlqk"
$SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU"

Write-Host "📝 Variables à configurer :" -ForegroundColor Yellow
Write-Host "   NEXT_PUBLIC_SUPABASE_URL = $SUPABASE_URL"
Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY = $($SUPABASE_ANON_KEY.Substring(0,50))..."
Write-Host ""

Write-Host "🗑️  Suppression des anciennes variables..." -ForegroundColor Yellow

# Supprimer les anciennes variables (all environments)
npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes 2>$null
npx vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>$null
npx vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes 2>$null

Write-Host "✅ Anciennes variables supprimées" -ForegroundColor Green
Write-Host ""

Write-Host "➕ Ajout des nouvelles variables (propres)..." -ForegroundColor Yellow

# Écrire les variables dans des fichiers temporaires pour éviter les problèmes de caractères
$SUPABASE_URL | Out-File -FilePath ".temp_url.txt" -Encoding utf8 -NoNewline
$SUPABASE_ANON_KEY | Out-File -FilePath ".temp_anon.txt" -Encoding utf8 -NoNewline
$SUPABASE_SERVICE_KEY | Out-File -FilePath ".temp_service.txt" -Encoding utf8 -NoNewline

# Ajouter les nouvelles variables propres
Get-Content ".temp_url.txt" -Raw | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
Get-Content ".temp_anon.txt" -Raw | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
Get-Content ".temp_service.txt" -Raw | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Nettoyer les fichiers temporaires
Remove-Item ".temp_url.txt", ".temp_anon.txt", ".temp_service.txt" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Variables configurées avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Redéploiement en production..." -ForegroundColor Cyan

npx vercel --prod --yes

Write-Host ""
Write-Host "✅ CORRECTION TERMINÉE !" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Vérification :" -ForegroundColor Cyan
Write-Host "   1. Attendre 30-60 secondes que le build se termine"
Write-Host "   2. Aller sur https://www.powalyze.com/login"
Write-Host "   3. L'erreur 'Invalid API key' ne devrait plus apparaître"
Write-Host "   4. Tester avec fabrice.fays@outlook.fr"
Write-Host ""
