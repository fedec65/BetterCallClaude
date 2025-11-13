# MODE_Multi_Lingual.md - Multi-Lingual Legal Framework

**Framework Version**: v1.0.0
**Mode Type**: Cross-Cutting (Always Active)
**Languages Supported**: German (DE), French (FR), Italian (IT), English (EN)

---

## Purpose

Provide native multi-lingual legal reasoning across Switzerland's four official languages, ensuring:
- Authentic legal terminology (not machine translation)
- Consistent citation formatting by language
- Language-specific legal interpretation
- Multi-lingual document handling
- Bilingual canton support (specifically Bern)

**Core Principle**: Multi-lingual capability is NATIVE to Swiss law, not a translation layer. The Swiss Constitution and federal statutes are equally authentic in DE/FR/IT.

---

## Activation Triggers

### Automatic Activation
- Query contains non-English legal terms
- Document language detection (French contract, German Gutachten, Italian court decision)
- Canton requires specific language (GE→FR, TI→IT, BE→DE/FR)
- Citation in non-English format detected
- Federal statute reference (ZGB/CCS/CC, OR/CO, StGB/CP/CPen)

### Explicit Activation
- User specifies target language: "analyze in French", "draft in German"
- User requests translation: "translate this contract from DE to FR"
- Multi-lingual consistency check requested
- Cross-language comparison needed

### Always Active
This mode operates continuously as a background layer for all personas and other modes, automatically handling language requirements.

---

## Constitutional Framework

### Art. 4 BV - Federal Languages (Landessprachen / Langues nationales / Lingue nazionali)

**German**: Die Landessprachen sind Deutsch, Französisch, Italienisch und Rätoromanisch.

**French**: Les langues nationales sont l'allemand, le français, l'italien et le romanche.

**Italian**: Le lingue nazionali sono il tedesco, il francese, l'italiano e il romancio.

**English**: The national languages are German, French, Italian, and Romansh.

### Art. 70 BV - Official Languages (Amtssprachen / Langues officielles / Lingue ufficiali)

Federal statutes are published in DE, FR, and IT as **equally authentic** (gleichlautend / équivalentes / equivalenti) versions. In case of divergence between language versions, courts must interpret considering all three.

---

## Language Distribution in Switzerland

### Canton Language Profile

| Canton | Primary | Secondary | Multi-Lingual |
|--------|---------|-----------|---------------|
| ZH | DE | - | No |
| BE | DE | FR | **Yes** (Bilingual) |
| GE | FR | - | No |
| BS | DE | - | No |
| VD | FR | - | No |
| TI | IT | - | No |

### Legal Practice Languages

**German (DE)**: ~65% of population
- Cantons: ZH, BE (majority), BS, AG, LU, SG, etc.
- Dominant in commercial law, corporate transactions
- Primary BGE publication language

**French (FR)**: ~25% of population
- Cantons: GE, VD, BE (minority), NE, JU, FR, VS
- Strong in international arbitration (Geneva)
- Secondary BGE publication language

**Italian (IT)**: ~8% of population
- Canton: TI (only fully Italian canton)
- Cross-border practice with Italy
- All BGE decisions available in IT

**English (EN)**: Not official, but widely used
- International contracts
- Cross-border transactions
- Arbitration proceedings
- Not authentic for Swiss statutes

---

## Language Detection Logic

### Step 1: Query Language Analysis

```yaml
detection_priority:
  1. Explicit language indicators:
    - Language codes: "DE:", "FR:", "IT:", "EN:"
    - Language names: "auf Deutsch", "en français", "in italiano"

  2. Legal terminology pattern matching:
    de_indicators: ["Haftung", "Vertrag", "Gutachten", "Sachverhalt", "Anspruch"]
    fr_indicators: ["responsabilité", "contrat", "préavis", "faits", "prétention"]
    it_indicators: ["responsabilità", "contratto", "preavviso", "fatti", "pretesa"]
    en_indicators: ["liability", "contract", "notice", "facts", "claim"]

  3. Citation format analysis:
    - "Art. X Abs. Y" → German
    - "art. X al. Y" → French
    - "art. X cpv. Y" → Italian
    - "Article X paragraph Y" → English

  4. Document metadata:
    - File name language codes (_de.pdf, _fr.docx)
    - PDF metadata language tags
    - Court jurisdiction (Obergericht ZH → DE, Tribunal cantonal GE → FR)

confidence_levels:
  high: ≥ 90% (proceed automatically)
  medium: 70-89% (confirm with user)
  low: < 70% (ask user explicitly)
```

### Step 2: Multi-Document Language Handling

```yaml
scenario_single_language:
  all_documents: "same_language"
  action: "Use detected language for entire analysis"
  example: "3 German contracts → full German analysis"

scenario_mixed_language:
  documents: ["contract_de.pdf", "court_decision_fr.pdf"]
  action: "Maintain each document in original language"
  synthesis: "Primary language for synthesis (user preference or majority)"
  cross_reference: "Note language switches explicitly"

scenario_bilingual_canton:
  canton: "BE"
  action: "Support both DE and FR equally"
  synthesis: "Use language of primary document"
  translation: "Provide key terms in both languages"
```

### Step 3: Output Language Selection

```yaml
default_rules:
  single_input_language: "Match input language"
  mixed_input: "Use primary language (explicit > majority > German default)"
  user_override: "Always honor explicit user language request"

special_cases:
  legal_research: "Provide results in language of precedents (BGE language)"
  contract_drafting: "Use parties' agreed language or bilingual"
  court_documents: "Use court's official language (canton-specific)"
  international: "English for cross-border transactions"
```

---

## Multi-Lingual Terminology Database

### Core Legal Concepts

#### 1. Contract Law (Vertragsrecht / Droit des contrats / Diritto dei contratti)

| DE | FR | IT | EN | Notes |
|----|----|----|----|----|
| Vertrag | contrat | contratto | contract | Art. 1 OR/CO |
| Angebot | offre | offerta | offer | Art. 3 OR |
| Annahme | acceptation | accettazione | acceptance | Art. 4 OR |
| Willensmängel | vices du consentement | vizi del consenso | defects of consent | Art. 23-31 OR |
| Irrtum | erreur | errore | error/mistake | Art. 24 OR |
| absichtliche Täuschung | dol | dolo | fraud | Art. 28 OR |
| Nichtigkeit | nullité | nullità | nullity | Art. 20 OR |
| Anfechtbarkeit | annulabilité | annullabilità | voidability | Art. 31 OR |

#### 2. Obligations and Performance (Erfüllung / Exécution / Adempimento)

| DE | FR | IT | EN | Notes |
|----|----|----|----|----|
| Erfüllung | exécution | adempimento | performance | Art. 68 OR |
| Nichterfüllung | inexécution | inadempimento | non-performance | Art. 97 OR |
| Verzug | demeure | mora | delay/default | Art. 102-109 OR |
| Unmöglichkeit | impossibilité | impossibilità | impossibility | Art. 119 OR |
| Schadenersatz | dommages-intérêts | risarcimento del danno | damages | Art. 97 OR |
| Vertragsstrafe | peine conventionnelle | pena convenzionale | contractual penalty | Art. 160-163 OR |

#### 3. Liability (Haftung / Responsabilité / Responsabilità)

| DE | FR | IT | EN | Notes |
|----|----|----|----|----|
| Haftung | responsabilité | responsabilità | liability | General concept |
| Verschulden | faute | colpa | fault | Art. 41 OR |
| Kausalität | causalité | causalità | causation | BGE requirement |
| Schaden | dommage | danno | damage | Art. 41 OR |
| Verschuldenshaftung | responsabilité pour faute | responsabilità per colpa | fault-based liability | Art. 41 OR |
| Kausalhaftung | responsabilité causale | responsabilità causale | strict liability | Art. 58 OR |
| Solidarhaftung | solidarité | solidarietà | joint and several liability | Art. 143-150 OR |

#### 4. Procedural Law (Verfahrensrecht / Droit de procédure / Diritto procedurale)

| DE | FR | IT | EN | Notes |
|----|----|----|----|----|
| Klage | action | azione | lawsuit/claim | Art. 219 ZPO |
| Kläger | demandeur | attore | plaintiff | |
| Beklagter | défendeur | convenuto | defendant | |
| Rechtsbegehren | conclusions | conclusioni | relief sought | Art. 219 ZPO |
| Sachverhalt | faits | fatti | facts | |
| Beweismittel | moyens de preuve | mezzi di prova | evidence | Art. 168 ZPO |
| Urteil | jugement | sentenza | judgment | Art. 238 ZPO |
| Rechtsmittel | voie de recours | rimedio giuridico | legal remedy | |

#### 5. Evidence and Proof (Beweis / Preuve / Prova)

| DE | FR | IT | EN | Notes |
|----|----|----|----|----|
| Beweislast | fardeau de la preuve | onere della prova | burden of proof | Art. 8 ZGB |
| Beweiswürdigung | appréciation des preuves | apprezzamento delle prove | evaluation of evidence | Art. 157 ZPO |
| Zeuge | témoin | testimone | witness | Art. 168 ZPO |
| Urkunde | document | documento | document | Art. 177 ZPO |
| Parteiaussage | interrogatoire des parties | interrogatorio delle parti | party testimony | Art. 187 ZPO |

### Non-Translatable Concepts

Certain Swiss legal concepts do not have direct equivalents in other languages and must be explained:

#### German Concepts

**Gutachtenstil** (Legal reasoning style)
- FR: "style d'analyse juridique" (approximation)
- IT: "stile di analisi giuridica" (approximation)
- EN: "legal opinion style" (approximation)
- **Definition**: Systematic legal analysis structure: Obersatz (rule) → Untersatz (application) → Schluss (conclusion)

**Geschäftsherrenhaftung** (Principal's liability - Art. 55 OR)
- FR: "responsabilité du commettant"
- IT: "responsabilità del datore di lavoro"
- EN: "vicarious liability"
- **Note**: Swiss concept broader than common law vicarious liability

#### French Concepts

**Faute grave** (Serious fault)
- DE: "grobes Verschulden"
- IT: "colpa grave"
- EN: "gross negligence"
- **Note**: Higher threshold than simple "faute" but specific Swiss interpretation

#### Italian Concepts

**Buona fede** (Good faith - Art. 2 ZGB)
- DE: "Treu und Glauben"
- FR: "bonne foi"
- EN: "good faith"
- **Note**: Fundamental principle with specific Swiss application in Art. 2 ZGB

---

## Citation Format Adaptation

### Federal Statutes

#### ZGB / CCS / CC (Civil Code)

| Language | Full Name | Abbreviation | Citation Format | Example |
|----------|-----------|--------------|-----------------|---------|
| DE | Schweizerisches Zivilgesetzbuch | ZGB | Art. X Abs. Y ZGB | Art. 8 Abs. 1 ZGB |
| FR | Code civil suisse | CCS | art. X al. Y CCS | art. 8 al. 1 CCS |
| IT | Codice civile svizzero | CC | art. X cpv. Y CC | art. 8 cpv. 1 CC |
| EN | Swiss Civil Code | SCC | Article X paragraph Y SCC | Article 8 paragraph 1 SCC |

#### OR / CO (Code of Obligations)

| Language | Full Name | Abbreviation | Citation Format | Example |
|----------|-----------|--------------|-----------------|---------|
| DE | Obligationenrecht | OR | Art. X Abs. Y OR | Art. 97 Abs. 1 OR |
| FR | Code des obligations | CO | art. X al. Y CO | art. 97 al. 1 CO |
| IT | Codice delle obbligazioni | CO | art. X cpv. Y CO | art. 97 cpv. 1 CO |
| EN | Code of Obligations | CO | Article X paragraph Y CO | Article 97 paragraph 1 CO |

#### StGB / CP / CPen (Criminal Code)

| Language | Full Name | Abbreviation | Citation Format | Example |
|----------|-----------|--------------|-----------------|---------|
| DE | Schweizerisches Strafgesetzbuch | StGB | Art. X Abs. Y StGB | Art. 111 StGB |
| FR | Code pénal suisse | CP | art. X al. Y CP | art. 111 CP |
| IT | Codice penale svizzero | CP | art. X cpv. Y CP | art. 111 CP |
| EN | Swiss Criminal Code | SCC | Article X paragraph Y SCC | Article 111 SCC |

#### BV / Cst. / Cost. (Federal Constitution)

| Language | Full Name | Abbreviation | Citation Format | Example |
|----------|-----------|--------------|-----------------|---------|
| DE | Bundesverfassung | BV | Art. X Abs. Y BV | Art. 8 Abs. 1 BV |
| FR | Constitution fédérale | Cst. | art. X al. Y Cst. | art. 8 al. 1 Cst. |
| IT | Costituzione federale | Cost. | art. X cpv. Y Cost. | art. 8 cpv. 1 Cost. |
| EN | Federal Constitution | FC | Article X paragraph Y FC | Article 8 paragraph 1 FC |

### Procedural Codes

#### ZPO / CPC (Civil Procedure Code)

| Language | Full Name | Abbreviation | Citation Format |
|----------|-----------|--------------|-----------------|
| DE | Schweizerische Zivilprozessordnung | ZPO | Art. X Abs. Y ZPO |
| FR | Code de procédure civile suisse | CPC | art. X al. Y CPC |
| IT | Codice di procedura civile svizzero | CPC | art. X cpv. Y CPC |
| EN | Swiss Civil Procedure Code | SCPC | Article X paragraph Y SCPC |

#### StPO / CPP (Criminal Procedure Code)

| Language | Full Name | Abbreviation | Citation Format |
|----------|-----------|--------------|-----------------|
| DE | Schweizerische Strafprozessordnung | StPO | Art. X Abs. Y StPO |
| FR | Code de procédure pénale suisse | CPP | art. X al. Y CPP |
| IT | Codice di procedura penale svizzero | CPP | art. X cpv. Y CPP |
| EN | Swiss Criminal Procedure Code | SCPP | Article X paragraph Y SCPP |

### BGE / ATF / DTF Citations

#### Standard Format

| Language | Name | Citation Format | Example |
|----------|------|-----------------|---------|
| DE | Bundesgerichtsentscheid | BGE [Band] [Abteilung] [Seite] E. [Erwägung] | BGE 145 III 229 E. 4.2 |
| FR | Arrêt du Tribunal fédéral | ATF [volume] [section] [page] consid. [considérant] | ATF 145 III 229 consid. 4.2 |
| IT | Decisione del Tribunale federale | DTF [volume] [sezione] [pagina] consid. [considerando] | DTF 145 III 229 consid. 4.2 |
| EN | Federal Supreme Court Decision | FSC [volume] [section] [page] consideration [number] | FSC 145 III 229 consideration 4.2 |

#### Section Codes (Same in all languages)

| Code | DE | FR | IT | EN |
|------|----|----|----|----|
| I | Verfassungsrecht | Droit constitutionnel | Diritto costituzionale | Constitutional law |
| Ia | Internationales & Grundrechte | Droit international & fondamental | Diritto internazionale & fondamentale | International & fundamental rights |
| II | Zivilrecht (ZGB) | Droit civil (CCS) | Diritto civile (CC) | Civil law |
| III | Schuld- und Sachenrecht | Droit des obligations & réel | Diritto delle obbligazioni & reale | Obligations & property law |
| IV | Sozialversicherungsrecht | Droit des assurances sociales | Diritto delle assicurazioni sociali | Social insurance law |
| V | Verwaltungsrecht | Droit administratif | Diritto amministrativo | Administrative law |
| VI | Strafrecht | Droit pénal | Diritto penale | Criminal law |

### Citation Terminology

| Element | DE | FR | IT | EN |
|---------|----|----|----|----|
| Article | Artikel → Art. | article → art. | articolo → art. | Article → Art. |
| Paragraph | Absatz → Abs. | alinéa → al. | capoverso → cpv. | paragraph → para. |
| Letter | Buchstabe → Bst. | lettre → let. | lettera → lett. | letter → lit. |
| Number | Ziffer → Ziff. | chiffre → ch. | numero → n. | number → no. |
| Consideration | Erwägung → E. | considérant → consid. | considerando → consid. | consideration → cons. |

---

## Multi-Lingual Analysis Workflows

### Workflow 1: Single Language Analysis

**Scenario**: German contract review

```yaml
Step 1: Language Detection
  detected_language: "de"
  confidence: 95%
  action: "Proceed in German"

Step 2: Terminology Consistency
  verify_terms:
    - "Haftung" used consistently
    - "Schadenersatz" vs "Entschädigung" (prefer OR terminology)
    - "Vertragsverletzung" vs "Nichterfüllung" (Art. 97 OR term)

Step 3: Citation Verification
  format_check:
    - "Art. X Abs. Y OR" ✓
    - NOT "Art. X al. Y OR" ✗ (French format in German text)

Step 4: Legal Framework
  primary_sources: [ZGB, OR, ZPO] in German
  bge_sources: BGE decisions (German versions)

Step 5: Output
  language: "de"
  maintain: "Full German throughout"
  citations: "Art. X Abs. Y format"
```

### Workflow 2: Multi-Language Document Set

**Scenario**: German contract + French court decision

```yaml
Step 1: Multi-Document Language Detection
  document_1: "contract_de.pdf" → German (95% confidence)
  document_2: "court_decision_fr.pdf" → French (98% confidence)

Step 2: Primary Language Selection
  user_preference: Not specified
  majority_language: German (if more documents)
  default: German (Swiss default)
  action: "Use German for synthesis, maintain French for court decision excerpts"

Step 3: Cross-Language Citation Handling
  german_contract_citations: "Art. 97 Abs. 1 OR"
  french_court_citations: "art. 97 al. 1 CO"
  synthesis_citations: "Art. 97 Abs. 1 OR (art. 97 al. 1 CO)"

Step 4: Terminology Consistency
  maintain_original:
    - German contract terms in German
    - French court decision terms in French
  synthesis_terms:
    - Primary: German
    - Parenthetical: French equivalents for key terms
    - Example: "Haftung (responsabilité)"

Step 5: Output Structure
  ## Contract Analysis (German)
  [Full German analysis of contract]

  ## Court Decision Analysis (French)
  [Analysis maintaining French terminology]

  ## Cross-Reference Synthesis (German with French notes)
  [Integrated analysis with language notes]
```

### Workflow 3: Bilingual Canton (Bern)

**Scenario**: Bern administrative law case

```yaml
Step 1: Canton Detection
  canton: "BE" (Bern)
  bilingual: true
  languages: ["de", "fr"]

Step 2: Language Determination
  priority_1: Court language (decision in DE or FR?)
  priority_2: Party preference
  priority_3: Majority documents
  default: German (but support French equally)

Step 3: Bilingual Handling
  terminology_approach:
    - Provide key terms in both languages
    - Example: "Baugesuch / permis de construire"
    - Use format: "DE term / FR term"

  citation_approach:
    cantonal_law: "Both DE and FR citations available"
    federal_law: "Primary language with note of equivalent"

Step 4: Output
  primary_language: "de" (assumed)
  bilingual_support:
    - Key terms: "Verwaltungsbeschwerde / recours administratif"
    - Cantonal citations: Both "Art. X BauG BE" and "art. X LConstr BE"
    - Federal citations: "Art. X Abs. Y OR (art. X al. Y CO)"

Step 5: Quality Check
  verify_bilingual_consistency:
    - Terms properly paired DE/FR
    - Citations available in both languages where required
    - No language preference bias
```

### Workflow 4: International Contract (English)

**Scenario**: Cross-border commercial contract governed by Swiss law

```yaml
Step 1: Language Detection
  contract_language: "en"
  governing_law: "Swiss law (Art. X OR)"
  parties: International

Step 2: Legal Framework Approach
  contract_terms: English (parties' language)
  legal_analysis: English with Swiss legal terms
  citations: English format with Swiss abbreviations

  approach:
    - "Article 97 paragraph 1 CO" (English format)
    - "liability (Haftung)" (Swiss legal concept in parentheses)
    - "BGE 145 III 229 consideration 4.2" (English format, Swiss structure)

Step 3: Swiss Legal Concepts
  maintain_swiss_terms:
    - "culpa in contrahendo" (Latin, universal)
    - "Verschuldenshaftung" → "fault-based liability (Verschuldenshaftung)"
    - "Solidarhaftung" → "joint and several liability (Solidarhaftung)"

Step 4: Output Structure
  primary_language: "en"
  legal_references: "English with Swiss parentheticals"
  precision: "Note Swiss legal concepts that differ from common law"

  example:
    "Under Article 97 paragraph 1 CO, the debtor who fails to perform
    is liable for damages (Schadenersatz). The Swiss concept of
    fault-based liability (Verschuldenshaftung) requires proof of..."

Step 5: Quality Check
  verify_accuracy:
    - Swiss legal concepts properly explained in English
    - No common law assumptions (e.g., "tort" vs "Art. 41 OR")
    - Citations properly formatted for international audience
    - Key Swiss terms preserved in parentheses
```

---

## Translation Handling

### When to Translate vs Maintain Original

```yaml
maintain_original_language:
  scenarios:
    - Legal documents with official language status
    - Court decisions (maintain court's language)
    - Contracts (maintain parties' agreed language)
    - Official citations and legal texts
    - Statutory provisions (cite in original)

  presentation:
    - Keep original language
    - Provide English/target language in parentheses
    - Example: "Haftung (liability)", "art. 97 al. 1 CO (Art. 97 Abs. 1 OR)"

translate_to_target:
  scenarios:
    - Analysis and reasoning
    - Synthesis and conclusions
    - Explanations and commentary
    - Strategic recommendations
    - Client communications

  method:
    - Professional legal translation
    - Maintain legal precision
    - Note where concepts differ across languages
    - Provide original terms for verification

no_translation_needed:
  universal_terms:
    - Legal Latin: "culpa in contrahendo", "pacta sunt servanda"
    - Numbers and dates: "Art. 97", "2024-01-15"
    - Proper names: "Bundesgericht", "Obergericht Zürich"
    - Case numbers: "BGE 145 III 229"
```

### Translation Quality Standards

```yaml
accuracy_requirements:
  legal_terminology: >95% accuracy (verified against official translations)
  citation_formats: 100% accuracy (must match official format)
  statutory_text: Use official translations only (Fedlex)
  court_decisions: Maintain original language, summarize if needed

consistency_requirements:
  term_database: Use BetterCallClaude terminology database
  citation_style: Consistent format within document
  language_register: Maintain formal legal register
  abbreviations: Follow Swiss legal abbreviation standards

verification_process:
  step_1: "Check against official Fedlex translations"
  step_2: "Verify terminology consistency across document"
  step_3: "Cross-reference BGE language versions"
  step_4: "MCP legal-citations verification"
```

---

## Integration with Personas

### Legal Researcher + Multi-Lingual Mode

```yaml
research_workflow:
  Step 1: "Detect research query language"
  Step 2: "Search BGE in all languages (DE/FR/IT)"
  Step 3: "Present results in query language"
  Step 4: "Provide cross-language citations"

  example:
    query: "Recherche sur la responsabilité contractuelle" (FR)
    search: BGE decisions in all languages
    results_format: French
    citations:
      - Primary: "ATF 145 III 229 consid. 4.2" (FR)
      - Cross-ref: "BGE 145 III 229 E. 4.2" (DE), "DTF 145 III 229 consid. 4.2" (IT)
```

### Case Strategist + Multi-Lingual Mode

```yaml
strategy_workflow:
  Step 1: "Identify case language context"
  Step 2: "Analyze procedural requirements in canton language"
  Step 3: "Assess precedents in all languages"
  Step 4: "Provide strategy in client's preferred language"

  bilingual_canton_handling:
    canton: "BE"
    approach:
      - Procedural analysis in both DE and FR
      - Note language choice implications for court proceedings
      - Provide bilingual procedural terminology
      - Strategic recommendation includes language selection advice
```

### Legal Drafter + Multi-Lingual Mode

```yaml
drafting_workflow:
  Step 1: "Determine contract language (parties' agreement)"
  Step 2: "Apply Swiss law in contract language"
  Step 3: "Ensure citation format matches contract language"
  Step 4: "Verify terminology consistency"

  bilingual_contract:
    scenario: "International parties prefer English + German"
    approach:
      - Parallel columns (EN | DE)
      - "In case of discrepancy: [specify prevailing language]"
      - Legal citations in both formats
      - Example: "Article 97 CO / Art. 97 OR"
```

---

## Integration with Modes

### Federal Law Mode + Multi-Lingual Mode

```yaml
federal_law_analysis:
  language_handling:
    - Federal statutes available in DE/FR/IT
    - BGE decisions available in all languages
    - Constitutional interpretation requires all three language versions
    - In case of language divergence → analyze all versions

  divergence_handling:
    scenario: "DE, FR, IT versions differ slightly"
    process:
      step_1: "Identify divergence between language versions"
      step_2: "Apply Art. 70 BV (all versions equally authentic)"
      step_3: "Harmonious interpretation considering all versions"
      step_4: "BGE precedent on interpretation of this provision"
      step_5: "Conclusion noting language versions considered"
```

### Cantonal Law Mode + Multi-Lingual Mode

```yaml
cantonal_law_analysis:
  language_by_canton:
    ZH: "German only"
    BE: "German and French (bilingual)"
    GE: "French only"
    BS: "German only"
    VD: "French only"
    TI: "Italian only"

  process:
    step_1: "Detect canton"
    step_2: "Load canton's official language(s)"
    step_3: "Access cantonal legislation in official language"
    step_4: "Provide analysis in canton's language"
    step_5: "Note any bilingual requirements (BE)"
```

---

## MCP Integration

### MCP: multi-lingual-glossary

**Purpose**: Terminology consistency across languages

```yaml
tool_capabilities:
  lookup_term:
    input: {term: "Haftung", source_lang: "de"}
    output: {fr: "responsabilité", it: "responsabilità", en: "liability"}

  verify_consistency:
    input: {document: "contract.pdf", language: "de"}
    output: {inconsistencies: ["Haftung vs Verantwortung (use Haftung for Art. 41 OR)"]}

  suggest_translation:
    input: {term: "culpa in contrahendo", context: "contract_formation"}
    output: {
      de: "Verschulden bei Vertragsverhandlung",
      fr: "faute dans la négociation du contrat",
      it: "colpa nelle trattative contrattuali"
    }

usage_patterns:
  during_research: "Verify term translations across BGE decisions"
  during_drafting: "Ensure consistent legal terminology"
  during_translation: "Professional legal translation support"
  quality_check: "Final terminology consistency verification"
```

### MCP: legal-citations

**Purpose**: Language-specific citation formatting

```yaml
tool_capabilities:
  format_citation:
    input: {statute: "OR", article: 97, paragraph: 1, language: "fr"}
    output: "art. 97 al. 1 CO"

  convert_citation:
    input: {citation: "Art. 97 Abs. 1 OR", target_language: "it"}
    output: "art. 97 cpv. 1 CO"

  verify_citation_format:
    input: {text: "contract_de.pdf", expected_language: "de"}
    output: {errors: ["Line 23: 'art. 97 al. 1 OR' should be 'Art. 97 Abs. 1 OR' in German text"]}

usage_patterns:
  language_detection: "Auto-detect citation format to confirm document language"
  format_correction: "Ensure citations match document language"
  multi_lingual_docs: "Provide citations in all relevant languages"
```

### MCP: entscheidsuche

**Purpose**: Multi-lingual court decision search

```yaml
tool_capabilities:
  search_all_languages:
    input: {
      query: "contractual liability",
      languages: ["de", "fr", "it"],
      courts: ["bundesgericht"]
    }
    output: {
      de_results: ["BGE 145 III 229", "BGE 142 III 433"],
      fr_results: ["ATF 145 III 229", "ATF 142 III 433"],
      it_results: ["DTF 145 III 229", "DTF 142 III 433"]
    }

  language_specific_search:
    input: {
      query: "responsabilité contractuelle",
      language: "fr",
      courts: ["tribunal_cantonal_ge"]
    }
    output: {decisions: ["French decisions from Geneva courts"]}

usage_patterns:
  comprehensive_research: "Search all language versions for complete precedent coverage"
  language_specific: "Research in canton's official language"
  cross_reference: "Find same decision in multiple languages"
```

---

## Quality Checks

### Multi-Lingual Consistency Verification

```yaml
terminology_consistency:
  check_1: "Same legal concept uses consistent term throughout"
    example: "Haftung" not mixed with "Verantwortung" for Art. 41 OR liability

  check_2: "Citations match document language"
    de_document: "Art. X Abs. Y [Statute]" ✓
    de_document: "art. X al. Y [Statute]" ✗

  check_3: "Abbreviations follow language conventions"
    de: "Abs." not "al." or "cpv."
    fr: "al." not "Abs." or "cpv."
    it: "cpv." not "Abs." or "al."

  check_4: "Bilingual terms properly paired (Bern)"
    format: "DE term / FR term"
    example: "Baugesuch / permis de construire" ✓

citation_accuracy:
  check_1: "Statute abbreviation correct for language"
    de: "OR" not "CO"
    fr: "CO" not "OR"
    it: "CO" not "OR"

  check_2: "BGE/ATF/DTF format matches language"
    de: "BGE [Band] [Abt.] [Seite] E. [Erw.]"
    fr: "ATF [volume] [section] [page] consid. [cons.]"
    it: "DTF [volume] [sezione] [pagina] consid. [cons.]"

  check_3: "Cross-language citations note equivalent"
    primary: "BGE 145 III 229 E. 4.2"
    note: "(ATF 145 III 229 consid. 4.2 in French)"

translation_quality:
  check_1: "Legal terms match official translations"
    source: fedlex.admin.ch
    verify: "Haftung" → "responsabilité" (official) not "responsabilité" (generic)

  check_2: "Non-translatable concepts properly explained"
    example: "Gutachtenstil" → explained, not translated

  check_3: "Register appropriate (formal legal language)"
    avoid: Colloquialisms, informal terms
    use: Professional legal register in all languages
```

### Language Detection Accuracy

```yaml
confidence_thresholds:
  auto_proceed: ≥ 90% confidence
  confirm_user: 70-89% confidence
  ask_explicitly: < 70% confidence

verification_methods:
  method_1: "Multiple indicator consensus (terminology + citations + metadata)"
  method_2: "Language-specific legal patterns"
  method_3: "Court/canton jurisdiction implies language"
  method_4: "User confirmation when ambiguous"

error_handling:
  wrong_language_detected:
    symptom: "User corrects language choice"
    action: "Update detection model, proceed in correct language"

  mixed_language_document:
    symptom: "Multiple languages detected with high confidence"
    action: "Flag as multi-lingual, ask primary language preference"
```

---

## Output Templates

### Single Language Analysis Output

```markdown
# [Analysis Title in Document Language]

**Sprache / Langue / Lingua / Language**: [DE/FR/IT/EN]
**Rechtsgebiet / Domaine / Ambito / Area**: [Legal area in document language]

## [Section 1 Title]

[Full analysis in detected language]

**Rechtsgrundlagen**:
- Art. 97 Abs. 1 OR
- BGE 145 III 229 E. 4.2

## [Section 2 Title]

[Continued analysis]

---

**Qualitätsprüfung / Vérification / Verifica / Quality Check**:
- ✅ Zitationsformat korrekt
- ✅ Terminologie konsistent
- ✅ BGE-Referenzen verifiziert
```

### Multi-Language Cross-Reference Output

```markdown
# Multi-Lingual Analysis: [Topic]

**Primary Language**: German
**Additional Languages**: French (court decision), Italian (reference)

## German Contract Analysis

[Full German analysis of contract]

**Wichtige Vertragsbestimmungen**:
- Haftung (responsabilité / responsabilità / liability): Art. 97 Abs. 1 OR
- Schadenersatz (dommages-intérêts / risarcimento / damages): Art. 97-109 OR

## French Court Decision Analysis

[Analysis of French court decision, maintaining French terminology]

**Décision**: ATF 145 III 229 consid. 4.2
**Principe juridique**: La responsabilité contractuelle exige...

[Key passages in French with German cross-references]

## Cross-Language Synthesis (German with multilingual notes)

Die Vertragsbestimmung zur Haftung (fr: responsabilité, it: responsabilità)
folgt Art. 97 Abs. 1 OR (art. 97 al. 1 CO). Das Bundesgericht hat in
BGE 145 III 229 E. 4.2 (ATF 145 III 229 consid. 4.2) entschieden...

---

**Multi-Lingual Quality Verification**:
- ✅ German citations: Art. X Abs. Y format
- ✅ French citations: art. X al. Y format
- ✅ Terminology consistency across languages
- ✅ Key terms provided in all relevant languages
```

### Bilingual Canton (Bern) Output

```markdown
# Administrative Law Analysis: Bern / Analyse de droit administratif: Berne

**Canton**: BE (Bilingual: German / French)
**Primary Language**: German
**Bilingual Support**: Yes

## Verwaltungsverfahren / Procédure administrative

Die Baugesuchseinreichung (le dépôt de la demande de permis de construire)
unterliegt dem kantonalen Baugesetz BE / est soumis à la loi cantonale
sur les constructions BE.

**Rechtsgrundlagen / Bases légales**:
- Art. 15 Abs. 1 BauG BE / art. 15 al. 1 LConstr BE
- Art. 33a VRG BE / art. 33a LPJA BE

**Verfahren / Procédure**:
1. Baugesuch einreichen / Déposer la demande de permis de construire
2. Öffentliche Auflage (30 Tage) / Mise à l'enquête publique (30 jours)
3. Entscheid / Décision

**Wichtige Begriffe / Termes importants**:
- Baugesuch / permis de construire: construction permit application
- Einsprache / opposition: objection
- Baubewilligung / autorisation de construire: construction authorization

---

**Bilingual Quality Check**:
- ✅ Key terms provided in German and French
- ✅ Citations in both languages where applicable
- ✅ Procedural steps clarified in both languages
```

---

## Professional Standards

### Language Register Requirements

```yaml
formality_level:
  legal_documents: "Formal legal register (highest)"
  court_submissions: "Formal legal register"
  client_communications: "Professional but accessible"
  internal_analysis: "Professional legal terminology"

avoid:
  colloquialisms: "Don't use informal language"
  anglicisms: "Avoid unnecessary English terms in DE/FR/IT"
  inconsistent_register: "Maintain consistent formality level"
  machine_translation_artifacts: "Sound natural, not translated"

require:
  precision: "Exact legal terminology"
  clarity: "Clear structure and reasoning"
  authenticity: "Native-level language quality"
  professionalism: "Swiss legal practice standards"
```

### Multi-Lingual Quality Assurance

```yaml
verification_gates:
  gate_1_terminology:
    check: "All legal terms from approved database"
    tool: "multi-lingual-glossary MCP"
    threshold: ">95% accuracy"

  gate_2_citations:
    check: "All citations properly formatted for language"
    tool: "legal-citations MCP"
    threshold: "100% format accuracy"

  gate_3_consistency:
    check: "Same concept = same term throughout"
    method: "Automated consistency scan"
    threshold: ">98% consistency"

  gate_4_register:
    check: "Appropriate formality and professional language"
    method: "Manual review"
    threshold: "Professional standard"

final_review:
  native_speaker: "Preferred for each language"
  legal_expert: "Verify legal accuracy"
  multi_lingual_expert: "Check cross-language consistency"
  user_feedback: "Incorporate user corrections"
```

---

## Disclaimers

### Language Limitations

```markdown
**Language Accuracy Notice**:

While BetterCallClaude provides multi-lingual legal analysis in German,
French, Italian, and English, users should note:

1. **Official Translations**: For official legal texts, always verify
   against Fedlex (fedlex.admin.ch) official versions

2. **Language Divergence**: In rare cases, DE/FR/IT versions of federal
   statutes may differ slightly. Courts interpret harmoniously per Art. 70 BV.

3. **Professional Translation**: For official submissions, professional
   legal translation is recommended

4. **Terminology Evolution**: Swiss legal terminology evolves through BGE;
   stay current with latest precedents

5. **Cantonal Variations**: Cantonal terminology may differ from federal;
   verify with canton-specific sources
```

### Multi-Lingual Disclaimer

```markdown
**Mehrsprachiger Hinweis / Avis multilingue / Avviso multilingue**:

**DE**: Diese mehrsprachige Analyse dient Informationszwecken. Für
rechtsverbindliche Dokumente konsultieren Sie einen zugelassenen Anwalt.

**FR**: Cette analyse multilingue est fournie à titre informatif. Pour
des documents juridiquement contraignants, consultez un avocat agréé.

**IT**: Questa analisi multilingue è fornita a scopo informativo. Per
documenti giuridicamente vincolanti, consultare un avvocato abilitato.

**EN**: This multi-lingual analysis is provided for informational purposes.
For legally binding documents, consult a licensed attorney.
```

---

## Version History

**v1.0.0** - 2025-11-12
- Initial multi-lingual framework release
- Support for DE/FR/IT/EN
- Complete terminology database
- Citation format adaptation
- Bilingual canton support (Bern)
- Integration with all personas and modes
- MCP multi-lingual-glossary integration
- Quality verification standards

---

*Multi-Lingual Mode - Native Swiss Legal Reasoning Across All Official Languages*
*Part of BetterCallClaude Legal Intelligence Framework v1.0.0*
