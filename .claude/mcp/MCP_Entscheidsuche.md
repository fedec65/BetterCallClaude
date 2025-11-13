# MCP_Entscheidsuche.md - Court Decision Search MCP Server

**MCP Server Name**: `entscheidsuche`
**Version**: v1.0.0
**Purpose**: Search and retrieve Swiss federal and cantonal court decisions
**Status**: Specification (Implementation Phase 2)

---

## Overview

The `entscheidsuche` MCP server provides comprehensive access to Swiss court decisions (Bundesgericht and cantonal courts) for legal research, precedent analysis, and case strategy development. It integrates with all three BetterCallClaude personas and supports multi-lingual search across DE/FR/IT/EN.

### Key Capabilities
- **Federal Supreme Court (Bundesgericht)**: BGE/ATF/DTF decisions from bundesgericht.ch
- **Cantonal Courts**: 6 canton court systems (ZH, BE, GE, BS, VD, TI)
- **Multi-Lingual Search**: Query and retrieve decisions in all official languages
- **Advanced Filtering**: By date range, legal area, court, language, citation
- **Citation Verification**: Validate BGE citations and retrieve full decisions
- **Precedent Analysis**: Success rate calculations, pattern identification
- **Cross-Language Linking**: Find same decision in multiple language versions

---

## Data Sources

### Federal Supreme Court (Bundesgericht)

**Primary Source**: https://www.bundesgericht.ch/

```yaml
bge_database:
  official_name:
    de: "Bundesgerichtsentscheid (BGE)"
    fr: "Arrêt du Tribunal fédéral (ATF)"
    it: "Decisione del Tribunale federale (DTF)"

  coverage:
    published_decisions: "BGE/ATF/DTF (leading cases)"
    unpublished_decisions: "Available since 2000"
    historical_archive: "Selected decisions back to 1875"

  languages:
    available: ["de", "fr", "it"]
    note: "Same decision available in multiple languages"

  sections:
    I: "Constitutional law"
    Ia: "International law and fundamental rights"
    II: "Civil law (ZGB)"
    III: "Obligations and property law (OR)"
    IV: "Social insurance law"
    V: "Administrative law"
    VI: "Criminal law"

  access_method:
    api: "bundesgericht.ch API (if available)"
    fallback: "Web scraping with proper rate limiting"
    format: "Structured JSON with metadata + full text"
```

### Cantonal Courts

#### Zürich (ZH)

**Source**: https://gerichte.zh.ch/

```yaml
court_system:
  supreme: "Obergericht Zürich"
  specialized: "Handelsgericht Zürich (Commercial Court)"
  administrative: "Verwaltungsgericht Zürich"

database_access:
  url: "https://gerichte.zh.ch/entscheidungen"
  coverage: "Recent decisions (typically 5+ years)"
  language: "de"
  search_capabilities: ["fulltext", "date_range", "legal_area", "court"]

citation_format:
  example: "ZR 123/2024"
  structure: "[Court abbreviation] [Number]/[Year]"
```

#### Bern (BE)

**Source**: https://www.justice.be.ch/

```yaml
court_system:
  supreme: "Obergericht Bern / Tribunal cantonal Berne"
  administrative: "Verwaltungsgericht / Tribunal administratif"

database_access:
  url: "https://www.belex.sites.be.ch/app/de/texts_of_law"
  coverage: "Recent decisions"
  languages: ["de", "fr"]
  bilingual: true
  note: "Decisions may be in German or French"

citation_format:
  example: "BEOGE 2024/123"
  structure: "[BEOGE/BESTA] [Year]/[Number]"
```

#### Genève (GE)

**Source**: https://www.ge.ch/justice/

```yaml
court_system:
  supreme: "Tribunal cantonal Genève"
  specialized: "Chambre civile, Chambre pénale, Chambre administrative"

database_access:
  url: "https://www.ge.ch/rechercher-jurisprudence-genevoise"
  coverage: "Recent decisions"
  language: "fr"
  search_capabilities: ["fulltext", "date_range", "chamber"]

citation_format:
  example: "ACJC/123/2024"
  structure: "[Chamber code]/[Number]/[Year]"
```

#### Basel-Stadt (BS)

**Source**: https://www.gerichte.bs.ch/

```yaml
court_system:
  supreme: "Appellationsgericht Basel-Stadt"
  administrative: "Verwaltungsgericht Basel-Stadt"

database_access:
  url: "https://www.gerichte.bs.ch/entscheidungen"
  coverage: "Recent decisions"
  language: "de"

citation_format:
  example: "VGE 2024-123"
  structure: "[Court abbreviation] [Year]-[Number]"
```

#### Vaud (VD)

**Source**: https://www.vd.ch/justice/

```yaml
court_system:
  supreme: "Tribunal cantonal Vaud"
  specialized: "Cour civile, Cour pénale, Cour de droit administratif et public"

database_access:
  url: "https://www.vd.ch/themes/etat-droit-finances/justice/jurisprudence"
  coverage: "Recent decisions"
  language: "fr"

citation_format:
  example: "HC/2024/123"
  structure: "[Chamber code]/[Year]/[Number]"
```

#### Ticino (TI)

**Source**: https://www4.ti.ch/poteri/giudiziario/

```yaml
court_system:
  supreme: "Tribunale d'appello Ticino"
  administrative: "Tribunale amministrativo Ticino"

database_access:
  url: "https://www4.ti.ch/poteri/giudiziario/decisioni"
  coverage: "Recent decisions"
  language: "it"

citation_format:
  example: "6A.2024.123"
  structure: "[Chamber code].[Year].[Number]"
```

---

## Tool Specifications

### Tool 1: `search_decisions`

Search for court decisions with advanced filtering capabilities.

**Function Signature**:
```typescript
search_decisions(params: {
  query: string;                    // Search query (fulltext or keywords)
  courts?: string[];                // Filter by courts (see court codes below)
  date_range?: {                    // Optional date filtering
    from?: string;                  // ISO date: "2020-01-01"
    to?: string;                    // ISO date: "2024-12-31"
  };
  languages?: string[];             // Filter by language: ["de", "fr", "it"]
  legal_areas?: string[];           // Filter by legal area (see codes below)
  max_results?: number;             // Maximum results to return (default: 20)
  sort_by?: "relevance" | "date";  // Sort order (default: "relevance")
}): Promise<DecisionSearchResult>
```

**Court Codes**:
```yaml
federal:
  bundesgericht: "Swiss Federal Supreme Court (all chambers)"
  bundesgericht_I: "Constitutional law chamber"
  bundesgericht_II: "Civil law chamber"
  bundesgericht_III: "Obligations law chamber"
  bundesgericht_IV: "Social insurance chamber"
  bundesgericht_V: "Administrative law chamber"
  bundesgericht_VI: "Criminal law chamber"

cantonal:
  obergericht_zh: "Zürich Supreme Court"
  handelsgericht_zh: "Zürich Commercial Court"
  verwaltungsgericht_zh: "Zürich Administrative Court"

  obergericht_be: "Bern Supreme Court"
  verwaltungsgericht_be: "Bern Administrative Court"

  tribunal_cantonal_ge: "Geneva Cantonal Court"

  appellationsgericht_bs: "Basel-Stadt Appellate Court"
  verwaltungsgericht_bs: "Basel-Stadt Administrative Court"

  tribunal_cantonal_vd: "Vaud Cantonal Court"

  tribunale_appello_ti: "Ticino Appellate Court"
  tribunale_amministrativo_ti: "Ticino Administrative Court"
```

**Legal Area Codes**:
```yaml
civil_law:
  - "zivilrecht"              # General civil law
  - "personenrecht"           # Persons (ZGB Part 1)
  - "familienrecht"           # Family law (ZGB Part 2)
  - "erbrecht"                # Inheritance (ZGB Part 3)
  - "sachenrecht"             # Property law (ZGB Part 4)

obligations:
  - "obligationenrecht"       # General obligations (OR)
  - "vertragsrecht"           # Contract law (OR Part 1-2)
  - "haftpflichtrecht"        # Liability (Art. 41+ OR)
  - "gesellschaftsrecht"      # Corporate law (OR Part 3)
  - "wertpapierrecht"         # Securities law

procedural:
  - "zivilprozessrecht"       # Civil procedure (ZPO)
  - "strafprozessrecht"       # Criminal procedure (StPO)
  - "verwaltungsverfahren"    # Administrative procedure

criminal:
  - "strafrecht"              # Criminal law (StGB)
  - "strafprozessrecht"       # Criminal procedure

administrative:
  - "verwaltungsrecht"        # Administrative law
  - "sozialversicherungsrecht" # Social insurance
  - "steuerrecht"             # Tax law
  - "baurecht"                # Construction law

constitutional:
  - "verfassungsrecht"        # Constitutional law
  - "grundrechte"             # Fundamental rights
```

**Response Format**:
```typescript
interface DecisionSearchResult {
  total_results: number;
  results: Decision[];
  search_metadata: {
    query: string;
    filters_applied: string[];
    execution_time_ms: number;
  };
}

interface Decision {
  // Core identification
  citation: string;              // "BGE 145 III 229" or "ZR 123/2024"
  court: string;                 // Court code
  date: string;                  // ISO date
  language: string;              // "de" | "fr" | "it"

  // Content
  title: string;                 // Case title/summary
  summary: string;               // Official summary (Regeste/Résumé)
  legal_areas: string[];         // Legal area codes

  // Full text availability
  full_text_available: boolean;
  full_text_url?: string;        // URL to retrieve full decision

  // Cross-language
  alternative_languages?: {      // Same decision in other languages
    de?: string;                 // BGE citation
    fr?: string;                 // ATF citation
    it?: string;                 // DTF citation
  };

  // Metadata
  chamber?: string;              // Court chamber/section
  judges?: string[];             // Judge names (if available)
  legal_provisions: string[];    // Cited legal provisions (e.g., "Art. 97 OR")

  // Relevance
  relevance_score?: number;      // 0.0-1.0 if sorted by relevance
}
```

**Usage Example 1: Contract Liability Research**
```typescript
const results = await search_decisions({
  query: "vertragliche Haftung Lieferverzug Schadenersatz",
  courts: ["bundesgericht_III", "obergericht_zh", "handelsgericht_zh"],
  date_range: {
    from: "2015-01-01",
    to: "2024-12-31"
  },
  languages: ["de"],
  legal_areas: ["obligationenrecht", "haftpflichtrecht"],
  max_results: 20,
  sort_by: "relevance"
});

// Returns: 20 most relevant BGE and ZH court decisions on contract liability
```

**Usage Example 2: Geneva Administrative Law**
```typescript
const results = await search_decisions({
  query: "autorisation de construire refus permis",
  courts: ["tribunal_cantonal_ge"],
  languages: ["fr"],
  legal_areas: ["verwaltungsrecht", "baurecht"],
  date_range: {
    from: "2020-01-01"
  },
  max_results: 15
});

// Returns: Recent Geneva administrative court decisions on construction permits
```

---

### Tool 2: `get_decision_by_citation`

Retrieve a specific court decision by its official citation.

**Function Signature**:
```typescript
get_decision_by_citation(params: {
  citation: string;              // Full citation: "BGE 145 III 229" or "ZR 123/2024"
  language?: string;             // Preferred language (if available)
  include_full_text?: boolean;   // Include full decision text (default: true)
}): Promise<DecisionDetail>
```

**Response Format**:
```typescript
interface DecisionDetail {
  // Core identification
  citation: string;
  court: string;
  date: string;
  language: string;

  // Content
  title: string;
  summary: string;                // Official Regeste/Résumé/Massima
  facts: string;                  // Sachverhalt/Faits/Fatti
  reasoning: Consideration[];     // Erwägungen/Considérants/Considerandi
  judgment: string;               // Dispositiv/Dispositif/Dispositivo

  // Full text
  full_text?: string;             // Complete decision text

  // Legal framework
  legal_provisions: LegalProvision[];  // Cited provisions with full text
  precedents_cited: string[];          // Other decisions cited
  precedents_citing: string[];         // Decisions citing this one

  // Metadata
  chamber: string;
  judges: string[];
  parties?: {
    appellant?: string;
    respondent?: string;
  };

  // Cross-language
  alternative_languages?: {
    de?: string;
    fr?: string;
    it?: string;
  };

  // Document
  pdf_url?: string;               // Link to official PDF
  official_url: string;           // bundesgericht.ch or cantonal URL
}

interface Consideration {
  number: string;                 // "4.2" or "4.2.1"
  heading?: string;               // Consideration heading (if any)
  text: string;                   // Full consideration text
  legal_analysis: boolean;        // Is this legal reasoning vs. factual?
}

interface LegalProvision {
  citation: string;               // "Art. 97 Abs. 1 OR"
  provision_text: string;         // Full text of the provision
  relevance: "primary" | "secondary";  // How central to the decision
}
```

**Usage Example 1: BGE Lookup**
```typescript
const decision = await get_decision_by_citation({
  citation: "BGE 145 III 229",
  language: "de",
  include_full_text: true
});

// Returns: Complete BGE 145 III 229 with Erwägungen, cited provisions, full text
```

**Usage Example 2: Cantonal Decision Lookup**
```typescript
const decision = await get_decision_by_citation({
  citation: "ZR 123/2024",
  include_full_text: true
});

// Returns: Complete Zürich Obergericht decision
```

---

### Tool 3: `analyze_precedent_success_rate`

Analyze success rates for specific claim types based on historical precedents.

**Function Signature**:
```typescript
analyze_precedent_success_rate(params: {
  claim_type: string;            // Type of legal claim
  legal_basis: string[];         // Legal provisions involved
  courts?: string[];             // Filter by courts (default: all)
  date_range?: {
    from?: string;
    to?: string;
  };
  min_cases?: number;            // Minimum cases for statistical significance (default: 10)
}): Promise<PrecedentAnalysis>
```

**Claim Type Codes**:
```yaml
contract_claims:
  - "vertragsverletzung_schadenersatz"     # Contract breach damages
  - "lieferverzug_wandelung"               # Delivery delay rescission
  - "mangel_preisminderung"                # Defect price reduction
  - "vertragsaufloesung"                   # Contract termination

liability_claims:
  - "verschuldenshaftung_art41"            # Fault-based liability Art. 41 OR
  - "kausalhaftung_art58"                  # Strict liability Art. 58 OR
  - "werkeigentumerhaftung_art58"          # Property owner liability

employment:
  - "kuendigung_missbräuchlich"            # Abusive termination
  - "schadenersatz_arbeitgeber"            # Employer liability

administrative:
  - "baubewilligung_verweigerung"          # Construction permit denial
  - "verfuegung_anfechtung"                # Administrative decision challenge
```

**Response Format**:
```typescript
interface PrecedentAnalysis {
  claim_type: string;
  analysis_period: {
    from: string;
    to: string;
  };

  statistics: {
    total_cases: number;
    plaintiff_success: number;        // Full or partial success
    plaintiff_full_success: number;   // Full success only
    defendant_success: number;
    split_decisions: number;          // Partial success

    success_rate: number;             // 0.0-1.0 (plaintiff perspective)
    confidence_level: "low" | "medium" | "high";  // Based on sample size
  };

  key_factors: SuccessFactor[];       // Factors affecting success

  representative_cases: Decision[];   // 3-5 leading cases

  trends?: {
    trend_direction: "increasing" | "stable" | "decreasing";
    note: string;
  };
}

interface SuccessFactor {
  factor: string;                     // "evidence_quality", "procedural_compliance"
  impact: "positive" | "negative" | "neutral";
  description: string;
  supporting_cases: string[];         // BGE citations supporting this factor
}
```

**Usage Example: Contract Breach Success Rate**
```typescript
const analysis = await analyze_precedent_success_rate({
  claim_type: "vertragsverletzung_schadenersatz",
  legal_basis: ["Art. 97 OR", "Art. 107 OR"],
  courts: ["bundesgericht_III", "obergericht_zh"],
  date_range: {
    from: "2015-01-01",
    to: "2024-12-31"
  },
  min_cases: 20
});

// Returns:
// {
//   claim_type: "vertragsverletzung_schadenersatz",
//   statistics: {
//     total_cases: 87,
//     plaintiff_success: 64,
//     success_rate: 0.74,
//     confidence_level: "high"
//   },
//   key_factors: [
//     {
//       factor: "clear_contract_terms",
//       impact: "positive",
//       description: "Well-drafted contracts increase success probability",
//       supporting_cases: ["BGE 145 III 229", "BGE 142 III 433"]
//     }
//   ]
// }
```

---

### Tool 4: `find_similar_cases`

Find cases with similar facts or legal issues.

**Function Signature**:
```typescript
find_similar_cases(params: {
  reference_case?: string;       // Citation of reference case
  facts_description?: string;    // Description of facts (if no reference case)
  legal_issues: string[];        // Legal issues involved
  similarity_threshold?: number; // 0.0-1.0 (default: 0.7)
  max_results?: number;          // Default: 10
}): Promise<SimilarCaseResult>
```

**Response Format**:
```typescript
interface SimilarCaseResult {
  total_results: number;
  similar_cases: SimilarCase[];
}

interface SimilarCase {
  decision: Decision;            // Full decision object
  similarity_score: number;      // 0.0-1.0
  similarity_factors: string[];  // What makes it similar
  key_differences?: string[];    // Notable differences
}
```

**Usage Example**:
```typescript
const similar = await find_similar_cases({
  reference_case: "BGE 145 III 229",
  legal_issues: ["contract_breach", "delivery_delay", "damages"],
  similarity_threshold: 0.65,
  max_results: 15
});

// Returns: 15 cases similar to BGE 145 III 229 with similarity scores
```

---

### Tool 5: `get_legal_provision_interpretation`

Retrieve BGE interpretation and application of specific legal provisions.

**Function Signature**:
```typescript
get_legal_provision_interpretation(params: {
  provision: string;             // "Art. 97 OR" or "Art. 8 ZGB"
  language?: string;             // Preferred language
  date_range?: {
    from?: string;
    to?: string;
  };
  sort_by?: "date" | "importance";  // Default: "importance"
}): Promise<ProvisionInterpretation>
```

**Response Format**:
```typescript
interface ProvisionInterpretation {
  provision: string;
  provision_text: {               // Official text in all languages
    de: string;
    fr: string;
    it: string;
  };

  leading_cases: Decision[];      // Most important BGE on this provision

  interpretation_principles: InterpretationPrinciple[];

  application_examples: ApplicationExample[];

  related_provisions: string[];   // Other relevant provisions

  total_bge_citations: number;    // How many BGE cite this provision
}

interface InterpretationPrinciple {
  principle: string;              // Key interpretive principle
  source: string;                 // BGE citation establishing principle
  text: string;                   // Relevant BGE passage
}

interface ApplicationExample {
  case_citation: string;
  facts_summary: string;
  application: string;            // How provision was applied
  outcome: "granted" | "denied" | "partial";
}
```

**Usage Example**:
```typescript
const interpretation = await get_legal_provision_interpretation({
  provision: "Art. 97 Abs. 1 OR",
  language: "de",
  date_range: {
    from: "2010-01-01"
  },
  sort_by: "importance"
});

// Returns: Complete BGE interpretation framework for Art. 97 OR
```

---

## Integration with Personas

### Legal Researcher Persona

**Primary Tools**:
- `search_decisions`: Main research tool for BGE and cantonal precedents
- `get_decision_by_citation`: Retrieve specific decisions for detailed analysis
- `get_legal_provision_interpretation`: Understand statutory interpretation

**Workflow Integration**:
```yaml
step_1_identify_legal_issue:
  action: "User describes research question"
  output: "Identify relevant legal provisions and claim types"

step_2_search_precedents:
  tool: "search_decisions"
  params:
    query: "Derived from research question"
    legal_areas: "Auto-detected from issue"
    courts: "bundesgericht + relevant cantonal"
    date_range: "Last 10 years (adjustable)"

step_3_retrieve_leading_cases:
  tool: "get_decision_by_citation"
  params: "Top 3-5 relevant BGE from search"
  analysis: "Extract legal principles and reasoning"

step_4_provision_analysis:
  tool: "get_legal_provision_interpretation"
  params: "Key statutory provisions"
  synthesis: "Combine BGE interpretation with case facts"

step_5_output:
  format: "Research memorandum with citations"
  quality: ">95% citation accuracy verified"
```

### Case Strategist Persona

**Primary Tools**:
- `analyze_precedent_success_rate`: Calculate litigation success probability
- `find_similar_cases`: Identify analogous precedents for strategy
- `search_decisions`: Research specific procedural or substantive issues

**Workflow Integration**:
```yaml
step_1_case_assessment:
  action: "Analyze client case facts and legal claims"
  output: "Identify claim types and legal bases"

step_2_success_probability:
  tool: "analyze_precedent_success_rate"
  params:
    claim_type: "Client's claim type"
    legal_basis: "Relevant statutes"
    courts: "Likely jurisdiction"
  analysis: "Calculate success probability with confidence level"

step_3_analogous_precedents:
  tool: "find_similar_cases"
  params:
    facts_description: "Client case summary"
    legal_issues: "Key legal questions"
  analysis: "Compare client case to precedents, identify strengths/weaknesses"

step_4_procedural_strategy:
  tool: "search_decisions"
  params:
    query: "Procedural issues (venue, evidence, interim measures)"
    legal_areas: ["zivilprozessrecht"]
  synthesis: "Develop optimal procedural approach"

step_5_output:
  format: "Strategic assessment with success probability"
  include: "Risks, timeline, costs, settlement analysis"
```

### Legal Drafter Persona

**Primary Tools**:
- `get_legal_provision_interpretation`: Ensure contract clauses align with BGE
- `search_decisions`: Verify enforceable vs. unenforceable clauses
- `get_decision_by_citation`: Check specific BGE on contract drafting

**Workflow Integration**:
```yaml
step_1_contract_framework:
  action: "Identify contract type and governing law"
  output: "Relevant OR provisions (Art. 184-551 OR)"

step_2_clause_verification:
  tool: "search_decisions"
  params:
    query: "Specific clause type (e.g., liability limitation)"
    legal_areas: ["obligationenrecht", "vertragsrecht"]
  analysis: "Verify clause enforceability per BGE"

step_3_precedent_compliance:
  tool: "get_decision_by_citation"
  params: "Key BGE on contract interpretation"
  application: "Draft clauses consistent with BGE standards"

step_4_quality_check:
  tool: "get_legal_provision_interpretation"
  params: "All cited OR provisions"
  verify: "Citations accurate, interpretation current"

step_5_output:
  format: "Contract draft with BGE-compliant clauses"
  quality: ">95% citation accuracy, enforceability verified"
```

---

## Multi-Lingual Support

### Language Detection and Routing

```yaml
automatic_language_detection:
  method_1: "Query language analysis (keywords, structure)"
  method_2: "Court jurisdiction (GE → French, ZH → German, TI → Italian)"
  method_3: "User language preference (explicit or inferred)"
  method_4: "Citation format ('Art. X Abs. Y' → German, 'art. X al. Y' → French)"

routing_logic:
  single_language_query:
    action: "Search in query language, return results in same language"
    example: "German query → German BGE → German output"

  multi_language_research:
    action: "Search all languages, return in user's preferred language"
    example: "Search DE/FR/IT BGE → Present in German with FR/IT cross-references"

  cross_language_citation:
    action: "Provide BGE/ATF/DTF equivalent citations"
    example: "BGE 145 III 229 (ATF 145 III 229, DTF 145 III 229)"
```

### Language-Specific Search Optimization

```yaml
german_search:
  courts: "bundesgericht, obergericht_zh, obergericht_be, appellationsgericht_bs"
  terminology: "Use German legal terms (Haftung, Schadenersatz)"
  citation_format: "BGE [Band] [Abteilung] [Seite] E. [Erwägung]"

french_search:
  courts: "bundesgericht, tribunal_cantonal_ge, tribunal_cantonal_vd, obergericht_be"
  terminology: "Use French legal terms (responsabilité, dommages-intérêts)"
  citation_format: "ATF [volume] [section] [page] consid. [considérant]"

italian_search:
  courts: "bundesgericht, tribunale_appello_ti"
  terminology: "Use Italian legal terms (responsabilità, risarcimento)"
  citation_format: "DTF [volume] [sezione] [pagina] consid. [considerando]"

cross_language_synthesis:
  approach: "Search all language versions, synthesize in primary language"
  note: "Same BGE available in DE/FR/IT with identical content, different citation"
  verification: "Cross-check all language versions for consistency"
```

---

## Data Access Patterns

### Rate Limiting and Caching

```yaml
rate_limits:
  bundesgericht_api:
    requests_per_minute: 60
    requests_per_hour: 3600
    concurrent_requests: 5

  cantonal_scrapers:
    requests_per_minute: 30
    requests_per_hour: 1800
    concurrent_requests: 3
    respect_robots_txt: true

caching_strategy:
  bge_decisions:
    cache_duration: "90 days (BGE are stable)"
    cache_key: "citation + language"

  cantonal_decisions:
    cache_duration: "30 days (may be updated)"
    cache_key: "citation + timestamp"

  search_results:
    cache_duration: "7 days"
    cache_key: "query_hash + filters"

  success_rate_analysis:
    cache_duration: "30 days (recalculate monthly)"
    cache_key: "claim_type + date_range + courts"

cache_invalidation:
  trigger_1: "New BGE published (monthly check)"
  trigger_2: "User reports outdated information"
  trigger_3: "Manual invalidation command"
```

### Error Handling

```yaml
network_errors:
  timeout:
    retry: true
    max_retries: 3
    exponential_backoff: true

  connection_failed:
    fallback: "Use cached data if available"
    notify: "User about potential staleness"

  rate_limit_exceeded:
    action: "Queue request, retry after cooldown"
    notify: "User about delay"

data_errors:
  citation_not_found:
    verify: "Check citation format"
    suggest: "Alternative citations or similar cases"

  incomplete_data:
    action: "Return available data with warning"
    note: "Specific missing fields"

  parsing_error:
    fallback: "Return raw text if structured parsing fails"
    log: "Error for debugging"

validation_errors:
  invalid_citation_format:
    response: "Error with format guidance"
    example: "Correct format: 'BGE 145 III 229' not 'BGE 145/III/229'"

  invalid_court_code:
    response: "Error with list of valid court codes"

  invalid_date_range:
    response: "Error with date format requirements"
```

---

## Performance Optimization

### Search Optimization

```yaml
indexing:
  fulltext_index: "All decision text for fast keyword search"
  metadata_index: "Court, date, legal area for filtering"
  citation_index: "Fast lookup by citation"

search_strategies:
  simple_query:
    method: "Direct keyword search in indexed fields"
    performance: "< 200ms for most queries"

  complex_query:
    method: "Multi-stage search with ranking algorithm"
    performance: "< 1000ms for complex filters"

  similar_cases:
    method: "Vector similarity search on case embeddings"
    performance: "< 2000ms for similarity analysis"

result_ranking:
  relevance_factors:
    - keyword_match_score: 0.4
    - court_hierarchy: 0.2  # BGE > cantonal
    - recency: 0.2
    - citation_count: 0.1   # How often cited by other cases
    - legal_area_match: 0.1
```

### Parallel Processing

```yaml
multi_court_search:
  strategy: "Search all courts in parallel"
  concurrency: 5
  aggregation: "Merge results with unified ranking"

cross_language_search:
  strategy: "Search DE/FR/IT versions in parallel"
  deduplication: "Same decision in multiple languages = single result"
  presentation: "Show all language versions available"

batch_citation_lookup:
  strategy: "Lookup multiple citations in parallel"
  max_batch_size: 20
  timeout_per_citation: 5000ms
```

---

## Quality Assurance

### Data Validation

```yaml
citation_accuracy:
  verification: "Cross-check against bundesgericht.ch official database"
  threshold: ">99.5% accuracy"
  method: "Automated verification via legal-citations MCP"

content_integrity:
  check_1: "Complete Erwägungen/Considérants text extracted"
  check_2: "All legal provisions cited are captured"
  check_3: "PDF matches structured data"
  check_4: "Cross-language versions consistent"

metadata_completeness:
  required_fields: ["citation", "court", "date", "summary"]
  optional_fields: ["judges", "parties", "chamber"]
  completeness_target: ">95% for required fields"
```

### User Feedback Loop

```yaml
accuracy_reporting:
  mechanism: "Users can report citation errors or outdated data"
  response: "Verify and update within 24 hours"
  tracking: "Maintain error rate metrics"

relevance_feedback:
  mechanism: "Users can rate search result relevance"
  usage: "Improve ranking algorithms"
  target: ">85% user satisfaction with search relevance"

feature_requests:
  collection: "Track requests for additional courts or features"
  prioritization: "Quarterly review and roadmap updates"
```

---

## Implementation Notes

### Phase 2 Development Tasks

```yaml
infrastructure:
  task_1: "Set up MCP server framework (TypeScript/Node.js)"
  task_2: "Implement bundesgericht.ch API integration"
  task_3: "Build cantonal court scrapers (6 cantons)"
  task_4: "Set up PostgreSQL database for decisions and cache"
  task_5: "Implement Redis cache layer"

core_functionality:
  task_6: "Implement search_decisions tool with filtering"
  task_7: "Implement get_decision_by_citation tool"
  task_8: "Implement analyze_precedent_success_rate tool"
  task_9: "Implement find_similar_cases tool"
  task_10: "Implement get_legal_provision_interpretation tool"

quality_assurance:
  task_11: "Build citation verification system"
  task_12: "Implement data validation pipelines"
  task_13: "Set up monitoring and alerting"
  task_14: "Create test suite with sample BGE"

integration:
  task_15: "Integrate with legal-citations MCP for verification"
  task_16: "Integrate with multi-lingual-glossary MCP"
  task_17: "Test with all three personas (Researcher, Strategist, Drafter)"
  task_18: "Performance testing and optimization"
```

### Technical Stack Recommendations

```yaml
backend:
  runtime: "Node.js 20+ with TypeScript"
  framework: "Express.js for MCP server protocol"
  database: "PostgreSQL 15+ for decision storage"
  cache: "Redis 7+ for fast lookups"
  search: "Elasticsearch 8+ for fulltext search (optional, high performance)"

scraping:
  library: "Playwright for JavaScript-heavy sites"
  parser: "Cheerio for HTML parsing"
  pdf: "pdf-parse for PDF extraction"

api_integration:
  http_client: "axios with retry logic"
  rate_limiting: "bottleneck.js"
  concurrency: "p-limit for controlled parallelism"

data_processing:
  text_processing: "natural for NLP tasks"
  similarity: "sentence-transformers (Python bridge) for case similarity"
  multilingual: "language-detection library"
```

---

## Testing Strategy

### Unit Tests

```yaml
tool_tests:
  search_decisions:
    - test_simple_keyword_search
    - test_multi_filter_search
    - test_date_range_filtering
    - test_court_specific_search
    - test_language_filtering
    - test_result_ranking

  get_decision_by_citation:
    - test_bge_lookup_de
    - test_bge_lookup_fr
    - test_bge_lookup_it
    - test_cantonal_lookup_zh
    - test_invalid_citation_error
    - test_cross_language_linking

validation_tests:
  - test_citation_format_validation
  - test_date_range_validation
  - test_court_code_validation
  - test_legal_area_code_validation
```

### Integration Tests

```yaml
persona_integration:
  - test_legal_researcher_workflow
  - test_case_strategist_success_rate
  - test_legal_drafter_provision_lookup

mcp_integration:
  - test_legal_citations_verification
  - test_multi_lingual_glossary_lookup
  - test_cross_mcp_coordination

end_to_end:
  - test_full_research_workflow
  - test_multi_language_search
  - test_canton_specific_research
```

### Performance Tests

```yaml
load_tests:
  - test_concurrent_searches: 100
  - test_large_result_sets: 500+
  - test_cache_performance
  - test_database_query_performance

stress_tests:
  - test_rate_limit_handling
  - test_error_recovery
  - test_failover_scenarios
```

---

## Monitoring and Maintenance

### Metrics

```yaml
performance_metrics:
  - search_latency_p50
  - search_latency_p95
  - search_latency_p99
  - cache_hit_rate
  - database_query_time

quality_metrics:
  - citation_accuracy_rate
  - data_completeness_percentage
  - user_reported_errors
  - search_result_relevance_score

operational_metrics:
  - requests_per_minute
  - error_rate
  - scraper_success_rate
  - database_size_growth
```

### Maintenance Tasks

```yaml
daily:
  - monitor_error_logs
  - check_scraper_health
  - verify_api_connectivity

weekly:
  - check_new_bge_publications
  - update_cantonal_decisions
  - review_cache_effectiveness

monthly:
  - recalculate_success_rate_statistics
  - update_legal_provision_interpretations
  - review_and_optimize_search_relevance

quarterly:
  - comprehensive_data_quality_audit
  - performance_optimization_review
  - feature_roadmap_update
```

---

## Version History

**v1.0.0** - 2025-11-12
- Initial specification for entscheidsuche MCP server
- 5 core tools defined
- Integration with all personas specified
- Multi-lingual support architecture
- Quality assurance framework
- Implementation roadmap

---

*Entscheidsuche MCP Server - Swiss Court Decision Search and Analysis*
*Part of BetterCallClaude Legal Intelligence Framework v1.0.0*
