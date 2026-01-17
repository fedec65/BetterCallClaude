#!/bin/bash
#
# BetterCallClaude Installer v2.0
# Swiss Legal Framework for Claude Code
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash
#
# Or with options:
#   ./install.sh install    # Fresh install (interactive)
#   ./install.sh update     # Update existing installation
#   ./install.sh uninstall  # Remove BetterCallClaude
#   ./install.sh doctor     # Check health/diagnose issues
#   ./install.sh --help     # Show help
#

set -e

# ============================================================================
# Configuration & Defaults
# ============================================================================

# Fallback version for initial display (banner, early logs)
# This will be updated after repository is cloned
VERSION="2.2.1"

# Extract version from pyproject.toml (source of truth after clone)
extract_version_from_pyproject() {
    local pyproject_path="${1:-pyproject.toml}"
    if [ ! -f "$pyproject_path" ]; then
        echo "unknown"
        return 1
    fi
    # Extract version line and remove quotes/whitespace
    grep '^version = ' "$pyproject_path" | sed 's/^version = "\(.*\)"$/\1/' | tr -d ' '
}

# Update VERSION from cloned repository's pyproject.toml
# Call this after clone_repository() to get actual version
update_version_from_repo() {
    if [ -f "$INSTALL_DIR/pyproject.toml" ]; then
        local extracted_version
        extracted_version=$(extract_version_from_pyproject "$INSTALL_DIR/pyproject.toml")
        if [ "$extracted_version" != "unknown" ] && [ -n "$extracted_version" ]; then
            VERSION="$extracted_version"
            log_step "Version extracted from pyproject.toml: $VERSION"
        fi
    fi
}

REPO_URL="https://github.com/fedec65/BetterCallClaude.git"
REPO_RAW_URL="https://raw.githubusercontent.com/fedec65/BetterCallClaude/main"
SUPPORT_EMAIL="federico@cesconi.com"

# Detect home directory (cross-platform)
if [ -n "$HOME" ]; then
    HOME_DIR="$HOME"
elif [ -n "$USERPROFILE" ]; then
    HOME_DIR="$USERPROFILE"
else
    HOME_DIR=$(eval echo ~)
fi

# Default paths
CLAUDE_DIR="$HOME_DIR/.claude"
COMMANDS_DIR="$CLAUDE_DIR/commands"
DEFAULT_MCP_DIR="$HOME_DIR/.bettercallclaude"
BACKUP_DIR="$CLAUDE_DIR/backups/bettercallclaude-$(date +%Y%m%d-%H%M%S)"
CUSTOMIZATIONS_DIR="$CLAUDE_DIR/customizations"

# ============================================================================
# Logging System
# ============================================================================

# Create log directory and file
LOG_DIR="$HOME_DIR/.bettercallclaude/logs"
LOG_TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="$LOG_DIR/install-$LOG_TIMESTAMP.log"
INSTALL_SUCCESS=false

# Initialize logging
init_logging() {
    mkdir -p "$LOG_DIR"

    # Create log file with system info header
    {
        echo "================================================================================"
        echo "BetterCallClaude Installation Log"
        echo "================================================================================"
        echo "Timestamp:     $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo "Installer:     v${VERSION}"
        echo "Platform:      $(uname -s) $(uname -r)"
        echo "Architecture:  $(uname -m)"
        echo "Shell:         $SHELL ($BASH_VERSION)"
        echo "User:          $(whoami)"
        echo "Home:          $HOME_DIR"
        echo "Working Dir:   $(pwd)"
        echo ""
        echo "--- Environment ---"
        echo "PATH: $PATH"
        echo "LANG: ${LANG:-not set}"
        echo "LC_ALL: ${LC_ALL:-not set}"
        echo ""
        echo "--- Tool Versions ---"
        echo "Git:     $(git --version 2>/dev/null || echo 'not found')"
        echo "Node:    $(node --version 2>/dev/null || echo 'not found')"
        echo "npm:     $(npm --version 2>/dev/null || echo 'not found')"
        echo "Python:  $(python3 --version 2>/dev/null || python --version 2>/dev/null || echo 'not found')"
        echo ""
        echo "================================================================================"
        echo "Installation Log"
        echo "================================================================================"
        echo ""
    } > "$LOG_FILE"

    # Start capturing all output to log file (while still showing on screen)
    exec > >(tee -a "$LOG_FILE") 2>&1
}

# Log a message to file only (for internal tracking)
log_to_file() {
    echo "[$(date '+%H:%M:%S')] $1" >> "$LOG_FILE"
}

# Error handler - called when installation fails
handle_error() {
    local exit_code=$?
    local line_number=$1
    local command="$2"

    # Add error details to log
    {
        echo ""
        echo "================================================================================"
        echo "INSTALLATION FAILED"
        echo "================================================================================"
        echo "Exit Code:     $exit_code"
        echo "Failed at:     Line $line_number"
        echo "Command:       $command"
        echo "Timestamp:     $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo ""
        echo "--- Last 50 lines of output ---"
        tail -50 "$LOG_FILE" 2>/dev/null || echo "(unable to read log)"
        echo ""
        echo "================================================================================"
    } >> "$LOG_FILE"

    # Show user-friendly error message
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              INSTALLATION FAILED                              ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}An error occurred during installation.${NC}"
    echo ""
    echo -e "${BOLD}📋 A detailed log file has been created:${NC}"
    echo -e "   ${CYAN}$LOG_FILE${NC}"
    echo ""
    echo -e "${BOLD}📧 Please send this log file for support:${NC}"
    echo -e "   ${CYAN}$SUPPORT_EMAIL${NC}"
    echo ""
    echo -e "${BOLD}Quick email command:${NC}"
    if [ "$PLATFORM" = "macos" ]; then
        echo -e "   ${CYAN}open \"mailto:$SUPPORT_EMAIL?subject=BetterCallClaude%20Installation%20Error&body=Please%20attach%20the%20log%20file%20from%20$LOG_FILE\"${NC}"
    else
        echo -e "   ${CYAN}mail -s 'BetterCallClaude Installation Error' $SUPPORT_EMAIL < \"$LOG_FILE\"${NC}"
    fi
    echo ""
    echo -e "${BOLD}Or manually:${NC}"
    echo "   1. Open your email client"
    echo "   2. Create a new email to: $SUPPORT_EMAIL"
    echo "   3. Subject: BetterCallClaude Installation Error"
    echo "   4. Attach the log file: $LOG_FILE"
    echo "   5. Describe what you were trying to do"
    echo ""
    echo -e "${YELLOW}We'll investigate and help you resolve this issue!${NC}"
    echo ""

    exit $exit_code
}

# Success handler - clean up old logs on successful installation
handle_success() {
    INSTALL_SUCCESS=true

    {
        echo ""
        echo "================================================================================"
        echo "INSTALLATION SUCCESSFUL"
        echo "================================================================================"
        echo "Completed at: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
        echo ""
    } >> "$LOG_FILE"

    # Keep only the last 5 log files to avoid clutter
    local log_count=$(ls -1 "$LOG_DIR"/install-*.log 2>/dev/null | wc -l | tr -d ' ')
    if [ "$log_count" -gt 5 ]; then
        ls -1t "$LOG_DIR"/install-*.log | tail -n +6 | xargs rm -f 2>/dev/null
    fi
}

# Set up error trap (will be enabled after color detection)
setup_error_trap() {
    trap 'handle_error ${LINENO} "$BASH_COMMAND"' ERR
}

# Installation state
INSTALL_DIR=""
MCP_SERVERS_DIR=""
USE_VENV=true
USE_SYMLINKS=true
SCOPE="global"
DRY_RUN=false
FORCE=false
INTERACTIVE=true

# Detect if stdin is a terminal (needed for piped execution: curl ... | bash)
# When piped, stdin is the script content, not the terminal
USE_TTY=false
if [ ! -t 0 ]; then
    # Try to redirect stdin from terminal for interactive prompts
    # This is needed for curl | bash scenarios where we still want interactivity
    # Suppress all errors since /dev/tty may not exist or be accessible
    {
        exec 3</dev/tty && USE_TTY=true
    } 2>/dev/null || {
        # No terminal available, force non-interactive mode
        INTERACTIVE=false
    }
fi

# ============================================================================
# Colors & Output
# ============================================================================

# Detect color support
if [ -t 1 ] && command -v tput &>/dev/null && [ "$(tput colors 2>/dev/null)" -ge 8 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    PURPLE='\033[0;35m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    PURPLE=''
    CYAN=''
    BOLD=''
    NC=''
fi

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_step() { echo -e "${CYAN}→${NC} $1"; }

print_banner() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}               ${CYAN}${BOLD}BetterCallClaude Installer${NC}                      ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}             ${YELLOW}Swiss Legal Framework v${VERSION}${NC}                     ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# ============================================================================
# Platform Detection
# ============================================================================

detect_platform() {
    case "$(uname -s)" in
        Darwin*)
            PLATFORM="macos"
            PLATFORM_NAME="macOS"
            ;;
        Linux*)
            PLATFORM="linux"
            PLATFORM_NAME="Linux"
            # Detect WSL
            if grep -qi microsoft /proc/version 2>/dev/null; then
                PLATFORM="wsl"
                PLATFORM_NAME="Windows (WSL)"
            fi
            ;;
        CYGWIN*|MINGW*|MSYS*)
            PLATFORM="windows"
            PLATFORM_NAME="Windows"
            ;;
        *)
            PLATFORM="unknown"
            PLATFORM_NAME="Unknown"
            ;;
    esac

    log_info "Detected platform: ${PLATFORM_NAME}"
}

# ============================================================================
# Dependency Checks
# ============================================================================

check_command() {
    command -v "$1" &>/dev/null
}

get_version() {
    local cmd="$1"
    case "$cmd" in
        node)
            node --version 2>/dev/null | sed 's/v//'
            ;;
        python|python3)
            "$cmd" --version 2>/dev/null | awk '{print $2}'
            ;;
        npm)
            npm --version 2>/dev/null
            ;;
        git)
            git --version 2>/dev/null | awk '{print $3}'
            ;;
    esac
}

version_ge() {
    # Returns 0 if version $1 >= $2
    [ "$(printf '%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    echo ""

    local errors=0
    local warnings=0

    # Git (required)
    if check_command git; then
        log_success "Git: $(get_version git)"
    else
        log_error "Git not found - required for installation"
        errors=$((errors + 1))
    fi

    # Node.js >= 18 (required for MCP servers)
    # Now supports Node.js 18-24+ thanks to WASM-based SQLite (no native modules)
    if check_command node; then
        local node_ver=$(get_version node)
        local node_major=$(echo "$node_ver" | cut -d. -f1)
        if [ "$node_major" -ge 18 ]; then
            log_success "Node.js: $node_ver (>= 18 supported)"
        else
            log_error "Node.js: $node_ver (>= 18 required, found $node_major)"
            errors=$((errors + 1))
        fi
    else
        log_error "Node.js not found - required for MCP servers"
        errors=$((errors + 1))
    fi

    # npm (required)
    if check_command npm; then
        log_success "npm: $(get_version npm)"
    else
        log_error "npm not found - required for MCP servers"
        errors=$((errors + 1))
    fi

    # Python >= 3.10 (required for agents)
    local python_cmd=""
    if check_command python3; then
        python_cmd="python3"
    elif check_command python; then
        python_cmd="python"
    fi

    if [ -n "$python_cmd" ]; then
        local py_ver=$(get_version "$python_cmd")
        local py_major=$(echo "$py_ver" | cut -d. -f1)
        local py_minor=$(echo "$py_ver" | cut -d. -f2)
        if [ "$py_major" -ge 3 ] && [ "$py_minor" -ge 10 ] && [ "$py_minor" -le 13 ]; then
            log_success "Python: $py_ver (3.10-3.13 supported)"
            PYTHON_CMD="$python_cmd"
        elif [ "$py_major" -ge 3 ] && [ "$py_minor" -ge 14 ]; then
            log_warning "Python: $py_ver (3.14+ may have compatibility issues)"
            log_warning "Some packages may fail to build from source."
            log_warning "Recommended: Use Python 3.11-3.13 for best compatibility."
            PYTHON_CMD="$python_cmd"
            warnings=$((warnings + 1))
        else
            log_error "Python: $py_ver (>= 3.10 required)"
            errors=$((errors + 1))
        fi
    else
        log_error "Python not found - required for legal agents"
        errors=$((errors + 1))
    fi

    # Claude Code CLI (optional but recommended)
    if check_command claude; then
        log_success "Claude Code CLI: installed"
    else
        log_warning "Claude Code CLI not found (optional - works with Claude Desktop)"
        warnings=$((warnings + 1))
    fi

    # Check ~/.claude directory
    if [ -d "$CLAUDE_DIR" ]; then
        log_success "Claude config directory: $CLAUDE_DIR"
    else
        log_warning "Claude config directory not found - will create"
        warnings=$((warnings + 1))
    fi

    echo ""

    if [ $errors -gt 0 ]; then
        log_error "Missing $errors required prerequisite(s). Please install them and try again."
        echo ""
        echo "Installation guides:"
        echo "  Node.js: https://nodejs.org/"
        echo "  Python:  https://www.python.org/"
        echo "  Git:     https://git-scm.com/"
        exit 1
    fi

    if [ $warnings -gt 0 ]; then
        log_warning "$warnings warning(s) noted, but installation can proceed."
    fi

    return 0
}

# ============================================================================
# Interactive Prompts
# ============================================================================

prompt_yes_no() {
    local prompt="$1"
    local default="${2:-y}"
    local response

    if [ "$INTERACTIVE" = false ]; then
        [ "$default" = "y" ] && return 0 || return 1
    fi

    if [ "$default" = "y" ]; then
        prompt="$prompt [Y/n]: "
    else
        prompt="$prompt [y/N]: "
    fi

    # Read from /dev/tty when running in piped mode (curl | bash)
    if [ "$USE_TTY" = true ]; then
        echo -n "$prompt"
        read -r response <&3
    else
        read -r -p "$prompt" response
    fi
    response=${response:-$default}

    [[ "$response" =~ ^[Yy]$ ]]
}

prompt_choice() {
    local prompt="$1"
    local default="$2"
    shift 2
    local options=("$@")

    if [ "$INTERACTIVE" = false ]; then
        echo "$default"
        return
    fi

    echo "" >&2
    echo -e "${CYAN}$prompt${NC}" >&2
    local i=1
    for opt in "${options[@]}"; do
        echo "  [$i] $opt" >&2
        i=$((i + 1))
    done
    echo "" >&2

    local choice
    local read_prompt="Choose [1-${#options[@]}] (default: $default): "
    # Read from /dev/tty when running in piped mode (curl | bash)
    if [ "$USE_TTY" = true ]; then
        echo -n "$read_prompt" >&2
        read -r choice <&3
    else
        read -r -p "$read_prompt" choice
    fi
    choice=${choice:-$default}

    echo "$choice"
}

prompt_path() {
    local prompt="$1"
    local default="$2"
    local path

    if [ "$INTERACTIVE" = false ]; then
        echo "$default"
        return
    fi

    echo "" >&2
    echo -e "${CYAN}$prompt${NC}" >&2
    echo "  Default: $default" >&2
    local read_prompt="  [Enter] to accept or type custom path: "
    # Read from /dev/tty when running in piped mode (curl | bash)
    if [ "$USE_TTY" = true ]; then
        echo -n "$read_prompt" >&2
        read -r path <&3
    else
        read -r -p "$read_prompt" path
    fi
    path=${path:-$default}

    # Expand ~ to home directory
    path="${path/#\~/$HOME_DIR}"

    echo "$path"
}

# ============================================================================
# Interactive Installation Flow
# ============================================================================

interactive_install() {
    print_banner
    echo -e "${BOLD}Welcome to BetterCallClaude Installer v${VERSION}${NC}"
    echo ""

    detect_platform
    check_prerequisites

    echo ""
    echo -e "${BOLD}📍 Installation Scope:${NC}"
    local scope_choice=$(prompt_choice "Where should BetterCallClaude be installed?" "1" \
        "Global (recommended) - Available in all projects" \
        "Local - Only in current project")

    if [ "$scope_choice" = "2" ]; then
        SCOPE="local"
        INSTALL_DIR="$(pwd)/.bettercallclaude"
        MCP_SERVERS_DIR="$INSTALL_DIR/mcp-servers"
        log_info "Local installation to: $INSTALL_DIR"
    else
        SCOPE="global"
        INSTALL_DIR="$CLAUDE_DIR/bettercallclaude"
    fi

    # MCP Server location (only for global installs)
    if [ "$SCOPE" = "global" ]; then
        echo ""
        echo -e "${BOLD}📂 MCP Server Location:${NC}"
        MCP_SERVERS_DIR=$(prompt_path "Where should MCP servers be installed?" "$DEFAULT_MCP_DIR/mcp-servers")
    fi

    # Python environment choice
    echo ""
    echo -e "${BOLD}🐍 Python Environment:${NC}"
    local py_choice=$(prompt_choice "How should Python dependencies be managed?" "1" \
        "Virtual environment (recommended) - Isolated, no conflicts" \
        "System Python - Use existing packages" \
        "Skip Python setup - I'll configure manually")

    case "$py_choice" in
        1) USE_VENV=true ;;
        2) USE_VENV=false ;;
        3) USE_VENV="skip" ;;
    esac

    # Backup existing settings
    if [ -f "$CLAUDE_DIR/settings.json" ] || [ -d "$COMMANDS_DIR" ]; then
        echo ""
        echo -e "${BOLD}💾 Existing Configuration:${NC}"
        if prompt_yes_no "Create backup of existing Claude settings?" "y"; then
            create_backup
        fi
    fi

    # Confirm installation
    echo ""
    echo -e "${BOLD}📋 Installation Summary:${NC}"
    echo "  Scope:           $SCOPE"
    echo "  Install Dir:     $INSTALL_DIR"
    echo "  MCP Servers:     $MCP_SERVERS_DIR"
    echo "  Python Env:      $([ "$USE_VENV" = true ] && echo "Virtual environment" || ([ "$USE_VENV" = false ] && echo "System Python" || echo "Manual"))"
    echo "  Commands Dir:    $COMMANDS_DIR"
    echo ""

    if ! prompt_yes_no "Proceed with installation?" "y"; then
        log_warning "Installation cancelled."
        exit 0
    fi

    echo ""
    perform_installation
}

# ============================================================================
# Installation Functions
# ============================================================================

create_backup() {
    log_info "Creating backup..."
    mkdir -p "$BACKUP_DIR"

    # Backup settings.json
    if [ -f "$CLAUDE_DIR/settings.json" ]; then
        cp "$CLAUDE_DIR/settings.json" "$BACKUP_DIR/"
        log_step "Backed up settings.json"
    fi

    # Backup existing commands (handle broken symlinks gracefully)
    if [ -d "$COMMANDS_DIR" ]; then
        # Use cp -rP to preserve symlinks without following them
        # Also suppress errors for broken symlinks and continue
        if cp -rP "$COMMANDS_DIR" "$BACKUP_DIR/" 2>/dev/null; then
            log_step "Backed up commands directory"
        else
            # Fallback: copy only regular files, skip broken symlinks
            mkdir -p "$BACKUP_DIR/commands"
            find "$COMMANDS_DIR" -maxdepth 1 -type f -exec cp {} "$BACKUP_DIR/commands/" \; 2>/dev/null || true
            log_step "Backed up commands directory (skipped broken symlinks)"
        fi
    fi

    # Backup existing CLAUDE.md
    if [ -f "$CLAUDE_DIR/CLAUDE.md" ]; then
        cp "$CLAUDE_DIR/CLAUDE.md" "$BACKUP_DIR/"
        log_step "Backed up CLAUDE.md"
    fi

    # Backup existing installation (handle broken symlinks gracefully)
    if [ -d "$INSTALL_DIR" ]; then
        if cp -rP "$INSTALL_DIR" "$BACKUP_DIR/" 2>/dev/null; then
            log_step "Backed up previous installation"
        else
            log_step "Previous installation backup skipped (broken symlinks)"
        fi
    fi

    log_success "Backup created at: $BACKUP_DIR"
}

clone_repository() {
    log_info "Cloning BetterCallClaude repository..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would clone $REPO_URL to $INSTALL_DIR"
        return 0
    fi

    # Create parent directory
    mkdir -p "$(dirname "$INSTALL_DIR")"

    # Handle existing directory
    if [ -d "$INSTALL_DIR" ]; then
        if [ "$FORCE" = true ]; then
            log_step "Removing existing installation (--force)"
            rm -rf "$INSTALL_DIR"
        elif [ -d "$INSTALL_DIR/.git" ]; then
            # Already a git repo - update instead of clone
            log_step "Existing installation found, updating..."
            (
                cd "$INSTALL_DIR"
                # Unshallow if necessary and fetch all refs properly
                git fetch --unshallow origin 2>/dev/null || git fetch origin 2>/dev/null || true
                git fetch origin main 2>/dev/null
                git checkout main 2>/dev/null || true
                git reset --hard origin/main 2>/dev/null
            ) || {
                log_warning "Update failed, removing and re-cloning..."
                rm -rf "$INSTALL_DIR"
            }
            if [ -d "$INSTALL_DIR/.git" ]; then
                log_success "Repository updated: $INSTALL_DIR"
                return 0
            fi
        else
            # Directory exists but not a git repo - remove it
            log_step "Removing non-git directory at install location..."
            rm -rf "$INSTALL_DIR"
        fi
    fi

    # Clone
    local clone_output
    if clone_output=$(git clone --depth 1 "$REPO_URL" "$INSTALL_DIR" 2>&1); then
        log_success "Repository cloned to: $INSTALL_DIR"
    else
        log_error "Failed to clone repository"
        log_error "Git error: $clone_output"
        exit 1
    fi
}

setup_mcp_servers() {
    log_info "Setting up MCP servers..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would build MCP servers in $MCP_SERVERS_DIR"
        return 0
    fi

    # Create MCP directory
    mkdir -p "$MCP_SERVERS_DIR"

    # Copy MCP server source files
    if [ -d "$INSTALL_DIR/mcp-servers" ]; then
        cp -r "$INSTALL_DIR/mcp-servers/"* "$MCP_SERVERS_DIR/" 2>/dev/null || true
        log_step "Copied MCP server sources"
    fi

    # Check if this is a npm workspaces monorepo
    if [ -f "$MCP_SERVERS_DIR/package.json" ]; then
        local has_workspaces=$(grep -c '"workspaces"' "$MCP_SERVERS_DIR/package.json" 2>/dev/null || echo "0")

        if [ "$has_workspaces" -gt 0 ]; then
            # Build using npm workspaces (handles dependencies correctly)
            log_step "Building MCP servers using npm workspaces..."
            (
                cd "$MCP_SERVERS_DIR"
                # Install all dependencies and setup workspace symlinks
                log_step "Installing npm dependencies..."
                if ! npm install 2>&1; then
                    log_error "npm install failed - this usually means:"
                    log_error "  1. Node.js version incompatibility (use Node 20.x or 22.x LTS)"
                    log_error "  2. Native module build failure (better-sqlite3 requires prebuilt binaries)"
                    log_error "  3. Network issues or npm registry problems"
                    log_error ""
                    log_error "Try: nvm install 22 && nvm use 22 && re-run installation"
                    exit 1
                fi
                # Build all workspaces (shared first due to dependency order)
                log_step "Compiling TypeScript..."
                if ! npm run build 2>&1; then
                    log_error "TypeScript compilation failed"
                    log_error "This may indicate missing dependencies from failed npm install"
                    exit 1
                fi
            ) || {
                log_error "MCP server build failed - see errors above"
                log_error "Installation cannot continue without working MCP servers"
                return 1
            }
        else
            # Fallback: Build each server individually
            for server_dir in "$MCP_SERVERS_DIR"/*/; do
                if [ -d "$server_dir" ] && [ -f "$server_dir/package.json" ]; then
                    local server_name=$(basename "$server_dir")
                    log_step "Building $server_name..."

                    (
                        cd "$server_dir"
                        npm install --silent 2>/dev/null || npm install
                        if [ -f "tsconfig.json" ]; then
                            npm run build --silent 2>/dev/null || npm run build || true
                        fi
                    ) || log_warning "Failed to build $server_name"
                fi
            done
        fi
    fi

    log_success "MCP servers configured"
}

setup_python_env() {
    if [ "$USE_VENV" = "skip" ]; then
        log_info "Skipping Python environment setup (manual mode)"
        return 0
    fi

    log_info "Setting up Python environment..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would setup Python environment"
        return 0
    fi

    local venv_dir="$INSTALL_DIR/.venv"

    if [ "$USE_VENV" = true ]; then
        # Create virtual environment
        log_step "Creating virtual environment..."
        "$PYTHON_CMD" -m venv "$venv_dir" || {
            log_error "Failed to create virtual environment"
            return 1
        }

        # Activate and install
        source "$venv_dir/bin/activate"
        pip install --upgrade pip --quiet

        if [ -f "$INSTALL_DIR/requirements.txt" ]; then
            pip install -r "$INSTALL_DIR/requirements.txt" --quiet
            log_step "Installed Python dependencies"
        fi

        deactivate
        log_success "Virtual environment created at: $venv_dir"
    else
        # System Python - just install dependencies
        if [ -f "$INSTALL_DIR/requirements.txt" ]; then
            "$PYTHON_CMD" -m pip install -r "$INSTALL_DIR/requirements.txt" --user --quiet
            log_step "Installed Python dependencies to user site-packages"
        fi
        log_success "Python dependencies installed (system)"
    fi
}

install_commands() {
    log_info "Installing commands..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would install commands to $COMMANDS_DIR"
        return 0
    fi

    # Create commands directory
    mkdir -p "$COMMANDS_DIR"

    local source_dir="$INSTALL_DIR/.claude/commands"
    local count=0

    if [ ! -d "$source_dir" ]; then
        log_error "Commands source directory not found: $source_dir"
        return 1
    fi

    for cmd_file in "$source_dir"/*.md; do
        if [ -f "$cmd_file" ]; then
            local filename=$(basename "$cmd_file")
            local target="$COMMANDS_DIR/$filename"

            # Remove existing
            [ -L "$target" ] || [ -f "$target" ] && rm -f "$target"

            if [ "$USE_SYMLINKS" = true ]; then
                ln -s "$cmd_file" "$target"
            else
                cp "$cmd_file" "$target"
            fi

            count=$((count + 1))
        fi
    done

    log_success "Installed $count commands"
}

update_settings_json() {
    log_info "Configuring Claude Code settings..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would update settings.json"
        return 0
    fi

    local settings_file="$CLAUDE_DIR/settings.json"

    # Create settings if doesn't exist
    if [ ! -f "$settings_file" ]; then
        echo '{}' > "$settings_file"
    fi

    # Generate MCP server configurations with absolute paths
    local entscheidsuche_path="$MCP_SERVERS_DIR/entscheidsuche-mcp/dist/index.js"
    local citations_path="$MCP_SERVERS_DIR/legal-citations/dist/index.js"

    # Use Node.js to safely merge JSON (cross-platform)
    node -e "
const fs = require('fs');
const settingsPath = '$settings_file';
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

// Ensure mcpServers object exists
if (!settings.mcpServers) settings.mcpServers = {};

// Add BetterCallClaude MCP servers
settings.mcpServers['entscheidsuche'] = {
    command: 'node',
    args: ['$entscheidsuche_path'],
    description: 'Swiss court decision search (BetterCallClaude)'
};

settings.mcpServers['legal-citations'] = {
    command: 'node',
    args: ['$citations_path'],
    description: 'Legal citation verification (BetterCallClaude)'
};

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
" || {
    log_warning "Could not update settings.json automatically"
    log_step "Please add MCP servers manually to ~/.claude/settings.json"
    return 1
}

    log_success "Updated settings.json with MCP server paths"
}

configure_imports() {
    log_info "Configuring CLAUDE.md imports..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would configure CLAUDE.md"
        return 0
    fi

    local claude_md="$CLAUDE_DIR/CLAUDE.md"
    local import_marker="# BetterCallClaude Framework"
    local import_block="
# BetterCallClaude Framework
# Swiss Legal Intelligence - https://github.com/fedec65/BetterCallClaude
@bettercallclaude/.claude/BETTERASK.md
@bettercallclaude/.claude/LEGAL_PRINCIPLES.md
@bettercallclaude/.claude/LEGAL_SYMBOLS.md
@bettercallclaude/.claude/SWISS_LAW_CONFIG.md
"

    if [ -f "$claude_md" ]; then
        if grep -q "$import_marker" "$claude_md"; then
            log_success "Imports already configured"
            return 0
        fi
        # Append to existing
        echo "$import_block" >> "$claude_md"
        log_success "Added imports to existing CLAUDE.md"
    else
        echo "# Claude Code Configuration" > "$claude_md"
        echo "$import_block" >> "$claude_md"
        log_success "Created CLAUDE.md with imports"
    fi
}

create_manifest() {
    log_info "Creating installation manifest..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would create manifest.json"
        return 0
    fi

    local manifest_file="$INSTALL_DIR/manifest.json"
    local install_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    cat > "$manifest_file" << EOF
{
    "name": "BetterCallClaude",
    "version": "$VERSION",
    "installed_at": "$install_date",
    "platform": "$PLATFORM",
    "scope": "$SCOPE",
    "paths": {
        "install_dir": "$INSTALL_DIR",
        "mcp_servers": "$MCP_SERVERS_DIR",
        "commands": "$COMMANDS_DIR",
        "claude_dir": "$CLAUDE_DIR"
    },
    "python": {
        "venv": $( [ "$USE_VENV" = true ] && echo "true" || echo "false" ),
        "command": "${PYTHON_CMD:-python3}"
    },
    "components": {
        "commands": true,
        "mcp_servers": true,
        "agents": true
    }
}
EOF

    # Also update version.txt for backwards compatibility
    echo "$VERSION" > "$INSTALL_DIR/version.txt"

    log_success "Manifest created"
}

install_cli() {
    log_info "Installing CLI wrapper..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would install CLI"
        return 0
    fi

    local cli_dir="$INSTALL_DIR/bin"
    local cli_script="$cli_dir/bettercallclaude"

    mkdir -p "$cli_dir"

    # Create CLI wrapper
    cat > "$cli_script" << 'EOFCLI'
#!/bin/bash
#
# BetterCallClaude CLI
# Manage your BetterCallClaude installation
#

# Find installation
if [ -f "$HOME/.claude/bettercallclaude/manifest.json" ]; then
    INSTALL_DIR="$HOME/.claude/bettercallclaude"
elif [ -f "./.bettercallclaude/manifest.json" ]; then
    INSTALL_DIR="./.bettercallclaude"
else
    echo "BetterCallClaude installation not found."
    echo "Run the installer: curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash"
    exit 1
fi

MANIFEST="$INSTALL_DIR/manifest.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

get_version() {
    if [ -f "$MANIFEST" ]; then
        node -e "console.log(JSON.parse(require('fs').readFileSync('$MANIFEST')).version)" 2>/dev/null || \
        cat "$INSTALL_DIR/version.txt" 2>/dev/null || echo "unknown"
    else
        echo "unknown"
    fi
}

cmd_version() {
    echo ""
    echo -e "${CYAN}BetterCallClaude Version Info${NC}"
    echo "=============================="
    echo ""

    # Installed version
    local installed_version=$(get_version)
    echo -e "Installed version:  ${GREEN}v${installed_version}${NC}"

    # Installation paths
    echo ""
    echo "Installation paths:"
    echo "  Framework:    $INSTALL_DIR"
    if [ -f "$MANIFEST" ]; then
        local mcp_dir=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$MANIFEST')).paths.mcp_servers)" 2>/dev/null)
        echo "  MCP Servers:  $mcp_dir"
        local commands_dir=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$MANIFEST')).paths.commands)" 2>/dev/null)
        echo "  Commands:     $commands_dir"
    fi

    # MCP servers status
    echo ""
    echo "MCP Servers:"
    if [ -f "$MANIFEST" ]; then
        local mcp_dir=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$MANIFEST')).paths.mcp_servers)" 2>/dev/null)
        if [ -d "$mcp_dir" ]; then
            for server_dir in "$mcp_dir"/*/; do
                if [ -d "$server_dir" ]; then
                    local server_name=$(basename "$server_dir")
                    # Skip non-server directories
                    if [ "$server_name" = "node_modules" ] || [ "$server_name" = "integration-tests" ]; then
                        continue
                    fi
                    if [ -f "$server_dir/dist/index.js" ] || [ -f "$server_dir/build/index.js" ]; then
                        echo -e "  ${GREEN}[✓]${NC} $server_name"
                    else
                        echo -e "  ${YELLOW}[!]${NC} $server_name (not built)"
                    fi
                fi
            done
        fi
    fi

    # Check for updates
    echo ""
    echo -e "${CYAN}Checking for updates...${NC}"
    cd "$INSTALL_DIR" 2>/dev/null || { echo -e "${YELLOW}Cannot check updates${NC}"; return; }

    git fetch origin --quiet 2>/dev/null || { echo -e "${YELLOW}Cannot fetch from remote${NC}"; return; }

    local current=$(git rev-parse HEAD 2>/dev/null)
    local remote=$(git rev-parse origin/main 2>/dev/null)

    if [ -z "$current" ] || [ -z "$remote" ]; then
        echo -e "${YELLOW}Cannot determine version status${NC}"
    elif [ "$current" = "$remote" ]; then
        echo -e "${GREEN}✓ You have the latest version!${NC}"
    else
        # Get remote version
        local remote_version=$(git show origin/main:version.txt 2>/dev/null || echo "unknown")
        echo -e "${YELLOW}⚡ Update available: v${remote_version}${NC}"
        echo ""
        echo -e "Run ${CYAN}bettercallclaude update${NC} to upgrade"
        echo ""

        # Ask if user wants to update
        echo -n "Would you like to update now? [y/N]: "
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            cmd_update
        fi
    fi
    echo ""
}

cmd_update() {
    echo -e "${CYAN}Updating BetterCallClaude...${NC}"
    cd "$INSTALL_DIR"

    git fetch origin
    local current=$(git rev-parse HEAD)
    local remote=$(git rev-parse origin/main)

    if [ "$current" = "$remote" ]; then
        echo -e "${GREEN}Already up to date!${NC}"
    else
        if git pull origin main; then
            echo -e "${GREEN}Updated successfully!${NC}"

            # Reset version.txt to ensure we get the pulled version
            # (create_manifest may have modified it locally)
            git checkout -- version.txt 2>/dev/null

            # Update VERSION from the newly pulled version.txt
            if [ -f "$INSTALL_DIR/version.txt" ]; then
                VERSION=$(cat "$INSTALL_DIR/version.txt" | tr -d '[:space:]')

                # Update manifest.json with new version
                if [ -f "$MANIFEST" ]; then
                    # Use node if available for reliable JSON update
                    if command -v node &> /dev/null; then
                        node -e "
                            const fs = require('fs');
                            const manifest = JSON.parse(fs.readFileSync('$MANIFEST'));
                            manifest.version = '$VERSION';
                            manifest.updated_at = new Date().toISOString();
                            fs.writeFileSync('$MANIFEST', JSON.stringify(manifest, null, 4));
                        " 2>/dev/null && echo -e "${GREEN}Manifest updated to v${VERSION}${NC}"
                    else
                        # Fallback to sed for systems without node
                        sed -i.bak 's/"version": "[^"]*"/"version": "'"$VERSION"'"/' "$MANIFEST" 2>/dev/null && \
                        rm -f "${MANIFEST}.bak" && \
                        echo -e "${GREEN}Manifest updated to v${VERSION}${NC}"
                    fi
                fi
            fi
        else
            echo -e "${RED}Update failed!${NC}"
            echo -e "${YELLOW}This may be due to local changes. Try:${NC}"
            echo "  cd $INSTALL_DIR && git stash && bettercallclaude update"
            echo ""
            echo -e "${YELLOW}Or reset local changes:${NC}"
            echo "  cd $INSTALL_DIR && git checkout -- . && bettercallclaude update"
            return 1
        fi
    fi

    cmd_version
}

cmd_doctor() {
    echo ""
    echo -e "${CYAN}BetterCallClaude Health Check${NC}"
    echo "=============================="
    echo ""

    local issues=0

    # Check installation
    if [ -d "$INSTALL_DIR" ]; then
        echo -e "${GREEN}[✓]${NC} Installation directory exists"
    else
        echo -e "${RED}[✗]${NC} Installation directory missing"
        issues=$((issues + 1))
    fi

    # Check manifest
    if [ -f "$MANIFEST" ]; then
        echo -e "${GREEN}[✓]${NC} Manifest found: v$(get_version)"
    else
        echo -e "${YELLOW}[!]${NC} Manifest missing"
    fi

    # Check MCP servers
    local mcp_dir=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$MANIFEST')).paths.mcp_servers)" 2>/dev/null)
    if [ -d "$mcp_dir" ]; then
        local mcp_count=$(ls -d "$mcp_dir"/*/ 2>/dev/null | wc -l | tr -d ' ')
        echo -e "${GREEN}[✓]${NC} MCP servers: $mcp_count configured"
    else
        echo -e "${RED}[✗]${NC} MCP servers directory missing"
        issues=$((issues + 1))
    fi

    # Check commands
    local cmd_count=$(ls -1 "$HOME/.claude/commands/"*.md 2>/dev/null | wc -l | tr -d ' ')
    if [ "$cmd_count" -gt 0 ]; then
        echo -e "${GREEN}[✓]${NC} Commands installed: $cmd_count"
    else
        echo -e "${RED}[✗]${NC} No commands found"
        issues=$((issues + 1))
    fi

    # Check broken symlinks
    local broken=0
    for link in "$HOME/.claude/commands/"*.md; do
        if [ -L "$link" ] && [ ! -e "$link" ]; then
            broken=$((broken + 1))
        fi
    done
    if [ "$broken" -gt 0 ]; then
        echo -e "${RED}[✗]${NC} Broken symlinks: $broken"
        issues=$((issues + 1))
    fi

    # Check settings.json
    if [ -f "$HOME/.claude/settings.json" ]; then
        if grep -q "entscheidsuche" "$HOME/.claude/settings.json"; then
            echo -e "${GREEN}[✓]${NC} MCP servers configured in settings.json"
        else
            echo -e "${YELLOW}[!]${NC} MCP servers not in settings.json"
        fi
    fi

    echo ""
    if [ "$issues" -eq 0 ]; then
        echo -e "${GREEN}All checks passed!${NC}"
    else
        echo -e "${YELLOW}$issues issue(s) found. Run 'bettercallclaude repair' or reinstall.${NC}"
    fi
    echo ""
}

cmd_uninstall() {
    echo -e "${YELLOW}Are you sure you want to uninstall BetterCallClaude? [y/N]${NC}"
    # Read from /dev/tty when running in piped mode (curl | bash)
    if [ "$USE_TTY" = true ]; then
        read -r response <&3
    else
        read -r response
    fi

    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Uninstall cancelled."
        return
    fi

    echo "Removing BetterCallClaude..."

    # Remove commands
    rm -f "$HOME/.claude/commands/legal-"*.md 2>/dev/null
    rm -f "$HOME/.claude/commands/agent-"*.md 2>/dev/null
    rm -f "$HOME/.claude/commands/swiss"*.md 2>/dev/null

    # Get MCP dir from manifest before deleting
    local mcp_dir=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$MANIFEST')).paths.mcp_servers)" 2>/dev/null)

    # Remove installation
    rm -rf "$INSTALL_DIR"

    # Remove MCP servers if separate location
    if [ -d "$mcp_dir" ] && [ "$mcp_dir" != "$INSTALL_DIR/mcp-servers" ]; then
        rm -rf "$mcp_dir"
    fi

    # Remove CLI
    rm -f /usr/local/bin/bettercallclaude 2>/dev/null || true

    echo -e "${GREEN}BetterCallClaude uninstalled.${NC}"
    echo "Note: Backups preserved in ~/.claude/backups/"
    echo "Note: CLAUDE.md imports not removed (manual cleanup if desired)"
}

cmd_list() {
    echo ""
    echo -e "${CYAN}Installed BetterCallClaude Commands${NC}"
    echo "===================================="
    echo ""

    echo "Legal Commands:"
    for cmd in "$HOME/.claude/commands/legal-"*.md; do
        [ -f "$cmd" ] && echo "  /$(basename "$cmd" .md)"
    done

    echo ""
    echo "Agent Commands:"
    for cmd in "$HOME/.claude/commands/agent-"*.md; do
        [ -f "$cmd" ] && echo "  /$(basename "$cmd" .md)"
    done

    echo ""
}

cmd_help() {
    echo ""
    echo "BetterCallClaude CLI - Swiss Legal Framework for Claude"
    echo ""
    echo "Usage: bettercallclaude <command>"
    echo ""
    echo "Commands:"
    echo "  install     Run installer (fresh or update)"
    echo "  update      Update to latest version"
    echo "  uninstall   Remove BetterCallClaude"
    echo "  doctor      Check installation health"
    echo "  list        List installed commands"
    echo "  version     Show version"
    echo "  help        Show this help"
    echo ""
}

case "${1:-help}" in
    install)
        curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash -s -- install
        ;;
    update)
        cmd_update
        ;;
    uninstall)
        cmd_uninstall
        ;;
    doctor|check)
        cmd_doctor
        ;;
    list|commands)
        cmd_list
        ;;
    version|--version|-v)
        cmd_version
        ;;
    help|--help|-h|*)
        cmd_help
        ;;
esac
EOFCLI

    chmod +x "$cli_script"

    # Try to symlink to PATH with better fallback handling
    if [ -w "/usr/local/bin" ]; then
        ln -sf "$cli_script" "/usr/local/bin/bettercallclaude"
        log_success "CLI installed to /usr/local/bin/bettercallclaude"
    else
        # Create ~/.local/bin if it doesn't exist
        mkdir -p "$HOME/.local/bin"

        # Try to create symlink (redirect errors to suppress permission warnings)
        if ln -sf "$cli_script" "$HOME/.local/bin/bettercallclaude" 2>/dev/null; then
            log_success "CLI installed to ~/.local/bin/bettercallclaude"

            # Check if ~/.local/bin is in PATH
            if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
                log_info "Add to PATH in your shell profile (~/.zshrc or ~/.bashrc):"
                echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
            fi
        else
            # Fallback: provide clear instructions
            log_warning "Could not install CLI to PATH automatically."
            log_info "Option 1 - Run manually:"
            echo "  $cli_script"
            log_info "Option 2 - Add to PATH in your shell profile (~/.zshrc or ~/.bashrc):"
            echo "  export PATH=\"$INSTALL_DIR/bin:\$PATH\""
        fi
    fi
}

perform_installation() {
    echo ""
    echo -e "${BOLD}⚙️  Installing BetterCallClaude...${NC}"
    echo ""

    clone_repository
    update_version_from_repo  # Extract actual version after clone
    setup_mcp_servers
    setup_python_env
    install_commands
    update_settings_json
    configure_imports
    create_manifest
    install_cli

    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ Installation complete!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "Version: ${CYAN}$VERSION${NC}"
    echo ""
    echo -e "${BOLD}Quick Start:${NC}"
    echo "  1. Open Claude Code"
    echo "  2. Type: /legal:help"
    echo ""
    echo -e "${BOLD}Management:${NC}"
    echo "  bettercallclaude update     - Update to latest"
    echo "  bettercallclaude doctor     - Check health"
    echo "  bettercallclaude list       - Show commands"
    echo ""
    echo -e "${BOLD}Documentation:${NC}"
    echo "  https://github.com/fedec65/BetterCallClaude"
    echo ""
    echo -e "${BOLD}Support:${NC}"
    echo "  📧 $SUPPORT_EMAIL"
    echo "  📋 Installation log: $LOG_FILE"
    echo ""
}

# ============================================================================
# Version Function
# ============================================================================

do_version() {
    print_banner

    # Find existing installation
    if [ -d "$CLAUDE_DIR/bettercallclaude" ]; then
        INSTALL_DIR="$CLAUDE_DIR/bettercallclaude"
    elif [ -d "./.bettercallclaude" ]; then
        INSTALL_DIR="./.bettercallclaude"
    else
        log_error "No existing installation found."
        echo ""
        echo "Install BetterCallClaude with:"
        echo "  curl -fsSL https://raw.githubusercontent.com/fedec65/bettercallclaude/main/install.sh | bash"
        exit 1
    fi

    local manifest="$INSTALL_DIR/manifest.json"

    # Installed version
    local installed_version="unknown"
    if [ -f "$INSTALL_DIR/version.txt" ]; then
        installed_version=$(cat "$INSTALL_DIR/version.txt")
    elif [ -f "$manifest" ]; then
        installed_version=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$manifest')).version)" 2>/dev/null) || installed_version="unknown"
    fi

    echo -e "${CYAN}Installed Version${NC}"
    echo "================="
    echo -e "  Version:    ${GREEN}v${installed_version}${NC}"
    echo "  Location:   $INSTALL_DIR"
    echo ""

    # MCP servers status
    echo -e "${CYAN}MCP Servers${NC}"
    echo "==========="
    if [ -f "$manifest" ]; then
        local mcp_dir=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$manifest')).paths.mcp_servers)" 2>/dev/null)
        if [ -d "$mcp_dir" ]; then
            for server_dir in "$mcp_dir"/*/; do
                if [ -d "$server_dir" ]; then
                    local server_name=$(basename "$server_dir")
                    # Skip non-server directories
                    if [ "$server_name" = "node_modules" ] || [ "$server_name" = "integration-tests" ]; then
                        continue
                    fi
                    if [ -f "$server_dir/dist/index.js" ] || [ -f "$server_dir/build/index.js" ]; then
                        echo -e "  ${GREEN}[✓]${NC} $server_name"
                    else
                        echo -e "  ${YELLOW}[!]${NC} $server_name (not built)"
                    fi
                fi
            done
        else
            echo -e "  ${YELLOW}[!]${NC} MCP directory not found: $mcp_dir"
        fi
    else
        echo -e "  ${YELLOW}[!]${NC} Manifest not found"
    fi
    echo ""

    # Check for updates
    echo -e "${CYAN}Update Check${NC}"
    echo "============"

    if [ ! -d "$INSTALL_DIR/.git" ]; then
        echo -e "  ${YELLOW}[!]${NC} Not a git repository, cannot check for updates"
        return
    fi

    cd "$INSTALL_DIR"

    echo -n "  Fetching latest version... "
    if ! git fetch origin --quiet 2>/dev/null; then
        echo -e "${YELLOW}failed${NC}"
        echo -e "  ${YELLOW}[!]${NC} Cannot connect to remote repository"
        return
    fi
    echo -e "${GREEN}done${NC}"

    local current=$(git rev-parse HEAD 2>/dev/null)
    local remote=$(git rev-parse origin/main 2>/dev/null)

    if [ -z "$current" ] || [ -z "$remote" ]; then
        echo -e "  ${YELLOW}[!]${NC} Cannot determine version status"
    elif [ "$current" = "$remote" ]; then
        echo -e "  ${GREEN}✓ You have the latest version!${NC}"
    else
        # Get remote version
        local remote_version=$(git show origin/main:version.txt 2>/dev/null || echo "unknown")
        echo -e "  ${YELLOW}⚡ Update available: v${remote_version}${NC}"
        echo ""

        # Ask if user wants to update (handle piped mode)
        local response
        echo -n "  Would you like to update now? [y/N]: "
        if [ "$USE_TTY" = true ]; then
            read -r response <&3
        else
            read -r response
        fi

        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo ""
            do_update
        else
            echo ""
            echo -e "  Run ${CYAN}./install.sh update${NC} or ${CYAN}bettercallclaude update${NC} to upgrade later"
        fi
    fi
    echo ""
}

# ============================================================================
# Update Function
# ============================================================================

do_update() {
    print_banner
    log_info "Updating BetterCallClaude..."

    # Find existing installation
    if [ -d "$CLAUDE_DIR/bettercallclaude" ]; then
        INSTALL_DIR="$CLAUDE_DIR/bettercallclaude"
    elif [ -d "./.bettercallclaude" ]; then
        INSTALL_DIR="./.bettercallclaude"
    else
        log_error "No existing installation found. Run 'install' first."
        exit 1
    fi

    # Load manifest for paths
    local manifest="$INSTALL_DIR/manifest.json"
    if [ -f "$manifest" ]; then
        MCP_SERVERS_DIR=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$manifest')).paths.mcp_servers)" 2>/dev/null) || \
        MCP_SERVERS_DIR="$INSTALL_DIR/mcp-servers"
    else
        MCP_SERVERS_DIR="$INSTALL_DIR/mcp-servers"
    fi

    create_backup

    cd "$INSTALL_DIR"

    # Stash local changes if any
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        log_warning "Local changes detected, stashing..."
        git stash
    fi

    # Pull updates
    git pull origin main || {
        log_error "Failed to pull updates"
        exit 1
    }

    # Extract updated version
    update_version_from_repo

    # Rebuild MCP servers
    setup_mcp_servers

    # Reinstall commands
    install_commands

    # Update manifest
    create_manifest

    log_success "Update complete!"
    echo ""
}

# ============================================================================
# Doctor Function
# ============================================================================

do_doctor() {
    print_banner
    log_info "Running health check..."

    # Delegate to CLI
    if [ -f "$CLAUDE_DIR/bettercallclaude/bin/bettercallclaude" ]; then
        "$CLAUDE_DIR/bettercallclaude/bin/bettercallclaude" doctor
    else
        log_error "Installation not found. Run installer first."
        exit 1
    fi
}

# ============================================================================
# Uninstall Function
# ============================================================================

do_uninstall() {
    print_banner
    log_info "Uninstalling BetterCallClaude..."

    # Delegate to CLI if exists
    if [ -f "$CLAUDE_DIR/bettercallclaude/bin/bettercallclaude" ]; then
        "$CLAUDE_DIR/bettercallclaude/bin/bettercallclaude" uninstall
    else
        # Manual uninstall
        log_warning "No CLI found, performing manual uninstall..."

        rm -f "$COMMANDS_DIR/legal-"*.md 2>/dev/null
        rm -f "$COMMANDS_DIR/agent-"*.md 2>/dev/null
        rm -rf "$CLAUDE_DIR/bettercallclaude" 2>/dev/null
        rm -rf "$DEFAULT_MCP_DIR" 2>/dev/null
        rm -f /usr/local/bin/bettercallclaude 2>/dev/null || true

        log_success "BetterCallClaude uninstalled."
    fi
}

# ============================================================================
# Help
# ============================================================================

print_help() {
    print_banner
    echo "Usage: install.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  install       Interactive installation (default)"
    echo "  update        Update existing installation"
    echo "  uninstall     Remove BetterCallClaude"
    echo "  doctor        Check installation health"
    echo "  version       Show version and check for updates"
    echo ""
    echo "Options:"
    echo "  --help, -h        Show this help"
    echo "  --force, -f       Force reinstall"
    echo "  --dry-run         Show what would be done"
    echo "  --no-interactive  Skip prompts, use defaults"
    echo "  --no-symlinks     Copy commands instead of symlinks"
    echo ""
    echo "Examples:"
    echo "  # Interactive install"
    echo "  curl -fsSL https://raw.githubusercontent.com/.../install.sh | bash"
    echo ""
    echo "  # Update existing"
    echo "  ./install.sh update"
    echo "  # or: bettercallclaude update"
    echo ""
    echo "Documentation: https://github.com/fedec65/BetterCallClaude"
}

# ============================================================================
# Main
# ============================================================================

main() {
    local command=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            install)
                command="install"
                shift
                ;;
            update|-u|--update)
                command="update"
                shift
                ;;
            uninstall)
                command="uninstall"
                shift
                ;;
            doctor|check)
                command="doctor"
                shift
                ;;
            version|-v|--version)
                command="version"
                shift
                ;;
            --help|-h)
                print_help
                exit 0
                ;;
            --force|-f)
                FORCE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --no-interactive)
                INTERACTIVE=false
                shift
                ;;
            --no-symlinks)
                USE_SYMLINKS=false
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                print_help
                exit 1
                ;;
        esac
    done

    # Default to install
    command="${command:-install}"

    # Initialize logging for install and update commands
    if [ "$command" = "install" ] || [ "$command" = "update" ]; then
        init_logging
        setup_error_trap
        log_to_file "Starting $command command"
    fi

    case "$command" in
        install)
            if [ "$INTERACTIVE" = true ]; then
                interactive_install
            else
                print_banner
                detect_platform
                check_prerequisites
                INSTALL_DIR="$CLAUDE_DIR/bettercallclaude"
                MCP_SERVERS_DIR="$DEFAULT_MCP_DIR/mcp-servers"
                perform_installation
            fi
            handle_success
            ;;
        update)
            do_update
            handle_success
            ;;
        uninstall)
            do_uninstall
            ;;
        doctor)
            do_doctor
            ;;
        version)
            do_version
            ;;
    esac
}

main "$@"
