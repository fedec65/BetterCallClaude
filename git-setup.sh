#!/bin/bash

# BetterCallClaude - Git Repository Setup Script
# This script initializes the git repository and pushes to GitHub

set -e  # Exit on error

echo "=========================================="
echo "BetterCallClaude - Git Setup"
echo "=========================================="
echo ""

# Navigate to project directory
PROJECT_DIR="/Users/federicocesconi/Dev/BetterCallClaude"
echo "📁 Navigating to: $PROJECT_DIR"
cd "$PROJECT_DIR"

# Check if git is already initialized
if [ -d ".git" ]; then
    echo "✅ Git repository already initialized"
else
    echo "🔧 Initializing git repository..."
    git init
    echo "✅ Git initialized"
fi

# Configure git user (if not already set globally)
if [ -z "$(git config user.name)" ]; then
    echo "⚙️  Setting git user configuration..."
    read -p "Enter your name: " GIT_NAME
    read -p "Enter your email: " GIT_EMAIL
    git config user.name "$GIT_NAME"
    git config user.email "$GIT_EMAIL"
    echo "✅ Git user configured"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# macOS
.DS_Store
.AppleDouble
.LSOverride

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Node.js (for future MCP servers)
node_modules/
npm-debug.log
yarn-error.log
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# Database
*.db
*.sqlite
*.sqlite3

# Build artifacts
dist/
build/
*.tgz

# Temporary files
tmp/
temp/
*.tmp

# Testing
coverage/
.nyc_output/

# MCP Server specific (Phase 2)
mcp-servers/*/node_modules/
mcp-servers/*/dist/
mcp-servers/*/.env

# Cache
.cache/
*.cache
EOF
    echo "✅ .gitignore created"
fi

# Check current git status
echo ""
echo "📊 Current git status:"
git status

# Add all files
echo ""
echo "➕ Adding all files to git..."
git add .

# Show what will be committed
echo ""
echo "📋 Files to be committed:"
git status --short

# Create commit
echo ""
echo "💾 Creating commit..."
git commit -m "Initial commit: BetterCallClaude Framework v1.0.0-alpha

Foundation Phase Complete (100%)

Core Framework:
- Legal Principles and Swiss Law Configuration
- Citation and Symbol System
- Multi-lingual support (DE/FR/IT/EN)

Personas (3/3):
- Legal Researcher: BGE research, statute interpretation
- Case Strategist: Litigation strategy, risk assessment
- Legal Drafter: Contract drafting, document generation

Modes (3/3):
- Federal Law: Swiss federal statutes and BGE
- Cantonal Law: 6 cantons (ZH/BE/GE/BS/VD/TI)
- Multi-Lingual: Native DE/FR/IT/EN reasoning

MCP Specifications (2/2):
- Entscheidsuche: Court decision search spec
- Legal Citations: Citation verification spec

Documentation:
- Comprehensive README
- Complete installation guide (INSTALLATION.md)
- Detailed usage guide (USAGE_GUIDE.md)
- Development roadmap (IMPLEMENTATION_STATUS.md)

Target Users: Swiss lawyers and legal professionals
License: Open source (to be added)
Framework: Claude Code v1.0+

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

echo "✅ Commit created"

# Add GitHub remote
GITHUB_URL="https://github.com/fedec65/BetterCallClaude.git"
echo ""
echo "🔗 Adding GitHub remote: $GITHUB_URL"

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists, updating URL..."
    git remote set-url origin "$GITHUB_URL"
else
    git remote add origin "$GITHUB_URL"
fi

echo "✅ Remote configured"

# Verify remote
echo ""
echo "🔍 Verifying remote configuration:"
git remote -v

# Set main branch
echo ""
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo ""
echo "🚀 Ready to push to GitHub!"
echo ""
read -p "Push to GitHub now? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
    echo "📤 Pushing to GitHub..."
    git push -u origin main
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository: https://github.com/fedec65/BetterCallClaude"
else
    echo "⏸️  Skipped push. To push manually later, run:"
    echo "   git push -u origin main"
fi

echo ""
echo "=========================================="
echo "✅ Git Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Visit: https://github.com/fedec65/BetterCallClaude"
echo "2. Review repository settings"
echo "3. Add license (recommended: MIT or Apache 2.0)"
echo "4. Enable GitHub Pages for documentation"
echo "5. Share with Swiss legal community!"
echo ""
