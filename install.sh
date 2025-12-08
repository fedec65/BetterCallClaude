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

VERSION="1.3.2"
REPO_URL="https://github.com/fedec65/BetterCallClaude.git"
REPO_RAW_URL="https://raw.githubusercontent.com/fedec65/BetterCallClaude/main"

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

# Installation state
INSTALL_DIR=""
MCP_SERVERS_DIR=""
USE_VENV=true
USE_SYMLINKS=true
SCOPE="global"
DRY_RUN=false
FORCE=false
INTERACTIVE=true

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
    if check_command node; then
        local node_ver=$(get_version node)
        local node_major=$(echo "$node_ver" | cut -d. -f1)
        if [ "$node_major" -ge 18 ]; then
            log_success "Node.js: $node_ver (>= 18 required)"
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
        if [ "$py_major" -ge 3 ] && [ "$py_minor" -ge 10 ]; then
            log_success "Python: $py_ver (>= 3.10 required)"
            PYTHON_CMD="$python_cmd"
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

    read -r -p "$prompt" response
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
    read -r -p "Choose [1-${#options[@]}] (default: $default): " choice
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
    read -r -p "  [Enter] to accept or type custom path: " path
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

    # Backup existing commands
    if [ -d "$COMMANDS_DIR" ]; then
        cp -r "$COMMANDS_DIR" "$BACKUP_DIR/"
        log_step "Backed up commands directory"
    fi

    # Backup existing CLAUDE.md
    if [ -f "$CLAUDE_DIR/CLAUDE.md" ]; then
        cp "$CLAUDE_DIR/CLAUDE.md" "$BACKUP_DIR/"
        log_step "Backed up CLAUDE.md"
    fi

    # Backup existing installation
    if [ -d "$INSTALL_DIR" ]; then
        cp -r "$INSTALL_DIR" "$BACKUP_DIR/"
        log_step "Backed up previous installation"
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

    # Remove existing if force
    if [ -d "$INSTALL_DIR" ] && [ "$FORCE" = true ]; then
        rm -rf "$INSTALL_DIR"
    fi

    # Clone
    git clone --depth 1 "$REPO_URL" "$INSTALL_DIR" 2>/dev/null || {
        log_error "Failed to clone repository"
        exit 1
    }

    log_success "Repository cloned to: $INSTALL_DIR"
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

    # Build each MCP server
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
    echo "BetterCallClaude v$(get_version)"
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
        git pull origin main
        echo -e "${GREEN}Updated successfully!${NC}"
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
    read -r response

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

    # Try to symlink to PATH
    if [ -w "/usr/local/bin" ]; then
        ln -sf "$cli_script" "/usr/local/bin/bettercallclaude"
        log_success "CLI installed to /usr/local/bin/bettercallclaude"
    elif [ -d "$HOME/.local/bin" ]; then
        ln -sf "$cli_script" "$HOME/.local/bin/bettercallclaude"
        log_success "CLI installed to ~/.local/bin/bettercallclaude"
    else
        log_warning "Could not install CLI to PATH. Run manually:"
        echo "  $cli_script"
    fi
}

perform_installation() {
    echo ""
    echo -e "${BOLD}⚙️  Installing BetterCallClaude...${NC}"
    echo ""

    clone_repository
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
            ;;
        update)
            do_update
            ;;
        uninstall)
            do_uninstall
            ;;
        doctor)
            do_doctor
            ;;
    esac
}

main "$@"
