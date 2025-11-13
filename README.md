# BetterCallClaude Framework

**Legal Intelligence Framework for Swiss Lawyers**

[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Language Support](https://img.shields.io/badge/languages-DE%20|%20FR%20|%20IT%20|%20EN-orange)]()

---

## 🎯 Overview

**BetterCallClaude** is a CLI-based legal intelligence framework built on Claude Code, specifically designed for Swiss lawyers. It provides AI-powered legal research, case strategy development, and document drafting capabilities with deep understanding of Swiss federal and cantonal law.

### Key Features

- **Multi-Jurisdictional Swiss Law** - Federal + 6 major cantons (ZH, BE, GE, BS, VD, TI)
- **Multi-Lingual** - Native support for German, French, Italian, and English
- **Legal Research** - BGE precedent analysis, statute lookup, citation verification
- **Case Strategy** - Strategic analysis, risk assessment, argumentation development
- **Document Drafting** - Swiss-standard contracts, briefs, and legal opinions
- **Privacy-First** - Anwaltsgeheimnis compliant with local LLM support (coming in v1.1)
- **Open Source** - MIT licensed, community-driven

### Success Targets

- **80% time savings** on legal research and precedent analysis
- **25% quality improvement** through systematic verification
- **>95% citation accuracy** via automated verification

---

## 🚀 Quick Start

### Prerequisites

- [Claude Code](https://claude.com/claude-code) installed and configured
- Node.js 18+ (for MCP servers)
- macOS, Linux, or Windows

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/BetterCallClaude.git
cd BetterCallClaude

# Install MCP servers
cd mcp-servers/entscheidsuche && npm install && cd ../..
cd mcp-servers/legal-citations && npm install && cd ../..

# Configure Claude Code to use BetterCallClaude
# Copy .claude/ directory to your user configuration:
cp -r .claude ~/.claude/betterask/

# Or add to your project-specific .claude/ directory
```

### Configuration

Edit `~/.betterask/config.yaml`:

```yaml
# Privacy mode: strict (local) | balanced (hybrid) | cloud (full)
privacy_mode: balanced

# LLM backend: anthropic (default) | ollama (v1.1+)
llm_backend: anthropic

# Your practice focus
canton_focus: ["ZH", "GE"]  # Primary jurisdictions
languages: ["de", "fr", "en"]
practice_areas: ["corporate", "litigation"]

# Optional: Commercial database credentials
commercial_databases:
  swisslex:
    enabled: false
    api_key: ""
  weblaw:
    enabled: false
    api_key: ""
```

---

## 📖 Usage

### Basic Legal Research

```bash
# Start Claude Code in your working directory
claude-code

# Activate Legal Researcher persona
"I need to research BGE precedents on contractual liability under Art. 97 OR"

# BetterCallClaude will:
# 1. Activate Legal Researcher persona
# 2. Search bundesgericht.ch via entscheidsuche MCP
# 3. Extract relevant BGE decisions
# 4. Verify citations via legal-citations MCP
# 5. Present structured analysis in your preferred language
```

### Case Strategy Development

```bash
"Analyze litigation strategy for breach of contract case, ZH jurisdiction,
considering BGE 142 III 102 and recent cantonal precedents"

# Case Strategist persona will:
# 1. Analyze relevant precedents
# 2. Assess procedural options (ZPO Zürich)
# 3. Evaluate strengths/weaknesses
# 4. Develop strategic recommendations
```

### Document Drafting

```bash
"Draft a Swiss share purchase agreement (DE) for software company acquisition,
considering Art. 216 OR and standard market practices"

# Legal Drafter persona will:
# 1. Select appropriate legal framework
# 2. Draft provisions with proper citations
# 3. Ensure multi-lingual terminology consistency
# 4. Verify citation accuracy
```

---

## 🏗️ Architecture

### Framework Structure

```
BetterCallClaude/
├── .claude/                    # Framework configuration
│   ├── BETTERASK.md           # Main entry point
│   ├── LEGAL_PRINCIPLES.md    # Swiss legal reasoning
│   ├── LEGAL_SYMBOLS.md       # Citation symbols
│   ├── SWISS_LAW_CONFIG.md    # Jurisdiction routing
│   ├── personas/              # Legal expert personas
│   ├── modes/                 # Swiss law operation modes
│   └── mcp/                   # MCP server documentation
│
├── mcp-servers/               # Custom MCP implementations
│   ├── entscheidsuche/       # Court decision search
│   ├── legal-citations/      # Citation verification
│   └── commercial-db-plugins/ # Optional database plugins
│
├── version-manager/           # Version control system
└── docs/                      # Documentation
```

### Core Components

**Legal Personas** (3 in v1.0):
- **Legal Researcher** - Precedent analysis, statute lookup
- **Case Strategist** - Strategy development, risk assessment
- **Legal Drafter** - Document generation

**Swiss Law Modes**:
- **Federal Law** - ZGB, OR, StGB, StPO, ZPO
- **Cantonal Law** - ZH, BE, GE, BS, VD, TI
- **Multi-Lingual** - DE/FR/IT/EN with terminology precision

**MCP Servers**:
- **entscheidsuche** - Swiss court decision search
- **legal-citations** - Citation extraction and verification

---

## 🌍 Multi-Lingual Support

BetterCallClaude natively supports all Swiss official languages plus English:

- **German (DE)** - Art. 1 OR, BGE 145 III 229
- **French (FR)** - art. 1 CO, ATF 145 III 229
- **Italian (IT)** - art. 1 CO, DTF 145 III 229
- **English (EN)** - Art. 1 OR (international contexts)

The framework automatically:
- Detects input language
- Maintains language consistency
- Handles mixed-language queries
- Translates legal terminology accurately
- Adapts citation formats

---

## 📚 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [Legal Workflows](docs/workflows/)
  - [BGE Precedent Research](docs/workflows/research-precedents.md)
  - [Case Strategy Development](docs/workflows/case-strategy.md)
  - [Contract Drafting](docs/workflows/draft-contracts.md)
- [Multi-Lingual Documentation](docs/languages/)
  - [Deutsch](docs/languages/de/)
  - [Français](docs/languages/fr/)
  - [Italiano](docs/languages/it/)
- [Video Tutorials](docs/tutorials/) (Coming soon)

---

## 🔄 Version Management

BetterCallClaude includes a built-in version management system for easy upgrades and rollbacks:

```bash
# Check current version
betterask --version

# List available versions
betterask version list

# Upgrade to latest
betterask version upgrade

# Rollback if needed
betterask version rollback
```

---

## 🛣️ Roadmap

### v1.0 (Current - MVP)
- ✅ 3 core personas (Researcher, Strategist, Drafter)
- ✅ 6 cantons (ZH, BE, GE, BS, VD, TI)
- ✅ Multi-lingual (DE/FR/IT/EN)
- ✅ 2 MCP servers (entscheidsuche, legal-citations)
- ✅ Corporate + Litigation practice areas

### v1.1 (Planned - Q2 2024)
- Local LLM support (Ollama integration)
- Feedback collection system
- Additional personas (Compliance, Tax, Criminal)
- Full cantonal coverage (all 26 cantons)
- Legal glossary MCP server

### v1.2 (Planned - Q3 2024)
- Document template library
- Commercial database plugins (swisslex, Weblaw)
- Advanced conflict checking
- EU Integration mode

### v2.0 (Future)
- Team collaboration features
- DMS integration (Vertec, Abraxas)
- Time tracking and billing
- Court filing system integration

---

## 🤝 Contributing

We welcome contributions from the Swiss legal tech community! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone and install
git clone https://github.com/yourusername/BetterCallClaude.git
cd BetterCallClaude
npm install

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Inspired by [SuperClaude Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- Built on [Claude Code](https://claude.com/claude-code) by Anthropic
- Swiss legal data sources: bundesgericht.ch, admin.ch, fedlex.admin.ch

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/BetterCallClaude/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/BetterCallClaude/discussions)
- **Email**: support@betterask claude.ch (Coming soon)

---

**Built with ❤️ for the Swiss legal community**
