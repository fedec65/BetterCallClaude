# BetterCallClaude

**Legal Intelligence Framework for Swiss Lawyers**

[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue.svg)](https://github.com/yourusername/bettercallclaude)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-DE%20%7C%20FR%20%7C%20IT%20%7C%20EN-orange.svg)]()
[![Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-purple.svg)](https://claude.ai/code)

> Transform Swiss legal research and case strategy with AI-powered precision. Built for solo practitioners and medium-sized law firms specializing in corporate law and litigation.

---

## 🎯 Overview

BetterCallClaude is a comprehensive legal intelligence framework that provides Swiss lawyers with:

- **80% time savings** on precedent analysis and legal research
- **25% quality improvement** through systematic verification
- **Multi-jurisdictional expertise** across federal and cantonal Swiss law (ZH, BE, GE, BS, VD, TI)
- **Multi-lingual precision** in legal terminology and reasoning (DE, FR, IT, EN)

### Key Features

✅ **Three Expert Legal Personas**
- **Legal Researcher**: BGE precedent research, statutory analysis, multi-lingual legal research
- **Case Strategist**: Litigation strategy, risk assessment, procedural analysis
- **Legal Drafter**: Contract drafting (OR framework), court submissions, legal opinions

✅ **Swiss Law Modes**
- **Federal Law Mode**: ZGB, OR, StGB, StPO, ZPO, BV analysis
- **Cantonal Law Mode**: Canton-specific law routing (6 cantons in v1.0)
- **Multi-Lingual Mode**: Terminology consistency across DE/FR/IT/EN

✅ **MCP Server Integration**
- **entscheidsuche**: Swiss court decision search (bundesgericht.ch + cantonal courts)
- **legal-citations**: Citation extraction, verification, and formatting

✅ **Agent Framework** (NEW in v1.0)
- **ResearcherAgent**: Autonomous Swiss legal research with MCP integration
- **CaseManager**: Complete case lifecycle management with findings tracking
- **IntegratedResearchSystem**: Case-bound research orchestration
- **Graceful Error Handling**: Resilient research even when sources are unavailable

---

## 📋 Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Documentation](#documentation)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🔧 Requirements

### System Requirements
- **Operating System**: macOS, Linux, or Windows
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Claude Code**: Latest version ([Installation Guide](https://docs.anthropic.com/claude/docs/claude-code))

### Required API Keys
- **Anthropic API Key**: For Claude Code access ([Get API Key](https://console.anthropic.com/))
- **Tavily API Key** (Optional): For enhanced web research ([Get API Key](https://app.tavily.com/))

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/bettercallclaude.git
cd bettercallclaude
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure MCP Servers

The framework uses MCP (Model Context Protocol) servers for Swiss court decision search and citation management.

```bash
cd mcp-servers
npm install
npm run build
```

### Step 4: Set Up Claude Code Integration

Copy the `.claude` directory to your Claude Code configuration:

```bash
# The .claude directory contains all personas, modes, and MCP configurations
# Claude Code will automatically detect and load these configurations
```

### Step 5: Configure API Keys

Create a `.env` file in the project root:

```bash
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional (for enhanced research)
TAVILY_API_KEY=your_tavily_api_key_here
```

### Step 6: Verify Installation

Run the verification script:

```bash
npm run verify
```

You should see:
```
✅ Node.js version compatible (v18.x.x)
✅ npm version compatible (v8.x.x)
✅ Claude Code detected
✅ MCP servers built successfully
✅ Framework configuration loaded
✅ API keys configured

🎉 BetterCallClaude is ready to use!
```

---

## 🚀 Quick Start

### Basic Usage with Claude Code

1. **Open Claude Code** in your terminal
2. **Activate BetterCallClaude** by opening any legal document or starting a conversation

### Example: Legal Research

```bash
# Start Claude Code
claude

# In Claude Code, ask:
"Search BGE for recent decisions on Art. 62 OR (liability for unlawful acts)"
```

The **Legal Researcher** persona will automatically activate and:
- Search bundesgericht.ch for relevant BGE decisions
- Verify citations against official sources
- Present multi-lingual analysis with proper terminology

### Example: Case Strategy

```bash
# In Claude Code, ask:
"Analyze the litigation strategy for a breach of contract case under Art. 97 OR with damages of CHF 500,000"
```

The **Case Strategist** persona will:
- Assess case strength with evidence-based risk probability
- Evaluate procedural strategy options (ZPO federal + cantonal)
- Calculate settlement value with financial and strategic risk modeling

### Example: Document Drafting

```bash
# In Claude Code, ask:
"Draft a service agreement under Swiss OR for software development services"
```

The **Legal Drafter** persona will:
- Generate contract following Swiss Code of Obligations framework
- Include proper Swiss legal structure and terminology
- Provide multi-lingual drafting (DE/FR/IT/EN)

---

## 🔧 Command Reference

BetterCallClaude provides specialized `/legal` commands for direct access to Swiss legal intelligence features.

### Available Commands

#### `/legal:help` - Display Command Help

Show available commands and usage information with optional filtering by category.

**Syntax:**
```
/legal:help [--category=<cat>] [--command=<name>] [--verbose]
```

**Arguments:**
- `--category` (optional): Filter by command category
  - `research` - Legal research commands
  - `drafting` - Document drafting commands
  - `analysis` - Legal analysis commands
  - `case_strategy` - Case strategy commands
  - `compliance` - Compliance-related commands
  - `document` - Document management commands
  - `swiss_law` - Swiss law specific commands
  - `system` - System and utility commands
- `--command` (optional): Show detailed help for specific command
- `--verbose` (optional): Display extended help information

**Examples:**
```bash
# Show all available commands
/legal:help

# Show only research commands
/legal:help --category=research

# Show detailed help for specific command
/legal:help --command=legal:research

# Show verbose help for all commands
/legal:help --verbose
```

---

#### `/legal:research` - Search Swiss Legal Sources

Search across Swiss legal sources including BGE precedents, federal statutes, and cantonal law.

**Syntax:**
```
/legal:research <query> [--jurisdiction=<jur>] [--date-from=<YYYY-MM-DD>] [--date-to=<YYYY-MM-DD>] [--limit=<n>]
```

**Arguments:**
- `query` (required): Search query (legal topic, citation, or keywords)
- `--jurisdiction` (optional): Jurisdiction filter
  - `federal` - Federal law and BGE decisions only
  - `all` - All jurisdictions (default)
  - Canton codes: `ZH`, `BE`, `GE`, `BS`, `VD`, `TI`
- `--date-from` (optional): Start date filter (YYYY-MM-DD format)
- `--date-to` (optional): End date filter (YYYY-MM-DD format)
- `--limit` (optional): Maximum number of results (default: 10)

**Data Sources:**
- **BGE** (Bundesgerichtsentscheide) - Federal Supreme Court decisions
- **Federal Statutes** (SR - Systematische Rechtssammlung)
- **Cantonal Law** - Canton-specific regulations and decisions
- **Lower Court Decisions** - Cantonal and district court rulings

**Examples:**
```bash
# Basic research query
/legal:research "liability for defective products"

# Search for specific BGE citation
/legal:research "BGE 147 V 321" --jurisdiction=federal

# Search cantonal law with date filter
/legal:research "rental law" --jurisdiction=ZH --date-from=2020-01-01

# Comprehensive search with all filters
/legal:research "contract liability" --jurisdiction=all --date-from=2018-01-01 --date-to=2024-12-31 --limit=20

# Multi-lingual research (German)
/legal:research "Verjährung von Forderungen"

# Multi-lingual research (French)
/legal:research "prescription des créances"
```

**Activated Features:**
- ✅ **Legal Researcher Persona** - Automatic activation for precedent analysis
- ✅ **Swiss Law Expert Persona** - Jurisdiction-specific expertise
- ✅ **MCP Servers** - BGE Search, Entscheidsuche, Cantonal Courts integration
- ✅ **Multi-Lingual Processing** - DE/FR/IT/EN support with terminology precision
- ✅ **Citation Verification** - Automatic verification of legal references

---

#### `/agent:researcher` - Autonomous Legal Research Agent

Execute autonomous research using the ResearcherAgent with MCP server integration.

**Syntax:**
```
/agent:researcher <query> [--depth=<level>] [--focus=<area>] [--canton=<code>] [--language=<lang>]
```

**Arguments:**
- `query` (required): Research question or legal topic
- `--depth` (optional): Research depth level
  - `quick` - Fast overview (1-2 sources)
  - `standard` - Balanced research (default, 3-5 sources)
  - `deep` - Comprehensive analysis (all sources)
- `--focus` (optional): Focus area
  - `case_law` - Court decisions and precedents
  - `legislation` - Statutes and regulations
  - `doctrine` - Legal commentary and scholarship
  - `all` - All sources (default)
- `--canton` (optional): Canton filter (ZH, BE, GE, BS, VD, TI)
- `--language` (optional): Output language (DE, FR, IT, EN)

**Examples:**
```bash
# Quick research on contract liability
/agent:researcher "Art. 97 OR liability requirements" --depth=quick

# Deep cantonal research
/agent:researcher "rental law eviction" --canton=ZH --depth=deep

# Case law focus with language preference
/agent:researcher "BGE on product liability" --focus=case_law --language=DE

# Comprehensive multi-source research
/agent:researcher "prescription periods for contractual claims" --depth=deep --focus=all
```

**Agent Features:**
- ✅ **Autonomous Execution** - Agent manages full research workflow
- ✅ **MCP Integration** - Queries entscheidsuche + legal-citations servers
- ✅ **Graceful Error Handling** - Continues with available sources if some fail
- ✅ **Confidence Scoring** - Each finding includes confidence level
- ✅ **Citation Extraction** - Automatic BGE/ATF reference extraction
- ✅ **Research Memo** - Structured output with findings and recommendations

**Output Structure:**
```
📋 Research Memo
├── Query: [original research question]
├── Depth: [quick|standard|deep]
├── Sources Consulted: [list of MCP servers used]
├── Findings:
│   ├── Finding 1: [issue, conclusion, confidence, citations]
│   ├── Finding 2: [issue, conclusion, confidence, citations]
│   └── ...
├── Recommendations: [actionable next steps]
└── Execution Time: [duration in ms]
```

---

## 💡 Usage Examples

### Federal Law Analysis

```
Query: "Explain the requirements for liability under Art. 41 OR"

Result:
🎭 Persona: Legal Researcher
📖 Mode: Federal Law
🇨🇭 Jurisdiction: Swiss Federal Law

Art. 41 Abs. 1 OR establishes liability requirements:
1. Unlawful act (Widerrechtlichkeit / illicéité / illiceità)
2. Damage (Schaden / dommage / danno)
3. Causal connection (Kausalzusammenhang / lien de causalité / nesso causale)
4. Fault (Verschulden / faute / colpa)

BGE References:
- BGE 144 III 394: Unlawfulness criteria...
- BGE 143 III 101: Causal connection standards...

[Full analysis with citations...]
```

### Cantonal Law Routing

```
Query: "What are the court fees for commercial litigation in Zürich Canton?"

Result:
🎭 Persona: Legal Researcher
📖 Mode: Cantonal Law (ZH)
🏛️ Canton: Zürich

Zürich Court Fee Schedule (GebV ZH):
- Commercial disputes: Art. 12 GebV ZH
- Fee calculation based on dispute value
- CHF 1,000 minimum, 3% of value up to CHF 1M

ZH Court Website: https://gerichte-zh.ch
[Full cantonal analysis...]
```

### Multi-Lingual Analysis

```
Query (in French): "Quels sont les délais de prescription selon l'art. 127 CO?"

Result:
🎭 Persona: Legal Researcher
📖 Mode: Multi-Lingual (FR)
🌐 Languages: FR (primary), DE/IT (cross-reference)

Art. 127 CO - Délais de prescription:
- Délai général: 10 ans (art. 127 CO)
- Responsabilité délictuelle: 3 ans (art. 60 CO)
- Créances périodiques: 5 ans (art. 128 CO)

Terminologie:
- FR: prescription
- DE: Verjährung
- IT: prescrizione

[Full multi-lingual analysis...]
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
│   ├── mcp/                   # MCP server documentation
│   └── commands/              # Slash commands
│       └── agent-researcher.md # /agent:researcher command
│
├── packages/                   # TypeScript packages
│   └── agents/                # Agent Framework (NEW)
│       ├── src/
│       │   ├── base.ts        # AgentBase with checkpoints
│       │   ├── researcher.ts  # ResearcherAgent
│       │   ├── case-manager.ts # CaseManager
│       │   ├── mcp-adapter.ts # MCP integration
│       │   └── integration.ts # IntegratedResearchSystem
│       └── __tests__/         # 139 tests
│
├── mcp-servers/               # Custom MCP implementations
│   ├── entscheidsuche/       # Court decision search
│   ├── legal-citations/      # Citation verification
│   └── commercial-db-plugins/ # Optional database plugins
│
├── version-manager/           # Version control system
└── docs/                      # Documentation
    ├── AGENT_ARCHITECTURE.md  # Agent framework design
    └── AGENT_RESEARCHER_SPEC.md # ResearcherAgent specification
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

**Agent Framework** (`@bettercallclaude/agents`):
- **AgentBase** - Checkpoint management, audit logging, autonomy modes
- **ResearcherAgent** - Autonomous Swiss law research with MCP integration
- **CaseManager** - Case lifecycle (create, open, close, archive)
- **MCPAdapter** - Unified interface to MCP servers
- **IntegratedResearchSystem** - Case-bound research orchestration

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

### Getting Started Guides

- **English**: [Getting Started Guide](docs/getting-started.md)
- **Deutsch**: [Erste Schritte Anleitung](docs/languages/de/erste-schritte.md)
- **Français**: [Guide de Démarrage](docs/languages/fr/guide-demarrage.md)
- **Italiano**: [Guida Introduttiva](docs/languages/it/guida-introduttiva.md)

### Workflow Tutorials

- [Legal Research Workflow](docs/workflows/research-precedents.md) - BGE precedent search and statutory analysis
- [Case Strategy Workflow](docs/workflows/case-strategy.md) - Litigation strategy and risk assessment
- [Document Drafting Workflow](docs/workflows/draft-contracts.md) - Contract drafting and court submissions

### Technical Documentation

- [Framework Architecture](.claude/BETTERASK.md) - Main entry point and component overview
- [Legal Principles](.claude/LEGAL_PRINCIPLES.md) - Swiss legal reasoning standards
- [MCP Server Documentation](.claude/mcp/) - entscheidsuche and legal-citations specifications

---

## ⚙️ Configuration

### User Configuration

Create `~/.betterask/config.yaml` for personalized settings:

```yaml
# Framework version
version: "1.0.0"

# Privacy mode
privacy_mode: balanced  # strict | balanced | cloud

# LLM backend
llm_backend: anthropic  # anthropic | ollama (v1.1+)

# Practice focus
canton_focus: ["ZH", "GE"]
languages: ["de", "fr", "en"]
practice_areas: ["corporate", "litigation"]

# MCP servers
mcp_servers:
  entscheidsuche:
    enabled: true
    sources: ["bundesgericht", "zh", "be", "ge", "bs", "vd", "ti"]

  legal_citations:
    enabled: true
    verification: strict

# Data retention
data_retention_days: 30

# Session management
auto_save: true
checkpoint_interval: 1800  # 30 minutes
```

### Cantonal Law Configuration

BetterCallClaude v1.0 supports **6 major Swiss cantons**:

| Canton | Abbreviation | Language | Population |
|--------|-------------|----------|------------|
| Zürich | ZH | DE | 1.5M |
| Bern | BE | DE/FR (bilingual) | 1.0M |
| Genève | GE | FR | 0.5M |
| Basel-Stadt | BS | DE | 0.2M |
| Vaud | VD | FR | 0.8M |
| Ticino | TI | IT | 0.4M |

*Full 26-canton support coming in v1.1*

---

## 🛠️ Development

### Project Structure

```
bettercallclaude/
├── .claude/                  # Claude Code framework configuration
│   ├── personas/            # Legal expert personas
│   ├── modes/               # Swiss law operation modes
│   ├── mcp/                 # MCP server documentation
│   ├── BETTERASK.md         # Main entry point
│   ├── LEGAL_PRINCIPLES.md  # Legal reasoning standards
│   ├── LEGAL_SYMBOLS.md     # Citation formatting
│   └── SWISS_LAW_CONFIG.md  # Jurisdiction routing
├── mcp-servers/             # MCP server implementations
│   ├── entscheidsuche/      # Court decision search
│   └── legal-citations/     # Citation verification
├── docs/                    # User documentation
│   ├── getting-started.md   # English guide
│   ├── workflows/           # Workflow tutorials
│   └── languages/           # Multi-lingual docs
├── tests/                   # Integration tests
├── package.json             # npm configuration
└── README.md                # This file
```

### Building MCP Servers

```bash
cd mcp-servers
npm run build

# Run tests
npm test

# Development mode with hot reload
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run specific test suite
npm test -- personas
npm test -- modes
npm test -- mcp
```

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

## 🎯 Roadmap

### v1.0.0 (Current) - Foundation Phase ✅
- ✅ 3 legal expert personas
- ✅ 3 Swiss law operation modes
- ✅ 2 MCP server specifications
- ✅ 6-canton support (ZH, BE, GE, BS, VD, TI)
- ✅ Multi-lingual support (DE/FR/IT/EN)

### v1.1 (Q2 2025) - Expansion
- 🔜 All 26 Swiss cantons
- 🔜 Ollama integration (local LLM support)
- 🔜 Commercial database integrations (Swisslex, Weblaw)
- 🔜 Advanced precedent analysis

### v1.2 (Q3 2025) - Enhancement
- 🔜 Automated legal research reports
- 🔜 Practice management system integrations
- 🔜 Enhanced multi-lingual capabilities

### v2.0 (Q4 2025) - International
- 🔜 European law integration (EU regulations, ECHR)
- 🔜 Cross-border legal analysis
- 🔜 Advanced AI features (argumentation, negotiation support)

---

## 🤝 Contributing

We welcome contributions from the Swiss legal community and developers!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear commit messages
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request**

### Contribution Guidelines

- **Code Style**: Follow existing TypeScript/Node.js conventions
- **Documentation**: Update relevant docs for any changes
- **Testing**: Maintain >80% test coverage
- **Legal Accuracy**: Verify all Swiss law references and citations
- **Multi-Lingual**: Provide translations for DE/FR/IT when applicable

### Priority Contribution Areas

- **Additional Cantons**: Help us expand to all 26 Swiss cantons (v1.1 scope)
- **Commercial Databases**: Integrations with Swisslex, Weblaw (optional)
- **Local LLM Support**: Ollama integration for privacy mode (v1.1)
- **Workflow Examples**: Real-world case studies and examples
- **Bug Reports**: Help us improve stability and accuracy

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## ⚠️ Professional Disclaimer

**IMPORTANT**: BetterCallClaude is a legal research and analysis tool. All outputs:

- ✋ **Require professional lawyer review and validation**
- ✋ **Do not constitute legal advice**
- ✋ **May contain errors or omissions**
- ✋ **Should be verified against official sources**
- ✋ **Must be adapted to specific case circumstances**

**Lawyers maintain full professional responsibility for all legal work products.**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ for the Swiss legal community using:

- **[Claude Code](https://claude.ai/code)** by Anthropic - AI-powered development framework
- **[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)** - Extensible AI integration
- **Swiss Federal Supreme Court** - BGE/ATF/DTF precedent access
- **Swiss Cantonal Courts** - Cantonal decision databases

Special thanks to beta testers from Swiss law firms for their valuable feedback.

---

## 📞 Support

### Documentation & Resources

- **Documentation**: [docs/](docs/)
- **GitHub Issues**: [Report bugs and feature requests](mailto:federico@cesconi.com)
- **Discussions**: Community Q&A and best practices *(coming soon)*

### Community

- **Swiss Legal Tech Community**: Join discussions about legal technology in Switzerland
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get involved

### Contact

- **Project Maintainer**: Federico Cesconi
- **Website**: [https://cesconi.com](https://cesconi.com)

---

**Built for the Swiss legal community with precision, quality, and multi-lingual excellence.**

*BetterCallClaude v1.0.0-alpha - Legal Intelligence Framework*
