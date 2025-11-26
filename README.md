# BetterCallClaude

**Legal Intelligence Framework for Swiss Lawyers**

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/fedec65/bettercallclaude)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-DE%20%7C%20FR%20%7C%20IT%20%7C%20EN-orange.svg)]()
[![Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-purple.svg)](https://claude.ai/code)
[![Python](https://img.shields.io/badge/python-3.11%20%7C%203.12-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/typescript-5.7+-blue.svg)]()

> Transform Swiss legal research and case strategy with AI-powered precision. Built for solo practitioners and medium-sized law firms specializing in corporate law and litigation.

---

## 🎯 Overview

BetterCallClaude is a comprehensive legal intelligence framework that provides Swiss lawyers with:

- **80% time savings** on precedent analysis and legal research
- **25% quality improvement** through systematic verification
- **Multi-jurisdictional expertise** across federal and cantonal Swiss law (ZH, BE, GE, BS, VD, TI)
- **Multi-lingual precision** in legal terminology and reasoning (DE, FR, IT, EN)

### What's New in v1.1.0

🆕 **Agent Framework** - Autonomous legal research with intelligent orchestration

🆕 **Case Manager** - Complete case lifecycle management with findings tracking

🆕 **Database Layer** - SQLite-based persistence for BGE decisions and caching

🆕 **MCP Integration** - Production-ready MCP servers for Swiss legal sources

🆕 **Dual-Language Support** - Python and TypeScript implementations

🆕 **Comprehensive Testing** - 267+ tests with >73% coverage

---

## 📋 Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Command Reference](#command-reference)
- [Agent Framework](#agent-framework)
- [MCP Servers](#mcp-servers)
- [Architecture](#architecture)
- [Multi-Lingual Support](#multi-lingual-support)
- [Configuration](#configuration)
- [Development](#development)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Three Expert Legal Personas

| Persona | Description | Capabilities |
|---------|-------------|--------------|
| **Legal Researcher** | BGE precedent research and statutory analysis | Multi-lingual research, citation verification, precedent chains |
| **Case Strategist** | Litigation strategy and risk assessment | Risk probability analysis, settlement calculations, procedural strategy |
| **Legal Drafter** | Contract drafting and court submissions | Swiss OR framework, multi-lingual documents, proper legal structure |

### Swiss Law Modes

| Mode | Coverage | Features |
|------|----------|----------|
| **Federal Law** | ZGB, OR, StGB, StPO, ZPO, BV | BGE precedent search, federal statute analysis |
| **Cantonal Law** | ZH, BE, GE, BS, VD, TI | Canton-specific routing, local regulations |
| **Multi-Lingual** | DE, FR, IT, EN | Terminology consistency, citation format adaptation |

### Agent Framework (NEW)

| Agent | Purpose | Status |
|-------|---------|--------|
| **ResearcherAgent** | Autonomous Swiss legal research with MCP integration | ✅ Implemented |
| **CaseManager** | Case lifecycle management with findings tracking | ✅ Implemented |
| **IntegratedResearchSystem** | Case-bound research orchestration | ✅ Implemented |
| **StrategistAgent** | Litigation strategy development | 🔜 Planned |
| **DrafterAgent** | Document generation | 🔜 Planned |

### MCP Servers

| Server | Purpose | Features |
|--------|---------|----------|
| **entscheidsuche** | Swiss court decision search | BGE/ATF/DTF search, cantonal courts, semantic search |
| **legal-citations** | Citation management | Extraction, verification, multi-lingual formatting |
| **bge-search** | Federal Supreme Court | Direct BGE database access, full-text search |
| **shared** | Database infrastructure | SQLite persistence, connection pooling, repositories |

---

## 🔧 Requirements

### System Requirements

| Component | Version | Required |
|-----------|---------|----------|
| **Operating System** | macOS, Linux, Windows | Yes |
| **Python** | 3.11 or 3.12 | Yes |
| **Node.js** | v18.0.0 or higher | Yes |
| **npm** | v8.0.0 or higher | Yes |
| **Claude Code** | Latest version | Yes |

### Required API Keys

| Key | Purpose | Required |
|-----|---------|----------|
| **Anthropic API Key** | Claude Code access | Yes |
| **Tavily API Key** | Enhanced web research | Optional |

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/fedec65/bettercallclaude.git
cd bettercallclaude
```

### Step 2: Install Python Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -e ".[dev]"
```

### Step 3: Install Node.js Dependencies

```bash
npm install
```

### Step 4: Build MCP Servers

```bash
cd mcp-servers
npm install
npm run build
cd ..
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

```bash
# Run Python tests
pytest

# Run MCP server tests
cd mcp-servers && npm test && cd ..

# Check installation
python -c "from src.agents.researcher import ResearcherAgent; print('✅ Installation successful!')"
```

You should see:
```
✅ Installation successful!
```

---

## 🚀 Quick Start

### Method 1: Natural Language (Auto-Detection)

Simply start Claude Code and ask legal questions. The framework automatically detects legal keywords and activates the appropriate persona.

```bash
# Start Claude Code
claude

# Ask legal questions
"Search BGE for Art. 97 OR contractual liability"
"Draft a service agreement under Swiss OR"
"Analyze litigation strategy for breach of contract, CHF 500,000 damages"
```

### Method 2: Explicit Commands

Use `/legal:` commands for professional assurance and audit trails.

```bash
# Legal research
/legal:research Art. 97 OR contractual liability

# Case strategy
/legal:strategy Analyze breach of contract case with CHF 500,000 damages

# Document drafting
/legal:draft Service agreement under Swiss OR for software development
```

### Method 3: Agent Commands

Use `/agent:` commands for autonomous research workflows.

```bash
# Autonomous research
/agent:researcher "BGE precedents on Werkvertrag" --depth=deep

# With canton filter
/agent:researcher "rental law eviction" --canton=ZH --depth=standard
```

---

## 🔧 Command Reference

### Legal Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/legal:help` | Display command help | `/legal:help --category=research` |
| `/legal:research` | Search Swiss legal sources | `/legal:research Art. 97 OR --jurisdiction=federal` |
| `/legal:strategy` | Case strategy analysis | `/legal:strategy breach of contract CHF 500,000` |
| `/legal:draft` | Document drafting | `/legal:draft service agreement Swiss OR` |
| `/legal:federal` | Force federal law mode | `/legal:federal` |
| `/legal:cantonal` | Force cantonal law mode | `/legal:cantonal ZH` |
| `/legal:cite` | Citation verification | `/legal:cite BGE 147 III 93` |

### Agent Commands

| Command | Description | Options |
|---------|-------------|---------|
| `/agent:researcher` | Autonomous legal research | `--depth`, `--focus`, `--canton`, `--language` |

### Swiss Law Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/swiss:federal` | Federal law analysis | `/swiss:federal Art. 41 OR requirements` |
| `/swiss:precedent` | BGE precedent search | `/swiss:precedent Art. 97 OR liability` |
| `/doc:analyze` | Document analysis | `/doc:analyze contract.pdf` |

### Command Options

#### `/legal:research` Options

| Option | Description | Values |
|--------|-------------|--------|
| `--jurisdiction` | Jurisdiction filter | `federal`, `all`, `ZH`, `BE`, `GE`, `BS`, `VD`, `TI` |
| `--date-from` | Start date filter | `YYYY-MM-DD` |
| `--date-to` | End date filter | `YYYY-MM-DD` |
| `--limit` | Maximum results | Number (default: 10) |

#### `/agent:researcher` Options

| Option | Description | Values |
|--------|-------------|--------|
| `--depth` | Research depth | `quick`, `standard`, `deep` |
| `--focus` | Focus area | `case_law`, `legislation`, `doctrine`, `all` |
| `--canton` | Canton filter | `ZH`, `BE`, `GE`, `BS`, `VD`, `TI` |
| `--language` | Output language | `DE`, `FR`, `IT`, `EN` |

---

## 🤖 Agent Framework

The Agent Framework provides autonomous legal research capabilities with intelligent orchestration.

### ResearcherAgent

The ResearcherAgent performs deep, multi-source legal research with automatic citation verification.

```python
from src.agents.researcher import ResearcherAgent
from src.agents.base import AutonomyMode

# Create agent
agent = ResearcherAgent(autonomy_mode=AutonomyMode.BALANCED)

# Execute research
result = await agent.execute(
    task="Find BGE precedents on Art. 97 OR contractual liability",
    depth="standard",
    max_sources=50
)

# Access results
print(result.memo.executive_summary)
for finding in result.findings:
    print(f"- {finding.issue}: {finding.conclusion} (confidence: {finding.confidence})")
```

### Autonomy Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **CAUTIOUS** | Confirms before each significant action | High-stakes matters, learning the system |
| **BALANCED** | Confirms at key checkpoints only | Standard workflow (default) |
| **AUTONOMOUS** | Runs to completion with minimal interruption | Routine tasks, time pressure |

### CaseManager

Manage complete case lifecycle with findings tracking.

```python
from src.agents.case_manager import CaseManager

# Create case
case_manager = CaseManager()
case = case_manager.create_case(
    title="Müller vs. ABC AG",
    case_type="litigation",
    jurisdiction={"federal": True, "cantons": ["ZH"]}
)

# Add findings
case_manager.add_finding(
    case_id=case.case_id,
    issue="Contractual Liability",
    conclusion="Defendant breached Art. 97 OR",
    confidence=0.85,
    citations=["BGE 147 III 93", "BGE 144 III 394"]
)

# Export case
case_export = case_manager.export_case(case.case_id)
```

### Agent Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  /agent:researcher WORKFLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INPUT: Research question + Case context                        │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 1. UNDERSTAND   │ Parse question, identify legal issues      │
│  └─────────────────┘                                            │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 2. PLAN         │ Determine search strategy                  │
│  └─────────────────┘                                            │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │ 3. SEARCH       │────▶│ MCP Servers     │                    │
│  │    (parallel)   │     │ (BGE, Cantonal) │                    │
│  └─────────────────┘     └─────────────────┘                    │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 4. VERIFY       │ Citation verification                      │
│  └─────────────────┘                                            │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 5. SYNTHESIZE   │ Analyze findings, identify patterns        │
│  └─────────────────┘                                            │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ 6. DELIVER      │ Generate research memo                     │
│  └─────────────────┘                                            │
│       │                                                         │
│       ▼                                                         │
│  OUTPUT: Research memo with verified citations                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 MCP Servers

### Overview

BetterCallClaude includes custom MCP (Model Context Protocol) servers for Swiss legal data sources.

```
mcp-servers/
├── entscheidsuche/     # Swiss court decision search
├── bge-search/         # Federal Supreme Court database
├── legal-citations/    # Citation verification and formatting
├── shared/             # Database infrastructure
│   ├── database/       # SQLite client and repositories
│   │   ├── client.ts           # DatabaseClient with connection pooling
│   │   ├── repositories/       # BGE, Cantonal, Cache repositories
│   │   └── schema.sqlite.sql   # Database schema
│   └── src/__tests__/  # Comprehensive test suite
└── integration-tests/  # Cross-server integration tests
```

### entscheidsuche Server

Search Swiss court decisions across federal and cantonal courts.

**Methods:**
- `search` - Full-text search with filters
- `advancedSearch` - Complex query builder
- `getDecision` - Retrieve specific decision

**Example:**
```typescript
const result = await mcpCall("entscheidsuche", "search", {
  query: "Werkvertrag Mängelhaftung",
  filters: { year_from: 2015 },
  limit: 50
});
```

### legal-citations Server

Citation extraction, verification, and multi-lingual formatting.

**Methods:**
- `verify` - Verify citation accuracy
- `format` - Format citation for language
- `findAlternatives` - Suggest alternative citations

**Supported Formats:**
| Language | Format Example |
|----------|----------------|
| German | Art. 1 Abs. 2 OR \| BGE 145 III 229 |
| French | art. 1 al. 2 CO \| ATF 145 III 229 |
| Italian | art. 1 cpv. 2 CO \| DTF 145 III 229 |
| English | Art. 1 para. 2 OR \| BGE 145 III 229 |

### Database Infrastructure

The shared database layer provides:

- **DatabaseClient**: SQLite connection management with WAL mode
- **BGERepository**: Federal Supreme Court decision storage
- **CantonalRepository**: Cantonal court decision storage
- **CacheRepository**: API response caching with TTL
- **Connection Pooling**: Efficient resource management

**Schema Tables:**
- `bge_decisions` - Federal Supreme Court decisions
- `cantonal_decisions` - Cantonal court decisions
- `api_cache` - API response cache
- `search_queries` - Search analytics
- `schema_migrations` - Version tracking

---

## 🏗️ Architecture

### Project Structure

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
│       ├── legal-research.md
│       ├── legal-strategy.md
│       ├── legal-draft.md
│       └── agent-researcher.md
│
├── src/                        # Python source code
│   ├── agents/                # Agent Framework
│   │   ├── base.py           # AgentBase with checkpoints
│   │   └── researcher.py     # ResearcherAgent
│   ├── core/                  # Core framework components
│   ├── framework/             # Framework utilities
│   ├── tests/                 # Python tests
│   │   ├── unit/             # Unit tests
│   │   └── integration/      # Integration tests
│   └── utils/                 # Utility functions
│
├── mcp-servers/               # MCP Server implementations
│   ├── entscheidsuche/       # Court decision search
│   ├── bge-search/           # BGE database access
│   ├── legal-citations/      # Citation management
│   ├── shared/               # Shared infrastructure
│   │   ├── database/         # SQLite database layer
│   │   └── src/__tests__/    # Database tests
│   └── integration-tests/    # Cross-server tests
│
├── docs/                      # Documentation
│   ├── AGENT_ARCHITECTURE.md # Agent framework design
│   ├── AGENT_RESEARCHER_SPEC.md # ResearcherAgent spec
│   ├── command-reference.md  # Command documentation
│   ├── getting-started.md    # English guide
│   └── languages/            # Multi-lingual docs
│       ├── de/               # German documentation
│       ├── fr/               # French documentation
│       └── it/               # Italian documentation
│
├── conftest.py               # pytest configuration
├── pyproject.toml            # Python project config
├── package.json              # Node.js project config
└── README.md                 # This file
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LAWYER INTERFACE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GRANULAR COMMANDS              DELEGATION AGENTS               │
│  ─────────────────              ─────────────────               │
│  /legal:search-bge              /agent:researcher               │
│  /legal:cite-check              /agent:strategist (planned)     │
│  /legal:translate               /agent:drafter (planned)        │
│  /legal:format                  /agent:litigator (planned)      │
│                                                                 │
│  → Single action                → Multi-step workflow           │
│  → Immediate result             → Progress updates              │
│  → Full user control            → Checkpoint confirmations      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     SHARED INFRASTRUCTURE                       │
├─────────────────────────────────────────────────────────────────┤
│  MCP Servers: entscheidsuche, bge-search, legal-citations       │
│  Case Context: Serena memory persistence                        │
│  Verification: Citation validation layer                        │
│  Audit: Anwaltsgeheimnis-compliant logging                      │
│  Database: SQLite with connection pooling                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌍 Multi-Lingual Support

BetterCallClaude natively supports all Swiss official languages plus English.

### Supported Languages

| Language | Code | Citation Format | Court Reference |
|----------|------|-----------------|-----------------|
| German | DE | Art. 1 Abs. 2 OR | BGE 145 III 229 |
| French | FR | art. 1 al. 2 CO | ATF 145 III 229 |
| Italian | IT | art. 1 cpv. 2 CO | DTF 145 III 229 |
| English | EN | Art. 1 para. 2 OR | BGE 145 III 229 |

### Automatic Features

- **Language Detection**: Automatically detects input language
- **Consistency**: Maintains language consistency across responses
- **Mixed Queries**: Handles mixed-language queries intelligently
- **Terminology**: Translates legal terminology accurately
- **Citation Adaptation**: Adapts citation formats to target language

### Examples

```bash
# German query
/legal:research "Verjährung von Forderungen"

# French query
/legal:research "prescription des créances"

# Italian query
/legal:research "prescrizione dei crediti"

# English query with German output
/legal:research "limitation of claims" --language=DE
```

---

## ⚙️ Configuration

### User Configuration

Create `~/.betterask/config.yaml` for personalized settings:

```yaml
# Framework version
version: "1.1.0"

# Privacy mode
privacy_mode: balanced  # strict | balanced | cloud

# LLM backend
llm_backend: anthropic  # anthropic | ollama (v1.2+)

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

  bge_search:
    enabled: true
    database_path: ~/.betterask/bge.sqlite

# Agent settings
agents:
  researcher:
    default_depth: standard
    max_sources: 50
    checkpoint_frequency: 3min
    default_autonomy: balanced

# Data retention
data_retention_days: 30

# Session management
auto_save: true
checkpoint_interval: 1800  # 30 minutes
```

### Supported Cantons

| Code | Canton | Language | Court System |
|------|--------|----------|--------------|
| ZH | Zürich | DE | Commercial law hub |
| BE | Bern | DE/FR | Bilingual, capital |
| GE | Genève | FR | International law |
| BS | Basel-Stadt | DE | Pharmaceutical law |
| VD | Vaud | FR | Western Switzerland |
| TI | Ticino | IT | Southern Switzerland |

*Full 26-canton support coming in v1.2*

---

## 🛠️ Development

### Setting Up Development Environment

```bash
# Clone repository
git clone https://github.com/fedec65/bettercallclaude.git
cd bettercallclaude

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install development dependencies
pip install -e ".[dev]"
npm install

# Build MCP servers
cd mcp-servers && npm run build && cd ..
```

### Running Tests

```bash
# Run all Python tests
pytest

# Run with coverage
pytest --cov=src --cov-report=term-missing

# Run specific test file
pytest src/tests/unit/test_researcher.py

# Run MCP server tests
cd mcp-servers && npm test && cd ..

# Run integration tests
cd mcp-servers && npm run test:integration && cd ..
```

### Code Quality

```bash
# Python linting
black src/
ruff check src/
mypy src/

# TypeScript linting
cd mcp-servers && npm run lint && cd ..
```

### Building

```bash
# Build MCP servers
cd mcp-servers
npm run build

# Build Python package
pip install build
python -m build
```

---

## 📚 Documentation

### Getting Started Guides

| Language | Guide |
|----------|-------|
| English | [Getting Started](docs/getting-started.md) |
| Deutsch | [Erste Schritte](docs/languages/de/erste-schritte.md) |
| Français | [Guide de Démarrage](docs/languages/fr/guide-demarrage.md) |
| Italiano | [Guida Introduttiva](docs/languages/it/guida-introduttiva.md) |

### Technical Documentation

| Document | Description |
|----------|-------------|
| [Agent Architecture](docs/AGENT_ARCHITECTURE.md) | Agent framework design and orchestration |
| [ResearcherAgent Spec](docs/AGENT_RESEARCHER_SPEC.md) | Detailed ResearcherAgent specification |
| [Command Reference](docs/command-reference.md) | Complete command documentation |
| [Framework Architecture](.claude/BETTERASK.md) | Main entry point and configuration |
| [Legal Principles](.claude/LEGAL_PRINCIPLES.md) | Swiss legal reasoning standards |

### Workflow Tutorials

| Tutorial | Description |
|----------|-------------|
| [Legal Research](docs/workflows/research-precedents.md) | BGE precedent search workflow |
| [Case Strategy](docs/workflows/case-strategy.md) | Litigation strategy development |
| [Document Drafting](docs/workflows/draft-contracts.md) | Contract and submission drafting |

---

## 🎯 Roadmap

### v1.1.0 (Current) - Agent Framework ✅

- ✅ Agent base class with checkpoints and audit logging
- ✅ ResearcherAgent with MCP integration
- ✅ CaseManager for case lifecycle management
- ✅ Database infrastructure with SQLite
- ✅ 267+ tests with >73% coverage
- ✅ Python 3.11/3.12 support

### v1.2 (Q1 2025) - Expansion

- 🔜 All 26 Swiss cantons
- 🔜 StrategistAgent implementation
- 🔜 DrafterAgent implementation
- 🔜 Ollama integration (local LLM support)
- 🔜 Commercial database integrations (Swisslex, Weblaw)

### v1.3 (Q2 2025) - Enhancement

- 🔜 Automated legal research reports
- 🔜 Practice management integrations
- 🔜 Enhanced multi-lingual capabilities
- 🔜 Citation network analysis

### v2.0 (Q3 2025) - International

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

- **Code Style**: Follow existing Python (black, ruff) and TypeScript conventions
- **Documentation**: Update relevant docs for any changes
- **Testing**: Maintain >70% test coverage
- **Legal Accuracy**: Verify all Swiss law references and citations
- **Multi-Lingual**: Provide translations for DE/FR/IT when applicable

### Priority Areas

- **Additional Cantons**: Expand to all 26 Swiss cantons
- **Agent Development**: StrategistAgent and DrafterAgent
- **Commercial Databases**: Swisslex, Weblaw integrations
- **Local LLM**: Ollama integration for privacy mode
- **Workflow Examples**: Real-world case studies

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
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/fedec65/bettercallclaude/issues)

### Contact

- **Project Maintainer**: Federico Cesconi
- **Email**: federico@cesconi.com
- **Website**: [https://cesconi.com](https://cesconi.com)

---

**Built for the Swiss legal community with precision, quality, and multi-lingual excellence.**

*BetterCallClaude v1.1.0 - Legal Intelligence Framework*
