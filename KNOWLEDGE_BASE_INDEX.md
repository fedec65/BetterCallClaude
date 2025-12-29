# BetterCallClaude Knowledge Base Index

**Version**: 2.0.0
**Last Updated**: 2024-12-29
**Target Users**: Swiss lawyers (solo practitioners and medium firms)
**Practice Areas**: Corporate Law, Litigation, Compliance, Tax, Real Estate

---

## 🎯 Framework Mission

BetterCallClaude transforms legal research and case strategy for Swiss lawyers by providing:
- **80% time savings** on precedent analysis and legal research
- **25% quality improvement** through systematic verification
- **Multi-jurisdictional expertise** across federal and cantonal Swiss law
- **Multi-lingual precision** in legal terminology (DE/FR/IT/EN)

---

## 📁 Project Structure Overview

```
BetterCallClaude/
├── .claude/                       # Framework configuration
│   ├── commands/                  # 27 slash command definitions
│   ├── BETTERASK.md              # Main framework entry point
│   ├── LEGAL_PRINCIPLES.md       # Swiss legal reasoning standards
│   ├── LEGAL_SYMBOLS.md          # Citation format and symbols
│   └── SWISS_LAW_CONFIG.md       # Jurisdiction routing configuration
├── src/                           # Python source code
│   ├── agents/                    # Agent implementations
│   │   ├── base.py               # AgentBase abstract class
│   │   ├── researcher.py         # ResearcherAgent
│   │   ├── strategist.py         # StrategistAgent
│   │   ├── drafter.py            # DrafterAgent
│   │   └── orchestrator.py       # AgentOrchestrator
│   └── utils/                     # Shared utilities
├── mcp-servers/                   # MCP server implementations
│   ├── bge-search/               # BGE decision search
│   ├── entscheidsuche/           # Unified court decision search
│   ├── legal-citations/          # Citation verification
│   └── fedlex-sparql/            # Swiss federal law SPARQL
├── packages/                      # TypeScript packages
│   └── shared/                    # Shared infrastructure
└── docs/                          # Documentation
```

---

## 🔌 MCP Server Architecture

### 1. BGE Search (`mcp-servers/bge-search/`)

**Version**: 2.0.0
**Purpose**: Swiss Federal Supreme Court (Bundesgericht) decision search and retrieval

#### Tools
| Tool | Description |
|------|-------------|
| `search_bge` | Search BGE decisions by query, chamber, legal area, language |
| `get_bge_decision` | Retrieve specific decision by citation (e.g., "BGE 147 V 321") |
| `validate_citation` | Validate and normalize BGE citation format |

#### Key Features
- Cache-first strategy with database persistence
- 1-hour search TTL, 24-hour decision TTL
- Uses `@bettercallclaude/shared` package for infrastructure
- BundesgerichtClient for real API integration

#### BGE Chambers
| Chamber | Legal Area |
|---------|-----------|
| I | Civil Law |
| II | Public Law |
| III | Civil Law |
| IV | Criminal Law |
| V | Social Insurance Law |

---

### 2. Entscheidsuche (`mcp-servers/entscheidsuche/`)

**Version**: 2.0.0
**Purpose**: Unified Swiss federal and cantonal court decision search

#### Tools
| Tool | Description |
|------|-------------|
| `search_decisions` | Search across all Swiss courts |
| `search_canton` | Search specific cantonal court decisions |
| `get_related_decisions` | Find related precedents |
| `get_decision_details` | Retrieve full decision content |
| `analyze_precedent_success_rate` | Statistical analysis of precedent outcomes |
| `find_similar_cases` | Semantic similarity search |
| `get_legal_provision_interpretation` | BGE interpretations of statutory provisions |

#### Supported Cantons
| Code | Canton | Language |
|------|--------|----------|
| ZH | Zürich | German |
| BE | Bern | German/French |
| GE | Genève | French |
| BS | Basel-Stadt | German |
| VD | Vaud | French |
| TI | Ticino | Italian |

#### Key Features
- Multi-canton parallel search aggregation
- Court level filtering (federal/cantonal/district)
- Legal area classification
- Precedent network analysis

---

### 3. Legal Citations (`mcp-servers/legal-citations/`)

**Version**: 1.1.0
**Purpose**: Citation verification, formatting, and multi-lingual conversion

#### Tools
| Tool | Description |
|------|-------------|
| `validate_citation` | Verify citation accuracy and format |
| `format_citation` | Format citation to standard (BGE/ATF/DTF) |
| `convert_citation` | Convert between language formats |
| `parse_citation` | Parse citation into components |
| `get_provision_text` | Retrieve statute text from Fedlex API |
| `extract_citations` | Extract all citations from text |
| `standardize_document_citations` | Standardize all citations in a document |
| `compare_citation_versions` | Compare historical versions of provisions |

#### Statute SR Mapping
| Abbrev | SR Number | Name (DE) |
|--------|-----------|-----------|
| ZGB | 210 | Zivilgesetzbuch |
| OR | 220 | Obligationenrecht |
| StGB | 311.0 | Strafgesetzbuch |
| BV | 101 | Bundesverfassung |
| BGG | 173.110 | Bundesgerichtsgesetz |
| ZPO | 272 | Zivilprozessordnung |
| StPO | 312.0 | Strafprozessordnung |
| SchKG | 281.1 | Schuldbetreibungs- und Konkursgesetz |

#### Citation Formats by Language
| Language | Example |
|----------|---------|
| German | Art. 97 Abs. 1 OR, BGE 145 III 229 E. 4.2 |
| French | art. 97 al. 1 CO, ATF 145 III 229 consid. 4.2 |
| Italian | art. 97 cpv. 1 CO, DTF 145 III 229 consid. 4.2 |

---

### 4. Fedlex SPARQL (`mcp-servers/fedlex-sparql/`)

**Version**: 1.0.0
**Purpose**: Query Swiss federal legislation database using JOLUX ontology

#### Tools
| Tool | Description |
|------|-------------|
| `sparql_query` | Execute SPARQL queries against Fedlex endpoint |
| `search_legislation` | Search federal acts by title/SR number |
| `get_legislation_details` | Retrieve full legislation details |
| `get_article_text` | Get article text with historical versions |
| `get_consolidations` | Get all consolidated versions of an act |
| `get_legal_hierarchy` | Get hierarchical structure of legislation |
| `search_modifications` | Find modifications to legislation |

#### JOLUX Ontology Model
```
Work (abstract concept)
├── Expression (language-specific)
│   └── Manifestation (format-specific)
│       └── Article (text content)
└── Consolidation (point-in-time version)
```

---

## 🤖 Agent Ecosystem

### AgentBase (Abstract Class)

**Location**: `src/agents/base.py`

#### Core Interface
```python
class AgentBase(ABC):
    @abstractmethod
    async def execute(self, task: str, context: Dict) -> AgentResult: ...
    @abstractmethod
    async def checkpoint(self, checkpoint_id: str, data: Dict) -> CheckpointResult: ...
```

#### Autonomy Modes
| Mode | Behavior |
|------|----------|
| `CAUTIOUS` | Confirms before each significant action |
| `BALANCED` | Confirms at key checkpoints only |
| `AUTONOMOUS` | Runs to completion with minimal interruption |

#### State Management
- Checkpoint-based recovery with configurable rules
- Action logging for audit trail
- Context persistence across workflow steps

---

### ResearcherAgent

**Location**: `src/agents/researcher.py`
**Workflow**: 4 steps - SEARCH → VERIFY → SYNTHESIZE → OUTPUT

#### Features
- BGE/ATF/DTF precedent search
- Multi-canton court decision search
- Citation extraction and validation
- Confidence scoring (0.0-1.0)
- Research depth levels (quick/standard/deep/exhaustive)

#### Output: Research Memo
```markdown
## Legal Research Memo
### Executive Summary
### Methodology
### Key Findings
### Verified Citations
### Limitations
### Next Steps
```

---

### StrategistAgent

**Location**: `src/agents/strategist.py`
**Workflow**: 5 steps - ANALYZE → ASSESS → ESTIMATE → STRATEGIZE → REVIEW

#### Swiss Court Cost Tables
| Jurisdiction | Streitwert Range | Cost Range (CHF) |
|--------------|------------------|------------------|
| Federal | 0-30,000 | 800-5,000 |
| Federal | 30,000-100,000 | 2,000-12,000 |
| Federal | 100,000-500,000 | 5,000-30,000 |
| Federal | 500,000+ | 10,000-100,000 |

#### Attorney Hourly Rates (CHF)
| Level | Rate Range |
|-------|------------|
| Partner | 450-650 |
| Senior Associate | 350-450 |
| Associate | 250-350 |
| Paralegal | 150-200 |

#### Strategy Recommendations
| Type | Description |
|------|-------------|
| AGGRESSIVE | High confidence, strong position, pursue full claims |
| DEFENSIVE | Focus on minimizing exposure and risk |
| SETTLEMENT | Negotiate early resolution |
| HYBRID | Selective aggression with settlement readiness |

---

### DrafterAgent

**Location**: `src/agents/drafter.py`
**Workflow**: 6 steps - UNDERSTAND → STRUCTURE → DRAFT → CITE → FORMAT → REVIEW

#### Document Types
| Type | German | French | Italian |
|------|--------|--------|---------|
| Complaint | Klageschrift | Demande | Petizione |
| Answer | Klageantwort | Réponse | Risposta |
| Legal Opinion | Rechtsgutachten | Avis de droit | Parere giuridico |
| Memo | Memorandum | Mémorandum | Memorandum |
| Contract | Vertrag | Contrat | Contratto |

#### Document Structure (Klageschrift Example)
```
1. Rubrum - Party information
2. Rechtsbegehren - Prayer for relief
3. Sachverhalt - Statement of facts
4. Rechtliches - Legal arguments
5. Beweismittel - Evidence references
```

---

### AgentOrchestrator

**Location**: `src/agents/orchestrator.py`
**Version**: 2.0.0
**Purpose**: Multi-agent pipeline coordination

#### PipelineBuilder API
```python
pipeline = (
    PipelineBuilder("custom_analysis")
    .add_step("researcher", "Research Art. 97 OR precedents", output_key="research")
    .with_timeout(120)
    .add_step("strategist", "Develop litigation strategy", output_key="strategy")
    .with_input_mapping({"research_results": "research.findings"})
    .with_checkpoint()
    .build()
)
```

#### Pipeline Templates
| Template | Pipeline | Use Case |
|----------|----------|----------|
| `research_to_strategy` | Researcher → Strategist | Legal analysis |
| `strategy_to_draft` | Strategist → Drafter | Document preparation |
| `full_pipeline` | Researcher → Strategist → Drafter | Complete workflow |

#### Execution Features
- Parallel execution for independent steps
- Conditional routing based on context
- Checkpoint aggregation across agents
- Fail-fast or continue-on-error modes

---

## 🎛️ Command Reference

### Legal Persona Commands

| Command | Purpose |
|---------|---------|
| `/legal` | Intelligent user proxy - routes to appropriate agents |
| `/legal:research` | Explicit Legal Researcher persona activation |
| `/legal:strategy` | Explicit Case Strategist persona activation |
| `/legal:draft` | Explicit Legal Drafter persona activation |
| `/legal:help` | Show complete command reference |
| `/legal:version` | BetterCallClaude version and status |

### Legal Mode Commands

| Command | Purpose |
|---------|---------|
| `/legal:federal` | Force Federal Law Mode exclusively |
| `/legal:cantonal [canton]` | Force specific cantonal law (ZH/BE/GE/BS/VD/TI) |
| `/legal:cite` | Citation verification and formatting |
| `/legal:routing` | View jurisdiction routing configuration |

### Agent Commands

| Command | Agent | Description |
|---------|-------|-------------|
| `/agent:researcher` | ResearcherAgent | Full agent framework with checkpoints |
| `/agent:strategist` | StrategistAgent | Litigation strategy with cost estimation |
| `/agent:drafter` | DrafterAgent | Document generation with templates |
| `/agent:orchestrator` | AgentOrchestrator | Multi-agent pipeline coordination |

### Specialized Agent Commands

| Command | Domain |
|---------|--------|
| `/agent:citation` | BGE citation verification |
| `/agent:compliance` | FINMA, AML/KYC regulatory checks |
| `/agent:data-protection` | GDPR, nDSG/FADP privacy analysis |
| `/agent:risk` | Case probability, damages quantification |
| `/agent:procedure` | ZPO/StPO deadlines and rules |
| `/agent:translator` | DE/FR/IT legal terminology |
| `/agent:fiscal` | Tax law, DTAs, transfer pricing |
| `/agent:corporate` | AG/GmbH, M&A, commercial contracts |
| `/agent:cantonal` | All 26 Swiss cantons legal systems |
| `/agent:realestate` | Property law, Grundbuch, Lex Koller |

### Swiss Law Commands

| Command | Purpose |
|---------|---------|
| `/swiss:federal` | Search Swiss Federal Supreme Court decisions |
| `/swiss:precedent` | Deep precedent analysis with network mapping |

### Document Commands

| Command | Purpose |
|---------|---------|
| `/doc:analyze` | Legal document analysis with citation verification |

---

## ⚖️ Swiss Legal Principles

### Federal Structure
- **Federal Law Supremacy** (Art. 49 BV): Bundesrecht bricht kantonales Recht
- **Cantonal Autonomy**: Retained sovereignty where not delegated

### Core Legal Principles
1. **Good Faith** (Art. 2 ZGB): Treu und Glauben / Bonne foi
2. **Abuse of Rights** (Art. 2 Abs. 2 ZGB): Prohibition of abuse
3. **Burden of Proof** (Art. 8 ZGB): Party claiming a right bears burden

### Legal Interpretation Methods
1. **Grammatical**: Wortlaut - ordinary meaning of words
2. **Systematic**: Position within legal system
3. **Teleological**: Legislative intent and purpose
4. **Historical**: Legislative materials and development

### Precedent System (BGE/ATF/DTF)
- Persuasive authority (not binding like common law)
- Bundesgericht strives for consistency
- Departure requires strong justification

---

## 🌐 Multi-Lingual Support

### Language Detection
| Language | Legal Indicators |
|----------|-----------------|
| German | Vertrag, Haftung, Schaden, Anspruch |
| French | contrat, responsabilité, dommage, prétention |
| Italian | contratto, responsabilità, danno, pretesa |

### Canton-Language Mapping
| Canton | Primary Language(s) |
|--------|-------------------|
| ZH, BS | German |
| GE, VD | French |
| TI | Italian |
| BE | German + French (bilingual) |

---

## 🔒 Quality Standards

### Citation Accuracy
- **Target**: >95% verified citations
- **Validation**: Automated format checking
- **Cross-reference**: Statute existence verification

### Research Quality
- **BGE Search Recall**: >80% relevant decisions
- **Multi-lingual Consistency**: >90% proper terminology
- **Confidence Scoring**: 0.0-1.0 scale with transparency

### Professional Ethics
- Client data protection (Anwaltsgeheimnis)
- Audit trail for external API calls
- Configurable data retention

---

## 🔧 Configuration

### User Configuration Path
`~/.betterask/config.yaml`

```yaml
version: "2.0.0"
privacy_mode: balanced  # strict | balanced | cloud
llm_backend: anthropic  # anthropic | ollama

canton_focus: ["ZH", "GE"]
languages: ["de", "fr", "en"]
practice_areas: ["corporate", "litigation"]

mcp_servers:
  entscheidsuche:
    enabled: true
    sources: ["bundesgericht", "zh", "be", "ge", "bs", "vd", "ti"]
  legal_citations:
    enabled: true
    verification: strict
  bge_search:
    enabled: true
    cache_ttl: 86400  # 24 hours

data_retention_days: 30
auto_save: true
checkpoint_interval: 1800  # 30 minutes
```

---

## 📊 Performance Metrics

### Pipeline Execution Times
| Pipeline | Duration | Token Usage |
|----------|----------|-------------|
| research_to_strategy | 60-120s | 8-15K |
| strategy_to_draft | 45-90s | 10-20K |
| full_pipeline | 120-300s | 20-40K |
| parallel_3_agents | 40-80s | 15-25K |

### Research Depth Profiles
| Level | Max Sources | Time Limit | Confidence Target |
|-------|-------------|------------|-------------------|
| quick | 10 | 2 min | 0.6 |
| standard | 20 | 5 min | 0.7 |
| deep | 40 | 8 min | 0.8 |
| exhaustive | 50+ | 10 min | 0.9 |

---

## ⚠️ Professional Disclaimer

**IMPORTANT**: BetterCallClaude is a legal research and analysis tool. All outputs:
- Require professional lawyer review and validation
- Do not constitute legal advice
- May contain errors or omissions
- Should be verified against official sources
- Must be adapted to specific case circumstances

Lawyers maintain full professional responsibility for all legal work products.

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Citation not found | Verify format (Art. 123 OR, not Art.123 OR) |
| Wrong language output | Explicitly state preferred language |
| Canton law not applied | Explicitly mention canton code |
| MCP server error | Check server installation and config |

### MCP Server Diagnostics
```bash
# Check MCP server installation
cd mcp-servers/[server-name]
npm install
npm run build

# Verify server configuration
cat ~/.betterask/config.yaml
```

---

## 📚 Additional Resources

### Documentation Files
- `.claude/BETTERASK.md` - Main framework entry point
- `.claude/LEGAL_PRINCIPLES.md` - Swiss legal reasoning standards
- `.claude/LEGAL_SYMBOLS.md` - Citation format reference
- `.claude/SWISS_LAW_CONFIG.md` - Jurisdiction routing

### External References
- [Federal Supreme Court](https://www.bger.ch) - bundesgericht.ch
- [Fedlex](https://www.fedlex.admin.ch) - Swiss federal legislation
- [Entscheidsuche](https://entscheidsuche.ch) - Court decision search

---

**Built for the Swiss legal community with ❤️**

*BetterCallClaude v2.0.0 - Legal Intelligence Framework*
