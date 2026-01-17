# /legal Routing Configuration

**Internal configuration for the `/legal` intelligent proxy's intent detection and agent routing system.**

---

## Intent Detection Matrix

### Primary Intent Categories

```yaml
intents:
  # ========================================
  # RESEARCH INTENTS
  # ========================================
  research_general:
    patterns:
      - "find.*precedent"
      - "search.*BGE|ATF|DTF"
      - "research.*case law"
      - "jurisprudence.*on"
      - "what.*decisions.*on"
      - "look up.*Art\\.?\\s*\\d+"
    route: researcher
    confidence_boost: 0.2

  research_citation:
    patterns:
      - "verify.*citation"
      - "check.*BGE.*format"
      - "validate.*reference"
      - "citation.*correct"
    route: citation
    confidence_boost: 0.3

  # ========================================
  # STRATEGY INTENTS
  # ========================================
  strategy_analysis:
    patterns:
      - "analyze.*case"
      - "assess.*risk"
      - "evaluate.*chances"
      - "strategy.*for"
      - "recommend.*approach"
      - "litigation.*options"
    route: strategist
    confidence_boost: 0.2

  strategy_risk:
    patterns:
      - "probability.*success"
      - "calculate.*risk"
      - "settlement.*range"
      - "damages.*estimate"
      - "Monte Carlo"
      - "quantify.*risk"
    route: risk
    confidence_boost: 0.3

  # ========================================
  # DRAFTING INTENTS
  # ========================================
  draft_court:
    patterns:
      - "draft.*Klageschrift|complaint"
      - "prepare.*Berufung|appeal"
      - "write.*Klageantwort|response"
      - "create.*submission"
    route: drafter
    document_type: court_submission
    confidence_boost: 0.3

  draft_opinion:
    patterns:
      - "draft.*Rechtsgutachten|opinion"
      - "prepare.*memorandum"
      - "write.*legal analysis"
      - "create.*Gutachten"
    route: drafter
    document_type: legal_opinion
    confidence_boost: 0.3

  draft_contract:
    patterns:
      - "draft.*contract|Vertrag"
      - "prepare.*agreement"
      - "write.*Kaufvertrag|Mietvertrag"
      - "create.*NDA|SPA|SHA"
    route: drafter
    document_type: contract
    confidence_boost: 0.3

  # ========================================
  # COMPLIANCE INTENTS
  # ========================================
  compliance_finma:
    patterns:
      - "FINMA.*requirement"
      - "banking.*regulation"
      - "securities.*law"
      - "financial.*market"
      - "BEHG|FIDLEG|FINIG"
    route: compliance
    domain: finma
    confidence_boost: 0.3

  compliance_aml:
    patterns:
      - "AML|anti-money"
      - "KYC|know your customer"
      - "GwG|Geldwäscherei"
      - "beneficial owner"
      - "suspicious.*transaction"
    route: compliance
    domain: aml
    confidence_boost: 0.3

  # ========================================
  # PRIVACY INTENTS
  # ========================================
  privacy_gdpr:
    patterns:
      - "GDPR|DSGVO"
      - "data.*transfer"
      - "EU.*privacy"
      - "standard.*clauses"
    route: data-protection
    domain: gdpr
    confidence_boost: 0.3

  privacy_swiss:
    patterns:
      - "DSG|nDSG|FADP"
      - "Swiss.*privacy"
      - "EDÖB|FDPIC"
      - "data protection"
      - "DPIA|Folgenabschätzung"
    route: data-protection
    domain: swiss
    confidence_boost: 0.3

  # ========================================
  # PROCEDURAL INTENTS
  # ========================================
  procedure_civil:
    patterns:
      - "ZPO.*deadline"
      - "civil.*procedure"
      - "filing.*deadline"
      - "Klagefrist"
      - "Rechtsmittel.*Frist"
    route: procedure
    domain: civil
    confidence_boost: 0.3

  procedure_criminal:
    patterns:
      - "StPO.*deadline"
      - "criminal.*procedure"
      - "Beschwerdefrist"
      - "Einsprache"
    route: procedure
    domain: criminal
    confidence_boost: 0.3

  procedure_limitation:
    patterns:
      - "limitation.*period"
      - "Verjährung"
      - "prescription"
      - "statute.*limitation"
    route: procedure
    domain: limitation
    confidence_boost: 0.3

  # ========================================
  # FISCAL INTENTS
  # ========================================
  fiscal_general:
    patterns:
      - "tax.*implication"
      - "Steuer|impôt|imposta"
      - "DTA|double taxation"
      - "withholding.*tax"
    route: fiscal
    confidence_boost: 0.2

  fiscal_transfer:
    patterns:
      - "transfer pricing"
      - "BEPS"
      - "intercompany"
      - "arm's length"
    route: fiscal
    domain: transfer_pricing
    confidence_boost: 0.3

  # ========================================
  # CORPORATE INTENTS
  # ========================================
  corporate_formation:
    patterns:
      - "incorporate|Gründung"
      - "create.*AG|GmbH"
      - "register.*company"
      - "formation.*company"
    route: corporate
    domain: formation
    confidence_boost: 0.3

  corporate_ma:
    patterns:
      - "M&A|merger|acquisition"
      - "Fusion|Spaltung"
      - "share purchase"
      - "asset deal"
      - "due diligence"
    route: corporate
    domain: ma
    confidence_boost: 0.3

  corporate_governance:
    patterns:
      - "board.*resolution"
      - "shareholder.*meeting"
      - "Verwaltungsrat"
      - "corporate.*governance"
      - "fiduciary.*duty"
    route: corporate
    domain: governance
    confidence_boost: 0.3

  # ========================================
  # CANTONAL INTENTS
  # ========================================
  cantonal_specific:
    patterns:
      - "canton.*ZH|BE|GE|VD|TI|BS"
      - "Kanton.*Zürich|Bern|Genf"
      - "cantonal.*court"
      - "Bezirksgericht|Tribunal"
    route: cantonal
    confidence_boost: 0.3

  cantonal_comparison:
    patterns:
      - "compare.*cantons"
      - "which.*canton"
      - "inter-cantonal"
      - "forum.*shopping"
    route: cantonal
    domain: comparison
    confidence_boost: 0.3

  # ========================================
  # REAL ESTATE INTENTS
  # ========================================
  realestate_transaction:
    patterns:
      - "property.*purchase|sale"
      - "real estate.*transaction"
      - "Immobilien.*Kauf|Verkauf"
      - "Grundstück"
    route: realestate
    domain: transaction
    confidence_boost: 0.3

  realestate_register:
    patterns:
      - "Grundbuch|land register"
      - "easement|Dienstbarkeit"
      - "mortgage|Hypothek"
      - "Baurecht"
    route: realestate
    domain: register
    confidence_boost: 0.3

  realestate_lex_koller:
    patterns:
      - "Lex Koller|BGBB"
      - "foreign.*owner"
      - "Ausländer.*Grundstück"
      - "non-resident.*property"
    route: realestate
    domain: lex_koller
    confidence_boost: 0.4

  # ========================================
  # TRANSLATION INTENTS
  # ========================================
  translation_legal:
    patterns:
      - "translate.*legal"
      - "übersetzen|traduire"
      - "German.*French.*Italian"
      - "terminology.*Swiss"
    route: translator
    confidence_boost: 0.4

  # ========================================
  # PIPELINE INTENTS
  # ========================================
  pipeline_full:
    patterns:
      - "complete.*analysis"
      - "full.*workflow"
      - "end-to-end"
      - "research.*strategy.*draft"
      - "comprehensive.*review"
    route: orchestrator
    pipeline: full_pipeline
    confidence_boost: 0.4

  pipeline_research_strategy:
    patterns:
      - "research.*then.*strategy"
      - "analyze.*and.*recommend"
      - "find.*precedents.*assess"
    route: orchestrator
    pipeline: research_to_strategy
    confidence_boost: 0.3
```

---

## Agent Routing Rules

### Direct Agent Routing (@agent syntax)

```yaml
direct_routes:
  "@researcher":
    agent: researcher
    bypass_intent: true

  "@strategist":
    agent: strategist
    bypass_intent: true

  "@drafter":
    agent: drafter
    bypass_intent: true

  "@orchestrator":
    agent: orchestrator
    bypass_intent: true

  "@citation":
    agent: citation
    bypass_intent: true

  "@compliance":
    agent: compliance
    bypass_intent: true

  "@data-protection":
    agent: data-protection
    bypass_intent: true

  "@risk":
    agent: risk
    bypass_intent: true

  "@procedure":
    agent: procedure
    bypass_intent: true

  "@translator":
    agent: translator
    bypass_intent: true

  "@fiscal":
    agent: fiscal
    bypass_intent: true

  "@corporate":
    agent: corporate
    bypass_intent: true

  "@cantonal":
    agent: cantonal
    bypass_intent: true

  "@realestate":
    agent: realestate
    bypass_intent: true
```

### Workflow Routing (--workflow syntax)

```yaml
workflow_routes:
  "--workflow full":
    pipeline: full_pipeline
    agents: [researcher, strategist, drafter]
    checkpoints: [strategy_review, draft_review]

  "--workflow research":
    pipeline: research_only
    agents: [researcher]
    checkpoints: []

  "--workflow research,strategy":
    pipeline: research_to_strategy
    agents: [researcher, strategist]
    checkpoints: [strategy_review]

  "--workflow strategy,draft":
    pipeline: strategy_to_draft
    agents: [strategist, drafter]
    checkpoints: [draft_review]

  "--pipeline full_pipeline":
    alias: "--workflow full"

  "--pipeline research_to_strategy":
    alias: "--workflow research,strategy"

  "--pipeline research_to_draft":
    pipeline: research_to_draft
    agents: [researcher, drafter]
    checkpoints: [draft_review]
```

---

## Complexity Scoring Algorithm

```yaml
complexity_factors:
  # Intent complexity
  single_intent:
    weight: 1

  multiple_intents:
    weight: 2
    triggers: ["and", "also", "additionally", "then"]

  # Jurisdiction complexity
  federal_only:
    weight: 1

  single_canton:
    weight: 1.5

  multi_canton:
    weight: 2.5
    triggers: ["compare", "vs", "versus", "or"]

  # Language complexity
  single_language:
    weight: 1

  multi_language:
    weight: 2
    triggers: ["translate", "both languages", "German and French"]

  # Output complexity
  research_only:
    weight: 1

  analysis_required:
    weight: 2

  document_output:
    weight: 3
    triggers: ["draft", "prepare", "write", "create"]

scoring:
  simple: "score <= 3"
  moderate: "3 < score <= 6"
  complex: "score > 6"

routing_by_complexity:
  simple: "direct_agent"
  moderate: "coordinated_agents"
  complex: "full_pipeline"
```

---

## Language Detection

```yaml
language_patterns:
  de:
    indicators:
      - "\\b(und|oder|für|mit|der|die|das)\\b"
      - "\\b(Vertrag|Klage|Recht|Gericht)\\b"
      - "\\b(Art\\.|OR|ZGB|StGB|ZPO)\\b"
    confidence: 0.9

  fr:
    indicators:
      - "\\b(et|ou|pour|avec|le|la|les)\\b"
      - "\\b(contrat|plainte|droit|tribunal)\\b"
      - "\\b(art\\.|CO|CC|CP|CPC)\\b"
    confidence: 0.9

  it:
    indicators:
      - "\\b(e|o|per|con|il|la|le)\\b"
      - "\\b(contratto|azione|diritto|tribunale)\\b"
      - "\\b(art\\.|CO|CC|CP|CPC)\\b"
    confidence: 0.9

  en:
    indicators:
      - "\\b(and|or|for|with|the|a|an)\\b"
      - "\\b(contract|claim|law|court)\\b"
    confidence: 0.7  # Lower because English is fallback

default_language: de
```

---

## Jurisdiction Detection

```yaml
jurisdiction_patterns:
  federal:
    indicators:
      - "BGE|ATF|DTF"
      - "Bundesgericht|Tribunal fédéral"
      - "\\bOR\\b|\\bZGB\\b|\\bStGB\\b"
      - "federal"
    priority: 1

  cantonal:
    ZH:
      indicators: ["Zürich", "ZH", "Handelsgericht Zürich"]
    BE:
      indicators: ["Bern", "BE", "Obergericht Bern"]
    GE:
      indicators: ["Genève", "GE", "Geneva", "Genf"]
    VD:
      indicators: ["Vaud", "VD", "Lausanne"]
    TI:
      indicators: ["Ticino", "TI", "Lugano", "Bellinzona"]
    BS:
      indicators: ["Basel-Stadt", "BS", "Basel"]
    ZG:
      indicators: ["Zug", "ZG"]
    LU:
      indicators: ["Luzern", "LU", "Lucerne"]
    SG:
      indicators: ["St. Gallen", "SG", "St.Gallen"]
    AG:
      indicators: ["Aargau", "AG", "Aarau"]
    # ... all 26 cantons

default_jurisdiction: federal
```

---

## Multi-Agent Coordination

### Agent Combinations

```yaml
agent_combinations:
  research_compliance:
    agents: [researcher, compliance]
    coordination: parallel
    merge_strategy: combined_report

  risk_cantonal:
    agents: [risk, cantonal]
    coordination: parallel
    merge_strategy: comparative_analysis

  corporate_fiscal:
    agents: [corporate, fiscal]
    coordination: sequential
    data_passing:
      corporate_output: fiscal_input

  realestate_lex_koller:
    agents: [realestate, compliance]
    coordination: sequential
    trigger: "foreign_buyer_detected"
```

### Pipeline Templates

```yaml
pipeline_templates:
  full_litigation:
    name: "Full Litigation Pipeline"
    steps:
      - agent: researcher
        task: "Legal research"
        output: research_findings
      - agent: strategist
        task: "Strategy development"
        input: research_findings
        output: strategy_recommendation
        checkpoint: strategy_review
      - agent: drafter
        task: "Document drafting"
        input: strategy_recommendation
        output: legal_document
        checkpoint: draft_review

  compliance_review:
    name: "Compliance Review Pipeline"
    steps:
      - agent: compliance
        task: "Regulatory check"
        output: compliance_findings
      - agent: risk
        task: "Risk assessment"
        input: compliance_findings
        output: risk_report

  transaction_analysis:
    name: "Transaction Analysis Pipeline"
    steps:
      - agent: corporate
        task: "Corporate analysis"
        output: corporate_findings
      - agent: fiscal
        task: "Tax implications"
        input: corporate_findings
        output: fiscal_report
      - agent: drafter
        task: "Transaction documents"
        input: [corporate_findings, fiscal_report]
        output: transaction_docs
```

---

## Checkpoint Configuration

```yaml
checkpoints:
  strategy_review:
    trigger: "strategy_recommendation_complete"
    prompt: |
      **🔔 Strategy Checkpoint**

      The StrategistAgent recommends: {strategy_type}

      Key factors:
      - Success probability: {probability}%
      - Estimated costs: CHF {cost_range}
      - Timeline: {timeline}

      Options:
      1. ✅ Approve - Continue to next step
      2. ✏️ Modify - Adjust parameters
      3. ❌ Stop - Review details first
    timeout: 300  # seconds
    default_action: pause

  draft_review:
    trigger: "document_length > 3000 or document_type == court_submission"
    prompt: |
      **📄 Document Review Checkpoint**

      Document type: {document_type}
      Word count: {word_count}
      Citations: {citation_count}

      Options:
      1. ✅ Finalize - Accept draft
      2. ✏️ Revise - Request changes
      3. 🔍 Preview - Show full document
    timeout: 600
    default_action: pause

  risk_alert:
    trigger: "risk_level == HIGH or success_probability < 0.4"
    prompt: |
      **⚠️ High Risk Alert**

      Risk level: {risk_level}
      Concern: {risk_description}

      This requires explicit acknowledgment to proceed.
    timeout: 300
    default_action: require_acknowledgment
```

---

## Error Handling Routes

```yaml
error_handling:
  intent_unclear:
    threshold: "confidence < 0.5"
    action: clarification_request
    template: |
      **❓ I couldn't determine what you need**

      Your request: "{original_query}"

      Please try:
      1. Natural language: "I need to research..."
      2. Direct agent: "/legal @researcher [query]"
      3. Explicit workflow: "/legal --workflow full [query]"

  agent_failure:
    action: offer_alternatives
    template: |
      **⚠️ Agent Error**

      The @{agent_name} agent encountered an issue:
      - Error: {error_message}
      - Partial results: {partial_results}

      Options:
      1. 🔄 Retry
      2. 🔀 Alternative approach
      3. ❌ Cancel

  timeout:
    threshold: 180  # seconds per agent
    action: graceful_degradation
    fallback: return_partial_results
```

---

## Optimization Settings

```yaml
optimization:
  caching:
    enabled: true
    ttl: 3600  # 1 hour
    cache_keys:
      - intent_classification
      - jurisdiction_detection
      - language_detection

  parallel_execution:
    enabled: true
    max_parallel_agents: 3

  token_management:
    budget_warnings:
      - threshold: 75%
        action: notify
      - threshold: 90%
        action: compress_output

  performance_targets:
    simple_query: 10  # seconds
    single_agent: 30
    multi_agent: 90
    full_pipeline: 180
```

---

**This configuration drives the `/legal` proxy's intelligent routing behavior.**
