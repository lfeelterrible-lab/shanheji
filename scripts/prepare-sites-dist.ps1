$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$buildDir = Join-Path $projectRoot 'dist'
$clientDir = Join-Path $buildDir 'client'
$serverDir = Join-Path $buildDir 'server'
$metadataDir = Join-Path $buildDir '.openai'

New-Item -ItemType Directory -Force -Path $clientDir, $serverDir, $metadataDir | Out-Null

$excludedDirectories = @('client', 'server', '.openai')
Get-ChildItem -LiteralPath $buildDir -Force |
  Where-Object { $excludedDirectories -notcontains $_.Name } |
  ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $clientDir $_.Name) -Recurse -Force
  }

Copy-Item -LiteralPath (Join-Path $projectRoot 'site-worker/index.js') -Destination (Join-Path $serverDir 'index.js') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'site-worker/wrangler.json') -Destination (Join-Path $serverDir 'wrangler.json') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot '.openai/hosting.json') -Destination (Join-Path $metadataDir 'hosting.json') -Force

Write-Output "Prepared Sites bundle at $buildDir"
