# Family Calendar — Silent Launcher
# Starts dev server hidden, waits for ready, opens Chrome kiosk
# Run with: powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File launch-calendar.ps1

$projectDir = "C:\Users\unici\Desktop\personal-calendar"
$nodeExe    = "C:\Program Files\nodejs\node.exe"
$nextBin    = "$projectDir\node_modules\next\dist\bin\next"
$chromeExe  = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port       = 3000
$url        = "http://localhost:$port"

# Check if server is already running
$listening = netstat -ano | Select-String ":$port " | Select-String "LISTENING"
if (-not $listening) {
    # Start dev server as a hidden background process
    Start-Process -FilePath $nodeExe -ArgumentList "`"$nextBin`"", "dev" `
        -WorkingDirectory $projectDir -WindowStyle Hidden

    # Wait up to 30 seconds for server to respond
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 307) { break }
        } catch { }
    }
}

# Open Chrome in kiosk mode
Start-Process -FilePath $chromeExe -ArgumentList "--kiosk", "--no-first-run", "--disable-infobars", "--disable-session-crashed-bubble", $url
