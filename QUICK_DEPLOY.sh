#!/bin/bash
# BetterCallClaude - Quick GitHub Deploy
# Copy and paste these commands into your terminal

cd /Users/federicocesconi/Dev/BetterCallClaude

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "Initializing git..."
    git init
    git branch -M main
fi

# Create .gitignore
cat > .gitignore << 'EOF'
.DS_Store
.vscode/
.idea/
*.swp
node_modules/
*.log
.env
.env.local
dist/
build/
mcp-servers/*/node_modules/
mcp-servers/*/dist/
mcp-servers/*/.env
EOF

# Add all files
git add .

# Commit
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
- Comprehensive README with installation and usage
- Complete installation guide (INSTALLATION.md)
- Detailed usage guide (USAGE_GUIDE.md)
- Development roadmap (IMPLEMENTATION_STATUS.md)
- Git setup documentation

Target Users: Swiss lawyers and legal professionals
Framework: Claude Code v1.0+

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Add remote
git remote add origin https://github.com/fedec65/BetterCallClaude.git 2>/dev/null || git remote set-url origin https://github.com/fedec65/BetterCallClaude.git

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "🌐 Visit: https://github.com/fedec65/BetterCallClaude"
