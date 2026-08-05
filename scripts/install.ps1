# Montessori Bloom — dependency install helper (Windows)
# Run in PowerShell from project root:
#   Set-ExecutionPolicy -Scope Process Bypass; .\scripts\install.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Stopping stray node processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

if (Test-Path node_modules) {
  Write-Host "Removing node_modules..." -ForegroundColor Cyan
  cmd /c "rmdir /s /q node_modules" 2>$null
}
if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }

$env:npm_config_devdir = $null
npm config delete devdir 2>$null

Write-Host "Testing npm registry..." -ForegroundColor Cyan
npm ping --registry https://registry.npmjs.org

Write-Host "Installing (legacy-peer-deps, retries)..." -ForegroundColor Cyan
npm install --legacy-peer-deps --no-audit --no-fund `
  --fetch-retries=10 `
  --fetch-retry-mintimeout=30000 `
  --fetch-retry-maxtimeout=180000 `
  --maxsockets=3 `
  --prefer-online

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Install failed. Try:" -ForegroundColor Yellow
  Write-Host "  1. Switch network / disable VPN" -ForegroundColor Yellow
  Write-Host "  2. npm config set registry https://registry.npmjs.org/" -ForegroundColor Yellow
  Write-Host "  3. Run again, or deploy on Vercel (builds install deps in cloud)" -ForegroundColor Yellow
  exit 1
}

Write-Host ""
Write-Host "Done. Next:" -ForegroundColor Green
Write-Host "  1. Edit .env.local with Supabase keys" -ForegroundColor Green
Write-Host "  2. Run SQL in supabase/migrations/001 and 002" -ForegroundColor Green
Write-Host "  3. npm run dev" -ForegroundColor Green
