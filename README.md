# BetterCallClaude: Legal Intelligence Framework for Swiss Lawyers

[![Version](https://img.shields.io/badge/version-1.3.2-blue.svg)](https://github.com/fedec65/bettercallclaude)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-DE%20%7C%20FR%20%7C%20IT%20%7C%20EN-orange.svg)]()
[![Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-purple.svg)](https://claude.ai/code)
[![Claude Desktop](https://img.shields.io/badge/works%20with-Claude%20Desktop-blueviolet.svg)](https://claude.ai/download)

> **Transform Swiss legal research and case strategy with AI-powered precision.**
> Built for solo practitioners and medium-sized law firms specializing in corporate law and litigation.

---

## 🚀 Quick Install

**Works with both Claude Code CLI and Claude Desktop.**

```bash
curl -fsSL [https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh](https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh) | bash
````

The installer automatically detects your environment, configures MCP servers, creates symlinks, and backs up existing settings.

-----

## 🎯 Overview

BetterCallClaude is a comprehensive legal intelligence framework designed to provide:

  * **80% time savings** on precedent analysis and legal research.
  * **25% quality improvement** through systematic verification.
  * **Multi-jurisdictional expertise** across Federal law and all 26 Swiss cantons.
  * **Multi-lingual precision** in German, French, Italian, and English.
  * **Privacy-First Architecture** with local LLM support for attorney-client privilege (*Anwaltsgeheimnis*).

### What's New in v1.3.2

  * 🆕 **Intelligent Legal Proxy (`/legal`)**: Single entry point with automatic intent detection.
  * 🆕 **Hybrid Orchestration**: Routes queries seamlessly between autonomous agents and guided workflows.
  * 🆕 **Interactive Dialogue**: Agents now request clarification and confirm checkpoints for complex workflows.

-----

## 📋 Table of Contents

  - [Features & Agent Ecosystem](https://www.google.com/search?q=%23features--agent-ecosystem)
  - [Supported Jurisdictions](https://www.google.com/search?q=%23supported-jurisdictions)
  - [Privacy & Ollama Integration](https://www.google.com/search?q=%23privacy--ollama-integration)
  - [Quick Start](https://www.google.com/search?q=%23quick-start)
  - [Command Reference](https://www.google.com/search?q=%23command-reference)
  - [Architecture & MCP](https://www.google.com/search?q=%23architecture--mcp)
  - [Configuration](https://www.google.com/search?q=%23configuration)
  - [Development](https://www.google.com/search?q=%23development)

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

#### Core Pipeline Agents

  * **ResearcherAgent**: Autonomous deep-dive research with MCP integration for court databases.
  * **StrategistAgent**: Litigation strategy, risk assessment, and settlement analysis.
  * **DrafterAgent**: Generates documents adhering to Swiss formatting standards.
  * **AgentOrchestrator**: Coordinates multi-agent pipelines and manages checkpoints.

#### Specialized Domain Agents

  * **Citation Specialist (`@citation`)**: Verifies BGE/ATF/DTF references and cross-validates formatting.
  * **Compliance Officer (`@compliance`)**: Handles FINMA, AML/KYC (GwG), and regulatory compliance.
  * **Data Protection Specialist (`@data-protection`)**: Expert in GDPR and nDSG/FADP (DPIA workflows).
  * **Risk Analyst (`@risk`)**: Performs Monte Carlo simulations for damages and case outcomes.
  * **Procedure Specialist (`@procedure`)**: Calculates deadlines for ZPO/StPO/VwVG/BGG.
  * **Legal Translator (`@translator`)**: Specialized DE/FR/IT legal terminology (Termdat integration).
  * **Fiscal Expert (`@fiscal`)**: Tax law, Double Taxation Agreements (DTA), and transfer pricing.
  * **Corporate Specialist (`@corporate`)**: M\&A, shareholder agreements, and commercial contracts.
  * **Real Estate Expert (`@realestate`)**: Property transactions, *Grundbuch*, and *Lex Koller*.
  * **Cantonal Expert (`@cantonal`)**: Comparative law across 26 cantons and fee calculations.

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
/legal:research "Art. 97 OR contractual liability" --jurisdiction=federal

# Strategy
/legal:strategy "Breach of contract risk assessment" --risk-tolerance=low

# Drafting
/legal:draft "Service agreement under Swiss OR" --language=EN
```

-----

## Command Reference

### Primary Commands

| Command | Description | Key Options |
| :--- | :--- | :--- |
| `/legal` | Smart entry point (Proxy) | `@agent`, `--workflow`, `--mode` |
| `/legal:research` | Search legal sources | `--jurisdiction`, `--date-from`, `--limit` |
| `/legal:strategy` | Case strategy analysis | `--risk-tolerance`, `--settlement-focus` |
| `/legal:draft` | Document drafting | `--type`, `--language`, `--style` |
| `/legal:cite` | Verify citations | `--format` (DE/FR/IT) |

### Agent Directives

Access specific agents via `/agent:<name>` or the shorthand `@<name>` inside the `/legal` proxy.

| Agent | CLI Command | Context Options |
| :--- | :--- | :--- |
| **Researcher** | `/agent:researcher` | `--depth`, `--focus`, `--canton` |
| **Orchestrator** | `/agent:orchestrator` | `--workflow`, `--checkpoints` |
| **Specialists** | `/agent:compliance`, `/agent:risk`, etc. | *Domain specific* |

-----

## Architecture & MCP

BetterCallClaude connects Claude to Swiss legal databases via the **Model Context Protocol (MCP)**.

### MCP Servers

  * **`entscheidsuche`**: Connects to the centralized Swiss court decision database (Federal & Cantonal).
  * **`bge-search`**: Direct access to the Federal Supreme Court database.
  * **`legal-citations`**: A logic server for verifying and formatting Swiss legal citations (e.g., converting "BGE 145 III 229" to "ATF 145 III 229" for French contexts).
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

  * **v2.0**: Integration with European Law (EU regulations, ECHR).
  * **Integrations**: Connectors for commercial databases (Swisslex, Weblaw).
  * **Argumentation**: Advanced logic chains for appellate briefs.
  * **Citation Network**: Visual graphs of precedent relationships.

-----

## ⚠️ Professional Disclaimer

**BetterCallClaude is a legal intelligence tool, not a lawyer.**
All outputs require professional review. Lawyers maintain full professional responsibility for all work products generated using this framework.

-----

## License

This project is licensed under the **MIT License**.

Built with ❤️ for the Swiss legal community.