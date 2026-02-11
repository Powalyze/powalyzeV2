# Add missing Supabase environment variables to Vercel

Write-Host "Checking existing environment variables..." -ForegroundColor Cyan
npx vercel env pull .env.vercel.production

Write-Host "`n📝 Manual steps required:" -ForegroundColor Yellow
Write-Host "Run these commands one by one:`n" -ForegroundColor White

Write-Host "1. Add NEXT_PUBLIC_SUPABASE_URL:" -ForegroundColor Cyan
Write-Host "   echo 'https://pqsgdwfsdnmozzoynefw.supabase.co' | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production`n"

Write-Host "2. Add NEXT_PUBLIC_SUPABASE_ANON_KEY:" -ForegroundColor Cyan  
Write-Host "   echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.DRRnRPaUhPtCxYCM3TbT-mKJPGGYp0hFWrFf6PNYlqk' | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production`n"

Write-Host "3. Deploy:" -ForegroundColor Cyan
Write-Host "   npx vercel --prod --yes`n"
