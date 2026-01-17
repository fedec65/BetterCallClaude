# BetterCallClaude: Legal Intelligence Framework for Swiss Lawyers

[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](https://github.com/fedec65/bettercallclaude)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Languages](https://img.shields.io/badge/languages-DE%20%7C%20FR%20%7C%20IT%20%7C%20EN-orange.svg)]()
[![Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-purple.svg)](https://claude.ai/code)
[![Claude Desktop](https://img.shields.io/badge/works%20with-Claude%20Desktop-blueviolet.svg)](https://claude.ai/download)

> **Transform Swiss legal research and case strategy with AI-powered precision.**
> Built for solo practitioners and medium-sized law firms specializing in corporate law and litigation.

---

## 🚀 Quick Install

**Works with both Claude Code CLI and Claude Desktop.**

### macOS / Linux / WSL

```bash
curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash
```

### Windows (Native PowerShell)

```powershell
irm https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.ps1 | iex
```

> **Note**: Run PowerShell as Administrator. For detailed Windows instructions, see the [Windows Installation Guide](docs/windows-installation.md).

The installer automatically detects your environment, configures MCP servers, creates symlinks (or CLI wrappers on Windows), and backs up existing settings.

### Upgrading

To upgrade to the latest version:

```bash
# macOS / Linux / WSL
bettercallclaude update

# Windows PowerShell
bettercallclaude update
```

This will pull the latest changes from GitHub and update your installation. You can check your current version with:

```bash
bettercallclaude version
```

### Health Check

Verify your installation is working correctly:

```bash
bettercallclaude doctor
```

-----

## 🎯 Overview

BetterCallClaude is a comprehensive legal intelligence framework designed to provide:

  * **80% time savings** on precedent analysis and legal research.
  * **25% quality improvement** through systematic verification.
  * **Multi-jurisdictional expertise** across Federal law and all 26 Swiss cantons.
  * **Multi-lingual precision** in German, French, Italian, and English.
  * **Privacy-First Architecture** with local LLM support for attorney-client privilege (*Anwaltsgeheimnis*).

### What's New in v2.2.0

  * 🆕 **OnlineKommentar MCP Server**: Access Swiss legal commentaries via OnlineKommentar.ch API, completing the **Swiss Legal Research Trinity** (Law + Case Law + Doctrine).
  * 🆕 **4 New MCP Tools**: `search_commentaries`, `get_commentary`, `get_commentary_for_article`, `list_legislative_acts` with full multilingual support (DE/FR/IT/EN).
  * 🆕 **Legislative Act Mapping**: UUID mapping for major Swiss codes (OR, ZGB, StGB, ZPO, StPO, and more).

### What's New in v2.1.0

  * 🆕 **Multi-Agent Communication System**: MessageBus pattern with centralized publish-subscribe routing, MessageEnvelope with correlation IDs for distributed tracing, and comprehensive message history tracking with delivery status.
  * 🆕 **Structured Logging & Telemetry**: Enterprise-grade monitoring with StructuredLogger (JSON logging with contextual metadata), MetricsCollector (counters, gauges, histograms, timers), and TelemetrySystem (unified interface for logging and metrics with operation tracing).
  * 🆕 **Swiss Legal Citation Parser**: Multi-lingual parsing engine supporting German (BGE, Art., Abs., lit.), French (ATF, art., al., let.), and Italian (DTF, art., cpv., lett.) legal citations with BGE/ATF/DTF decision parsing, statutory article references, and court decision citations.

### What's New in v2.0.1

  * 🆕 **Fedlex SPARQL MCP Server**: Direct access to Swiss federal legislation via the JOLUX ontology, enabling semantic queries for laws, ordinances, and consolidated legal texts with full multilingual support (DE/FR/IT/RM).

### What's New in v2.0.0

  * 🆕 **PipelineBuilder API**: Fluent builder pattern for creating custom multi-agent workflows with `add_step()`, `add_parallel_group()`, `add_conditional_step()`, and `add_router()`.
  * 🆕 **Dynamic Agent Registry**: Auto-discovers all 14 agents (3 Python + 11 Command-based) with unified metadata.
  * 🆕 **Parallel Execution**: Run independent agents concurrently for faster complex analyses.
  * 🆕 **Conditional Routing**: Execute different pipeline paths based on runtime context and intermediate results.
  * 🆕 **CommandAgentAdapter**: Seamlessly integrates command-file agents with the Python orchestration layer.

-----

## 📋 Table of Contents

  - [Features & Agent Ecosystem](#features--agent-ecosystem)
  - [Supported Jurisdictions](#supported-jurisdictions)
  - [Privacy & Ollama Integration](#privacy--ollama-integration)
  - [Quick Start](#quick-start)
  - [Command Reference](#command-reference)
  - [Architecture & MCP](#architecture--mcp)
  - [Configuration](#configuration)
  - [Development](#development)

-----

## Features & Agent Ecosystem

### Core Legal Personas

The framework operates through three distinct expert personas:

| Persona | Focus | Capabilities |
| :--- | :--- | :--- |
| **Legal Researcher** | Precedent & Statute | BGE/ATF/DTF analysis, citation verification, legislative chains. |
| **Case Strategist** | Risk & Strategy | Outcome probability scoring, settlement calculations, procedural roadmaps. |
| **Legal Drafter** | Documentation | Contract drafting (OR/CO), court submissions, multi-lingual translation. |

### The Agent Ecosystem

BetterCallClaude utilizes a specialized swarm of 14+ agents. You can route to these specifically (e.g., `@compliance`) or let the `/legal` proxy route for you.

#### Core Pipeline Agents (Python)

  * **ResearcherAgent**: Autonomous deep-dive research with MCP integration for court databases.
  * **StrategistAgent**: Litigation strategy, risk assessment, and settlement analysis.
  * **DrafterAgent**: Generates documents adhering to Swiss formatting standards.
  * **AgentOrchestrator v2.0**: Coordinates multi-agent pipelines with the new PipelineBuilder API, supporting parallel execution, conditional routing, and checkpoint aggregation.

#### Specialized Domain Agents (Command-Based)

All 11 command-based agents are auto-discovered from `.claude/commands/agent:*.md` and seamlessly integrated via the `CommandAgentAdapter`:

  * **Citation Validator**: Verifies BGE/ATF/DTF references and cross-validates formatting.
  * **Contract Analyzer**: Analyzes contract terms and identifies risks.
  * **Deadline Tracker**: Tracks legal deadlines and limitation periods.
  * **Document Formatter**: Formats legal documents to Swiss standards.
  * **Jurisdiction Advisor**: Advises on jurisdiction selection.
  * **Opponent Analyzer**: Analyzes opposing counsel patterns.
  * **Precedent Finder**: Finds relevant legal precedents.
  * **Risk Assessor**: Comprehensive risk assessment.
  * **Settlement Calculator**: Calculates settlement values.
  * **Statute Interpreter**: Interprets statutory provisions.
  * **Timeline Builder**: Builds case timelines.

#### PipelineBuilder API (v2.0)

Build custom multi-agent workflows programmatically:

```python
from src.agents import PipelineBuilder, PipelineStep, PipelineExecutor

# Create a custom pipeline with parallel validation
pipeline = (
    PipelineBuilder("contract_review")
    .add_step("researcher", "Research Art. 97 OR precedents", output_key="research")
    .with_timeout(120)
    .add_parallel_group([
        PipelineStep("citation_validator", "Verify all citations", output_key="citations"),
        PipelineStep("risk_assessor", "Assess contract risks", output_key="risks"),
    ])
    .add_conditional_step(
        condition=lambda ctx: ctx.get("risks", {}).get("level") == "high",
        step=PipelineStep("strategist", "Deep strategy analysis"),
        else_step=PipelineStep("drafter", "Quick summary"),
    )
    .build()
)

# Execute with the orchestrator
result = await executor.execute(pipeline, {"contract": "..."})
```

-----

## Supported Jurisdictions

BetterCallClaude natively supports **Federal Law** (ZGB, OR, StGB, SchKG, etc.) and **all 26 Cantons** with their respective official languages.

### Cantonal Coverage

| Region | Cantons (Codes) | Court System Support |
| :--- | :--- | :--- |
| **Deutschschweiz** | ZH, LU, UR, SZ, OW, NW, GL, ZG, SO, BS, BL, SH, AR, AI, SG, AG, TG | Full High Court (Obergericht/Kantonsgericht) support. |
| **Romandie** | VD, NE, GE, JU | Full *Tribunal cantonal/Cour de justice* support. |
| **Bilingual** | BE, FR, VS | Full bilingual (DE/FR) routing and court naming. |
| **Svizzera Italiana** | TI, GR (Trilingual) | *Tribunale d'appello* and Grisonian courts. |

-----

## Privacy & Ollama Integration

To comply with **Swiss Attorney-Client Privilege (Art. 321 StGB)**, BetterCallClaude includes a `PrivacyRouter`.

### Privacy Levels

1.  **Public:** Uses Cloud LLMs (Anthropic) for general research (e.g., "Find BGE 145 III 229").
2.  **Confidential:** Prefers Local LLMs, falls back to Cloud if necessary.
3.  **Privileged:** **Strict Local Only**. Uses [Ollama](https://ollama.ai/) to process sensitive client facts locally.

### Auto-Detection

The system scans input for sensitive keywords (e.g., *"Mandatsgeheimnis"*, *"secret professionnel"*) and forces the appropriate privacy level.

**Recommended Local Models:** `llama3.1:8b` (Speed), `llama3.1:70b` (Deep Analysis), `mixtral:8x7b` (Multilingual).

-----

## Quick Start

### 1\. Intelligent Routing (Recommended)

The `/legal` command is your single entry point.

```bash
# Natural Language (Auto-Routes to Researcher → Strategist)
/legal "Analyze a breach of contract (Art. 97 OR) for a software firm, damages CHF 50k"

# Direct Agent Routing
/legal @compliance "Check FINMA requirements for a new crypto custody wallet"

# Workflow Definition
/legal --workflow full "Tenant eviction in Zürich due to renovation"
```

### 2\. Explicit Commands

Use specific commands for audit trails or specific tasks.

```bash
# Research
/legal-research "Art. 97 OR contractual liability" --jurisdiction=federal

# Strategy
/legal-strategy "Breach of contract risk assessment" --risk-tolerance=low

# Drafting
/legal-draft "Service agreement under Swiss OR" --language=EN
```

-----

## Command Reference

### Primary Commands

| Command | Description | Key Options |
| :--- | :--- | :--- |
| `/legal` | Smart entry point (Proxy) | `@agent`, `--workflow`, `--mode` |
| `/legal-research` | Search legal sources | `--jurisdiction`, `--date-from`, `--limit` |
| `/legal-strategy` | Case strategy analysis | `--risk-tolerance`, `--settlement-focus` |
| `/legal-draft` | Document drafting | `--type`, `--language`, `--style` |
| `/legal-cite` | Verify citations | `--format` (DE/FR/IT) |

### Agent Directives

Access specific agents via `/agent-<name>` or the shorthand `@<name>` inside the `/legal` proxy.

| Agent | CLI Command | Context Options |
| :--- | :--- | :--- |
| **Researcher** | `/agent-researcher` | `--depth`, `--focus`, `--canton` |
| **Orchestrator** | `/agent-orchestrator` | `--pipeline`, `--mode`, `--parallel`, `--steps` |
| **Specialists** | `/agent-compliance`, `/agent-risk`, etc. | *Domain specific* |

#### Orchestrator v2.0 Examples

```bash
# Full pipeline: Research → Strategy → Draft
/agent-orchestrator --pipeline full "Contract breach under Art. 97 OR"

# Parallel analysis with synthesis
/agent-orchestrator --parallel "risk_assessor,deadline_tracker,citation_validator" --then strategist

# Custom multi-agent sequence
/agent-orchestrator --steps "researcher,citation_validator,strategist,drafter" --task "Full verified analysis"
```

-----

## Architecture & MCP

BetterCallClaude connects Claude to Swiss legal databases via the **Model Context Protocol (MCP)**.

### MCP Servers

  * **`entscheidsuche`**: Connects to the centralized Swiss court decision database (Federal & Cantonal).
  * **`bge-search`**: Direct access to the Federal Supreme Court database.
  * **`legal-citations`**: A logic server for verifying and formatting Swiss legal citations (e.g., converting "BGE 145 III 229" to "ATF 145 III 229" for French contexts).
  * **`fedlex-sparql`**: Queries Swiss federal legislation using the JOLUX ontology via SPARQL. Retrieves laws, ordinances, and consolidated legal texts with multilingual support (DE/FR/IT/RM).
  * **`onlinekommentar`**: Access Swiss legal commentaries and doctrine via the OnlineKommentar.ch API. Search commentaries by law/article, retrieve full commentary content, and list available legislative acts.
  * **`shared`**: SQLite infrastructure for caching and connection pooling.

### Agent Workflow Diagram

```
[User Input]
    ⬇
[Privacy Router] ➡ (Sensitive?) ➡ [Ollama / Local LLM]
    ⬇ (Safe)
[Intelligent Proxy (/legal)]
    ⬇
[Agent Orchestrator]
    ⬇ ⬌ [Researcher] ⬌ [MCP: entscheidsuche]
    ⬇ ⬌ [Strategist] ⬌ [Risk Engine]
    ⬇ ⬌ [Drafter]
    ⬇
[Final Output]
```

-----

## Configuration

User settings are stored in `~/.betterask/config.yaml`.

```yaml
# Example Configuration
privacy_mode: balanced      # strict | balanced | cloud
llm_backend: anthropic      # anthropic | ollama
canton_focus: ["ZH", "GE"]  # Prioritize these courts
languages: ["de", "en"]     # Output preferences
mcp_servers:
  entscheidsuche:
    enabled: true
```

-----

## Development

### Setup

```bash
git clone [https://github.com/fedec65/bettercallclaude.git](https://github.com/fedec65/bettercallclaude.git)
cd bettercallclaude
python -m venv venv && source venv/bin/activate
pip install -e ".[dev]"
npm install
```

### Testing

```bash
pytest                  # Python tests (Agents)
npm test                # TypeScript tests (MCP Servers)
bettercallclaude doctor # System health check
```

-----

## 🎯 Roadmap (Future)

  * **European Law**: Integration with EU regulations and ECHR jurisprudence.
  * **Database Connectors**: Swisslex, Weblaw, and other commercial legal databases.
  * **Argumentation Engine**: Advanced logic chains for appellate briefs.
  * **Citation Network**: Visual graphs of precedent relationships.

-----

## ⚠️ Professional Disclaimer

**BetterCallClaude is a legal intelligence tool, not a lawyer.**
All outputs require professional review. Lawyers maintain full professional responsibility for all work products generated using this framework.

-----

## License

This project is licensed under the **AGPL-3.0**.

Built with ❤️ for the Swiss legal community.
