Set-Location "C:\Users\unici\Desktop\personal-calendar"
$env:GIT_AUTHOR_NAME = "Aaron"
$env:GIT_AUTHOR_EMAIL = "aaron@local"
$env:GIT_COMMITTER_NAME = "Aaron"
$env:GIT_COMMITTER_EMAIL = "aaron@local"
git ls-files --stage | Select-Object -First 5
Write-Host "---attempting commit---"
$result = git commit -m "Phase 1 scaffold complete"
Write-Host "Exit code: $LASTEXITCODE"
Write-Host $result
