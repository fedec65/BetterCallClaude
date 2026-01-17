#Requires -Version 5.1
<#
.SYNOPSIS
    BetterCallClaude Windows Installer
    Swiss Legal Intelligence Framework for Claude Code

.DESCRIPTION
    This script installs BetterCallClaude on native Windows systems.
    It handles:
    - Prerequisite checking (Git, Node.js, Python)
    - Repository cloning/updating
    - MCP server building
    - CLI wrapper creation
    - PATH configuration

.PARAMETER Force
    Force reinstallation even if already installed

.PARAMETER DryRun
    Preview installation without making changes

.PARAMETER NoInteractive
    Non-interactive mode with default options

.PARAMETER Uninstall
    Remove BetterCallClaude installation

.EXAMPLE
    # Standard installation
    irm https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.ps1 | iex

.EXAMPLE
    # Force reinstall
    .\install.ps1 -Force

.EXAMPLE
    # Dry run (preview only)
    .\install.ps1 -DryRun

.EXAMPLE
    # Uninstall
    .\install.ps1 -Uninstall

.NOTES
    Author: Federico Cesconi
    Version: 2.2.0
    License: AGPL-3.0
    Repository: https://github.com/fedec65/BetterCallClaude
#>

[CmdletBinding()]
param(
    [switch]$Force,
    [switch]$DryRun,
    [switch]$NoInteractive,
    [switch]$Uninstall,
    [switch]$Doctor,
    [switch]$Update,
    [switch]$Version
)

# ============================================================================
# Configuration
# ============================================================================
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"  # Faster downloads

$VERSION = "2.2.0"
$REPO_URL = "https://github.com/fedec65/BetterCallClaude.git"
$REPO_NAME = "BetterCallClaude"

# Installation Paths
$CLAUDE_DIR = "$env:USERPROFILE\.claude"
$INSTALL_DIR = "$CLAUDE_DIR\bettercallclaude"
$COMMANDS_DIR = "$CLAUDE_DIR\commands"
$MCP_DIR = "$env:USERPROFILE\.bettercallclaude\mcp-servers"
$MANIFEST_FILE = "$INSTALL_DIR\manifest.json"

# CLI Paths
$CLI_NAME = "bettercallclaude"
$APPS_DIR = "$env:LOCALAPPDATA\Microsoft\WindowsApps"

# ============================================================================
# Helper Functions
# ============================================================================

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

function Write-Warn {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host ""
    Write-Host "[$Step] " -ForegroundColor Cyan -NoNewline
    Write-Host $Message
}

function Show-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                                                               ║" -ForegroundColor Cyan
    Write-Host "║   ⚖️  " -ForegroundColor Cyan -NoNewline
    Write-Host "BetterCallClaude" -ForegroundColor White -NoNewline
    Write-Host " - Swiss Legal Intelligence      ║" -ForegroundColor Cyan
    Write-Host "║                                                               ║" -ForegroundColor Cyan
    Write-Host "║   Windows Installer v$VERSION                                  ║" -ForegroundColor Cyan
    Write-Host "║                                                               ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Test-Command {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Get-CommandVersion {
    param([string]$Command, [string]$VersionArg = "--version")
    try {
        $output = & $Command $VersionArg 2>&1
        return $output | Select-Object -First 1
    }
    catch {
        return $null
    }
}

function Confirm-Action {
    param([string]$Message, [bool]$Default = $true)

    if ($NoInteractive) {
        return $Default
    }

    $defaultText = if ($Default) { "Y/n" } else { "y/N" }
    $response = Read-Host "$Message [$defaultText]"

    if ([string]::IsNullOrWhiteSpace($response)) {
        return $Default
    }

    return $response -match "^[Yy]"
}

# ============================================================================
# Version Command
# ============================================================================

function Show-Version {
    Show-Banner

    Write-Host "Installed Version Information" -ForegroundColor White
    Write-Host "=============================" -ForegroundColor White
    Write-Host ""

    if (Test-Path $MANIFEST_FILE) {
        $manifest = Get-Content $MANIFEST_FILE | ConvertFrom-Json
        Write-Host "  Installed version:  " -NoNewline
        Write-Success "v$($manifest.version)"
        Write-Host "  Installed at:       $($manifest.installed_at)"
        Write-Host "  Platform:           $($manifest.platform)"
        Write-Host "  Install directory:  $($manifest.paths.install_dir)"
    }
    else {
        Write-Warn "  BetterCallClaude is not installed."
    }

    Write-Host ""

    # Check for updates
    Write-Info "Checking for updates..."

    if (Test-Path $INSTALL_DIR) {
        Push-Location $INSTALL_DIR
        try {
            git fetch origin --quiet 2>$null
            $localHash = git rev-parse HEAD 2>$null
            $remoteHash = git rev-parse origin/main 2>$null

            if ($localHash -eq $remoteHash) {
                Write-Success "✓ You have the latest version!"
            }
            else {
                $remoteVersion = git show origin/main:version.txt 2>$null
                Write-Warn "⚡ Update available: v$remoteVersion"
                Write-Host ""
                Write-Host "  Run: " -NoNewline
                Write-Info ".\install.ps1 -Update"
            }
        }
        catch {
            Write-Warn "Cannot check for updates"
        }
        finally {
            Pop-Location
        }
    }

    Write-Host ""
}

# ============================================================================
# Doctor Command
# ============================================================================

function Invoke-Doctor {
    Show-Banner

    Write-Host "Health Check" -ForegroundColor White
    Write-Host "============" -ForegroundColor White
    Write-Host ""

    $issues = 0

    # Check installation directory
    if (Test-Path $INSTALL_DIR) {
        Write-Success "  [✓] Installation directory exists"
    }
    else {
        Write-Err "  [✗] Installation directory missing"
        $issues++
    }

    # Check manifest
    if (Test-Path $MANIFEST_FILE) {
        $manifest = Get-Content $MANIFEST_FILE | ConvertFrom-Json
        Write-Success "  [✓] Manifest found: v$($manifest.version)"
    }
    else {
        Write-Warn "  [!] Manifest missing"
        $issues++
    }

    # Check MCP servers
    if (Test-Path $MCP_DIR) {
        $mcpCount = (Get-ChildItem -Directory $MCP_DIR -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -notin @("node_modules", "integration-tests") }).Count
        Write-Success "  [✓] MCP servers: $mcpCount configured"

        # Check if built
        $builtServers = 0
        Get-ChildItem -Directory $MCP_DIR -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -notin @("node_modules", "integration-tests") } |
            ForEach-Object {
                $distPath = Join-Path $_.FullName "dist\index.js"
                $buildPath = Join-Path $_.FullName "build\index.js"
                if ((Test-Path $distPath) -or (Test-Path $buildPath)) {
                    $builtServers++
                }
            }

        if ($builtServers -eq $mcpCount) {
            Write-Success "  [✓] All MCP servers built"
        }
        else {
            Write-Warn "  [!] Some MCP servers not built ($builtServers/$mcpCount)"
        }
    }
    else {
        Write-Err "  [✗] MCP servers directory missing"
        $issues++
    }

    # Check commands
    if (Test-Path $COMMANDS_DIR) {
        $cmdCount = (Get-ChildItem -Filter "*.md" $COMMANDS_DIR -ErrorAction SilentlyContinue).Count
        if ($cmdCount -gt 0) {
            Write-Success "  [✓] Commands installed: $cmdCount"
        }
        else {
            Write-Err "  [✗] No commands found"
            $issues++
        }
    }
    else {
        Write-Warn "  [!] Commands directory missing"
    }

    # Check CLI
    $cliPath = Join-Path $APPS_DIR "$CLI_NAME.cmd"
    if (Test-Path $cliPath) {
        Write-Success "  [✓] CLI installed"
    }
    else {
        Write-Warn "  [!] CLI not in PATH"
    }

    # Check prerequisites
    Write-Host ""
    Write-Host "Prerequisites" -ForegroundColor White
    Write-Host "=============" -ForegroundColor White
    Write-Host ""

    if (Test-Command "git") {
        Write-Success "  [✓] Git: $(Get-CommandVersion git)"
    }
    else {
        Write-Err "  [✗] Git not found"
        $issues++
    }

    if (Test-Command "node") {
        Write-Success "  [✓] Node.js: $(Get-CommandVersion node -v)"
    }
    else {
        Write-Err "  [✗] Node.js not found"
        $issues++
    }

    $pythonCmd = if (Test-Command "python3") { "python3" }
                 elseif (Test-Command "python") { "python" }
                 else { $null }

    if ($pythonCmd) {
        Write-Success "  [✓] Python: $(Get-CommandVersion $pythonCmd --version)"
    }
    else {
        Write-Err "  [✗] Python not found"
        $issues++
    }

    # Summary
    Write-Host ""
    if ($issues -eq 0) {
        Write-Success "All checks passed! ✓"
    }
    else {
        Write-Warn "$issues issue(s) found. Run installer to fix: .\install.ps1 -Force"
    }
    Write-Host ""
}

# ============================================================================
# Prerequisite Checks
# ============================================================================

function Test-Prerequisites {
    Write-Step "1/6" "Checking prerequisites..."

    $missing = @()

    # Check Git
    if (Test-Command "git") {
        $gitVersion = Get-CommandVersion git
        Write-Success "  ✓ Git: $gitVersion"
    }
    else {
        $missing += "Git (https://git-scm.com/download/win)"
    }

    # Check Node.js
    if (Test-Command "node") {
        $nodeVersion = Get-CommandVersion node "-v"
        $nodeVersionNum = [int]($nodeVersion -replace "^v(\d+).*", '$1')

        if ($nodeVersionNum -ge 18) {
            Write-Success "  ✓ Node.js: $nodeVersion"
        }
        else {
            $missing += "Node.js 18+ (current: $nodeVersion) - https://nodejs.org"
        }
    }
    else {
        $missing += "Node.js 18+ (https://nodejs.org)"
    }

    # Check Python
    $pythonCmd = $null
    if (Test-Command "python3") {
        $pythonCmd = "python3"
    }
    elseif (Test-Command "python") {
        $pythonCmd = "python"
    }

    if ($pythonCmd) {
        $pythonVersion = Get-CommandVersion $pythonCmd "--version"
        $versionMatch = [regex]::Match($pythonVersion, "(\d+)\.(\d+)")

        if ($versionMatch.Success) {
            $major = [int]$versionMatch.Groups[1].Value
            $minor = [int]$versionMatch.Groups[2].Value

            if ($major -ge 3 -and $minor -ge 11) {
                Write-Success "  ✓ Python: $pythonVersion"
            }
            else {
                $missing += "Python 3.11+ (current: $pythonVersion) - https://python.org"
            }
        }
    }
    else {
        $missing += "Python 3.11+ (https://python.org)"
    }

    # Report missing prerequisites
    if ($missing.Count -gt 0) {
        Write-Host ""
        Write-Err "Missing prerequisites:"
        foreach ($item in $missing) {
            Write-Err "  ✗ $item"
        }
        Write-Host ""
        Write-Err "Please install the missing prerequisites and try again."
        throw "Missing prerequisites"
    }

    Write-Success "  All prerequisites satisfied!"
}

# ============================================================================
# Installation Functions
# ============================================================================

function Install-Repository {
    Write-Step "2/6" "Installing BetterCallClaude repository..."

    # Create .claude directory
    if (-not (Test-Path $CLAUDE_DIR)) {
        if ($DryRun) {
            Write-Info "  [DRY RUN] Would create: $CLAUDE_DIR"
        }
        else {
            New-Item -ItemType Directory -Force -Path $CLAUDE_DIR | Out-Null
            Write-Info "  Created: $CLAUDE_DIR"
        }
    }

    # Clone or update repository
    if (Test-Path $INSTALL_DIR) {
        if ($Force) {
            Write-Info "  Removing existing installation..."
            if (-not $DryRun) {
                Remove-Item -Recurse -Force $INSTALL_DIR
            }
        }
        else {
            Write-Info "  Updating existing installation..."
            if (-not $DryRun) {
                Push-Location $INSTALL_DIR
                try {
                    git fetch origin
                    git checkout -- version.txt 2>$null  # Reset version.txt
                    git pull origin main
                }
                finally {
                    Pop-Location
                }
            }
            Write-Success "  Updated successfully!"
            return
        }
    }

    if ($DryRun) {
        Write-Info "  [DRY RUN] Would clone: $REPO_URL"
    }
    else {
        Write-Info "  Cloning repository..."
        git clone --depth 1 $REPO_URL $INSTALL_DIR
        Write-Success "  Cloned successfully!"
    }
}

function Install-MCPServers {
    Write-Step "3/6" "Building MCP servers..."

    $mcpSource = Join-Path $INSTALL_DIR "mcp-servers"

    if (-not (Test-Path $mcpSource)) {
        Write-Warn "  MCP servers directory not found, skipping..."
        return
    }

    # Create MCP directory
    if (-not (Test-Path $MCP_DIR)) {
        if ($DryRun) {
            Write-Info "  [DRY RUN] Would create: $MCP_DIR"
        }
        else {
            New-Item -ItemType Directory -Force -Path $MCP_DIR | Out-Null
        }
    }

    if ($DryRun) {
        Write-Info "  [DRY RUN] Would copy MCP servers to: $MCP_DIR"
        Write-Info "  [DRY RUN] Would run: npm install && npm run build"
        return
    }

    # Copy MCP servers
    Write-Info "  Copying MCP servers..."
    Copy-Item -Path "$mcpSource\*" -Destination $MCP_DIR -Recurse -Force

    # Build MCP servers
    Push-Location $MCP_DIR
    try {
        Write-Info "  Installing dependencies (this may take a moment)..."
        npm install --loglevel error 2>&1 | Out-Null

        Write-Info "  Building MCP servers..."
        npm run build 2>&1 | Out-Null

        Write-Success "  MCP servers built successfully!"
    }
    catch {
        Write-Warn "  MCP server build had warnings (may still work)"
    }
    finally {
        Pop-Location
    }
}

function Install-Commands {
    Write-Step "4/6" "Installing commands..."

    $commandsSource = Join-Path $INSTALL_DIR ".claude\commands"

    if (-not (Test-Path $commandsSource)) {
        Write-Warn "  Commands directory not found, skipping..."
        return
    }

    # Create commands directory
    if (-not (Test-Path $COMMANDS_DIR)) {
        if ($DryRun) {
            Write-Info "  [DRY RUN] Would create: $COMMANDS_DIR"
        }
        else {
            New-Item -ItemType Directory -Force -Path $COMMANDS_DIR | Out-Null
        }
    }

    if ($DryRun) {
        $cmdCount = (Get-ChildItem -Filter "*.md" $commandsSource -ErrorAction SilentlyContinue).Count
        Write-Info "  [DRY RUN] Would install $cmdCount commands"
        return
    }

    # Copy commands
    $commands = Get-ChildItem -Filter "*.md" $commandsSource -ErrorAction SilentlyContinue
    foreach ($cmd in $commands) {
        Copy-Item -Path $cmd.FullName -Destination $COMMANDS_DIR -Force
    }

    Write-Success "  Installed $($commands.Count) commands"
}

function Install-CLI {
    Write-Step "5/6" "Installing CLI..."

    $cliPath = Join-Path $APPS_DIR "$CLI_NAME.cmd"

    # Create CLI wrapper script
    $cliContent = @"
@echo off
REM BetterCallClaude CLI Wrapper
REM Auto-generated by install.ps1

setlocal enabledelayedexpansion

set "INSTALL_DIR=$INSTALL_DIR"

if "%1"=="version" goto :version
if "%1"=="--version" goto :version
if "%1"=="-v" goto :version
if "%1"=="doctor" goto :doctor
if "%1"=="check" goto :doctor
if "%1"=="update" goto :update
if "%1"=="uninstall" goto :uninstall
if "%1"=="help" goto :help
if "%1"=="--help" goto :help
if "%1"=="-h" goto :help

:help
echo.
echo BetterCallClaude CLI - Swiss Legal Intelligence Framework
echo.
echo Usage: bettercallclaude ^<command^>
echo.
echo Commands:
echo   version     Show version information
echo   update      Update to latest version
echo   doctor      Check installation health
echo   uninstall   Remove BetterCallClaude
echo   help        Show this help
echo.
goto :eof

:version
powershell -ExecutionPolicy Bypass -File "%INSTALL_DIR%\install.ps1" -Version
goto :eof

:doctor
powershell -ExecutionPolicy Bypass -File "%INSTALL_DIR%\install.ps1" -Doctor
goto :eof

:update
powershell -ExecutionPolicy Bypass -File "%INSTALL_DIR%\install.ps1" -Update
goto :eof

:uninstall
powershell -ExecutionPolicy Bypass -File "%INSTALL_DIR%\install.ps1" -Uninstall
goto :eof
"@

    if ($DryRun) {
        Write-Info "  [DRY RUN] Would create CLI at: $cliPath"
        return
    }

    # Ensure WindowsApps directory exists
    if (-not (Test-Path $APPS_DIR)) {
        New-Item -ItemType Directory -Force -Path $APPS_DIR | Out-Null
    }

    # Write CLI wrapper
    Set-Content -Path $cliPath -Value $cliContent -Encoding ASCII

    Write-Success "  CLI installed: $cliPath"
    Write-Info "  You can now run: bettercallclaude --help"
}

function New-Manifest {
    Write-Step "6/6" "Creating manifest..."

    $manifest = @{
        name = "BetterCallClaude"
        version = $VERSION
        installed_at = (Get-Date).ToString("o")
        platform = "windows"
        scope = "user"
        paths = @{
            install_dir = $INSTALL_DIR
            mcp_servers = $MCP_DIR
            commands = $COMMANDS_DIR
            claude_dir = $CLAUDE_DIR
        }
        python = @{
            venv = $false
            command = if (Test-Command "python3") { "python3" } else { "python" }
        }
        components = @{
            commands = $true
            mcp_servers = $true
            agents = $true
        }
    }

    if ($DryRun) {
        Write-Info "  [DRY RUN] Would create manifest"
        return
    }

    $manifest | ConvertTo-Json -Depth 10 | Set-Content -Path $MANIFEST_FILE

    # Also update version.txt
    $versionFile = Join-Path $INSTALL_DIR "version.txt"
    Set-Content -Path $versionFile -Value $VERSION -NoNewline

    Write-Success "  Manifest created"
}

# ============================================================================
# Update Function
# ============================================================================

function Invoke-Update {
    Show-Banner
    Write-Info "Updating BetterCallClaude..."
    Write-Host ""

    if (-not (Test-Path $INSTALL_DIR)) {
        Write-Err "BetterCallClaude is not installed."
        Write-Host "Run: .\install.ps1"
        return
    }

    Push-Location $INSTALL_DIR
    try {
        # Fetch latest
        git fetch origin

        # Check if update needed
        $localHash = git rev-parse HEAD
        $remoteHash = git rev-parse origin/main

        if ($localHash -eq $remoteHash) {
            Write-Success "Already up to date!"
            return
        }

        # Reset version.txt and pull
        git checkout -- version.txt 2>$null

        if (git pull origin main) {
            Write-Success "Updated successfully!"

            # Update version from pulled version.txt
            $versionFile = Join-Path $INSTALL_DIR "version.txt"
            if (Test-Path $versionFile) {
                $newVersion = (Get-Content $versionFile -Raw).Trim()

                # Update manifest
                if (Test-Path $MANIFEST_FILE) {
                    $manifest = Get-Content $MANIFEST_FILE | ConvertFrom-Json
                    $manifest.version = $newVersion
                    $manifest.updated_at = (Get-Date).ToString("o")
                    $manifest | ConvertTo-Json -Depth 10 | Set-Content -Path $MANIFEST_FILE
                    Write-Success "Manifest updated to v$newVersion"
                }
            }

            # Rebuild MCP servers
            Write-Info "Rebuilding MCP servers..."
            Push-Location $MCP_DIR
            try {
                npm install --loglevel error 2>&1 | Out-Null
                npm run build 2>&1 | Out-Null
                Write-Success "MCP servers rebuilt"
            }
            finally {
                Pop-Location
            }
        }
        else {
            Write-Err "Update failed!"
            Write-Warn "Try: git stash && .\install.ps1 -Update"
        }
    }
    finally {
        Pop-Location
    }

    # Show new version
    Write-Host ""
    Show-Version
}

# ============================================================================
# Uninstall Function
# ============================================================================

function Invoke-Uninstall {
    Show-Banner

    if (-not (Test-Path $INSTALL_DIR)) {
        Write-Warn "BetterCallClaude is not installed."
        return
    }

    if (-not (Confirm-Action "Are you sure you want to uninstall BetterCallClaude?" -Default $false)) {
        Write-Info "Uninstall cancelled."
        return
    }

    Write-Info "Removing BetterCallClaude..."

    # Remove commands
    if (Test-Path $COMMANDS_DIR) {
        Get-ChildItem $COMMANDS_DIR -Filter "legal-*.md" | Remove-Item -Force
        Get-ChildItem $COMMANDS_DIR -Filter "agent-*.md" | Remove-Item -Force
        Get-ChildItem $COMMANDS_DIR -Filter "swiss*.md" | Remove-Item -Force
        Get-ChildItem $COMMANDS_DIR -Filter "doc*.md" | Remove-Item -Force
        Write-Info "  Removed commands"
    }

    # Remove installation
    if (Test-Path $INSTALL_DIR) {
        Remove-Item -Recurse -Force $INSTALL_DIR
        Write-Info "  Removed installation directory"
    }

    # Remove MCP servers
    if (Test-Path $MCP_DIR) {
        Remove-Item -Recurse -Force $MCP_DIR
        Write-Info "  Removed MCP servers"
    }

    # Remove CLI
    $cliPath = Join-Path $APPS_DIR "$CLI_NAME.cmd"
    if (Test-Path $cliPath) {
        Remove-Item -Force $cliPath
        Write-Info "  Removed CLI"
    }

    Write-Success "BetterCallClaude uninstalled successfully!"
    Write-Host ""
}

# ============================================================================
# Main Installation
# ============================================================================

function Invoke-Installation {
    Show-Banner

    if ($DryRun) {
        Write-Warn "DRY RUN MODE - No changes will be made"
        Write-Host ""
    }

    # Check if already installed
    if ((Test-Path $INSTALL_DIR) -and -not $Force) {
        Write-Warn "BetterCallClaude is already installed."
        Write-Host ""

        if (Confirm-Action "Update existing installation?") {
            Invoke-Update
            return
        }

        if (-not (Confirm-Action "Reinstall? (use -Force to skip this prompt)")) {
            Write-Info "Installation cancelled."
            return
        }
    }

    try {
        Test-Prerequisites
        Install-Repository
        Install-MCPServers
        Install-Commands
        Install-CLI
        New-Manifest

        # Success message
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Success "  ✓ BetterCallClaude v$VERSION installed successfully!"
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Quick Start:" -ForegroundColor White
        Write-Host "    1. Open a new terminal (to refresh PATH)"
        Write-Host "    2. Run: " -NoNewline
        Write-Info "bettercallclaude doctor"
        Write-Host "    3. Start Claude Code: " -NoNewline
        Write-Info "claude"
        Write-Host "    4. Try: " -NoNewline
        Write-Info "/legal:help"
        Write-Host ""
        Write-Host "  Documentation:" -ForegroundColor White
        Write-Host "    https://github.com/fedec65/BetterCallClaude"
        Write-Host ""
    }
    catch {
        Write-Host ""
        Write-Err "Installation failed: $_"
        Write-Host ""
        Write-Warn "Troubleshooting:"
        Write-Host "  1. Ensure all prerequisites are installed"
        Write-Host "  2. Run as Administrator if needed"
        Write-Host "  3. Try: .\install.ps1 -Force"
        Write-Host ""
        exit 1
    }
}

# ============================================================================
# Entry Point
# ============================================================================

# Route to appropriate command
if ($Version) {
    Show-Version
}
elseif ($Doctor) {
    Invoke-Doctor
}
elseif ($Update) {
    Invoke-Update
}
elseif ($Uninstall) {
    Invoke-Uninstall
}
else {
    Invoke-Installation
}
