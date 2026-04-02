Set-Location "C:\Users\unici\Desktop\personal-calendar"
$env:GIT_AUTHOR_NAME = "Aaron"
$env:GIT_AUTHOR_EMAIL = "aaron@local"
$env:GIT_COMMITTER_NAME = "Aaron"
$env:GIT_COMMITTER_EMAIL = "aaron@local"
git add -A
git commit -m "Phase 1 final: env template, auth fixes, all stubs clean"
git push origin main
Write-Host "COMMITTED_AND_PUSHED"
