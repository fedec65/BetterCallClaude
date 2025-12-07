#!/bin/bash
#
# BetterCallClaude Installer
# Swiss Legal Framework for Claude Code
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash
#
# Or with options:
#   curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash -s -- --help
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/fedec65/BetterCallClaude.git"
INSTALL_DIR="$HOME/.claude/bettercallclaude"
COMMANDS_DIR="$HOME/.claude/commands"
BACKUP_DIR="$HOME/.claude/backups/bettercallclaude-$(date +%Y%m%d-%H%M%S)"
VERSION_FILE="$INSTALL_DIR/version.txt"
CUSTOMIZATIONS_DIR="$HOME/.claude/customizations"

# Banner
print_banner() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}                   ${CYAN}BetterCallClaude Installer${NC}                  ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}               ${YELLOW}Swiss Legal Framework for Claude${NC}               ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Help message
print_help() {
    print_banner
    echo "Usage: install.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h       Show this help message"
    echo "  --update, -u     Update existing installation"
    echo "  --uninstall      Remove BetterCallClaude"
    echo "  --force, -f      Force reinstall (overwrite existing)"
    echo "  --no-symlinks    Copy commands instead of symlinks"
    echo "  --dry-run        Show what would be done without doing it"
    echo ""
    echo "Examples:"
    echo "  # Fresh install"
    echo "  curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash"
    echo ""
    echo "  # Update existing installation"
    echo "  bettercallclaude update"
    echo "  # or"
    echo "  curl -fsSL .../install.sh | bash -s -- --update"
    echo ""
    echo "Documentation: https://github.com/fedec65/BetterCallClaude"
    exit 0
}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_step() {
    echo -e "${CYAN}→${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    local missing=0

    # Check git
    if command -v git &> /dev/null; then
        log_success "Git detected"
    else
        log_error "Git not found. Please install git first."
        missing=1
    fi

    # Check ~/.claude directory
    if [ -d "$HOME/.claude" ]; then
        log_success "~/.claude directory exists"
    else
        log_warning "~/.claude directory not found. Creating it..."
        mkdir -p "$HOME/.claude"
        log_success "Created ~/.claude directory"
    fi

    # Check for Claude Code CLI (optional)
    if command -v claude &> /dev/null; then
        log_success "Claude Code CLI detected"
    else
        log_warning "Claude Code CLI not found (optional - works with Claude Code Desktop too)"
    fi

    # Check for Claude Code Desktop (macOS)
    if [ -d "/Applications/Claude.app" ] || [ -d "$HOME/Applications/Claude.app" ]; then
        log_success "Claude Code Desktop detected"
    else
        log_warning "Claude Code Desktop not found (optional - works with CLI too)"
    fi

    if [ $missing -eq 1 ]; then
        log_error "Missing required prerequisites. Please install them and try again."
        exit 1
    fi

    echo ""
}

# Check existing installation
check_existing() {
    if [ -d "$INSTALL_DIR" ]; then
        return 0
    else
        return 1
    fi
}

# Get current version
get_current_version() {
    if [ -f "$VERSION_FILE" ]; then
        cat "$VERSION_FILE"
    else
        echo "unknown"
    fi
}

# Create backup
create_backup() {
    if [ -d "$INSTALL_DIR" ]; then
        log_info "Creating backup..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$INSTALL_DIR" "$BACKUP_DIR/"
        log_success "Backup created at $BACKUP_DIR"
    fi
}

# Install from git
install_from_git() {
    log_info "Installing BetterCallClaude..."

    # Create parent directory if needed
    mkdir -p "$(dirname "$INSTALL_DIR")"

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would clone $REPO_URL to $INSTALL_DIR"
        return 0
    fi

    # Clone repository
    log_step "Cloning repository..."
    git clone --depth 1 "$REPO_URL" "$INSTALL_DIR" 2>/dev/null || {
        log_error "Failed to clone repository"
        exit 1
    }

    log_success "Repository cloned successfully"
}

# Update existing installation
update_installation() {
    log_info "Updating BetterCallClaude..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would pull latest changes in $INSTALL_DIR"
        return 0
    fi

    cd "$INSTALL_DIR"

    # Check for local changes
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Local changes detected. Stashing..."
        git stash
    fi

    # Pull latest
    git pull origin main 2>/dev/null || {
        log_error "Failed to update. Please check your internet connection."
        exit 1
    }

    log_success "Updated to latest version"
}

# Create command symlinks
create_symlinks() {
    log_info "Setting up commands..."

    # Create commands directory if needed
    mkdir -p "$COMMANDS_DIR"

    local command_source="$INSTALL_DIR/.claude/commands"

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would create symlinks from $command_source"
        log_success "Would install commands"
        return 0
    fi

    if [ ! -d "$command_source" ]; then
        log_error "Commands directory not found at $command_source"
        exit 1
    fi

    # Count commands
    local count=0

    for cmd_file in "$command_source"/*.md; do
        if [ -f "$cmd_file" ]; then
            local filename=$(basename "$cmd_file")
            local target="$COMMANDS_DIR/$filename"

            if [ "$DRY_RUN" = true ]; then
                log_step "[DRY RUN] Would symlink $filename"
                count=$((count + 1))
                continue
            fi

            # Remove existing symlink or file
            if [ -L "$target" ] || [ -f "$target" ]; then
                rm "$target"
            fi

            if [ "$USE_SYMLINKS" = true ]; then
                # Create symlink
                ln -s "$cmd_file" "$target"
            else
                # Copy file
                cp "$cmd_file" "$target"
            fi

            count=$((count + 1))
        fi
    done

    log_success "Installed $count commands"
}

# Configure CLAUDE.md imports
configure_imports() {
    log_info "Configuring framework imports..."

    local claude_md="$HOME/.claude/CLAUDE.md"
    local import_marker="# BetterCallClaude Framework"
    local import_block="
# BetterCallClaude Framework
# Swiss Legal Intelligence - https://github.com/fedec65/BetterCallClaude
@bettercallclaude/.claude/BETTERASK.md
@bettercallclaude/.claude/LEGAL_PRINCIPLES.md
@bettercallclaude/.claude/LEGAL_SYMBOLS.md
@bettercallclaude/.claude/SWISS_LAW_CONFIG.md
"

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would configure imports in $claude_md"
        return 0
    fi

    # Check if CLAUDE.md exists
    if [ -f "$claude_md" ]; then
        # Check if already configured
        if grep -q "$import_marker" "$claude_md"; then
            log_success "Imports already configured"
            return 0
        fi

        # Append imports
        echo "$import_block" >> "$claude_md"
        log_success "Added imports to existing CLAUDE.md"
    else
        # Create new CLAUDE.md
        echo "# Claude Code Configuration" > "$claude_md"
        echo "$import_block" >> "$claude_md"
        log_success "Created CLAUDE.md with imports"
    fi
}

# Create customizations directory
setup_customizations() {
    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would create $CUSTOMIZATIONS_DIR"
        return 0
    fi

    mkdir -p "$CUSTOMIZATIONS_DIR"

    # Create README for customizations
    if [ ! -f "$CUSTOMIZATIONS_DIR/README.md" ]; then
        cat > "$CUSTOMIZATIONS_DIR/README.md" << 'EOF'
# Customizations Directory

Place your custom overrides here. Files in this directory are:
- **Never modified** by BetterCallClaude updates
- **Loaded after** framework defaults
- **Safe** for your personal modifications

## Usage

To customize a command:
1. Copy the original from `~/.claude/bettercallclaude/.claude/commands/`
2. Paste here and modify as needed
3. The customized version takes precedence

## Example

```bash
# Copy and customize legal-research
cp ~/.claude/bettercallclaude/.claude/commands/legal-research.md \
   ~/.claude/customizations/legal-research.md

# Edit your version
nano ~/.claude/customizations/legal-research.md
```
EOF
    fi
}

# Install CLI wrapper
install_cli() {
    log_info "Installing CLI wrapper..."

    local cli_path="/usr/local/bin/bettercallclaude"
    local cli_script="$INSTALL_DIR/bin/bettercallclaude"

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would install CLI to $cli_path"
        return 0
    fi

    # Create bin directory
    mkdir -p "$INSTALL_DIR/bin"

    # Create CLI wrapper script
    cat > "$cli_script" << 'EOFCLI'
#!/bin/bash
#
# BetterCallClaude CLI
# Manage your BetterCallClaude installation
#

INSTALL_DIR="$HOME/.claude/bettercallclaude"
VERSION_FILE="$INSTALL_DIR/version.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

show_help() {
    echo ""
    echo "BetterCallClaude CLI - Swiss Legal Framework for Claude"
    echo ""
    echo "Usage: bettercallclaude <command>"
    echo ""
    echo "Commands:"
    echo "  update      Update to the latest version"
    echo "  uninstall   Remove BetterCallClaude"
    echo "  version     Show installed version"
    echo "  doctor      Check installation health"
    echo "  list        List installed commands"
    echo "  help        Show this help message"
    echo ""
}

cmd_update() {
    echo -e "${CYAN}Updating BetterCallClaude...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main
    echo -e "${GREEN}[✓] Updated successfully${NC}"
    cmd_version
}

cmd_uninstall() {
    echo -e "${YELLOW}Are you sure you want to uninstall BetterCallClaude? [y/N]${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Removing installation..."
        rm -rf "$INSTALL_DIR"
        rm -f "$HOME/.claude/commands/legal-"*.md
        rm -f "$HOME/.claude/commands/agent-"*.md
        rm -f "$HOME/.claude/commands/swiss"*.md
        rm -f "$HOME/.claude/commands/doc"*.md
        rm -f /usr/local/bin/bettercallclaude 2>/dev/null || true
        echo -e "${GREEN}[✓] BetterCallClaude uninstalled${NC}"
        echo ""
        echo "Note: Your customizations in ~/.claude/customizations/ were preserved."
    else
        echo "Uninstall cancelled."
    fi
}

cmd_version() {
    if [ -f "$VERSION_FILE" ]; then
        echo "BetterCallClaude $(cat "$VERSION_FILE")"
    else
        # Try to get version from git
        cd "$INSTALL_DIR" 2>/dev/null && git describe --tags 2>/dev/null || echo "BetterCallClaude (version unknown)"
    fi
}

cmd_doctor() {
    echo ""
    echo "BetterCallClaude Health Check"
    echo "=============================="
    echo ""

    local issues=0

    # Check installation directory
    if [ -d "$INSTALL_DIR" ]; then
        echo -e "${GREEN}[✓]${NC} Installation directory exists"
    else
        echo -e "${RED}[✗]${NC} Installation directory missing"
        issues=$((issues + 1))
    fi

    # Check git repo
    if [ -d "$INSTALL_DIR/.git" ]; then
        echo -e "${GREEN}[✓]${NC} Git repository intact (updatable)"
    else
        echo -e "${YELLOW}[!]${NC} Git repository missing (ejected mode)"
    fi

    # Check commands
    local cmd_count=$(ls -1 "$HOME/.claude/commands/"*.md 2>/dev/null | wc -l | tr -d ' ')
    if [ "$cmd_count" -gt 0 ]; then
        echo -e "${GREEN}[✓]${NC} $cmd_count commands installed"
    else
        echo -e "${RED}[✗]${NC} No commands found"
        issues=$((issues + 1))
    fi

    # Check symlinks
    local broken_links=0
    for link in "$HOME/.claude/commands/"*.md; do
        if [ -L "$link" ] && [ ! -e "$link" ]; then
            broken_links=$((broken_links + 1))
        fi
    done
    if [ "$broken_links" -gt 0 ]; then
        echo -e "${RED}[✗]${NC} $broken_links broken symlinks"
        issues=$((issues + 1))
    else
        echo -e "${GREEN}[✓]${NC} All symlinks valid"
    fi

    # Check Claude Code
    if command -v claude &> /dev/null; then
        echo -e "${GREEN}[✓]${NC} Claude Code CLI available"
    else
        echo -e "${YELLOW}[!]${NC} Claude Code CLI not found"
    fi

    echo ""
    if [ "$issues" -eq 0 ]; then
        echo -e "${GREEN}All checks passed!${NC}"
    else
        echo -e "${RED}$issues issue(s) found. Consider reinstalling.${NC}"
    fi
    echo ""
}

cmd_list() {
    echo ""
    echo "Installed BetterCallClaude Commands"
    echo "===================================="
    echo ""

    echo -e "${CYAN}Legal Commands:${NC}"
    for cmd in "$HOME/.claude/commands/legal-"*.md; do
        if [ -f "$cmd" ]; then
            local name=$(basename "$cmd" .md)
            echo "  /$name"
        fi
    done

    echo ""
    echo -e "${CYAN}Agent Commands:${NC}"
    for cmd in "$HOME/.claude/commands/agent-"*.md; do
        if [ -f "$cmd" ]; then
            local name=$(basename "$cmd" .md)
            echo "  /$name"
        fi
    done

    echo ""
    echo -e "${CYAN}Swiss Law Commands:${NC}"
    for cmd in "$HOME/.claude/commands/swiss"*.md "$HOME/.claude/commands/doc"*.md; do
        if [ -f "$cmd" ]; then
            local name=$(basename "$cmd" .md)
            echo "  /$name"
        fi
    done

    echo ""
}

# Main command handler
case "${1:-help}" in
    update)
        cmd_update
        ;;
    uninstall)
        cmd_uninstall
        ;;
    version|--version|-v)
        cmd_version
        ;;
    doctor|check)
        cmd_doctor
        ;;
    list|commands)
        cmd_list
        ;;
    help|--help|-h|*)
        show_help
        ;;
esac
EOFCLI

    chmod +x "$cli_script"

    # Try to symlink to /usr/local/bin (may need sudo)
    if [ -w "/usr/local/bin" ]; then
        ln -sf "$cli_script" "$cli_path"
        log_success "CLI installed to $cli_path"
    else
        log_warning "Cannot write to /usr/local/bin. Run manually:"
        echo "  sudo ln -sf $cli_script $cli_path"
        log_success "CLI created at $cli_script"
    fi
}

# Print completion message
print_completion() {
    local version=$(get_current_version)

    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Installation complete!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "Version: ${CYAN}$version${NC}"
    echo ""
    echo -e "${YELLOW}Available commands:${NC}"
    echo "  /legal-research    - Swiss legal research"
    echo "  /legal-strategy    - Case strategy development"
    echo "  /legal-draft       - Document drafting"
    echo "  /legal-cite        - Citation formatting"
    echo "  /legal-federal     - Federal law lookup"
    echo "  /legal-cantonal    - Cantonal law lookup"
    echo "  /legal-help        - Show all legal commands"
    echo ""
    echo -e "${YELLOW}Management:${NC}"
    echo "  bettercallclaude update     - Update to latest version"
    echo "  bettercallclaude doctor     - Check installation health"
    echo "  bettercallclaude list       - List installed commands"
    echo "  bettercallclaude uninstall  - Remove framework"
    echo ""
    echo -e "${YELLOW}Documentation:${NC}"
    echo "  https://github.com/fedec65/BetterCallClaude"
    echo ""
    echo -e "${CYAN}Start Claude Code and type /legal-help to get started!${NC}"
    echo ""
}

# Uninstall
do_uninstall() {
    log_info "Uninstalling BetterCallClaude..."

    if [ "$DRY_RUN" = true ]; then
        log_step "[DRY RUN] Would remove $INSTALL_DIR"
        log_step "[DRY RUN] Would remove command symlinks"
        return 0
    fi

    # Remove symlinks
    rm -f "$COMMANDS_DIR/legal-"*.md 2>/dev/null
    rm -f "$COMMANDS_DIR/agent-"*.md 2>/dev/null
    rm -f "$COMMANDS_DIR/swiss"*.md 2>/dev/null
    rm -f "$COMMANDS_DIR/doc"*.md 2>/dev/null

    # Remove installation directory
    rm -rf "$INSTALL_DIR"

    # Remove CLI
    rm -f /usr/local/bin/bettercallclaude 2>/dev/null || true

    log_success "BetterCallClaude uninstalled"
    echo ""
    echo "Note: Your customizations in ~/.claude/customizations/ were preserved."
    echo "Note: CLAUDE.md was not modified. Remove BetterCallClaude imports manually if desired."
}

# Parse arguments
FORCE=false
UPDATE=false
UNINSTALL=false
USE_SYMLINKS=true
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            print_help
            ;;
        --update|-u)
            UPDATE=true
            shift
            ;;
        --uninstall)
            UNINSTALL=true
            shift
            ;;
        --force|-f)
            FORCE=true
            shift
            ;;
        --no-symlinks)
            USE_SYMLINKS=false
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            print_help
            ;;
    esac
done

# Main execution
main() {
    print_banner

    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN MODE - No changes will be made"
        echo ""
    fi

    # Handle uninstall
    if [ "$UNINSTALL" = true ]; then
        do_uninstall
        exit 0
    fi

    check_prerequisites

    # Check for existing installation
    if check_existing; then
        if [ "$UPDATE" = true ]; then
            create_backup
            update_installation
            create_symlinks
            print_completion
        elif [ "$FORCE" = true ]; then
            log_warning "Force reinstall requested"
            create_backup
            rm -rf "$INSTALL_DIR"
            install_from_git
            create_symlinks
            configure_imports
            setup_customizations
            install_cli
            print_completion
        else
            log_warning "BetterCallClaude is already installed."
            echo ""
            echo "Options:"
            echo "  --update  Update to latest version"
            echo "  --force   Force reinstall"
            echo ""
            echo "Or run: bettercallclaude update"
            exit 0
        fi
    else
        # Fresh install
        install_from_git
        create_symlinks
        configure_imports
        setup_customizations
        install_cli
        print_completion
    fi
}

# Run main
main
