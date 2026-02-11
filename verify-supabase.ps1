# Script de vérification complète Supabase (Auth + DNS + CORS + Endpoints)

# Charger les variables depuis .env.local
$envContent = Get-Content .env.local -Raw
$SUPABASE_URL = ($envContent | Select-String -Pattern 'NEXT_PUBLIC_SUPABASE_URL=(.+)').Matches.Groups[1].Value.Trim()
$ANON_KEY = ($envContent | Select-String -Pattern 'NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)').Matches.Groups[1].Value.Trim()

$domain = $SUPABASE_URL -replace 'https://', ''

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🔍 VÉRIFICATION COMPLÈTE SUPABASE" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "📍 URL: $SUPABASE_URL" -ForegroundColor Yellow
Write-Host "🔑 ANON_KEY: $($ANON_KEY.Substring(0, 50))...`n" -ForegroundColor Yellow

# 1. Vérification DNS
Write-Host "🔍 TEST 1/7: Résolution DNS..." -ForegroundColor Cyan
try {
    $dnsResult = Resolve-DnsName $domain -ErrorAction Stop
    Write-Host "  ✓ DNS résolu: $($dnsResult[0].IPAddress)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ERREUR DNS: $_" -ForegroundColor Red
}

# 2. Test connectivité HTTPS
Write-Host "`n🌐 TEST 2/7: Connectivité HTTPS..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $SUPABASE_URL -Method Head -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  ✓ HTTPS OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ERREUR HTTPS: $_" -ForegroundColor Red
}

# 3. Test endpoint Auth Health
Write-Host "`n🩺 TEST 3/7: Endpoint Auth Health..." -ForegroundColor Cyan
try {
    $authHealth = Invoke-WebRequest -Uri "$SUPABASE_URL/auth/v1/health" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  ✓ Auth Health OK (Status: $($authHealth.StatusCode))" -ForegroundColor Green
    Write-Host "  📄 Response: $($authHealth.Content)" -ForegroundColor DarkGray
} catch {
    Write-Host "  ✗ ERREUR Auth Health: $_" -ForegroundColor Red
}

# 4. Test signInWithPassword (sans credentials valides, juste pour tester l'endpoint)
Write-Host "`n🔑 TEST 4/7: Endpoint signInWithPassword..." -ForegroundColor Cyan
try {
    $headers = @{
        "apikey" = $ANON_KEY
        "Content-Type" = "application/json"
    }
    $body = @{
        email = "test@example.com"
        password = "wrongpassword"
    } | ConvertTo-Json

    $authResponse = Invoke-WebRequest -Uri "$SUPABASE_URL/auth/v1/token?grant_type=password" -Method Post -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  ✓ Endpoint répond (Status: $($authResponse.StatusCode))" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "  ✓ Endpoint répond correctement (400 = credentials invalides attendu)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ ERREUR: $_" -ForegroundColor Red
    }
}

# 5. Test REST API
Write-Host "`n📦 TEST 5/7: Endpoint REST API..." -ForegroundColor Cyan
try {
    $restResponse = Invoke-WebRequest -Uri "$SUPABASE_URL/rest/v1/" -Method Head -Headers @{"apikey" = $ANON_KEY} -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  ✓ REST API OK (Status: $($restResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  REST API: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 6. Test Realtime
Write-Host "`n📡 TEST 6/7: Endpoint Realtime..." -ForegroundColor Cyan
try {
    $realtimeResponse = Invoke-WebRequest -Uri "$SUPABASE_URL/realtime/v1/" -Method Head -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  ✓ Realtime OK (Status: $($realtimeResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Realtime: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 7. Test latence
Write-Host "`n⏱️  TEST 7/7: Latence..." -ForegroundColor Cyan
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $null = Invoke-WebRequest -Uri "$SUPABASE_URL/auth/v1/health" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    $stopwatch.Stop()
    $latency = $stopwatch.Elapsed.TotalSeconds
    Write-Host "  ✓ Latence: $($latency.ToString('F3'))s" -ForegroundColor Green
    if ($latency -lt 0.5) {
        Write-Host "  💚 Excellent (<0.5s)" -ForegroundColor Green
    } elseif ($latency -lt 1.0) {
        Write-Host "  💛 Correct (<1s)" -ForegroundColor Yellow
    } else {
        Write-Host "  ⚠️  Lent (>1s)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ ERREUR latence: $_" -ForegroundColor Red
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ✅ VÉRIFICATION TERMINÉE" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
