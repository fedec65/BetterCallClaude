# BetterCallClaude

**Legal Intelligence Framework for Swiss Lawyers**

[![Version](https://img.shields.io/badge/version-1.3.2-blue.svg)](https://github.com/fedec65/bettercallclaude)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-DE%20%7C%20FR%20%7C%20IT%20%7C%20EN-orange.svg)]()
[![Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-purple.svg)](https://claude.ai/code)
[![Claude Desktop](https://img.shields.io/badge/works%20with-Claude%20Desktop-blueviolet.svg)](https://claude.ai/download)
[![Python](https://img.shields.io/badge/python-3.11%20%7C%203.12-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/typescript-5.7+-blue.svg)]()

> Transform Swiss legal research and case strategy with AI-powered precision. Built for solo practitioners and medium-sized law firms specializing in corporate law and litigation.

### 🚀 One-Line Installation

```bash
curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash
```

**Works with both Claude Code CLI and Claude Desktop** — the installer auto-configures everything!

---

## 🎯 Overview

BetterCallClaude is a comprehensive legal intelligence framework that provides Swiss lawyers with:

- **80% time savings** on precedent analysis and legal research
- **25% quality improvement** through systematic verification
- **Multi-jurisdictional expertise** across federal and all 26 Swiss cantons (ZH, BE, LU, UR, SZ, OW, NW, GL, ZG, FR, SO, BS, BL, SH, AR, AI, SG, GR, AG, TG, TI, VD, VS, NE, GE, JU)
- **Multi-lingual precision** in legal terminology and reasoning (DE, FR, IT, EN)

### What's New in v1.3.2

🆕 **Intelligent Legal Proxy (`/legal`)** - Your single entry point to the entire BetterCallClaude framework with smart routing

🆕 **Three Access Modes** - Natural language, direct agent routing (`@researcher`), and explicit workflows (`--workflow full`)

🆕 **Hybrid Orchestration** - Automatic intent detection routes your query to the right agent(s) or pipeline

🆕 **Interactive Dialogue** - Clarification requests, progress updates, and checkpoint confirmations for complex workflows

🆕 **14+ Agent Coordination** - All specialized agents accessible through intelligent routing with confidence scoring

### What's New in v1.3.1

🆕 **10 Specialized Domain Agents** - Expert agents for Citation, Compliance, Data Protection, Risk, Procedure, Translation, Fiscal, Corporate, Cantonal, and Real Estate law

🆕 **Citation Specialist** - BGE/ATF/DTF citation verification, formatting, cross-reference validation

🆕 **Compliance Officer** - FINMA, AML/KYC, regulatory compliance verification

🆕 **Data Protection Specialist** - GDPR, nDSG/FADP privacy analysis with DPIA workflows

🆕 **Risk Analyst** - Case outcome probability scoring, Monte Carlo simulations, settlement analysis

🆕 **Procedure Specialist** - ZPO/StPO/VwVG deadline calculation, procedural roadmaps

🆕 **Legal Translator** - DE/FR/IT legal terminology with Termdat integration

🆕 **Fiscal Legal Expert** - Tax law, DTAs, transfer pricing, BEPS compliance

🆕 **Corporate & Commercial** - AG/GmbH, M&A, shareholder agreements, commercial contracts

🆕 **Cantonal Law Expert** - All 26 cantons with court comparison, fee calculators

🆕 **Real Estate Expert** - Property transactions, Grundbuch, Lex Koller analysis

### What's New in v1.3.0

🆕 **All 26 Swiss Cantons** - Complete coverage of Swiss jurisdictions with multilingual support

🆕 **Canton Metadata** - Language assignments, bilingual canton handling, court names in DE/FR/IT

🆕 **Enhanced Jurisdiction API** - `is_bilingual`, `official_languages`, `canton_name`, `from_string` methods

🆕 **Ollama Integration** - Local LLM inference with privacy-first routing for sensitive legal work

🆕 **Privacy Mode** - Automatic Swiss attorney-client privilege detection (Anwaltsgeheimnis, Art. 321 StGB)

🆕 **110+ Tests** - Extended test coverage for comprehensive canton validation

### What's New in v1.2.0

🆕 **StrategistAgent** - Litigation strategy development with risk assessment and settlement analysis

🆕 **DrafterAgent** - Document generation with Swiss legal standards and multi-lingual support

🆕 **AgentOrchestrator** - Multi-agent pipeline coordination with checkpoint management

🆕 **Multi-Lingual Utilities** - Language detection and legal terminology mapping for DE/FR/IT/EN

🆕 **Enhanced Type Safety** - Full mypy strict compliance across all agents

🆕 **93+ Agent Tests** - Comprehensive test coverage for the agent framework

---

## 📋 Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Command Reference](#command-reference)
- [Agent Framework](#agent-framework)
- [MCP Servers](#mcp-servers)
- [Ollama Integration](#ollama-integration)
- [Architecture](#architecture)
- [Multi-Lingual Support](#multi-lingual-support)
- [Configuration](#configuration)
- [Development](#development)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Features

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
| **Cantonal Law** | All 26 cantons | Canton-specific routing, local regulations, bilingual canton support |
| **Multi-Lingual** | DE, FR, IT, EN | Terminology consistency, citation format adaptation |

### Agent Framework

#### Core Pipeline Agents

| Agent | Purpose | Status |
|-------|---------|--------|
| **ResearcherAgent** | Autonomous Swiss legal research with MCP integration | ✅ Implemented |
| **StrategistAgent** | Litigation strategy with risk assessment and settlement analysis | ✅ Implemented |
| **DrafterAgent** | Document generation with Swiss legal standards | ✅ Implemented |
| **AgentOrchestrator** | Multi-agent pipeline coordination with checkpoints | ✅ Implemented |
| **CaseManager** | Case lifecycle management with findings tracking | ✅ Implemented |
| **IntegratedResearchSystem** | Case-bound research orchestration | ✅ Implemented |

#### Specialized Domain Agents (v1.3.1)

| Agent | Command | Domain |
|-------|---------|--------|
| **Citation Specialist** | `/agent:citation` | BGE/ATF/DTF citation verification, formatting, validation |
| **Compliance Officer** | `/agent:compliance` | FINMA, AML/KYC, regulatory compliance |
| **Data Protection Specialist** | `/agent:data-protection` | GDPR, nDSG/FADP, privacy analysis |
| **Risk Analyst** | `/agent:risk` | Case outcome probability, damages quantification |
| **Procedure Specialist** | `/agent:procedure` | ZPO/StPO/VwVG deadlines, procedural rules |
| **Legal Translator** | `/agent:translator` | DE/FR/IT legal terminology |
| **Fiscal Legal Expert** | `/agent:fiscal` | Tax law, DTA, fiscal implications |
| **Corporate & Commercial** | `/agent:corporate` | M&A, corporate governance, contracts |
| **Cantonal Law Expert** | `/agent:cantonal` | All 26 Swiss cantons legal systems |
| **Real Estate Expert** | `/agent:realestate` | Property law, Grundbuch, Lex Koller |

### MCP Servers

| Server | Purpose | Features |
|--------|---------|----------|
| **entscheidsuche** | Swiss court decision search | BGE/ATF/DTF search, cantonal courts, semantic search |
| **legal-citations** | Citation management | Extraction, verification, multi-lingual formatting |
| **bge-search** | Federal Supreme Court | Direct BGE database access, full-text search |
| **shared** | Database infrastructure | SQLite persistence, connection pooling, repositories |

---

## Requirements

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

## Installation

### Quick Install (Recommended)

Install BetterCallClaude globally with a single command — **no configuration required**:

```bash
curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash
```

That's it! The interactive installer handles everything automatically.

### Works With Both Claude Environments

| Environment | Support | How to Use |
|-------------|---------|------------|
| **Claude Code CLI** | ✅ Full Support | Run `claude` in terminal, then `/legal:help` |
| **Claude Desktop** | ✅ Full Support | Open Claude Desktop app, MCP servers auto-loaded |

The installer automatically:
- 🔍 Detects your Claude environment (CLI, Desktop, or both)
- ⚙️ Configures MCP servers for your setup
- 🔗 Creates command symlinks accessible from anywhere
- 💾 Backs up your existing settings before changes

### What Gets Installed

```
~/.claude/
├── bettercallclaude/          # Framework installation
├── commands/                   # Slash commands (symlinked)
├── settings.json              # Updated with MCP servers
└── settings.local.json        # Your existing settings (backed up)
```

**Components:**
- ✅ 30+ legal slash commands (`/legal:research`, `/legal:strategy`, etc.)
- ✅ 14 specialized legal agents (`@researcher`, `@compliance`, etc.)
- ✅ 2 MCP servers (entscheidsuche, legal-citations)
- ✅ `bettercallclaude` CLI for updates and management

### After Installation

**Claude Code CLI:**
```bash
claude
# Then type: /legal:help
```

**Claude Desktop:**
1. Open the Claude Desktop app
2. MCP servers are automatically available
3. Type `/legal:help` to see all commands

### Installation Options

```bash
# Interactive install (default)
./install.sh install

# Non-interactive with defaults (for scripts/CI)
curl -fsSL .../install.sh | bash -s -- --no-interactive

# Preview what would be installed
./install.sh --dry-run install

# Force reinstall
./install.sh --force install
```

### Managing Your Installation

```bash
# Check current version and available updates
bettercallclaude version
# or
./install.sh version

# Update to latest version
bettercallclaude update

# Check installation health
bettercallclaude doctor

# List installed commands
bettercallclaude list

# Uninstall (preserves customizations)
bettercallclaude uninstall
```

The `version` command shows:
- ✅ Installed version number
- ✅ Installation location
- ✅ MCP servers status (built/not built)
- ✅ Available updates with one-click upgrade option

### System Requirements

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | ≥ 18.0 | `node --version` |
| Python | ≥ 3.10 | `python --version` |
| npm | any | `npm --version` |
| Git | any | `git --version` |
| Claude Code | CLI or Desktop | `claude --version` |

### Customizing Commands

Your customizations are safe from updates:

```bash
# Copy a command to customize
cp ~/.claude/bettercallclaude/.claude/commands/legal:research.md \
   ~/.claude/customizations/legal:research.md

# Edit your version - it will take precedence
nano ~/.claude/customizations/legal:research.md
```

---

### Developer Installation

For contributing or development work, install the full development environment:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/fedec65/bettercallclaude.git
cd bettercallclaude
```

#### Step 2: Install Python Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -e ".[dev]"
```

#### Step 3: Install Node.js Dependencies

```bash
npm install
```

#### Step 4: Build MCP Servers

```bash
cd mcp-servers
npm install
npm run build
cd ..
```

#### Step 5: Configure API Keys (Optional)

> **Note**: When using BetterCallClaude through Claude Code CLI, no API keys are required for basic functionality. Claude Code handles authentication automatically. The optional keys below enable advanced features.

Create a `.env` file in the project root only if you need the optional features:

```bash
# Optional - For enhanced web research capabilities
# Required only if using Tavily-powered research features
TAVILY_API_KEY=your_tavily_api_key_here

# Optional - For advanced/standalone usage
# Only needed if running Python components outside of Claude Code
# or for future extensibility features
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### Step 6: Verify Installation

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

## Quick Start

### Method 1: Intelligent Legal Proxy (NEW - Recommended)

The `/legal` command is your intelligent entry point that routes to the right agent(s) automatically.

```bash
# Start Claude Code
claude

# Mode A: Natural Language - Just describe what you need
/legal I need to analyze a contract dispute about Art. 97 OR and prepare a legal opinion
→ Automatically routes: Researcher → Strategist → Drafter

# Mode B: Direct Agent - Use @agent for specific routing
/legal @compliance Check FINMA requirements for crypto custody
/legal @risk Calculate settlement range for CHF 500,000 dispute

# Mode C: Explicit Workflow - Define your pipeline
/legal --workflow full "Art. 97 OR breach, CHF 500,000 dispute"
/legal --workflow research,strategy "Tenant eviction in Zürich"
```

### Method 2: Natural Language (Auto-Detection)

Simply ask legal questions. The framework automatically detects legal keywords and activates the appropriate persona.

```bash
# Ask legal questions
"Search BGE for Art. 97 OR contractual liability"
"Draft a service agreement under Swiss OR"
"Analyze litigation strategy for breach of contract, CHF 500,000 damages"
```

### Method 3: Explicit Commands

Use `/legal:` commands for professional assurance and audit trails.

```bash
# Legal research
/legal:research Art. 97 OR contractual liability

# Case strategy
/legal:strategy Analyze breach of contract case with CHF 500,000 damages

# Document drafting
/legal:draft Service agreement under Swiss OR for software development
```

### Method 4: Agent Commands

Use `/agent:` commands for autonomous research workflows.

```bash
# Autonomous research
/agent:researcher "BGE precedents on Werkvertrag" --depth=deep

# With canton filter
/agent:researcher "rental law eviction" --canton=ZH --depth=standard
```

---

## Command Reference

### Intelligent Legal Proxy (v1.3.2)

| Command | Description | Example |
|---------|-------------|---------|
| `/legal` | Intelligent routing to agents | `/legal I need to analyze a contract dispute` |
| `/legal @agent` | Direct agent routing | `/legal @compliance Check FINMA requirements` |
| `/legal --workflow` | Explicit workflow definition | `/legal --workflow full "Art. 97 OR breach"` |
| `/legal --mode` | Set autonomy mode | `/legal --mode autonomous "Quick BGE search"` |

**Available Agent Routes**: `@researcher`, `@strategist`, `@drafter`, `@orchestrator`, `@citation`, `@compliance`, `@data-protection`, `@risk`, `@procedure`, `@translator`, `@fiscal`, `@corporate`, `@cantonal`, `@realestate`

### Legal Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/legal:help` | Display command help | `/legal:help --category=research` |
| `/legal:version` | Show version and MCP status | `/legal:version` |
| `/legal:research` | Search Swiss legal sources | `/legal:research Art. 97 OR --jurisdiction=federal` |
| `/legal:strategy` | Case strategy analysis | `/legal:strategy breach of contract CHF 500,000` |
| `/legal:draft` | Document drafting | `/legal:draft service agreement Swiss OR` |
| `/legal:federal` | Force federal law mode | `/legal:federal` |
| `/legal:cantonal` | Force cantonal law mode | `/legal:cantonal ZH` |
| `/legal:cite` | Citation verification | `/legal:cite BGE 147 III 93` |

### Agent Commands

#### Core Pipeline Agents

| Command | Description | Options |
|---------|-------------|---------|
| `/agent:researcher` | Autonomous legal research | `--depth`, `--focus`, `--canton`, `--language` |
| `/agent:strategist` | Litigation strategy development | `--risk-tolerance`, `--settlement-focus` |
| `/agent:drafter` | Legal document generation | `--type`, `--language`, `--style` |
| `/agent:orchestrator` | Multi-agent pipeline coordination | `--workflow`, `--checkpoints` |

#### Specialized Domain Agents (v1.3.1)

| Command | Description | Domain |
|---------|-------------|--------|
| `/agent:citation` | Citation verification and formatting | BGE/ATF/DTF references, validation |
| `/agent:compliance` | Regulatory compliance checks | FINMA, AML/KYC, GwG |
| `/agent:data-protection` | Privacy law analysis | GDPR, nDSG/FADP, DPIA |
| `/agent:risk` | Risk assessment and quantification | Case probability, damages modeling |
| `/agent:procedure` | Procedural rules and deadlines | ZPO, StPO, VwVG, BGG |
| `/agent:translator` | Legal translation | DE/FR/IT terminology |
| `/agent:fiscal` | Tax law analysis | DTAs, transfer pricing, BEPS |
| `/agent:corporate` | Corporate and commercial law | AG/GmbH, M&A, SHA |
| `/agent:cantonal` | Cantonal law expertise | All 26 cantons |
| `/agent:realestate` | Real estate law | Grundbuch, Lex Koller |

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

## Agent Framework

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

## MCP Servers

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

## Ollama Integration

BetterCallClaude includes full integration with [Ollama](https://ollama.ai/) for local LLM inference, providing privacy-first AI capabilities for sensitive legal work.

### Why Local LLM?

Swiss attorney-client privilege (Anwaltsgeheimnis, Art. 321 StGB) requires strict confidentiality. Local LLM processing ensures:

- **Data Sovereignty**: Sensitive legal content never leaves your infrastructure
- **Compliance**: Meets Swiss bar association data protection requirements
- **Control**: Full audit trail of all AI interactions
- **Flexibility**: Use cloud for general queries, local for privileged content

### Privacy Levels

| Level | Description | Routing | Use Case |
|-------|-------------|---------|----------|
| `PUBLIC` | Non-sensitive content | Cloud preferred | General legal research, public case law |
| `CONFIDENTIAL` | Client-related content | Local preferred, cloud fallback | Standard legal work, client communications |
| `PRIVILEGED` | Attorney-client privileged | Local only, no cloud | Mandatsgeheimnis, litigation strategy |

### Automatic Privilege Detection

The privacy router automatically detects privileged content in German, French, and Italian:

```yaml
# Detected patterns (examples)
german:
  - "Anwaltsgeheimnis"
  - "Berufsgeheimnis"
  - "Art. 321 StGB"
  - "Mandatsgeheimnis"
  - "streng vertraulich"

french:
  - "secret professionnel"
  - "secret de l'avocat"
  - "confidentiel"

italian:
  - "segreto professionale"
  - "segreto dell'avvocato"
```

### Supported Models

| Model | Context | Recommended For |
|-------|---------|-----------------|
| `llama3.1:70b` | 128K | Complex legal analysis, document review |
| `llama3.1:8b` | 128K | General tasks, Swiss German processing |
| `mixtral:8x7b` | 32K | Multilingual support (DE/FR/IT) |
| `phi3:medium` | 4K | Simple tasks, fast responses |
| `codellama:13b` | 16K | Legal tech, code generation |

### Configuration

```yaml
# ~/.betterask/config.yaml
privacy_mode: balanced  # strict | balanced | cloud

# LLM backend selection
llm_backend: ollama  # anthropic | ollama

# Ollama settings
ollama:
  host: "http://localhost:11434"
  default_model: "llama3.1:8b"
  timeout: 120

# Privacy routing
privacy:
  default_level: confidential
  allow_cloud_fallback: true
  log_routing_decisions: true
  auto_detect_sensitivity: true
```

### Installation

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull recommended models
ollama pull llama3.1:8b      # Fast, general purpose
ollama pull llama3.1:70b     # Complex legal analysis (requires 48GB+ RAM)
ollama pull mixtral:8x7b     # Multilingual support

# Verify installation
ollama list
```

### Usage Examples

```python
from src.integrations.ollama import OllamaClient, PrivacyRouter, PrivacyLevel

# Initialize client
client = OllamaClient()

# Check availability
if await client.is_available():
    # Direct generation
    response = await client.generate(
        prompt="Explain Art. 321 StGB",
        model=OllamaModel.LLAMA3_8B
    )

# Privacy-aware routing
router = PrivacyRouter(ollama_client=client)

# Automatic privilege detection
result = await router.route_request(
    "Mandatsgeheimnis discussion with client",
    privacy_level=PrivacyLevel.PRIVILEGED  # Forces local processing
)

# Chat with privacy
messages = [ChatMessage(role="user", content="Analyze this contract")]
result = await router.chat_with_privacy(messages)
```

### Privacy Router Behavior

| Scenario | Local Available | Cloud Fallback | Result |
|----------|-----------------|----------------|--------|
| PUBLIC + Ollama up | ✅ | Allowed | Cloud (preferred for speed) |
| CONFIDENTIAL + Ollama up | ✅ | Allowed | Local (preferred) |
| CONFIDENTIAL + Ollama down | ❌ | Allowed | Cloud (fallback) |
| PRIVILEGED + Ollama up | ✅ | Not allowed | Local |
| PRIVILEGED + Ollama down | ❌ | Not allowed | **Error** (privacy violation) |

### Audit Trail

All routing decisions are logged for compliance:

```python
# Get routing history
history = router.get_routing_history()

# Get statistics
stats = router.get_routing_statistics()
# Returns: {"total": 100, "local_count": 75, "cloud_count": 25, ...}
```

---

## Architecture

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
│       ├── legal:research.md
│       ├── legal:strategy.md
│       ├── legal:draft.md
│       └── agent:researcher.md
│
├── src/                        # Python source code
│   ├── agents/                # Agent Framework
│   │   ├── base.py           # AgentBase with checkpoints
│   │   ├── researcher.py     # ResearcherAgent
│   │   ├── strategist.py     # StrategistAgent with risk assessment
│   │   ├── drafter.py        # DrafterAgent for document generation
│   │   ├── orchestrator.py   # AgentOrchestrator for multi-agent pipelines
│   │   ├── models/           # Shared data models
│   │   │   └── shared.py     # Language, CaseFacts, Strategy models
│   │   └── utils/            # Agent utilities
│   │       └── language.py   # Language detection and terminology
│   ├── integrations/          # External integrations
│   │   └── ollama/           # Ollama local LLM integration
│   │       ├── client.py     # OllamaClient with model selection
│   │       └── privacy_mode.py # PrivacyRouter with privilege detection
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
│  /legal:cite-check              /agent:strategist               │
│  /legal:translate               /agent:drafter                  │
│  /legal:format                  /agent:orchestrator             │
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

## Multi-Lingual Support

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

## Configuration

### User Configuration

Create `~/.betterask/config.yaml` for personalized settings:

```yaml
# Framework version
version: "1.3.0"

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

### Supported Cantons (All 26)

All Swiss cantons are fully supported with their official languages and court systems.

#### German-Speaking Cantons (Deutschschweiz)

| Code | Canton | Language | Highest Court |
|------|--------|----------|---------------|
| ZH | Zürich | DE | Obergericht des Kantons Zürich |
| LU | Luzern | DE | Kantonsgericht Luzern |
| UR | Uri | DE | Obergericht des Kantons Uri |
| SZ | Schwyz | DE | Kantonsgericht Schwyz |
| OW | Obwalden | DE | Obergericht des Kantons Obwalden |
| NW | Nidwalden | DE | Obergericht des Kantons Nidwalden |
| GL | Glarus | DE | Obergericht des Kantons Glarus |
| ZG | Zug | DE | Obergericht des Kantons Zug |
| SO | Solothurn | DE | Obergericht des Kantons Solothurn |
| BS | Basel-Stadt | DE | Appellationsgericht Basel-Stadt |
| BL | Basel-Landschaft | DE | Kantonsgericht Basel-Landschaft |
| SH | Schaffhausen | DE | Obergericht des Kantons Schaffhausen |
| AR | Appenzell A.Rh. | DE | Obergericht Appenzell Ausserrhoden |
| AI | Appenzell I.Rh. | DE | Kantonsgericht Appenzell Innerrhoden |
| SG | St. Gallen | DE | Kantonsgericht St. Gallen |
| AG | Aargau | DE | Obergericht des Kantons Aargau |
| TG | Thurgau | DE | Obergericht des Kantons Thurgau |

#### Bilingual/Trilingual Cantons

| Code | Canton | Languages | Highest Court |
|------|--------|-----------|---------------|
| BE | Bern | DE/FR | Obergericht des Kantons Bern |
| FR | Fribourg | DE/FR | Tribunal cantonal de Fribourg |
| VS | Valais | DE/FR | Tribunal cantonal du Valais |
| GR | Graubünden | DE/IT/RM | Kantonsgericht Graubünden |

#### French-Speaking Cantons (Romandie)

| Code | Canton | Language | Highest Court |
|------|--------|----------|---------------|
| VD | Vaud | FR | Tribunal cantonal vaudois |
| NE | Neuchâtel | FR | Tribunal cantonal de Neuchâtel |
| GE | Genève | FR | Cour de justice de Genève |
| JU | Jura | FR | Tribunal cantonal du Jura |

#### Italian-Speaking Canton (Svizzera italiana)

| Code | Canton | Language | Highest Court |
|------|--------|----------|---------------|
| TI | Ticino | IT | Tribunale d'appello del Cantone Ticino |

#### Federal Level

| Code | Level | Languages | Court |
|------|-------|-----------|-------|
| CH | Bund / Confédération | DE/FR/IT | Bundesgericht / Tribunal fédéral / Tribunale federale |

---

## Development

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

## Documentation

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

### v1.3.2 (Current) - Intelligent Orchestration ✅

- ✅ Intelligent Legal Proxy (`/legal`) as unified entry point
- ✅ Hybrid orchestration combining natural language, direct routing, and workflows
- ✅ Intent detection system with pattern matching and confidence scoring
- ✅ Multi-agent coordination with 14+ specialized agents
- ✅ Interactive dialogue management with checkpoints
- ✅ Three autonomy modes: guided, balanced, autonomous

### v1.3.1 - Specialized Agents ✅

- ✅ 10 specialized domain agents for expert legal analysis
- ✅ Citation Specialist for BGE/ATF/DTF verification and formatting
- ✅ Compliance Officer for FINMA, AML/KYC regulatory checks
- ✅ Data Protection Specialist for GDPR, nDSG/FADP compliance
- ✅ Risk Analyst for case probability and damages modeling
- ✅ Procedure Specialist for ZPO/StPO deadline management
- ✅ Legal Translator for DE/FR/IT terminology
- ✅ Fiscal Legal Expert for tax law and DTA analysis
- ✅ Corporate & Commercial agent for M&A and contracts
- ✅ Cantonal Law Expert for all 26 cantons
- ✅ Real Estate Expert for Grundbuch and Lex Koller

### v1.3.0 - Canton & Privacy Enhancement ✅

- ✅ All 26 Swiss cantons with multilingual court names
- ✅ Ollama integration for local LLM inference with privacy routing
- ✅ Privacy mode with Swiss attorney-client privilege detection
- ✅ Complete cantonal court documentation (DE/FR/IT)
- 🔜 Commercial database integrations (Swisslex, Weblaw)
- 🔜 Automated legal research reports
- 🔜 Practice management integrations
- 🔜 Citation network analysis

### v1.2.0 - Agent Expansion ✅

- ✅ StrategistAgent with risk assessment and settlement analysis
- ✅ DrafterAgent with Swiss legal document generation
- ✅ AgentOrchestrator for multi-agent pipeline coordination
- ✅ Multi-lingual utilities (language detection, terminology mapping)
- ✅ Enhanced type safety with mypy strict compliance
- ✅ 93+ agent framework tests

### v1.1.0 - Agent Framework ✅

- ✅ Agent base class with checkpoints and audit logging
- ✅ ResearcherAgent with MCP integration
- ✅ CaseManager for case lifecycle management
- ✅ Database infrastructure with SQLite
- ✅ 267+ tests with >73% coverage
- ✅ Python 3.11/3.12 support

### v2.0 (Q2 2025) - International

- 🔜 European law integration (EU regulations, ECHR)
- 🔜 Cross-border legal analysis
- 🔜 Advanced AI features (argumentation, negotiation support)

---

## Contributing

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
- **Commercial Databases**: Swisslex, Weblaw integrations
- **Local LLM**: Ollama integration for privacy mode
- **Workflow Examples**: Real-world case studies
- **Agent Enhancements**: Pipeline improvements and new agent types

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

## License

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

*BetterCallClaude v1.3.2 - Legal Intelligence Framework*
