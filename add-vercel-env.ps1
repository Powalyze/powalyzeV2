$url = "https://pqsgdwfsdnmozzoynefw.supabase.co"
$anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.E7nOfgjuE_Kt_fAfV32HYu_Ieit2uQNFwXmpS2vD4HA"
$service = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU"
$orgId = "00000000-0000-0000-0000-000000000000"

Write-Host "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
$anon | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --sensitive

Write-Host "Adding SUPABASE_SERVICE_ROLE_KEY..."
$service | vercel env add SUPABASE_SERVICE_ROLE_KEY production --sensitive

Write-Host "Done!"
