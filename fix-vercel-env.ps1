# Script pour nettoyer et reconfigurer les variables Vercel
Write-Host "=== Nettoyage des variables Supabase sur Vercel ===" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Supprimer les anciennes variables
Write-Host "1. Suppression des variables corrompues..." -ForegroundColor Yellow
vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes 2>$null
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>$null
vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes 2>$null
Write-Host "   ✓ Anciennes variables supprimees" -ForegroundColor Green
Write-Host ""

# Etape 2: Recuperer les valeurs propres depuis .env.local
$url = Get-Content .env.local | Select-String "^NEXT_PUBLIC_SUPABASE_URL=" | ForEach-Object { $_ -replace "NEXT_PUBLIC_SUPABASE_URL=", "" } | ForEach-Object { $_.Trim() }
$anonKey = Get-Content .env.local | Select-String "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" | ForEach-Object { $_ -replace "NEXT_PUBLIC_SUPABASE_ANON_KEY=", "" } | ForEach-Object { $_.Trim() }
$serviceKey = Get-Content .env.local | Select-String "^SUPABASE_SERVICE_ROLE_KEY=" | ForEach-Object { $_ -replace "SUPABASE_SERVICE_ROLE_KEY=", "" } | ForEach-Object { $_.Trim() }

Write-Host "2. Valeurs recuperees depuis .env.local:" -ForegroundColor Yellow
Write-Host "   URL: $($url.Substring(0, [Math]::Min(30, $url.Length)))..." -ForegroundColor White
Write-Host "   ANON_KEY: $($anonKey.Substring(0, [Math]::Min(20, $anonKey.Length)))..." -ForegroundColor White
Write-Host "   SERVICE_KEY: $($serviceKey.Substring(0, [Math]::Min(20, $serviceKey.Length)))..." -ForegroundColor White
Write-Host ""

# Etape 3: Recréer les variables (proprement)
Write-Host "3. Recreation des variables sur Vercel..." -ForegroundColor Yellow
Write-Host "   NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor White
vercel env add NEXT_PUBLIC_SUPABASE_URL production --force <<EOF
$url
EOF

Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor White
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --force <<EOF
$anonKey
EOF

Write-Host "   SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor White
vercel env add SUPABASE_SERVICE_ROLE_KEY production --force <<EOF
$serviceKey
EOF

Write-Host ""
Write-Host "✓ Variables recreees avec succes!" -ForegroundColor Green
Write-Host ""

# Etape 4: Redeployer
Write-Host "4. Redeploiement sur Vercel..." -ForegroundColor Yellow
npx vercel --prod --yes

Write-Host ""
Write-Host "=== TERMINE ===" -ForegroundColor Green
Write-Host "Testez maintenant: https://www.powalyze.com/signup" -ForegroundColor Cyan
