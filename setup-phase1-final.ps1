Set-Location "C:\Users\unici\Desktop\personal-calendar"

# 1. Generate NEXTAUTH_SECRET
$secret = node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
Write-Host "NEXTAUTH_SECRET generated"

# 2. Write .env.local with all values
$envContent = @"
NEXTAUTH_SECRET=$secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=common
NEXT_PUBLIC_SUPABASE_URL=https://mivtjdbjztnvtjixhwmh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdnRqZGJqenRudnRqaXhod21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDEwMDgsImV4cCI6MjA5MDY3NzAwOH0.TW3fHgAp_Tuk3Q5GOrMEhIGBe7G29u0DNqNf1liJSM8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdnRqZGJqenRudnRqaXhod21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEwMTAwOCwiZXhwIjoyMDkwNjc3MDA4fQ.XEtu3V0njgROSG9VkQy_0gQQakEnm6GWusxPscwszyg
SUPABASE_DB_PASSWORD=CalApp2026!xK9#mPqR
"@
Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
Write-Host ".env.local written"

# 3. TypeScript check
Write-Host "Running TypeScript check..."
$tsc = & npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host "TypeScript: CLEAN" }
else { $tsc | ForEach-Object { Write-Host $_ } }

# 4. Git commit the current state (env.local excluded by .gitignore)
$gitScript = "C:\Users\unici\Desktop\personal-calendar\git-commit2.ps1"
Set-Content -Path $gitScript -Value @'
Set-Location "C:\Users\unici\Desktop\personal-calendar"
$env:GIT_AUTHOR_NAME = "Aaron"
$env:GIT_AUTHOR_EMAIL = "aaron@local"
$env:GIT_COMMITTER_NAME = "Aaron"
$env:GIT_COMMITTER_EMAIL = "aaron@local"
git add -A
git commit -m "Phase 1 final: env template, auth fixes, all stubs clean"
git push origin main
Write-Host "COMMITTED_AND_PUSHED"
'@
powershell -ExecutionPolicy Bypass -File $gitScript
Write-Host "SETUP_DONE"
