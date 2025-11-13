# BetterCallClaude - Installation Guide

**Complete Installation and Setup Guide for Swiss Legal Intelligence Framework**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Claude Code Setup](#claude-code-setup)
5. [MCP Server Configuration](#mcp-server-configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

#### 1. Claude Code CLI
**What it is**: Anthropic's official CLI tool for Claude AI assistant
**Why needed**: BetterCallClaude is built as a Claude Code framework

**Installation**:
```bash
# macOS/Linux
curl -fsSL https://claude.ai/install.sh | sh

# Verify installation
claude-code --version
```

**Documentation**: https://docs.claude.com/claude-code

#### 2. Node.js (v18 or higher)
**Why needed**: Required for MCP server implementation

```bash
# macOS with Homebrew
brew install node

# Verify installation
node --version  # Should be v18+
npm --version
```

#### 3. Git
**Why needed**: Version control and repository management

```bash
# macOS with Homebrew
brew install git

# Verify
git --version
```

### Optional but Recommended

#### PostgreSQL (for MCP servers - Phase 2)
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15
```

#### Redis (for caching - Phase 2)
```bash
# macOS with Homebrew
brew install redis
brew services start redis
```

---

## System Requirements

### Minimum Requirements
- **OS**: macOS 12+, Linux (Ubuntu 20.04+), Windows 10+ (WSL2)
- **RAM**: 8 GB
- **Disk Space**: 2 GB free
- **Internet**: Required for Claude API and MCP servers

### Recommended Requirements
- **OS**: macOS 13+ (Ventura or later)
- **RAM**: 16 GB
- **Disk Space**: 5 GB free
- **Internet**: Stable broadband connection

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Navigate to your development directory
cd ~/Dev  # or your preferred location

# Clone the repository
git clone https://github.com/fedec65/BetterCallClaude.git

# Navigate into the project
cd BetterCallClaude
```

### Step 2: Verify Project Structure

```bash
# Check that all core files are present
ls -la

# Expected structure:
# BetterCallClaude/
# ├── README.md
# ├── INSTALLATION.md (this file)
# ├── USAGE_GUIDE.md
# ├── IMPLEMENTATION_STATUS.md
# ├── .claude/
# │   ├── BETTERASK.md
# │   ├── LEGAL_PRINCIPLES.md
# │   ├── LEGAL_SYMBOLS.md
# │   ├── SWISS_LAW_CONFIG.md
# │   ├── personas/
# │   │   ├── PERSONA_Legal_Researcher.md
# │   │   ├── PERSONA_Case_Strategist.md
# │   │   └── PERSONA_Legal_Drafter.md
# │   ├── modes/
# │   │   ├── MODE_Federal_Law.md
# │   │   ├── MODE_Cantonal_Law.md
# │   │   └── MODE_Multi_Lingual.md
# │   └── mcp/
# │       ├── MCP_Entscheidsuche.md
# │       └── MCP_Legal_Citations.md
# └── mcp-servers/ (Phase 2)
```

### Step 3: Verify Framework Files

```bash
# Check core framework files
cat .claude/BETTERASK.md | head -20

# Should show: "BetterCallClaude Framework Entry Point"
```

---

## Claude Code Setup

### Step 1: Initialize Claude Code in Project

```bash
# Ensure you're in the BetterCallClaude directory
cd /path/to/BetterCallClaude

# Launch Claude Code in this directory
claude-code
```

**What happens**:
- Claude Code recognizes the `.claude/` directory
- Automatically loads all framework files
- Activates BetterCallClaude framework
- Personas and modes become available

### Step 2: Verify Framework Activation

Once Claude Code starts, enter this command:

```
Show me the active framework configuration
```

**Expected response**:
```
✅ BetterCallClaude Framework Active

**Loaded Components**:
- 📚 Core: BETTERASK.md, LEGAL_PRINCIPLES.md, LEGAL_SYMBOLS.md, SWISS_LAW_CONFIG.md
- 👤 Personas: Legal Researcher, Case Strategist, Legal Drafter
- 🔧 Modes: Federal Law, Cantonal Law, Multi-Lingual
- 🔌 MCP Specs: Entscheidsuche, Legal Citations
```

### Step 3: Test Framework with Simple Query

Try a basic Swiss law query:

```
What is Art. 97 OR about?
```

**Expected behavior**:
- Framework recognizes Swiss legal citation
- Federal Law mode activates automatically
- Provides explanation in requested language (DE/FR/IT/EN)
- Includes proper citation format

---

## MCP Server Configuration

**Note**: MCP servers (Phase 2) require additional setup. For v1.0 MVP, the framework works with specifications only.

### Future Setup (Phase 2)

#### 1. Entscheidsuche MCP Server

**Purpose**: Swiss court decision search (bundesgericht.ch + cantonal courts)

```bash
# Navigate to MCP servers directory
cd mcp-servers/entscheidsuche

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Add API keys and database connection

# Start server
npm start
```

#### 2. Legal Citations MCP Server

**Purpose**: Citation verification with Fedlex integration

```bash
cd mcp-servers/legal-citations

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Add Fedlex API credentials

# Start server
npm start
```

#### 3. Register MCP Servers with Claude Code

```bash
# Edit Claude Code MCP configuration
nano ~/.config/claude-code/mcp.json
```

Add:
```json
{
  "mcpServers": {
    "entscheidsuche": {
      "command": "node",
      "args": ["/path/to/BetterCallClaude/mcp-servers/entscheidsuche/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/entscheidsuche"
      }
    },
    "legal-citations": {
      "command": "node",
      "args": ["/path/to/BetterCallClaude/mcp-servers/legal-citations/dist/index.js"],
      "env": {
        "FEDLEX_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

---

## Verification

### Verification Checklist

Run through these checks to ensure proper installation:

#### ✅ Framework Activation
```
# In Claude Code, ask:
"Is BetterCallClaude framework active?"

# Expected: Confirmation with loaded components list
```

#### ✅ Persona Recognition
```
# In Claude Code, ask:
"I need legal research help"

# Expected: Legal Researcher persona activates automatically
```

#### ✅ Multi-Lingual Support
```
# In Claude Code, try:
"Erkläre mir Art. 97 OR"  # German
"Explique-moi l'art. 97 CO"  # French
"Spiegami l'art. 97 CO"  # Italian

# Expected: Native language responses with proper legal terminology
```

#### ✅ Canton Routing
```
# In Claude Code, ask:
"What are the construction regulations in Zurich?"

# Expected: Canton detection → Zürich-specific analysis
```

#### ✅ Citation System
```
# In Claude Code, ask:
"Cite BGE 145 III 229"

# Expected: Proper formatted citation with language adaptation
```

### Verification Output

**Successful Installation Output**:
```
✅ BetterCallClaude Framework: Active
✅ Core Files: 13/13 loaded
✅ Personas: 3/3 available
✅ Modes: 3/3 operational
✅ Multi-Lingual: DE/FR/IT/EN ready
✅ Canton Coverage: 6 cantons configured
✅ Citation System: Loaded

🎉 Installation Complete!
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Framework Not Loading

**Symptoms**:
- Claude Code doesn't recognize legal citations
- Personas don't activate automatically
- No multi-lingual support

**Solution**:
```bash
# 1. Verify you're in the correct directory
pwd  # Should show /path/to/BetterCallClaude

# 2. Check .claude directory exists
ls -la .claude/

# 3. Restart Claude Code from project directory
exit  # Exit current session
claude-code  # Restart in project directory
```

#### Issue 2: Missing Framework Files

**Symptoms**:
- Error: "File not found: .claude/BETTERASK.md"
- Incomplete persona/mode loading

**Solution**:
```bash
# Verify all files present
find .claude -name "*.md" -type f

# Should show 13 files:
# - 4 core files (BETTERASK, LEGAL_PRINCIPLES, LEGAL_SYMBOLS, SWISS_LAW_CONFIG)
# - 3 personas
# - 3 modes
# - 2 MCP specs

# If files missing, re-clone repository
```

#### Issue 3: Language Detection Not Working

**Symptoms**:
- Queries in French/Italian get German responses
- Citation formats don't adapt to language

**Solution**:
```bash
# Verify MODE_Multi_Lingual.md is loaded
cat .claude/modes/MODE_Multi_Lingual.md | head -20

# Should show: "MODE: Multi-Lingual - BetterCallClaude Framework"

# If file exists but not working, restart Claude Code
```

#### Issue 4: Canton Routing Errors

**Symptoms**:
- Canton-specific queries treated as federal law
- Incorrect jurisdiction routing

**Solution**:
```bash
# Check SWISS_LAW_CONFIG.md
cat .claude/SWISS_LAW_CONFIG.md | grep -A 5 "canton_configurations"

# Should show 6 cantons: ZH, BE, GE, BS, VD, TI

# Try explicit canton specification:
"What are Zürich (ZH) construction laws?"
```

#### Issue 5: Claude Code Installation Issues

**Symptoms**:
- `claude-code: command not found`
- Installation script fails

**Solution**:
```bash
# 1. Check if Claude Code is in PATH
echo $PATH | grep claude

# 2. Manually add to PATH (if needed)
export PATH="$HOME/.local/bin:$PATH"

# 3. Reload shell configuration
source ~/.zshrc  # or ~/.bashrc

# 4. Verify installation
which claude-code
claude-code --version
```

### Getting Help

If issues persist:

1. **Check Documentation**: Review USAGE_GUIDE.md for workflow examples
2. **GitHub Issues**: https://github.com/fedec65/BetterCallClaude/issues
3. **Claude Code Docs**: https://docs.claude.com/claude-code
4. **Community**: (Future) Swiss legal tech community forum

---

## Next Steps

### After Successful Installation

1. **Read USAGE_GUIDE.md**: Learn how to use each persona and workflow
2. **Try Example Queries**: Test framework with real legal questions
3. **Explore Canton Configurations**: Test jurisdiction-specific routing
4. **Multi-Lingual Testing**: Try queries in all 4 languages

### Development Roadmap

**Current: v1.0 MVP (Foundation Phase - 100% Complete)**
- ✅ 3 Legal Personas
- ✅ 3 Operational Modes
- ✅ 6 Canton Coverage
- ✅ Multi-Lingual Support (DE/FR/IT/EN)
- ✅ 2 MCP Server Specifications

**Next: v1.1 (MCP Implementation - 6-8 weeks)**
- ⏳ Entscheidsuche MCP server implementation
- ⏳ Legal Citations MCP server implementation
- ⏳ Database integration (PostgreSQL)
- ⏳ Cache layer (Redis)
- ⏳ Fedlex API integration

**Future: v1.2+ (Enhancements)**
- Local LLM support (Ollama)
- Remaining 20 cantons
- Additional practice areas
- Advanced analytics

### Contributing

BetterCallClaude is open source! Contributions welcome:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

See IMPLEMENTATION_STATUS.md for development priorities.

---

## Quick Reference

### Essential Commands

```bash
# Start Claude Code in project
cd /path/to/BetterCallClaude && claude-code

# Verify framework status
# In Claude Code: "Show framework status"

# Test legal research
# In Claude Code: "I need help with Art. 97 OR"

# Test multi-lingual
# In Claude Code: "Erkläre mir das Obligationenrecht"

# Test canton routing
# In Claude Code: "Zürich construction regulations"
```

### Key Files Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| README.md | Project overview | First-time introduction |
| INSTALLATION.md | This file | Setup and configuration |
| USAGE_GUIDE.md | Workflows and examples | Day-to-day usage |
| IMPLEMENTATION_STATUS.md | Development roadmap | Contributors and developers |
| .claude/BETTERASK.md | Framework entry point | Framework architecture |
| .claude/LEGAL_PRINCIPLES.md | Swiss legal foundations | Understanding legal reasoning |

---

## Support

- **Email**: support@bettercallclaude.dev (Future)
- **GitHub**: https://github.com/fedec65/BetterCallClaude
- **Documentation**: See USAGE_GUIDE.md
- **Issues**: Report bugs via GitHub Issues

---

**Installation Guide Version**: 1.0.0
**Last Updated**: 2025-01-12
**Framework Version**: v1.0.0-alpha (Foundation Phase Complete)

**Built with ❤️ for the Swiss legal community**
