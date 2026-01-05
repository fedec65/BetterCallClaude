# BetterCallClaude Knowledge Base Index

**Version**: 2.0.1
**Last Updated**: 2026-01-05
**Target Users**: Swiss lawyers (solo practitioners and medium firms)
**Practice Areas**: Corporate Law, Litigation, Compliance, Tax, Real Estate
**Framework Status**: Production Ready with Fedlex SPARQL Integration

---

## 🎯 Framework Mission

BetterCallClaude transforms legal research and case strategy for Swiss lawyers by providing:
- **80% time savings** on precedent analysis and legal research
- **25% quality improvement** through systematic verification
- **Multi-jurisdictional expertise** across federal and 26 cantonal systems
- **Multi-lingual precision** in legal terminology (DE/FR/IT/EN)
- **JOLUX ontology integration** via Fedlex SPARQL MCP server (NEW in v2.0.1)

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Claude Code Layer                      │
│  User Interface • Session Management • Context Control  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Agent Orchestration Layer                   │
│  ResearcherAgent • StrategistAgent • DrafterAgent       │
│  AgentOrchestrator • PipelineBuilder                    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  MCP Server Layer                        │
│  BGE-Search • Entscheidsuche • Legal-Citations          │
│  Fedlex-SPARQL • Shared Infrastructure                  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Data Source Layer                       │
│  bundesgericht.ch • entscheidsuche.ch • fedlex.admin.ch │
│  LINDAS SPARQL • Cantonal Court APIs                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure Overview

```
BetterCallClaude/
├── .claude/                       # Framework configuration (27 commands)
│   ├── commands/                  # Slash command definitions
│   │   ├── legal:*.md            # Legal persona commands (6)
│   │   ├── agent:*.md            # Specialized agents (14)
│   │   ├── swiss:*.md            # Swiss court commands (2)
│   │   └── doc:*.md              # Document analysis (1)
│   ├── BETTERASK.md              # Main framework entry point
│   ├── LEGAL_PRINCIPLES.md       # Swiss legal reasoning standards
│   ├── LEGAL_SYMBOLS.md          # Citation format and symbols
│   └── SWISS_LAW_CONFIG.md       # Jurisdiction routing configuration
├── src/                           # Python source code (deprecated)
│   ├── agents/                    # Legacy Python agent implementations
│   └── utils/                     # Shared utilities
├── mcp-servers/                   # MCP server implementations (TypeScript)
│   ├── bge-search/               # BGE decision search (v2.0.0)
│   ├── entscheidsuche/           # Unified court decision search (v2.0.0)
│   ├── legal-citations/          # Citation verification (v1.1.0)
│   ├── fedlex-sparql/            # Swiss federal law SPARQL (v2.0.1)
│   └── shared/                    # Shared infrastructure package
├── packages/                      # TypeScript packages
│   └── shared/                    # @bettercallclaude/shared
└── docs/                          # Documentation
    ├── onboarding/               # Getting started guides
    ├── languages/                # Multi-lingual documentation (DE/FR/IT)
    └── workflows/                # Workflow examples
```

---

## 🔌 MCP Server Architecture

### 1. BGE Search (`mcp-servers/bge-search/`)

**Version**: 2.0.0
**Purpose**: Swiss Federal Supreme Court (Bundesgericht) decision search and retrieval
**Language**: TypeScript with Node.js 18+
**Testing**: Vitest (76+ passing tests)

#### Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `search_bge` | Search BGE decisions | query, chamber?, area?, language?, limit? |
| `get_bge_decision` | Retrieve specific decision | citation (e.g., "BGE 147 V 321") |
| `validate_citation` | Validate BGE citation format | citation, strict? |

#### Key Features
- **Cache-first strategy** with SQLite database persistence
- **TTL Configuration**: 1-hour search cache, 24-hour decision cache
- **Multi-lingual support**: DE/FR/IT query and result handling
- **Infrastructure**: Uses `@bettercallclaude/shared` package
- **BundesgerichtClient**: Real API integration with bundesgericht.ch

#### BGE Chambers and Legal Areas

| Chamber | Legal Area | Example Citations |
|---------|-----------|-------------------|
| I | Verfassungsrecht (Constitutional) | BGE 145 I 167 |
| Ia | Grundrechte (Fundamental Rights) | BGE 146 Ia 75 |
| II | Öffentliches Recht (Public Law) | BGE 147 II 44 |
| III | Zivilrecht (Civil Law) | BGE 145 III 229 |
| IV | Strafrecht (Criminal Law) | BGE 146 IV 297 |
| V | Sozialversicherung (Social Insurance) | BGE 147 V 321 |

#### Implementation Details
```typescript
// Cache schema
CREATE TABLE search_cache (
  id INTEGER PRIMARY KEY,
  query_hash TEXT UNIQUE,
  results TEXT,
  created_at INTEGER,
  expires_at INTEGER
)

// Service architecture
BundesgerichtService
├── BundesgerichtClient (API integration)
├── CacheManager (persistence)
└── CitationValidator (format checking)
```

**Related Sections**: [Legal Citations MCP](#3-legal-citations-mcp-serverslegal-citations), [Swiss Court Commands](#swiss-law-commands)

---

### 2. Entscheidsuche (`mcp-servers/entscheidsuche/`)

**Version**: 2.0.0
**Purpose**: Unified Swiss federal and cantonal court decision search
**Language**: TypeScript
**Data Sources**: bundesgericht.ch + 6 cantonal court systems

#### Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `search_decisions` | Search across all Swiss courts | General precedent research |
| `search_canton` | Search specific cantonal courts | Canton-specific analysis |
| `get_related_decisions` | Find related precedents | Precedent network mapping |
| `get_decision_details` | Retrieve full decision content | Deep case analysis |
| `analyze_precedent_success_rate` | Statistical outcome analysis | Risk assessment |
| `find_similar_cases` | Semantic similarity search | Analogical reasoning |
| `get_legal_provision_interpretation` | BGE statutory interpretations | Statutory analysis |

#### Supported Jurisdictions

| Code | Canton | Court System | Language | API Status |
|------|--------|--------------|----------|------------|
| ZH | Zürich | Obergericht + Bezirksgerichte | German | ✅ Active |
| BE | Bern | Obergericht / Tribunal supérieur | German + French | ✅ Active |
| GE | Genève | Cour de justice | French | ✅ Active |
| BS | Basel-Stadt | Appellationsgericht | German | ✅ Active |
| VD | Vaud | Tribunal cantonal | French | ✅ Active |
| TI | Ticino | Tribunale d'appello | Italian | ✅ Active |

#### Key Features
- **Multi-canton parallel search**: Aggregate results from multiple jurisdictions
- **Court level filtering**: Federal / Cantonal / District
- **Legal area classification**: Automatic categorization
- **Precedent network analysis**: Citation graph construction
- **Date range filtering**: Temporal scope control
- **Relevance scoring**: Confidence-based ranking

#### Search Strategy
```yaml
search_workflow:
  1_parse_query: Extract legal concepts, citations, keywords
  2_identify_jurisdictions: Federal vs. cantonal determination
  3_parallel_execution: Concurrent API calls to all sources
  4_result_aggregation: Merge and deduplicate results
  5_relevance_ranking: Score by confidence and recency
  6_metadata_enrichment: Court, chamber, legal area tagging
```

**Related Sections**: [BGE Search](#1-bge-search-mcp-serversbge-search), [Swiss Law Configuration](#-swiss-legal-principles)

---

### 3. Legal Citations (`mcp-servers/legal-citations/`)

**Version**: 1.1.0
**Purpose**: Citation verification, formatting, and multi-lingual conversion
**Standards**: Swiss legal citation conventions (DE/FR/IT)

#### Tools

| Tool | Description | Example Input | Example Output |
|------|-------------|---------------|----------------|
| `validate_citation` | Verify citation accuracy | "Art. 97 OR" | ✅ Valid |
| `format_citation` | Format to standard | "article 97 CO" | "Art. 97 OR" |
| `convert_citation` | Language conversion | "Art. 97 OR" (DE→FR) | "art. 97 CO" |
| `parse_citation` | Parse into components | "BGE 145 III 229 E. 4.2" | {volume:145, section:III...} |
| `get_provision_text` | Retrieve statute text | "Art. 97 OR" | Full article text |
| `extract_citations` | Extract from text | "See Art. 97, 98 OR..." | ["Art. 97 OR", "Art. 98 OR"] |
| `standardize_document_citations` | Standardize all citations | Document text | Corrected document |
| `compare_citation_versions` | Historical comparison | "Art. 97 OR", dates | Version diff |

#### Statute SR Number Mapping

| Abbreviation | SR Number | Full Name (German) | French | Italian |
|--------------|-----------|-------------------|--------|---------|
| ZGB | 210 | Zivilgesetzbuch | Code civil | Codice civile |
| OR | 220 | Obligationenrecht | Code des obligations | Codice delle obbligazioni |
| StGB | 311.0 | Strafgesetzbuch | Code pénal | Codice penale |
| BV | 101 | Bundesverfassung | Constitution fédérale | Costituzione federale |
| BGG | 173.110 | Bundesgerichtsgesetz | Loi sur le Tribunal fédéral | Legge sul Tribunale federale |
| ZPO | 272 | Zivilprozessordnung | Code de procédure civile | Codice di procedura civile |
| StPO | 312.0 | Strafprozessordnung | Code de procédure pénale | Codice di procedura penale |
| SchKG | 281.1 | Schuldbetreibungs- und Konkursgesetz | Loi sur la poursuite | Legge sull'esecuzione |

#### Citation Format Standards

**Statutory Citations**:
| Language | Format | Example |
|----------|--------|---------|
| German | Art. [X] Abs. [Y] lit. [Z] [Code] | Art. 97 Abs. 1 lit. a OR |
| French | art. [X] al. [Y] let. [Z] [Code] | art. 97 al. 1 let. a CO |
| Italian | art. [X] cpv. [Y] lett. [Z] [Code] | art. 97 cpv. 1 lett. a CO |

**BGE Citations**:
| Language | Format | Example |
|----------|--------|---------|
| German | BGE [vol] [sect] [page] E. [consid] | BGE 145 III 229 E. 4.2 |
| French | ATF [vol] [sect] [page] consid. [X] | ATF 145 III 229 consid. 4.2 |
| Italian | DTF [vol] [sect] [page] consid. [X] | DTF 145 III 229 consid. 4.2 |

#### Validation Rules
```yaml
citation_validation:
  statutory:
    - Article number exists in statute
    - Paragraph/letter references are valid
    - Code abbreviation is recognized
    - Format matches language conventions

  bge_decisions:
    - Volume number is valid (>=100)
    - Section is valid (I, Ia, II, III, IV, V)
    - Page number format is correct
    - Consideration (E./consid.) format matches
```

**Related Sections**: [Fedlex SPARQL](#4-fedlex-sparql-mcp-serversfedlex-sparql), [Legal Symbols](#legal-symbols-reference)

---

### 4. Fedlex SPARQL (`mcp-servers/fedlex-sparql/`)

**Version**: 2.0.1 ⭐ NEW
**Purpose**: Query Swiss federal legislation database using JOLUX ontology
**Data Source**: LINDAS SPARQL endpoint (lindas.admin.ch)
**Protocol**: SPARQL 1.1 Query Language
**Testing**: Comprehensive test coverage with Vitest

#### Tools

| Tool | Description | SPARQL Operation | Response Time |
|------|-------------|------------------|---------------|
| `searchLegislation` | Search federal acts by title/SR | Full-text search | ~500ms |
| `lookupStatute` | Lookup by SR number or abbreviation | Direct retrieval | ~200ms |
| `getArticle` | Get article text with structure | Article traversal | ~300ms |
| `getMetadata` | Retrieve act metadata | Metadata query | ~150ms |
| `findRelated` | Find related legislation | Relationship traversal | ~800ms |

#### JOLUX Ontology Model (FRBR-based)

```
┌─────────────────────────────────────────────────────┐
│                     Work                            │
│  (Abstract legal concept - language-independent)    │
│  URI: https://fedlex.data.admin.ch/eli/cc/XX/YY   │
└──────────────────┬──────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌────────┐   ┌────────┐   ┌────────┐
│ DE     │   │ FR     │   │ IT     │
│ Expr   │   │ Expr   │   │ Expr   │   Expression
│        │   │        │   │        │   (Language-specific)
└───┬────┘   └───┬────┘   └───┬────┘
    │            │            │
    ▼            ▼            ▼
┌────────┐   ┌────────┐   ┌────────┐
│ HTML   │   │ PDF    │   │ XML    │   Manifestation
│ Format │   │ Format │   │ Format │   (Format-specific)
└───┬────┘   └────────┘   └────────┘
    │
    ▼
┌─────────────────────────────────────┐
│        Article Structure            │
│  ┌─────────────────────────────┐  │
│  │ Art. 97 OR                  │  │   Article
│  │  ├─ Abs. 1 (Paragraph)     │  │   (Text content)
│  │  │   └─ lit. a (Letter)     │  │
│  │  └─ Abs. 2                  │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Implementation Functions

**`searchLegislation(query, language, filters)`**
```typescript
// Full-text search across federal acts
Parameters:
  - query: string (search terms)
  - language: 'de' | 'fr' | 'it' (default: 'de')
  - filters: {
      legalArea?: string
      inForce?: boolean
      limit?: number (default: 20)
    }

Returns: {
  acts: Array<{
    srNumber: string
    title: string
    abbreviation: string
    inForce: boolean
    lastModified: string
  }>
  totalCount: number
  facets: {
    legalArea: Map<string, number>
    status: Map<string, number>
  }
  hasMore: boolean
  searchTimeMs: number
}
```

**`lookupStatute(identifier, language)`**
```typescript
// Direct lookup by SR number or abbreviation
Parameters:
  - identifier: string (SR number like "220" or abbreviation like "OR")
  - language: 'de' | 'fr' | 'it'

Returns: {
  found: boolean
  acts: Array<{
    srNumber: string
    title: string
    abbreviation: string
    uri: string
    languages: string[]
    inForce: boolean
  }>
  searchType: 'sr_number' | 'abbreviation'
  searchTimeMs: number
}
```

**`getArticle(srNumber, articleNumber, language)`**
```typescript
// Retrieve article text with full structure
Parameters:
  - srNumber: string (e.g., "220" for OR)
  - articleNumber: string (e.g., "97")
  - language: 'de' | 'fr' | 'it'

Returns: {
  found: boolean
  act: {
    srNumber: string
    title: string
  }
  articles: Array<{
    number: string
    text: string
    paragraphs: Array<{
      number: string
      text: string
      letters?: Array<{
        literal: string
        text: string
      }>
    }>
  }>
  searchTimeMs: number
}
```

**`getMetadata(srNumber, language)`**
```typescript
// Retrieve comprehensive act metadata
Parameters:
  - srNumber: string
  - language: 'de' | 'fr' | 'it'

Returns: {
  found: boolean
  metadata: {
    srNumber: string
    title: string
    abbreviation: string
    publicationDate: string
    entryIntoForce: string
    languages: string[]
    legalArea: string
    responsibleOffice: string
    inForce: boolean
  }
  searchTimeMs: number
}
```

**`findRelated(srNumber, relationType, language)`**
```typescript
// Find related legislation and modifications
Parameters:
  - srNumber: string
  - relationType: 'modifies' | 'amended_by' | 'repealed_by' | 'related_to'
  - language: 'de' | 'fr' | 'it'

Returns: {
  byRelationType: Map<string, Array<{
    srNumber: string
    title: string
    relationship: string
    date: string
  }>>
  legislativeHistory: Array<{
    date: string
    type: 'amendment' | 'revision'
    actSrNumber: string
    actTitle: string
  }>
  relatedActs: Array<{
    srNumber: string
    title: string
    relationshipType: string
  }>
  searchTimeMs: number
}
```

#### SPARQL Query Examples

**Article Retrieval Query**:
```sparql
PREFIX eli: <http://data.europa.eu/eli/ontology#>
PREFIX schema: <http://schema.org/>

SELECT ?articleText ?paragraphNumber ?paragraphText
WHERE {
  ?work eli:id_local "220" .  # SR number for OR
  ?work eli:has_part ?article .
  ?article eli:number "97" .
  ?article schema:articleBody ?articleText .

  OPTIONAL {
    ?article eli:has_part ?paragraph .
    ?paragraph eli:number ?paragraphNumber .
    ?paragraph schema:text ?paragraphText .
  }
}
```

#### Performance Optimization
```yaml
caching:
  - Metadata: 24-hour cache (changes rare)
  - Article text: 12-hour cache
  - Search results: 1-hour cache
  - Relationship queries: 6-hour cache

connection_pooling:
  - Max connections: 10
  - Timeout: 5000ms
  - Retry strategy: Exponential backoff (3 attempts)

query_optimization:
  - Use LIMIT for large result sets
  - Prefer specific URI lookups over full-text search
  - Batch related queries when possible
```

#### Integration with Legal Workflows

**Research Workflow**:
```
User query: "Art. 97 OR liability requirements"
  ↓
1. lookupStatute("OR") → Confirm SR 220 exists
2. getArticle("220", "97", "de") → Retrieve article structure
3. findRelated("220", "amended_by") → Check for modifications
4. BGE Search → Find precedent interpretations
  ↓
Output: Comprehensive statutory + precedent analysis
```

**Citation Verification Workflow**:
```
Document citations: ["Art. 97 OR", "Art. 41 OR", "Art. 2 ZGB"]
  ↓
Parallel verification:
  ├─ getArticle("220", "97") → ✅ Valid
  ├─ getArticle("220", "41") → ✅ Valid
  └─ getArticle("210", "2")  → ✅ Valid
  ↓
Result: All citations verified against Fedlex
```

**Related Sections**: [Legal Citations MCP](#3-legal-citations-mcp-serverslegal-citations), [Swiss Law Configuration](#-swiss-law-configuration)

---

### 5. Shared Infrastructure (`packages/shared/`)

**Package Name**: `@bettercallclaude/shared`
**Version**: 2.0.0
**Purpose**: Common infrastructure for all MCP servers

#### Exports

| Module | Components | Purpose |
|--------|-----------|---------|
| `cache/` | CacheManager, CacheConfig | Shared caching layer |
| `database/` | DatabaseClient, Migrations | SQLite persistence |
| `logging/` | Logger, LogConfig | Structured logging |
| `validation/` | CitationValidator, Schemas | Input validation |
| `types/` | SharedTypes, Interfaces | TypeScript definitions |

#### Cache Architecture
```typescript
interface CacheConfig {
  provider: 'memory' | 'sqlite' | 'redis'
  ttl: number  // seconds
  maxSize?: number  // entries
  evictionPolicy?: 'lru' | 'fifo'
}

class CacheManager {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  invalidate(pattern: string): Promise<void>
  stats(): CacheStats
}
```

**Related Sections**: [All MCP Servers](#-mcp-server-architecture)

---

## 🤖 Agent Ecosystem

### Agent Architecture Overview

```
┌────────────────────────────────────────────────┐
│            AgentBase (Abstract)                │
│  • Checkpoint system                          │
│  • Autonomy modes (CAUTIOUS/BALANCED/AUTO)    │
│  • State persistence                          │
│  • Action logging                             │
└────────────────┬───────────────────────────────┘
                 │
     ┌───────────┼───────────┬──────────────┐
     │           │           │              │
     ▼           ▼           ▼              ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐
│Research │ │Strategy │ │Drafter  │ │Orchestrator  │
│Agent    │ │Agent    │ │Agent    │ │(Coordinator) │
└─────────┘ └─────────┘ └─────────┘ └──────────────┘
```

### AgentBase (Abstract Class)

**Location**: `src/agents/base.py` (Python implementation - legacy)
**Purpose**: Common agent interface and state management

#### Core Interface
```python
from abc import ABC, abstractmethod
from typing import Dict, Any

class AgentBase(ABC):
    @abstractmethod
    async def execute(self, task: str, context: Dict[str, Any]) -> AgentResult:
        """Execute agent's primary task"""
        pass

    @abstractmethod
    async def checkpoint(self, checkpoint_id: str, data: Dict) -> CheckpointResult:
        """Create recovery checkpoint"""
        pass

    def set_autonomy(self, mode: AutonomyMode) -> None:
        """Configure agent autonomy level"""
        pass
```

#### Autonomy Modes

| Mode | Behavior | User Interaction | Use Case |
|------|----------|-----------------|----------|
| `CAUTIOUS` | Confirms before each significant action | High (every step) | High-stakes matters, training |
| `BALANCED` | Confirms at key checkpoints only | Moderate (milestones) | Standard legal work |
| `AUTONOMOUS` | Runs to completion with minimal interruption | Low (errors only) | Routine tasks, bulk processing |

#### Checkpoint System
```yaml
checkpoint_configuration:
  trigger_points:
    - Before expensive operations (API calls)
    - After major workflow steps
    - Before irreversible actions
    - On error conditions

  recovery_rules:
    - Auto-resume from last checkpoint on failure
    - Checkpoint expiry: 24 hours
    - Max checkpoints per workflow: 20

  state_persistence:
    - Agent configuration
    - Execution context
    - Intermediate results
    - User confirmations
```

**Related Sections**: [ResearcherAgent](#researcheragent), [StrategistAgent](#strategistagent), [DrafterAgent](#drafteragent), [AgentOrchestrator](#agentorchestrator)

---

### ResearcherAgent

**Location**: `src/agents/researcher.py`
**Activation**: `/agent:researcher` or `/legal:research`
**Workflow**: SEARCH → VERIFY → SYNTHESIZE → OUTPUT

#### Workflow Steps

**Step 1: SEARCH** (Checkpoint after)
- Query parsing and legal concept extraction
- Parallel BGE/cantonal court searches
- Full-text statute searches (via Fedlex SPARQL)
- Initial relevance filtering

**Step 2: VERIFY** (Checkpoint after)
- Citation format validation
- Cross-reference verification
- Precedent authenticity checking
- Source credibility scoring

**Step 3: SYNTHESIZE**
- Extract key legal principles from decisions
- Identify precedent patterns and trends
- Map statutory provisions to case law
- Calculate confidence scores

**Step 4: OUTPUT**
- Generate structured research memo
- Include verified citations
- Note limitations and gaps
- Provide next research steps

#### Research Depth Levels

| Level | Max Sources | Max Hops | Time Limit | Confidence Target | Token Usage |
|-------|-------------|----------|------------|-------------------|-------------|
| **quick** | 10 | 1 | 2 min | 0.6 | ~5K |
| **standard** | 20 | 3 | 5 min | 0.7 | ~12K |
| **deep** | 40 | 4 | 8 min | 0.8 | ~25K |
| **exhaustive** | 50+ | 5 | 10 min | 0.9 | ~40K |

#### Output: Research Memo Template
```markdown
# Legal Research Memo

**Date**: [ISO 8601]
**Researcher**: ResearcherAgent v2.0
**Confidence**: [0.0-1.0]
**Research Depth**: [quick|standard|deep|exhaustive]

## Executive Summary
[2-3 sentence summary of key findings]

## Research Question
[Original query with clarifications]

## Methodology
- **Sources Consulted**: [Count]
- **BGE Decisions Reviewed**: [Count]
- **Cantonal Decisions**: [Canton:Count]
- **Statutes Analyzed**: [SR numbers]
- **Search Duration**: [Duration]

## Key Findings

### 1. Legal Framework
[Statutory provisions with citations]

### 2. Precedent Analysis
[BGE/cantonal decisions with analysis]

### 3. Legal Principles
[Extracted principles with supporting citations]

### 4. Doctrinal Views
[Academic commentary if available]

## Verified Citations

### Statutory References
- [Citation] - Verified via Fedlex SPARQL ✅
- [Citation] - Format validated ✅

### BGE References
- [Citation] - Retrieved from bundesgericht.ch ✅
- [Citation] - Cross-referenced ✅

### Cantonal References
- [Citation] - Retrieved from [Court] ✅

## Limitations
- [Gaps in research]
- [Unavailable sources]
- [Temporal limitations]

## Confidence Assessment
**Overall Confidence**: [X.XX]/1.0
- Source credibility: [Score]
- Citation verification: [Score]
- Coverage completeness: [Score]

## Next Steps
1. [Recommended follow-up research]
2. [Additional sources to consult]
3. [Clarifications needed]
```

#### Confidence Scoring Algorithm
```yaml
confidence_calculation:
  weights:
    source_credibility: 0.35
    citation_accuracy: 0.25
    coverage_completeness: 0.25
    temporal_relevance: 0.15

  source_credibility_tiers:
    BGE_decisions: 1.0
    cantonal_supreme_courts: 0.9
    lower_courts: 0.7
    doctrine: 0.8

  citation_accuracy:
    all_verified: 1.0
    mostly_verified: 0.8
    partially_verified: 0.5

  coverage_assessment:
    exhaustive: 1.0
    comprehensive: 0.8
    adequate: 0.6
    limited: 0.4
```

**Related Sections**: [BGE Search MCP](#1-bge-search-mcp-serversbge-search), [Entscheidsuche MCP](#2-entscheidsuche-mcp-serversentscheidsuche), [Fedlex SPARQL MCP](#4-fedlex-sparql-mcp-serversfedlex-sparql)

---

### StrategistAgent

**Location**: `src/agents/strategist.py`
**Activation**: `/agent:strategist` or `/legal:strategy`
**Workflow**: ANALYZE → ASSESS → ESTIMATE → STRATEGIZE → REVIEW

#### Workflow Steps

**Step 1: ANALYZE** (Checkpoint after)
- Legal claims analysis
- Evidence assessment
- Burden of proof mapping
- Procedural requirements

**Step 2: ASSESS**
- Success probability estimation (statistical + precedent-based)
- Risk identification (legal, financial, reputational)
- Strengths and weaknesses matrix
- Opponent's likely arguments

**Step 3: ESTIMATE** (Checkpoint after)
- Damages calculation
- Court costs estimation (federal/cantonal tables)
- Attorney fees projection
- Settlement value range

**Step 4: STRATEGIZE**
- Litigation strategy recommendation
- Alternative dispute resolution options
- Procedural tactic selection
- Timeline planning

**Step 5: REVIEW**
- Strategy validation against precedents
- Cost-benefit analysis
- Risk-adjusted decision recommendation

#### Swiss Court Cost Tables (2024)

**Federal Supreme Court (BGG)**:
| Streitwert (CHF) | Court Costs (CHF) | Typical Party Costs (CHF) |
|------------------|-------------------|---------------------------|
| 0 - 30,000 | 800 - 5,000 | 3,000 - 15,000 |
| 30,000 - 100,000 | 2,000 - 12,000 | 8,000 - 40,000 |
| 100,000 - 500,000 | 5,000 - 30,000 | 20,000 - 100,000 |
| 500,000 - 1,000,000 | 10,000 - 60,000 | 40,000 - 200,000 |
| > 1,000,000 | 15,000 - 100,000 | 60,000 - 300,000 |

**Cantonal Courts (Examples)**:
| Canton | First Instance | Appeal | Commercial Court |
|--------|---------------|--------|------------------|
| ZH | 200 - 50,000 | 500 - 80,000 | 1,000 - 100,000 |
| GE | 150 - 40,000 | 400 - 70,000 | 800 - 90,000 |
| BE | 180 - 45,000 | 450 - 75,000 | 900 - 95,000 |

#### Swiss Attorney Hourly Rates (2024 Market)

| Level | Zürich/Geneva | Other Cities | Experience |
|-------|---------------|--------------|------------|
| Partner | 500 - 700 | 400 - 600 | 15+ years |
| Senior Associate | 400 - 500 | 300 - 450 | 8-15 years |
| Associate | 300 - 400 | 250 - 350 | 3-8 years |
| Junior Associate | 200 - 300 | 180 - 250 | 0-3 years |
| Paralegal | 150 - 200 | 120 - 180 | - |

#### Strategy Recommendation Matrix

| Success Probability | Financial Exposure | Recommended Strategy |
|---------------------|-------------------|---------------------|
| > 70% | High | AGGRESSIVE: Pursue full claims, resist settlement |
| > 70% | Low | MODERATE: Claim but open to settlement |
| 40-70% | High | SETTLEMENT: Negotiate early resolution |
| 40-70% | Low | DEFENSIVE: Minimize costs, explore ADR |
| < 40% | Any | RISK MITIGATION: Settlement or withdrawal |

#### Output: Strategy Memo Template
```markdown
# Litigation Strategy Memorandum

**Case**: [Description]
**Strategist**: StrategistAgent v2.0
**Date**: [ISO 8601]
**Jurisdiction**: [Federal / Canton]

## Executive Summary
[3-4 sentence strategic recommendation]

## Case Analysis

### Legal Claims
| Claim | Legal Basis | Burden of Proof | Assessment |
|-------|-------------|----------------|------------|
| [Claim 1] | [Art. X] | [Plaintiff/Defendant] | [Strong/Moderate/Weak] |

### Evidence Assessment
**Available Evidence**:
- [Evidence item 1] - [Strength: High/Medium/Low]
- [Evidence item 2] - [Strength: High/Medium/Low]

**Evidence Gaps**:
- [Missing evidence] - [Impact: Critical/Significant/Minor]

## Risk Assessment

### Success Probability
**Overall Probability**: [XX]%

**Methodology**:
- Precedent analysis: [Count] similar cases
- Win rate for similar claims: [XX]%
- Evidentiary strength adjustment: [+/- XX]%
- Procedural factors: [+/- XX]%

### Risk Factors

**Legal Risks**:
- [Risk 1] - Probability: [XX]%, Impact: [High/Medium/Low]
- [Risk 2] - Probability: [XX]%, Impact: [High/Medium/Low]

**Financial Risks**:
- Adverse cost award: [CHF range]
- Extended litigation duration: [Additional CHF]
- Reputational exposure: [Assessment]

## Financial Analysis

### Damages Calculation
**Primary Damages**: CHF [Amount]
- [Component 1]: CHF [Amount]
- [Component 2]: CHF [Amount]

**Secondary Damages**: CHF [Amount]
- Interest (Art. 104 OR): CHF [Amount]
- Consequential damages: CHF [Amount]

**Total Claim Value**: CHF [Amount]

### Cost Estimation

**Court Costs** ([Court Name]):
- Estimated Streitwert: CHF [Amount]
- Expected court fees: CHF [Range]

**Attorney Fees**:
- Estimated hours: [Hours]
- Blended rate: CHF [Rate]/hour
- Total legal fees: CHF [Range]

**Total Litigation Budget**: CHF [Range]

### Settlement Analysis

**Settlement Value Range**: CHF [Low] - CHF [High]

**Calculation**:
- Expected value: [Success %] × [Damages] = CHF [Amount]
- Risk discount: [XX]%
- Cost savings: CHF [Amount]
- **Recommended settlement range**: CHF [Low] - CHF [High]

## Strategic Recommendation

### Primary Strategy: [AGGRESSIVE|DEFENSIVE|SETTLEMENT|HYBRID]

**Rationale**:
[2-3 paragraphs explaining recommendation based on above analysis]

### Tactical Options

**Litigation Track**:
1. [Procedural step 1] - [Timeline] - [Purpose]
2. [Procedural step 2] - [Timeline] - [Purpose]
3. [Procedural step 3] - [Timeline] - [Purpose]

**Alternative Dispute Resolution**:
- Mediation feasibility: [High/Medium/Low]
- Arbitration option: [Available/Not applicable]
- Settlement conference: [Recommended timing]

### Timeline

| Milestone | Deadline | Action Required |
|-----------|----------|----------------|
| [Milestone 1] | [Date] | [Action] |
| [Milestone 2] | [Date] | [Action] |

**Estimated Duration**: [Months] to [Milestone]

## Strengths and Weaknesses

### Strengths ✓
1. [Strength 1] - [Supporting precedent/evidence]
2. [Strength 2] - [Supporting precedent/evidence]
3. [Strength 3] - [Supporting precedent/evidence]

### Weaknesses ⚠
1. [Weakness 1] - [Mitigation strategy]
2. [Weakness 2] - [Mitigation strategy]
3. [Weakness 3] - [Mitigation strategy]

## Opponent Analysis

**Likely Arguments**:
1. [Counter-argument 1] - **Our response**: [Strategy]
2. [Counter-argument 2] - **Our response**: [Strategy]

**Opponent's Position Strength**: [Assessment]

## Decision Recommendation

**Recommended Action**: [Specific recommendation]

**Decision Factors**:
- Financial: [Cost-benefit ratio: X:X]
- Legal: [Success probability: XX%]
- Strategic: [Business objectives alignment]
- Risk: [Risk-adjusted value: CHF XX]

**Next Steps**:
1. [Immediate action]
2. [Follow-up action]
3. [Contingency planning]
```

**Related Sections**: [ResearcherAgent](#researcheragent), [Swiss Law Configuration](#-swiss-law-configuration)

---

### DrafterAgent

**Location**: `src/agents/drafter.py`
**Activation**: `/agent:drafter` or `/legal:draft`
**Workflow**: UNDERSTAND → STRUCTURE → DRAFT → CITE → FORMAT → REVIEW

#### Workflow Steps

**Step 1: UNDERSTAND**
- Parse drafting requirements
- Identify document type and jurisdiction
- Determine language (DE/FR/IT)
- Extract key facts and legal issues

**Step 2: STRUCTURE** (Checkpoint after)
- Select appropriate template
- Organize factual and legal sections
- Plan argumentation sequence
- Prepare citation framework

**Step 3: DRAFT**
- Write factual recitations
- Develop legal arguments
- Integrate supporting citations
- Draft prayers for relief

**Step 4: CITE** (Checkpoint after)
- Insert statutory citations
- Add BGE/cantonal precedents
- Verify citation accuracy (via legal-citations MCP)
- Format according to language conventions

**Step 5: FORMAT**
- Apply jurisdiction-specific formatting
- Number paragraphs and sections
- Create table of contents if needed
- Format exhibits and annexes

**Step 6: REVIEW**
- Completeness check
- Citation verification
- Language consistency check
- Professional formatting validation

#### Supported Document Types

| Type | German | French | Italian | Template Available |
|------|--------|--------|---------|-------------------|
| Complaint | Klageschrift | Demande en justice | Petizione | ✅ |
| Answer to complaint | Klageantwort | Réponse | Risposta | ✅ |
| Appeal brief | Berufung | Appel | Appello | ✅ |
| Legal opinion | Rechtsgutachten | Avis de droit | Parere giuridico | ✅ |
| Legal memo | Memorandum | Mémorandum | Memorandum | ✅ |
| Contract | Vertrag | Contrat | Contratto | ✅ |
| Letter | Rechtsschreiben | Lettre | Lettera | ✅ |

#### Swiss Court Document Structure

**Klageschrift (Zürich Commercial Court Example)**:
```markdown
AN DAS HANDELSGERICHT DES KANTONS ZÜRICH

KLAGE

in Sachen

[Kläger Name]
[Adresse]
[Vertretung durch RA]

Kläger

gegen

[Beklagter Name]
[Adresse]
[Vertretung durch RA]

Beklagter

betreffend [Rechtsgrund], Streitwert CHF [Betrag]

---

RECHTSBEGEHREN

Die Klägerschaft beantragt, es sei:

1. [Hauptbegehren]
2. [Nebenbegehren]
3. [Kostenfolge]

---

SACHVERHALT

I. Die Parteien

[Paragraph 1 - Kläger]
[Paragraph 2 - Beklagter]

II. Vertragsschluss

[Paragraphs describing contract formation]

III. Vertragsverletzung

[Paragraphs describing breach]

IV. Schaden

[Paragraphs describing damages]

---

RECHTLICHES

A. Zuständigkeit

[Jurisdiction analysis]

B. Anwendbares Recht

[Choice of law analysis]

C. Vertragsverletzung (Art. 97 OR)

1. Vertragspflicht

[Analysis with citations]

2. Pflichtverletzung

[Analysis with citations]

3. Verschulden

[Analysis with citations]

4. Schaden und Kausalität

[Analysis with citations]

---

BEWEISMITTEL

[List of evidence with exhibit markers]

---

BEILAGEN

1. [Exhibit 1 description]
2. [Exhibit 2 description]

---

[Ort], [Datum]

[Signature block]
[Attorney name and bar number]
```

**Demande (Geneva Tribunal Example - French)**:
```markdown
TRIBUNAL DE PREMIÈRE INSTANCE
CANTON DE GENÈVE

DEMANDE EN PAIEMENT

dans la cause

[Demandeur]
[Adresse]
[Représenté par Me]

demandeur

contre

[Défendeur]
[Adresse]
[Représenté par Me]

défendeur

Valeur litigieuse: CHF [montant]

---

CONCLUSIONS

Le demandeur conclut à ce qu'il plaise au Tribunal:

1. [Conclusion principale]
2. [Conclusions accessoires]
3. [Frais et dépens]

---

FAITS

I. Les parties

[Paragraphe 1]

II. Le contrat

[Paragraphes sur la formation du contrat]

III. La violation

[Paragraphes sur la violation]

IV. Le dommage

[Paragraphes sur le dommage]

---

DROIT

A. Compétence

[Analyse de la compétence]

B. Droit applicable

[Analyse du droit applicable]

C. Responsabilité contractuelle (art. 97 CO)

1. Obligation contractuelle

[Analyse avec citations]

2. Violation de l'obligation

[Analyse avec citations]

3. Dommage et causalité

[Analyse avec citations]

---

MOYENS DE PREUVE

[Liste des pièces]

---

PIÈCES

1. [Pièce 1]
2. [Pièce 2]

---

[Lieu], le [date]

[Bloc signature]
[Nom de l'avocat]
```

#### Citation Integration Standards

**Statutory Citations in Text**:
- First mention: Full citation with SR number
  - DE: "Art. 97 Abs. 1 des Bundesgesetzes über das Obligationenrecht (OR; SR 220)"
  - FR: "art. 97 al. 1 de la loi fédérale complétant le Code civil suisse (CO; RS 220)"
- Subsequent mentions: Short form
  - DE: "Art. 97 Abs. 1 OR"
  - FR: "art. 97 al. 1 CO"

**BGE Citations**:
- Include consideration reference for key holdings
  - DE: "BGE 145 III 229 E. 4.2"
  - FR: "ATF 145 III 229 consid. 4.2"
- Page reference for direct quotes
  - DE: "BGE 145 III 229 E. 4.2 S. 235"

**Doctrine Citations** (if used):
- Author, Title, Edition, Year, Paragraph
- DE: "GAUCH/SCHLUEP/SCHMID, Schweizerisches Obligationenrecht AT, 10. Aufl. 2014, N 123"
- FR: "GAUCH/SCHLUEP/SCHMID, Traité de droit des obligations, 10ème éd. 2014, n° 123"

**Related Sections**: [Legal Citations MCP](#3-legal-citations-mcp-serverslegal-citations), [ResearcherAgent](#researcheragent)

---

### AgentOrchestrator

**Location**: `src/agents/orchestrator.py`
**Version**: 2.0.0
**Purpose**: Multi-agent pipeline coordination and workflow management

#### PipelineBuilder API

**Fluent Interface Design**:
```python
from src.agents.orchestrator import PipelineBuilder, AutonomyMode

# Example: Research → Strategy → Draft pipeline
pipeline = (
    PipelineBuilder("contract_dispute_analysis")

    # Step 1: Research
    .add_step(
        agent_type="researcher",
        task="Research Art. 97 OR contractual liability precedents",
        output_key="research_results"
    )
    .with_timeout(120)  # 2 minutes max
    .with_autonomy(AutonomyMode.BALANCED)

    # Step 2: Strategy
    .add_step(
        agent_type="strategist",
        task="Develop litigation strategy for CHF 500,000 damages claim",
        output_key="strategy_memo"
    )
    .with_input_mapping({
        "research_findings": "research_results.key_findings",
        "precedent_data": "research_results.verified_citations"
    })
    .with_checkpoint()  # User confirmation required before strategy

    # Step 3: Draft
    .add_step(
        agent_type="drafter",
        task="Draft Klageschrift for Zürich Commercial Court",
        output_key="draft_complaint"
    )
    .with_input_mapping({
        "legal_arguments": "strategy_memo.strengths",
        "precedents": "research_results.verified_citations",
        "damages": "strategy_memo.financial_analysis"
    })
    .with_autonomy(AutonomyMode.CAUTIOUS)  # Confirm before finalizing document

    # Build and validate
    .build()
)

# Execute pipeline
result = await pipeline.execute(initial_context={
    "case_facts": "...",
    "jurisdiction": "ZH",
    "language": "de"
})
```

#### Pipeline Templates

**Pre-built Workflow Templates**:

| Template Name | Pipeline | Use Case | Duration | Token Usage |
|--------------|----------|----------|----------|-------------|
| `research_to_strategy` | Researcher → Strategist | Legal analysis and risk assessment | 60-120s | 8-15K |
| `strategy_to_draft` | Strategist → Drafter | Strategy to document conversion | 45-90s | 10-20K |
| `full_pipeline` | Researcher → Strategist → Drafter | Complete workflow | 120-300s | 20-40K |
| `multi_jurisdiction` | Researcher(parallel) → Merger | Cross-canton analysis | 40-80s | 15-25K |

**Template Usage**:
```python
from src.agents.orchestrator import PipelineTemplates

# Use pre-built template
pipeline = PipelineTemplates.full_pipeline(
    research_depth="deep",
    jurisdiction="ZH",
    document_type="Klageschrift"
)

result = await pipeline.execute(context={"case_facts": "..."})
```

#### Execution Features

**Parallel Execution**:
```python
# Execute multiple independent agents in parallel
pipeline = (
    PipelineBuilder("multi_canton_research")
    .add_parallel_steps([
        ("researcher_zh", "Research Zürich precedents", "zh_results"),
        ("researcher_ge", "Research Geneva precedents", "ge_results"),
        ("researcher_federal", "Research BGE", "bge_results")
    ])
    .add_step(
        "merger",
        "Synthesize multi-jurisdiction findings",
        "final_results"
    )
    .with_input_mapping({
        "all_results": ["zh_results", "ge_results", "bge_results"]
    })
    .build()
)
```

**Conditional Routing**:
```python
# Route based on intermediate results
pipeline = (
    PipelineBuilder("adaptive_strategy")
    .add_step("researcher", "Initial research", "research")
    .add_conditional_step(
        condition=lambda ctx: ctx["research"]["confidence"] < 0.7,
        true_step=("researcher", "Deep research", "deep_research"),
        false_step=("strategist", "Proceed with strategy", "strategy")
    )
    .build()
)
```

**Checkpoint Aggregation**:
```python
# Collect user input at multiple checkpoints
pipeline = (
    PipelineBuilder("interactive_workflow")
    .add_step("researcher", "Research", "research")
    .with_checkpoint(
        prompt="Review research findings. Proceed with strategy?",
        options=["Proceed", "Request more research", "Abort"]
    )
    .add_step("strategist", "Strategy", "strategy")
    .with_checkpoint(
        prompt="Approve strategy recommendations?",
        options=["Approve", "Modify", "Abort"]
    )
    .build()
)
```

**Error Handling Modes**:
```python
# Fail-fast mode (default)
pipeline = PipelineBuilder("strict").with_error_mode("fail_fast")

# Continue-on-error mode (for data collection pipelines)
pipeline = PipelineBuilder("tolerant").with_error_mode("continue")

# Retry with exponential backoff
pipeline = (
    PipelineBuilder("resilient")
    .with_retry(max_attempts=3, backoff_factor=2)
)
```

#### Pipeline Execution Result

```python
@dataclass
class PipelineResult:
    success: bool
    pipeline_id: str
    duration_ms: int

    # Step-by-step results
    step_results: Dict[str, AgentResult]

    # Checkpoint history
    checkpoints: List[CheckpointResult]

    # Final aggregated output
    final_output: Dict[str, Any]

    # Execution metadata
    metadata: Dict[str, Any]

    # Error information (if applicable)
    error: Optional[Exception]
    failed_step: Optional[str]
```

**Related Sections**: [ResearcherAgent](#researcheragent), [StrategistAgent](#strategistagent), [DrafterAgent](#drafteragent)

---

## 🎛️ Command Reference

### Command Categories

**Total Commands**: 27 slash commands
- **Legal Persona Commands**: 6 commands
- **Specialized Agent Commands**: 14 commands
- **Swiss Law Commands**: 2 commands
- **Document Commands**: 1 command
- **Mode Commands**: 2 commands
- **Utility Commands**: 2 commands

### Legal Persona Commands

| Command | Persona | Purpose | Workflow Steps |
|---------|---------|---------|----------------|
| `/legal` | User Proxy | Intelligent routing to appropriate agents | - |
| `/legal:research` | Legal Researcher | Explicit Legal Researcher activation | SEARCH → VERIFY → SYNTHESIZE → OUTPUT |
| `/legal:strategy` | Case Strategist | Explicit Case Strategist activation | ANALYZE → ASSESS → ESTIMATE → STRATEGIZE → REVIEW |
| `/legal:draft` | Legal Drafter | Explicit Legal Drafter activation | UNDERSTAND → STRUCTURE → DRAFT → CITE → FORMAT → REVIEW |
| `/legal:help` | - | Complete command reference display | - |
| `/legal:version` | - | Framework version and capability status | - |

**Usage Example**:
```bash
/legal:research Art. 97 OR contractual liability precedents in Zürich

# Activates Legal Researcher with explicit confirmation:
# "🎭 Persona: Legal Researcher (/legal:research activated)"
```

### Legal Mode Commands

| Command | Mode | Purpose | Use Case |
|---------|------|---------|----------|
| `/legal:federal` | Federal Law Mode | Force federal law analysis exclusively | Cross-canton issues, federal statute interpretation |
| `/legal:cantonal [ZH\|BE\|GE\|BS\|VD\|TI]` | Cantonal Law Mode | Force specific cantonal law | Canton-specific procedure, cantonal tax, administrative |
| `/legal:cite` | Citation Tool | Citation verification and formatting | Document preparation, citation checking |
| `/legal:routing` | Configuration | View jurisdiction routing configuration | Troubleshooting, configuration review |

**Usage Example**:
```bash
/legal:cantonal ZH
Handelsgericht Zürich commercial litigation procedure

# Forces Zürich cantonal law mode with German output
```

### Specialized Agent Commands

| Command | Agent | Domain | Key Features |
|---------|-------|--------|--------------|
| `/agent:researcher` | ResearcherAgent | Full agent framework | Checkpoints, autonomy control, depth levels |
| `/agent:strategist` | StrategistAgent | Litigation strategy | Cost estimation, success probability |
| `/agent:drafter` | DrafterAgent | Document generation | Multi-lingual templates, citation integration |
| `/agent:orchestrator` | AgentOrchestrator | Pipeline coordination | Multi-agent workflows, parallel execution |
| `/agent:citation` | Citation Specialist | BGE citation work | Verification, format conversion (DE/FR/IT) |
| `/agent:compliance` | Compliance Officer | FINMA, AML/KYC | Regulatory compliance analysis |
| `/agent:data-protection` | Data Protection | GDPR, nDSG/FADP | Privacy law analysis |
| `/agent:risk` | Risk Analyst | Case probability | Statistical analysis, damages quantification |
| `/agent:procedure` | Procedure Specialist | ZPO/StPO rules | Deadline calculation, procedural requirements |
| `/agent:translator` | Legal Translator | DE/FR/IT terminology | Legal term translation with context |
| `/agent:fiscal` | Fiscal Expert | Tax law, DTAs | Swiss tax, transfer pricing |
| `/agent:corporate` | Corporate Law | AG/GmbH, M&A | Corporate governance, commercial contracts |
| `/agent:cantonal` | Cantonal Expert | 26 Swiss cantons | All cantonal legal systems |
| `/agent:realestate` | Real Estate | Property law | Grundbuch, Lex Koller, construction law |

**Usage Example**:
```bash
/agent:compliance
Analyze FINMA requirements for new crypto custody service

# Activates specialized Compliance Officer agent
```

### Swiss Law Commands

| Command | Purpose | Data Sources | Output |
|---------|---------|-------------|--------|
| `/swiss:federal` | Federal Supreme Court search | bundesgericht.ch, BGE database | BGE decisions with analysis |
| `/swiss:precedent` | Deep precedent analysis | BGE + citation network | Precedent evolution, citation chains |

**Usage Example**:
```bash
/swiss:precedent
Trace evolution of Art. 41 OR foreseeability interpretation

# Performs precedent network analysis across BGE history
```

### Document Commands

| Command | Purpose | Capabilities |
|---------|---------|-------------|
| `/doc:analyze` | Legal document analysis | Structure analysis, citation verification, issue identification |

**Usage Example**:
```bash
/doc:analyze
[paste contract text]

# Analyzes document structure, verifies citations, identifies legal issues
```

---

## ⚖️ Swiss Legal Principles

### Federal Structure (Art. 49 BV)

**Federal Law Supremacy**:
- Bundesrecht bricht kantonales Recht (DE)
- Le droit fédéral prime le droit cantonal (FR)
- Il diritto federale prevale su quello cantonale (IT)

**Cantonal Autonomy**:
- Cantons retain sovereignty in areas not delegated to federal level
- Cantonal procedural law (ZPO cantonale)
- Cantonal tax law
- Cantonal administrative law

**Coordination Principle**:
- Federal and cantonal law must be interpreted harmoniously
- Avoid conflicts through systematic interpretation

### Core Legal Principles

**1. Good Faith** (Art. 2 ZGB)
- Treu und Glauben (DE) / Bonne foi (FR) / Buona fede (IT)
- Applications:
  - Contractual interpretation (Art. 18 OR)
  - Abuse of rights prohibition (Art. 2 Abs. 2 ZGB)
  - Reasonable reliance protection
  - Duty of loyalty in ongoing relationships

**2. Burden of Proof** (Art. 8 ZGB)
- Party claiming a right bears burden of proof
- Standard: Balance of probabilities (civil)
- Negative facts generally require no proof

**3. Proportionality** (Verhältnismässigkeit)
- Three-part test:
  1. Suitability (Eignung)
  2. Necessity (Erforderlichkeit)
  3. Proportionality stricto sensu (Angemessenheit)

### Legal Interpretation Methods

**Swiss Methodology** (established by BGE):

| Method | German | French | Priority | Application |
|--------|--------|--------|----------|-------------|
| Grammatical | Wortlaut | Texte | Primary | Ordinary meaning of words, multi-lingual consistency |
| Systematic | Systematik | Systématique | Secondary | Position within legal system, related provisions |
| Teleological | Zweck | But | Secondary | Legislative intent, ratio legis |
| Historical | Entstehungsgeschichte | Historique | Tertiary | Legislative materials, development over time |

**Interpretation Hierarchy**:
1. Clear wording → Grammatical interpretation prevails
2. Ambiguous wording → Systematic and teleological interpretation
3. Legislative gap → Analogical reasoning or judge-made law

### Precedent System (BGE/ATF/DTF)

**Nature**:
- **Persuasive authority** (not binding like common law)
- Bundesgericht strives for consistency
- Lower courts generally follow BGE
- Departure requires strong justification

**Precedent Analysis Framework**:
1. Identify **ratio decidendi** (core legal principle)
2. **Distinguish facts** (material differences from current case)
3. **Consider evolution** (newer BGE may modify principles)
4. **Assess persuasiveness** (chamber, vote split, reasoning quality)
5. **Check overruling** (later BGE explicitly departing)

**Related Sections**: [BGE Search MCP](#1-bge-search-mcp-serversbge-search), [ResearcherAgent](#researcheragent)

---

## 🌐 Multi-Lingual Support

### Language Detection

**Automatic Detection Triggers**:

| Language | Legal Indicators | Citation Format |
|----------|-----------------|----------------|
| German | Vertrag, Haftung, Schaden, Anspruch, Bundesgericht | Art. 97 OR, BGE 145 III 229 |
| French | contrat, responsabilité, dommage, prétention, Tribunal fédéral | art. 97 CO, ATF 145 III 229 |
| Italian | contratto, responsabilità, danno, pretesa, Tribunale federale | art. 97 CO, DTF 145 III 229 |
| English | contract, liability, damages, claim, Federal Supreme Court | Art. 97 OR (Swiss context) |

### Canton-Language Mapping

| Canton Code | Canton Name | Primary Language(s) | Court Language(s) |
|-------------|-------------|-------------------|------------------|
| ZH | Zürich | German | German |
| BE | Bern | German + French | German, French (bilingual) |
| GE | Genève | French | French |
| BS | Basel-Stadt | German | German |
| BL | Basel-Landschaft | German | German |
| VD | Vaud | French | French |
| TI | Ticino | Italian | Italian |
| VS | Valais / Wallis | French + German | French, German (bilingual) |
| FR | Fribourg / Freiburg | French + German | French, German (bilingual) |
| NE | Neuchâtel | French | French |
| JU | Jura | French | French |
| LU | Luzern | German | German |
| AG | Aargau | German | German |
| SG | St. Gallen | German | German |

### Multi-Lingual Terminology Consistency

**Statutory References**:
| Concept | German | French | Italian |
|---------|--------|--------|---------|
| Article | Art. | art. | art. |
| Paragraph | Abs. | al. | cpv. |
| Letter | lit. | let. | lett. |
| Civil Code | ZGB (SR 210) | CC (RS 210) | CC (RS 210) |
| Code of Obligations | OR (SR 220) | CO (RS 220) | CO (RS 220) |

**Court Decisions**:
| Element | German | French | Italian |
|---------|--------|--------|---------|
| Federal Supreme Court | Bundesgericht | Tribunal fédéral | Tribunale federale |
| Decision collection | BGE | ATF | DTF |
| Consideration | Erwägung (E.) | considérant (consid.) | considerando (consid.) |

**Related Sections**: [Legal Citations MCP](#3-legal-citations-mcp-serverslegal-citations), [Swiss Law Configuration](#-swiss-law-configuration)

---

## 🇨🇭 Swiss Law Configuration

### Jurisdiction Routing Logic

```
User Query
    │
    ▼
┌────────────────────┐
│ Language Detection │ → DE/FR/IT/EN
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Jurisdiction       │
│ Analysis           │
└─────────┬──────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌────────────┐
│Federal? │ │ Cantonal?  │
└────┬────┘ └─────┬──────┘
     │            │
     │            ▼
     │     ┌────────────┐
     │     │Which Canton│
     │     │ZH/BE/GE/...│
     │     └─────┬──────┘
     │           │
     ▼           ▼
┌───────────────────────┐
│ Activate Mode         │
│ - Federal Law Mode    │
│ - Cantonal Law + CT   │
│ - Multi-Lingual Mode  │
└───────────────────────┘
```

### Federal vs. Cantonal Competence Matrix

| Legal Area | Federal | Cantonal | Notes |
|------------|---------|----------|-------|
| Civil Law (ZGB) | ✓ Primary | - | Federal competence |
| Obligations (OR) | ✓ Primary | - | Federal competence |
| Criminal Law | ✓ Primary | Limited execution | Federal StGB, cantonal execution |
| Civil Procedure | ✓ Framework (ZPO) | ✓ Specifics | ZPO federal, cantonal details |
| Criminal Procedure | ✓ Primary (StPO) | ✓ Execution | Federal framework |
| Administrative Law | ✓ Federal matters | ✓ Cantonal matters | Divided competence |
| Tax Law | ✓ Federal taxes | ✓ Cantonal taxes | Parallel systems |
| Construction Law | - | ✓ Primary | Cantonal competence |
| Education Law | - | ✓ Primary | Cantonal competence |
| Police Law | Limited | ✓ Primary | Cantonal competence |

**Related Sections**: [Entscheidsuche MCP](#2-entscheidsuche-mcp-serversentscheidsuche), [Multi-Lingual Support](#-multi-lingual-support)

---

## 🔒 Quality Standards

### Citation Accuracy Targets

| Metric | Target | Validation Method |
|--------|--------|------------------|
| Citation format accuracy | >95% | Automated format checking (legal-citations MCP) |
| Statutory cross-reference verification | >90% | Fedlex SPARQL existence checking |
| BGE citation retrieval success | >85% | BGE search MCP validation |
| Multi-lingual terminology consistency | >90% | Language-specific term validation |

### Research Quality Metrics

| Metric | Target | Measurement |
|--------|--------|------------|
| BGE search recall (relevant decisions) | >80% | Manual review of sample cases |
| Research confidence scoring accuracy | >75% | Outcome validation |
| Source credibility assessment | >90% | Expert review |
| Multi-lingual consistency | >90% | Cross-language verification |

### Professional Ethics Standards

**Anwaltsgeheimnis (Professional Secrecy)**:
- All client data must be anonymized in queries
- Local processing option available (strict privacy mode)
- No retention of client-specific data beyond session
- Audit trail for all external API calls

**Data Retention**:
- Default: 30 days for session data
- Configurable: 0-90 days
- User control: Can delete session data on demand
- Compliance: GDPR/nDSG compatible

**Related Sections**: [Configuration](#-configuration)

---

## 🔧 Configuration

### User Configuration File

**Location**: `~/.betterask/config.yaml`

```yaml
# BetterCallClaude Configuration v2.0.1

version: "2.0.1"

# Privacy mode determines data handling
privacy_mode: balanced  # strict | balanced | cloud

# LLM backend (ollama support coming in v1.1)
llm_backend: anthropic  # anthropic | ollama (future)

# Practice focus
canton_focus:
  - ZH  # Primary jurisdiction
  - GE  # Secondary jurisdiction

languages:
  - de  # German
  - fr  # French
  - en  # English

practice_areas:
  - corporate
  - litigation
  - compliance

# MCP Server Configuration
mcp_servers:
  bge_search:
    enabled: true
    cache_ttl: 86400  # 24 hours
    max_results: 50

  entscheidsuche:
    enabled: true
    sources:
      - bundesgericht
      - zh
      - be
      - ge
      - bs
      - vd
      - ti
    parallel_search: true

  legal_citations:
    enabled: true
    verification: strict  # strict | relaxed
    auto_format: true

  fedlex_sparql:
    enabled: true
    endpoint: "https://lindas.admin.ch/query"
    timeout_ms: 5000
    cache_ttl: 43200  # 12 hours

# Agent Configuration
agents:
  default_autonomy: balanced  # cautious | balanced | autonomous
  checkpoint_interval: 1800  # 30 minutes
  max_parallel_agents: 3

# Data Retention
data_retention_days: 30
auto_save: true

# Jurisdiction Routing
jurisdiction:
  default_mode: federal  # federal | cantonal
  default_canton: ZH
  auto_detect: true
```

### Environment Variables

```bash
# Anthropic API Key (required)
export ANTHROPIC_API_KEY="sk-ant-..."

# Optional: Override config location
export BETTERASK_CONFIG_PATH="/custom/path/config.yaml"

# Optional: Enable debug logging
export BETTERASK_DEBUG=true
```

**Related Sections**: [Quality Standards](#-quality-standards)

---

## 📊 Performance Metrics

### Pipeline Execution Performance

| Pipeline | Duration | Token Usage | Cost (USD) |
|----------|----------|-------------|------------|
| research_to_strategy | 60-120s | 8-15K | $0.24-$0.45 |
| strategy_to_draft | 45-90s | 10-20K | $0.30-$0.60 |
| full_pipeline | 120-300s | 20-40K | $0.60-$1.20 |
| parallel_3_agents | 40-80s | 15-25K | $0.45-$0.75 |

**Cost Calculation** (Anthropic Claude Sonnet 4.5 pricing):
- Input tokens: $3.00 / 1M tokens
- Output tokens: $15.00 / 1M tokens
- Assumes ~20% output tokens

### Research Depth Profiles (v2.0.1)

| Level | Max Sources | Max Hops | Time Limit | Confidence Target | Token Usage | Use Case |
|-------|-------------|----------|------------|-------------------|-------------|----------|
| **quick** | 10 | 1 | 2 min | 0.6 | ~5K | Preliminary research, quick checks |
| **standard** | 20 | 3 | 5 min | 0.7 | ~12K | Standard legal research |
| **deep** | 40 | 4 | 8 min | 0.8 | ~25K | Complex litigation research |
| **exhaustive** | 50+ | 5 | 10 min | 0.9 | ~40K | High-stakes matters, precedent analysis |

### MCP Server Response Times

| MCP Server | Operation | Avg Response | 95th Percentile |
|------------|-----------|--------------|----------------|
| bge-search | Search (cached) | 150ms | 300ms |
| bge-search | Search (uncached) | 2000ms | 4000ms |
| bge-search | Get decision (cached) | 50ms | 100ms |
| entscheidsuche | Multi-canton search | 3000ms | 6000ms |
| legal-citations | Validate citation | 100ms | 200ms |
| legal-citations | Get provision text | 800ms | 1500ms |
| fedlex-sparql | Lookup statute | 200ms | 400ms |
| fedlex-sparql | Search legislation | 500ms | 1000ms |
| fedlex-sparql | Get article | 300ms | 600ms |

**Related Sections**: [MCP Server Architecture](#-mcp-server-architecture)

---

## ⚠️ Professional Disclaimer

**CRITICAL NOTICE**: BetterCallClaude is a legal research and analysis tool designed to assist lawyers. All outputs from this framework:

- ✅ **Require professional lawyer review and validation**
- ✅ **Do not constitute legal advice**
- ✅ **May contain errors, omissions, or outdated information**
- ✅ **Must be verified against official sources** (bundesgericht.ch, fedlex.admin.ch)
- ✅ **Must be adapted to specific case circumstances and client needs**
- ✅ **Cannot replace professional legal judgment**

**Lawyers maintain full professional responsibility** for all legal work products, regardless of tool assistance.

**Swiss Bar Compliance**:
- Comply with cantonal bar association rules
- Maintain client confidentiality (Anwaltsgeheimnis)
- Exercise independent professional judgment
- Verify all citations and legal authorities

---

## 🆘 Troubleshooting

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Citation not found | Incorrect format, typo | Verify format: "Art. 123 OR" not "Art.123 OR" |
| Wrong language output | Auto-detection failed | Explicitly state language preference in query |
| Canton law not applied | No canton mentioned | Explicitly mention canton code (ZH, GE, etc.) |
| MCP server not responding | Server not installed/configured | Check installation: `npm install` in mcp-servers/[name] |
| Fedlex SPARQL timeout | Network issue, endpoint down | Check LINDAS endpoint status, retry |
| Low research confidence | Insufficient sources | Increase research depth level or expand query |

### MCP Server Diagnostics

**Check Installation**:
```bash
# Navigate to MCP server directory
cd mcp-servers/bge-search

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Verify server starts
npm start
```

**Verify Configuration**:
```bash
# Check config file exists
ls -la ~/.betterask/config.yaml

# Display config
cat ~/.betterask/config.yaml

# Validate YAML syntax
python3 -c "import yaml; yaml.safe_load(open('/Users/$(whoami)/.betterask/config.yaml'))"
```

**Test MCP Connectivity**:
```bash
# Test BGE Search
curl -X POST http://localhost:3000/search_bge \
  -H "Content-Type: application/json" \
  -d '{"query": "Art. 97 OR", "limit": 5}'

# Test Fedlex SPARQL
curl -X POST http://localhost:3001/lookupStatute \
  -H "Content-Type: application/json" \
  -d '{"identifier": "OR", "language": "de"}'
```

**Related Sections**: [Configuration](#-configuration), [MCP Server Architecture](#-mcp-server-architecture)

---

## 📚 Additional Resources

### Internal Documentation

**Framework Configuration**:
- `.claude/BETTERASK.md` - Main framework entry point with activation patterns
- `.claude/LEGAL_PRINCIPLES.md` - Swiss legal reasoning standards and methodology
- `.claude/LEGAL_SYMBOLS.md` - Citation format reference and symbol system
- `.claude/SWISS_LAW_CONFIG.md` - Jurisdiction routing and canton configuration

**Command Reference**:
- `.claude/commands/legal:*.md` - Legal persona command definitions (6 files)
- `.claude/commands/agent:*.md` - Specialized agent commands (14 files)
- `.claude/commands/swiss:*.md` - Swiss court commands (2 files)
- `.claude/commands/doc:*.md` - Document analysis commands (1 file)

**Workflow Guides**:
- `docs/workflows/research-precedents.md` - BGE research workflow
- `docs/workflows/case-strategy.md` - Litigation strategy development
- `docs/workflows/draft-contracts.md` - Contract drafting workflow

**Multi-Lingual Documentation**:
- `docs/languages/de/ERSTE_SCHRITTE.md` - German getting started guide
- `docs/languages/fr/GUIDE_DEMARRAGE.md` - French getting started guide
- `docs/languages/it/GUIDA_INTRODUTTIVA.md` - Italian getting started guide

### External Resources

**Swiss Legal Databases**:
- [Bundesgericht](https://www.bger.ch) - Swiss Federal Supreme Court
- [Fedlex](https://www.fedlex.admin.ch) - Swiss federal legislation database
- [Entscheidsuche](https://entscheidsuche.ch) - Multi-canton court decision search
- [LINDAS](https://lindas.admin.ch) - Linked Data Service with JOLUX ontology

**JOLUX Documentation**:
- [JOLUX SPARQL Endpoint](https://lindas.admin.ch/sparql) - Query interface
- [JOLUX Ontology Documentation](https://fedlex.data.admin.ch) - RDF schema
- [FRBR Model](https://www.ifla.org/publications/node/11240) - Foundational ontology

**Legal Research Resources**:
- [swisslex.ch](https://www.swisslex.ch) - Commercial legal database (subscription)
- [weblaw.ch](https://www.weblaw.ch) - Legal commentary and practice materials (subscription)

---

## 🔄 Version History

### v2.0.1 (2026-01-05) ⭐ CURRENT

**Added**:
- Fedlex SPARQL MCP server with JOLUX ontology integration
- LINDAS SPARQL endpoint for Swiss federal legislation
- Enhanced article retrieval with full paragraph/letter structure
- Legislative relationship tracking (amendments, modifications)

**Fixed**:
- Version update workflow improvements
- README synchronization
- Manifest regeneration after updates

**Performance**:
- Fedlex SPARQL queries: 200-500ms average
- 12-hour cache TTL for legislation data

### v2.0.0 (2024-12-29)

**Major Changes**:
- TypeScript migration for all MCP servers
- @bettercallclaude/shared infrastructure package
- AgentOrchestrator with PipelineBuilder API
- Comprehensive test coverage (Vitest)

**Added**:
- 14 specialized domain agents
- Checkpoint-based workflow recovery
- Multi-lingual command system (27 commands)

### v1.1.0 (2024-12-15)

**Added**:
- Legal Citations MCP v1.1.0
- Citation format conversion (DE/FR/IT)
- Statutory text retrieval via Fedlex API

**Improved**:
- Multi-lingual support (DE/FR/IT/EN)
- Canton-specific court decision search

---

## 🤝 Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/fedec65/BetterCallClaude.git
cd BetterCallClaude

# Install dependencies
npm install

# Build all MCP servers
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

### Running Tests

```bash
# All tests
npm test

# Specific MCP server
cd mcp-servers/bge-search
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Project Guidelines

- TypeScript for all MCP servers
- Vitest for testing
- Follow existing code patterns
- Include tests for new features
- Update documentation

---

**Built for the Swiss legal community with ❤️**

*BetterCallClaude v2.0.1 - Swiss Legal Intelligence Framework*
*Last Updated: 2026-01-05*
