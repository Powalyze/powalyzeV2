# Script de mise à jour des variables d'environnement Vercel pour le projet phfeteiholkfiredgero

Write-Host "🔧 Mise à jour des variables d'environnement Vercel..." -ForegroundColor Cyan

# URL Supabase
Write-Host "  Mise à jour NEXT_PUBLIC_SUPABASE_URL..."
echo "https://phfeteiholkfiredgero.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Anon Key
Write-Host "  Mise à jour NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmV0ZWlob2xrZmlyZWRnZXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NjkwMzgsImV4cCI6MjA4MDU0NTAzOH0.ktSkQoksSUkWx_TmAJLa299Cg1lPyLwJvgh4EbV4qXM" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Service Role Key
Write-Host "  Mise à jour SUPABASE_SERVICE_ROLE_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmV0ZWlob2xrZmlyZWRnZXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk2OTAzOCwiZXhwIjoyMDgwNTQ1MDM4fQ.-v9Q2Xm_KXVx66NRkGpa-PspfVPsmpD3jztXDYttJn4" | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

Write-Host "✅ Variables d'environnement mises à jour!" -ForegroundColor Green
Write-Host "🚀 Lancement du redéploiement..." -ForegroundColor Cyan

# Redéploiement
npx vercel --prod --yes

Write-Host "✅ Migration vers phfeteiholkfiredgero terminée!" -ForegroundColor Green
