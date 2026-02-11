# ============================================
# FIX VERCEL: Nettoyer les variables Supabase corrompues
# ============================================

Write-Host "🔧 NETTOYAGE DES VARIABLES SUPABASE SUR VERCEL" -ForegroundColor Cyan
Write-Host ""

# Variables propres (depuis .env.local)
$SUPABASE_URL = "https://pqsgdwfsdnmozzoynefw.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.DRRnRPaUhPtCxYCM3TbT-mKJPGGYp0hFWrFf6PNYlqk"
$SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU"

Write-Host "📝 Variables à configurer :" -ForegroundColor Yellow
Write-Host "   NEXT_PUBLIC_SUPABASE_URL = $SUPABASE_URL"
Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY = $($SUPABASE_ANON_KEY.Substring(0,50))..."
Write-Host ""

Write-Host "⚠️  ATTENTION : Ceci va remplacer les variables existantes sur Vercel" -ForegroundColor Red
$confirm = Read-Host "Continuer ? (o/N)"

if ($confirm -ne "o" -and $confirm -ne "O") {
    Write-Host "❌ Annulé" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🗑️  Suppression des anciennes variables..." -ForegroundColor Yellow

# Supprimer les anciennes variables (all environments)
npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes 2>$null
npx vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>$null
npx vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes 2>$null

Write-Host "✅ Anciennes variables supprimées" -ForegroundColor Green
Write-Host ""

Write-Host "➕ Ajout des nouvelles variables (propres)..." -ForegroundColor Yellow

# Ajouter les nouvelles variables propres
Write-Output $SUPABASE_URL | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
Write-Output $SUPABASE_ANON_KEY | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
Write-Output $SUPABASE_SERVICE_KEY | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

Write-Host ""
Write-Host "✅ Variables configurées avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Redéploiement en production..." -ForegroundColor Cyan

npx vercel --prod --yes

Write-Host ""
Write-Host "✅ CORRECTION TERMINÉE !" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Vérification :" -ForegroundColor Cyan
Write-Host "   1. Attendre 30 secondes que le build se termine"
Write-Host "   2. Aller sur https://www.powalyze.com/login"
Write-Host "   3. L'erreur 'Invalid API key' ne devrait plus apparaître"
Write-Host ""
