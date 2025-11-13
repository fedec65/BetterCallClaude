# MCP_Legal_Citations.md - Legal Citation Verification MCP Server

**MCP Server Name**: `legal-citations`
**Version**: v1.0.0
**Purpose**: Verify, format, and manage Swiss legal citations with >95% accuracy
**Status**: Specification (Implementation Phase 2)

---

## Overview

The `legal-citations` MCP server ensures citation accuracy and consistency across all BetterCallClaude personas and modes. It handles Swiss statutory citations (ZGB, OR, StGB, etc.), BGE precedent citations, and cantonal law references in all official languages (DE/FR/IT/EN).

### Key Capabilities
- **Citation Verification**: Validate citations against Fedlex and bundesgericht.ch
- **Multi-Lingual Formatting**: Convert citations between DE/FR/IT/EN formats
- **Statutory Text Retrieval**: Fetch official provision text from Fedlex
- **Citation Extraction**: Parse documents to extract all legal citations
- **Format Standardization**: Ensure consistent citation style across documents
- **Cross-Language Linking**: Link equivalent citations across languages

---

## Data Sources

### Primary Source: Fedlex (Swiss Federal Legislation)

**Official Database**: https://www.fedlex.admin.ch/

```yaml
fedlex_coverage:
  federal_statutes:
    - ZGB/CCS/CC (Civil Code)
    - OR/CO (Code of Obligations)
    - StGB/CP/CPen (Criminal Code)
    - BV/Cst./Cost. (Federal Constitution)
    - ZPO/CPC (Civil Procedure Code)
    - StPO/CPP (Criminal Procedure Code)
    - All federal acts and ordinances

  languages:
    available: ["de", "fr", "it"]
    equally_authentic: true  # All three languages official per Art. 70 BV
    english: false           # Unofficial translations only

  historical_versions:
    available: true
    access: "Retrieve statute text as of specific date"
    note: "Important for determining applicable law"

  access_method:
    api: "Fedlex REST API"
    documentation: "https://www.fedlex.admin.ch/en/data/fedlex-api"
    authentication: "API key (free registration)"
    rate_limit: "Generous (typically 1000+ requests/hour)"
```

### Secondary Source: Bundesgericht (BGE Citations)

**Database**: https://www.bundesgericht.ch/

```yaml
bge_coverage:
  published_decisions: "BGE/ATF/DTF series"
  citation_format: "BGE [Band] [Abteilung] [Seite] E. [Erwägung]"
  languages: ["de", "fr", "it"]

  verification_capability:
    check_existence: "Verify BGE citation exists"
    retrieve_metadata: "Court, date, legal areas, summary"
    full_text_access: "For detailed verification"

  integration:
    mcp_server: "entscheidsuche"
    coordination: "legal-citations verifies format, entscheidsuche retrieves content"
```

### Tertiary Sources: Cantonal Legislation

**Canton-Specific Databases**: 6 cantons (ZH, BE, GE, BS, VD, TI)

```yaml
cantonal_sources:
  zurich:
    url: "https://zhlex.zh.ch/"
    coverage: "All ZH cantonal legislation"
    language: "de"

  bern:
    url: "https://www.belex.sites.be.ch/"
    coverage: "All BE cantonal legislation"
    languages: ["de", "fr"]
    bilingual: true

  geneva:
    url: "https://www.ge.ch/legislation/"
    coverage: "All GE cantonal legislation"
    language: "fr"

  basel_stadt:
    url: "https://www.gesetzessammlung.bs.ch/"
    coverage: "All BS cantonal legislation"
    language: "de"

  vaud:
    url: "https://www.rsv.vd.ch/"
    coverage: "All VD cantonal legislation"
    language: "fr"

  ticino:
    url: "https://m3.ti.ch/CAN/RLeggi/"
    coverage: "All TI cantonal legislation"
    language: "it"
```

---

## Citation Format Standards

### Federal Statute Citations

#### Format by Language

**German (DE)**:
```yaml
structure: "Art. [number] Abs. [paragraph] Bst. [letter] [Statute]"

examples:
  article_only: "Art. 97 OR"
  article_paragraph: "Art. 97 Abs. 1 OR"
  article_paragraph_letter: "Art. 97 Abs. 1 Bst. a OR"
  article_range: "Art. 97-109 OR"
  multiple_paragraphs: "Art. 97 Abs. 1 und 2 OR"

abbreviations:
  artikel: "Art."
  absatz: "Abs."
  buchstabe: "Bst."
  ziffer: "Ziff."
```

**French (FR)**:
```yaml
structure: "art. [number] al. [paragraph] let. [letter] [Statute]"

examples:
  article_only: "art. 97 CO"
  article_paragraph: "art. 97 al. 1 CO"
  article_paragraph_letter: "art. 97 al. 1 let. a CO"
  article_range: "art. 97 à 109 CO"
  multiple_paragraphs: "art. 97 al. 1 et 2 CO"

abbreviations:
  article: "art."
  alinea: "al."
  lettre: "let."
  chiffre: "ch."
```

**Italian (IT)**:
```yaml
structure: "art. [number] cpv. [paragraph] lett. [letter] [Statute]"

examples:
  article_only: "art. 97 CO"
  article_paragraph: "art. 97 cpv. 1 CO"
  article_paragraph_letter: "art. 97 cpv. 1 lett. a CO"
  article_range: "art. 97-109 CO"
  multiple_paragraphs: "art. 97 cpv. 1 e 2 CO"

abbreviations:
  articolo: "art."
  capoverso: "cpv."
  lettera: "lett."
  numero: "n."
```

**English (EN)** (Unofficial):
```yaml
structure: "Article [number] paragraph [paragraph] letter [letter] [Statute]"

examples:
  article_only: "Article 97 CO"
  article_paragraph: "Article 97 paragraph 1 CO"
  article_paragraph_letter: "Article 97 paragraph 1 letter a CO"
  article_range: "Articles 97-109 CO"
  multiple_paragraphs: "Article 97 paragraphs 1 and 2 CO"

note: "English format for international contracts, not official Swiss format"
```

#### Statute Abbreviations by Language

| Statute | DE | FR | IT | EN |
|---------|----|----|----|----|
| Civil Code | ZGB | CCS | CC | SCC |
| Code of Obligations | OR | CO | CO | CO |
| Criminal Code | StGB | CP | CP | SCC |
| Federal Constitution | BV | Cst. | Cost. | FC |
| Civil Procedure Code | ZPO | CPC | CPC | SCPC |
| Criminal Procedure Code | StPO | CPP | CPP | SCPP |
| Administrative Procedure Act | VwVG | PA | PA | APA |

### BGE / ATF / DTF Citations

#### Format by Language

**German (DE)**:
```yaml
format: "BGE [Band] [Abteilung] [Seite] E. [Erwägung]"

examples:
  basic: "BGE 145 III 229"
  with_consideration: "BGE 145 III 229 E. 4.2"
  with_sub_consideration: "BGE 145 III 229 E. 4.2.1"

structure:
  band: "Volume number (e.g., 145 = year 2019, Vol. 145)"
  abteilung: "Section (I, Ia, II, III, IV, V, VI)"
  seite: "Starting page number"
  erwagung: "Consideration number (optional)"

abbreviations:
  bundesgerichtsentscheid: "BGE"
  erwagung: "E."
```

**French (FR)**:
```yaml
format: "ATF [volume] [section] [page] consid. [considérant]"

examples:
  basic: "ATF 145 III 229"
  with_consideration: "ATF 145 III 229 consid. 4.2"
  with_sub_consideration: "ATF 145 III 229 consid. 4.2.1"

structure:
  volume: "Volume number"
  section: "Section (I, Ia, II, III, IV, V, VI)"
  page: "Starting page number"
  considerant: "Consideration number (optional)"

abbreviations:
  arret_tribunal_federal: "ATF"
  considerant: "consid."
```

**Italian (IT)**:
```yaml
format: "DTF [volume] [sezione] [pagina] consid. [considerando]"

examples:
  basic: "DTF 145 III 229"
  with_consideration: "DTF 145 III 229 consid. 4.2"
  with_sub_consideration: "DTF 145 III 229 consid. 4.2.1"

structure:
  volume: "Volume number"
  sezione: "Section (I, Ia, II, III, IV, V, VI)"
  pagina: "Starting page number"
  considerando: "Consideration number (optional)"

abbreviations:
  decisione_tribunale_federale: "DTF"
  considerando: "consid."
```

#### Section Codes (Same in all languages)

| Code | Legal Area | DE | FR | IT |
|------|-----------|----|----|-----|
| I | Constitutional law | Verfassungsrecht | Droit constitutionnel | Diritto costituzionale |
| Ia | International & fundamental rights | Internationales Recht & Grundrechte | Droit international & fondamental | Diritto internazionale & fondamentale |
| II | Civil law (ZGB) | Zivilrecht | Droit civil | Diritto civile |
| III | Obligations law (OR) | Schuld- und Sachenrecht | Droit des obligations | Diritto delle obbligazioni |
| IV | Social insurance | Sozialversicherungsrecht | Droit des assurances sociales | Diritto delle assicurazioni sociali |
| V | Administrative law | Verwaltungsrecht | Droit administratif | Diritto amministrativo |
| VI | Criminal law | Strafrecht | Droit pénal | Diritto penale |

### Cantonal Law Citations

#### Format Variations by Canton

**Zürich (ZH)**:
```yaml
format_de: "[Statute abbreviation] ZH [optional: § number]"
examples:
  - "BauG ZH"
  - "§ 15 Abs. 1 BauG ZH"
  - "Art. 23 KV ZH"  # Cantonal constitution uses "Art."
```

**Bern (BE)** (Bilingual):
```yaml
format_de: "[Statute abbreviation] BE"
format_fr: "[Statute abbreviation] BE"
examples_de:
  - "BauG BE"
  - "Art. 15 Abs. 1 BauG BE"
examples_fr:
  - "LConstr BE"
  - "art. 15 al. 1 LConstr BE"
note: "Same statute, different language abbreviations"
```

**Genève (GE)**:
```yaml
format_fr: "[Statute abbreviation] GE"
examples:
  - "LCI GE"  # Loi sur les constructions et les installations
  - "art. 12 al. 1 LCI GE"
```

**Basel-Stadt (BS)**:
```yaml
format_de: "[Statute abbreviation] BS"
examples:
  - "BPG BS"  # Bau- und Planungsgesetz
  - "§ 10 Abs. 1 BPG BS"
note: "Uses § (paragraph sign) like ZH"
```

**Vaud (VD)**:
```yaml
format_fr: "[Statute abbreviation] VD"
examples:
  - "LATC VD"  # Loi sur l'aménagement du territoire et les constructions
  - "art. 8 al. 1 LATC VD"
```

**Ticino (TI)**:
```yaml
format_it: "[Statute abbreviation] TI"
examples:
  - "LALPT TI"  # Legge di applicazione della legislazione federale in materia di pianificazione del territorio
  - "art. 15 cpv. 1 LALPT TI"
```

---

## Tool Specifications

### Tool 1: `verify_citation`

Verify that a legal citation is correctly formatted and exists.

**Function Signature**:
```typescript
verify_citation(params: {
  citation: string;              // Citation to verify
  expected_language?: string;    // Expected language (auto-detect if omitted)
  strict_format?: boolean;       // Require exact formatting (default: true)
}): Promise<CitationVerification>
```

**Response Format**:
```typescript
interface CitationVerification {
  is_valid: boolean;
  citation_type: "federal_statute" | "bge" | "cantonal_statute" | "unknown";

  parsed_citation?: {
    statute?: string;            // "OR", "ZGB", etc.
    article?: number;            // 97
    paragraph?: number;          // 1
    letter?: string;             // "a"
    bge_volume?: number;         // 145
    bge_section?: string;        // "III"
    bge_page?: number;           // 229
    bge_consideration?: string;  // "4.2"
    canton?: string;             // "ZH", "BE", etc.
  };

  language_detected: string;     // "de", "fr", "it", "en"
  format_correct: boolean;

  errors?: string[];             // Format errors if any
  suggestions?: string[];        // Corrected format suggestions

  provision_exists: boolean;     // Verified against Fedlex/Bundesgericht
  provision_text?: string;       // Official text (if requested)

  cross_language_equivalents?: {  // Equivalent citations in other languages
    de?: string;
    fr?: string;
    it?: string;
    en?: string;
  };
}
```

**Usage Example 1: Federal Statute Verification**
```typescript
const result = await verify_citation({
  citation: "Art. 97 Abs. 1 OR",
  expected_language: "de",
  strict_format: true
});

// Returns:
// {
//   is_valid: true,
//   citation_type: "federal_statute",
//   parsed_citation: {
//     statute: "OR",
//     article: 97,
//     paragraph: 1
//   },
//   language_detected: "de",
//   format_correct: true,
//   provision_exists: true,
//   provision_text: "Der Schuldner, der die Erfüllung...",
//   cross_language_equivalents: {
//     fr: "art. 97 al. 1 CO",
//     it: "art. 97 cpv. 1 CO",
//     en: "Article 97 paragraph 1 CO"
//   }
// }
```

**Usage Example 2: BGE Verification**
```typescript
const result = await verify_citation({
  citation: "BGE 145 III 229 E. 4.2",
  expected_language: "de"
});

// Returns:
// {
//   is_valid: true,
//   citation_type: "bge",
//   parsed_citation: {
//     bge_volume: 145,
//     bge_section: "III",
//     bge_page: 229,
//     bge_consideration: "4.2"
//   },
//   language_detected: "de",
//   format_correct: true,
//   provision_exists: true,
//   cross_language_equivalents: {
//     fr: "ATF 145 III 229 consid. 4.2",
//     it: "DTF 145 III 229 consid. 4.2"
//   }
// }
```

**Usage Example 3: Error Detection**
```typescript
const result = await verify_citation({
  citation: "art. 97 Abs. 1 OR",  // Mixed FR/DE format
  strict_format: true
});

// Returns:
// {
//   is_valid: false,
//   format_correct: false,
//   language_detected: "mixed",
//   errors: ["Mixed language format: 'art.' is French but 'Abs.' is German"],
//   suggestions: [
//     "Art. 97 Abs. 1 OR (correct German)",
//     "art. 97 al. 1 CO (correct French)"
//   ]
// }
```

---

### Tool 2: `format_citation`

Convert a citation to a specific language format.

**Function Signature**:
```typescript
format_citation(params: {
  citation: string;              // Source citation
  target_language: string;       // "de", "fr", "it", "en"
  include_provision_text?: boolean;  // Include statutory text (default: false)
}): Promise<FormattedCitation>
```

**Response Format**:
```typescript
interface FormattedCitation {
  original_citation: string;
  original_language: string;

  formatted_citation: string;    // Reformatted in target language
  target_language: string;

  provision_text?: {             // If requested
    [language: string]: string;  // Provision text in each language
  };

  formatting_changes: string[];  // What was changed

  all_language_versions?: {      // All available formats
    de: string;
    fr: string;
    it: string;
    en?: string;
  };
}
```

**Usage Example 1: DE → FR Conversion**
```typescript
const result = await format_citation({
  citation: "Art. 97 Abs. 1 OR",
  target_language: "fr",
  include_provision_text: true
});

// Returns:
// {
//   original_citation: "Art. 97 Abs. 1 OR",
//   original_language: "de",
//   formatted_citation: "art. 97 al. 1 CO",
//   target_language: "fr",
//   provision_text: {
//     de: "Der Schuldner, der die Erfüllung...",
//     fr: "Le débiteur qui ne fournit pas...",
//     it: "Il debitore che non adempie..."
//   },
//   formatting_changes: [
//     "Art. → art.",
//     "Abs. → al.",
//     "OR → CO"
//   ]
// }
```

**Usage Example 2: BGE Format Conversion**
```typescript
const result = await format_citation({
  citation: "BGE 145 III 229 E. 4.2",
  target_language: "it"
});

// Returns:
// {
//   original_citation: "BGE 145 III 229 E. 4.2",
//   original_language: "de",
//   formatted_citation: "DTF 145 III 229 consid. 4.2",
//   target_language: "it",
//   formatting_changes: [
//     "BGE → DTF",
//     "E. → consid."
//   ]
// }
```

---

### Tool 3: `get_provision_text`

Retrieve the official text of a legal provision from Fedlex.

**Function Signature**:
```typescript
get_provision_text(params: {
  citation: string;              // Legal provision citation
  languages?: string[];          // Languages to retrieve (default: all)
  as_of_date?: string;           // Historical version (ISO date)
  include_context?: boolean;     // Include surrounding articles (default: false)
}): Promise<ProvisionText>
```

**Response Format**:
```typescript
interface ProvisionText {
  citation: string;
  provision_type: "article" | "paragraph" | "letter";

  text: {
    [language: string]: string;  // Provision text in requested languages
  };

  context?: {                    // If include_context = true
    preceding_article?: {
      citation: string;
      text: { [language: string]: string };
    };
    following_article?: {
      citation: string;
      text: { [language: string]: string };
    };
  };

  metadata: {
    statute_full_name: {
      [language: string]: string;
    };
    in_force_since: string;      // ISO date
    last_amendment?: string;     // ISO date
    fedlex_url: {
      [language: string]: string;
    };
  };

  historical_version?: boolean;  // True if as_of_date was specified
  as_of_date?: string;
}
```

**Usage Example 1: Current Provision**
```typescript
const result = await get_provision_text({
  citation: "Art. 97 Abs. 1 OR",
  languages: ["de", "fr", "en"]
});

// Returns:
// {
//   citation: "Art. 97 Abs. 1 OR",
//   provision_type: "article",
//   text: {
//     de: "Der Schuldner, der die Erfüllung der Verbindlichkeit oder die Ausübung eines Rechts aus dem Schuldverhältnis nicht oder nicht gehörig bewirkt, hat den daraus entstehenden Schaden zu ersetzen, sofern er nicht beweist, dass ihm keinerlei Verschulden zur Last falle.",
//     fr: "Le débiteur qui ne fournit pas la prestation due ou ne l'exécute pas conformément au contrat répond du dommage résultant de cette inexécution, à moins qu'il ne prouve qu'aucune faute ne lui est imputable.",
//     en: "A debtor who fails to perform an obligation or performs it defectively is liable for any resulting loss unless he proves that he was not at fault." // Unofficial
//   },
//   metadata: {
//     statute_full_name: {
//       de: "Obligationenrecht",
//       fr: "Code des obligations"
//     },
//     in_force_since: "1912-01-01",
//     fedlex_url: {
//       de: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_97",
//       fr: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/fr#art_97"
//     }
//   }
// }
```

**Usage Example 2: Historical Version**
```typescript
const result = await get_provision_text({
  citation: "Art. 8 Abs. 3 BV",
  languages: ["de"],
  as_of_date: "2000-01-01"
});

// Returns provision text as it was on January 1, 2000
```

---

### Tool 4: `extract_citations`

Extract all legal citations from a document or text.

**Function Signature**:
```typescript
extract_citations(params: {
  text: string;                  // Text to analyze
  document_language?: string;    // Expected language (auto-detect if omitted)
  citation_types?: string[];     // Types to extract (default: all)
  include_verification?: boolean; // Verify each citation (default: false)
}): Promise<ExtractedCitations>
```

**Citation Types**:
```yaml
available_types:
  - "federal_statute"            # Art. X OR, Art. Y ZGB
  - "bge"                        # BGE/ATF/DTF citations
  - "cantonal_statute"           # Canton-specific statutes
  - "all"                        # Extract all types
```

**Response Format**:
```typescript
interface ExtractedCitations {
  total_citations: number;
  citations_by_type: {
    federal_statute: number;
    bge: number;
    cantonal_statute: number;
  };

  citations: ExtractedCitation[];

  statistics: {
    unique_statutes: string[];   // ["OR", "ZGB", "StGB"]
    unique_bge: string[];         // ["BGE 145 III 229", "BGE 142 III 433"]
    language_distribution: {
      [language: string]: number;
    };
  };
}

interface ExtractedCitation {
  citation: string;              // As it appears in text
  citation_type: string;
  language: string;

  location: {
    start_index: number;
    end_index: number;
    line_number?: number;
  };

  parsed_citation: any;          // Structured parse (same as verify_citation)

  verification?: CitationVerification;  // If include_verification = true

  context?: {                    // Surrounding text
    before: string;
    after: string;
  };
}
```

**Usage Example: Contract Citation Extraction**
```typescript
const text = `
Der Verkäufer haftet nach Art. 197 OR für die zugesicherten Eigenschaften.
Die Verjährung richtet sich nach Art. 210 OR. Das Bundesgericht hat in
BGE 145 III 229 entschieden, dass...
`;

const result = await extract_citations({
  text: text,
  document_language: "de",
  citation_types: ["federal_statute", "bge"],
  include_verification: true
});

// Returns:
// {
//   total_citations: 3,
//   citations_by_type: {
//     federal_statute: 2,
//     bge: 1
//   },
//   citations: [
//     {
//       citation: "Art. 197 OR",
//       citation_type: "federal_statute",
//       language: "de",
//       location: { start_index: 25, end_index: 37 },
//       verification: { is_valid: true, ... }
//     },
//     {
//       citation: "Art. 210 OR",
//       citation_type: "federal_statute",
//       language: "de",
//       location: { start_index: 95, end_index: 107 },
//       verification: { is_valid: true, ... }
//     },
//     {
//       citation: "BGE 145 III 229",
//       citation_type: "bge",
//       language: "de",
//       location: { start_index: 140, end_index: 156 },
//       verification: { is_valid: true, ... }
//     }
//   ],
//   statistics: {
//     unique_statutes: ["OR"],
//     unique_bge: ["BGE 145 III 229"],
//     language_distribution: { de: 3 }
//   }
// }
```

---

### Tool 5: `standardize_document_citations`

Standardize all citations in a document to a consistent format.

**Function Signature**:
```typescript
standardize_document_citations(params: {
  text: string;                  // Document text
  target_language: string;       // Desired citation language
  target_style?: CitationStyle;  // Optional style guide
  dry_run?: boolean;             // Preview changes without applying (default: false)
}): Promise<StandardizedDocument>
```

**Citation Styles**:
```typescript
interface CitationStyle {
  abbreviation_style: "standard" | "verbose";  // "Art." vs "Artikel"
  spacing: "compact" | "spaced";               // "Art.97" vs "Art. 97"
  bge_consideration_format: "abbreviated" | "full";  // "E." vs "Erwägung"
  cross_language_notes?: boolean;              // Include (ATF/DTF) after BGE
}
```

**Response Format**:
```typescript
interface StandardizedDocument {
  original_text: string;
  standardized_text: string;

  changes_made: DocumentChange[];

  statistics: {
    total_changes: number;
    citations_standardized: number;
    format_errors_corrected: number;
    language_conversions: number;
  };

  citation_index?: CitationIndex[];  // Optional index of all citations
}

interface DocumentChange {
  original: string;
  standardized: string;
  location: { start_index: number; end_index: number };
  change_type: "format" | "language" | "correction";
  reason: string;
}

interface CitationIndex {
  citation: string;
  first_occurrence_line: number;
  total_occurrences: number;
  provision_summary?: string;      // Brief description of provision
}
```

**Usage Example: Bilingual Contract Standardization**
```typescript
const contract_text = `
This agreement is governed by Art. 97 paragraph 1 CO and
art. 107 al. 1 CO. Reference is also made to BGE 145 III 229.
`;

const result = await standardize_document_citations({
  text: contract_text,
  target_language: "en",
  target_style: {
    abbreviation_style: "standard",
    spacing: "spaced",
    cross_language_notes: true
  },
  dry_run: false
});

// Returns:
// {
//   standardized_text: `
//     This agreement is governed by Article 97 paragraph 1 CO
//     (art. 97 al. 1 CO / Art. 97 Abs. 1 OR) and Article 107
//     paragraph 1 CO. Reference is also made to FSC 145 III 229
//     (ATF 145 III 229 / BGE 145 III 229 E.).
//   `,
//   changes_made: [
//     {
//       original: "Art. 97 paragraph 1 CO",
//       standardized: "Article 97 paragraph 1 CO (art. 97 al. 1 CO / Art. 97 Abs. 1 OR)",
//       change_type: "format",
//       reason: "Standardized to English format with cross-language notes"
//     }
//   ],
//   statistics: {
//     total_changes: 3,
//     citations_standardized: 3,
//     format_errors_corrected: 0,
//     language_conversions: 0
//   }
// }
```

---

### Tool 6: `compare_citation_versions`

Compare different versions of a legal provision over time.

**Function Signature**:
```typescript
compare_citation_versions(params: {
  citation: string;
  dates: string[];               // ISO dates to compare
  languages?: string[];          // Languages to compare (default: ["de"])
  highlight_changes?: boolean;   // Highlight text differences (default: true)
}): Promise<ProvisionComparison>
```

**Response Format**:
```typescript
interface ProvisionComparison {
  citation: string;
  versions: ProvisionVersion[];

  changes_summary: {
    total_amendments: number;
    substantive_changes: boolean;
    formatting_changes_only: boolean;
  };

  timeline: AmendmentTimeline[];
}

interface ProvisionVersion {
  date: string;
  text: {
    [language: string]: string;
  };
  in_force: boolean;             // Was this version in force on the date?
  amendments?: string[];         // What changed in this version
}

interface AmendmentTimeline {
  date: string;
  change_description: string;
  source: string;                // Federal Gazette reference
}
```

**Usage Example: Track Art. 97 OR Changes**
```typescript
const result = await compare_citation_versions({
  citation: "Art. 97 OR",
  dates: ["2000-01-01", "2010-01-01", "2020-01-01", "2024-01-01"],
  languages: ["de", "fr"],
  highlight_changes: true
});

// Returns historical versions with highlighted changes
```

---

## Integration with Personas

### Legal Researcher Persona

**Primary Usage**:
- `verify_citation`: Ensure all research citations are accurate
- `get_provision_text`: Retrieve statutory provisions for analysis
- `extract_citations`: Parse precedents to identify all cited provisions

**Workflow Integration**:
```yaml
research_workflow:
  step_1_verify_sources:
    tool: "verify_citation"
    action: "Verify all BGE and statutory citations"

  step_2_retrieve_provisions:
    tool: "get_provision_text"
    action: "Get official text of all cited provisions"

  step_3_cross_language_check:
    tool: "format_citation"
    action: "Provide citations in all languages for multi-lingual research"

  output_standard:
    citation_accuracy: ">95% verified against Fedlex"
    multi_lingual: "All citations available in DE/FR/IT"
```

### Case Strategist Persona

**Primary Usage**:
- `verify_citation`: Validate citations in case materials
- `extract_citations`: Analyze opponent's filings for citation accuracy
- `get_provision_text`: Verify exact wording of statutory bases

**Workflow Integration**:
```yaml
strategy_workflow:
  step_1_citation_audit:
    tool: "extract_citations"
    action: "Extract all citations from case materials"

  step_2_verification:
    tool: "verify_citation"
    action: "Verify each citation for accuracy"

  step_3_provision_analysis:
    tool: "get_provision_text"
    action: "Retrieve current and historical provision texts"

  quality_gate:
    requirement: "100% citation accuracy in strategic documents"
    cross_check: "Verify opponent's citations for errors"
```

### Legal Drafter Persona

**Primary Usage**:
- `format_citation`: Ensure consistent citation format
- `standardize_document_citations`: Final quality check before delivery
- `verify_citation`: Real-time citation verification during drafting

**Workflow Integration**:
```yaml
drafting_workflow:
  step_1_initial_draft:
    action: "Draft document with legal citations"

  step_2_real_time_verification:
    tool: "verify_citation"
    trigger: "After each citation insertion"
    action: "Immediate feedback on format and accuracy"

  step_3_standardization:
    tool: "standardize_document_citations"
    action: "Ensure all citations follow target language format"

  step_4_final_check:
    tool: "extract_citations"
    action: "Generate citation index for document"

  output_standard:
    citation_accuracy: ">95%"
    format_consistency: "100%"
    multi_lingual: "Proper format for document language"
```

---

## Multi-Lingual Support

### Language Detection Strategies

```yaml
citation_language_indicators:
  german_indicators:
    - "Art." (capital A)
    - "Abs." (Absatz)
    - "Bst." (Buchstabe)
    - "BGE" (not ATF or DTF)
    - "ZGB", "OR", "StGB" (not CCS, CO, CP)

  french_indicators:
    - "art." (lowercase a)
    - "al." (alinéa)
    - "let." (lettre)
    - "ATF" (not BGE or DTF)
    - "CCS", "CO", "CP" (not ZGB, OR, StGB)

  italian_indicators:
    - "art." (lowercase a)
    - "cpv." (capoverso)
    - "lett." (lettera)
    - "DTF" (not BGE or ATF)
    - "CC", "CO", "CP" (not ZGB, OR, StGB)

  english_indicators:
    - "Article" (full word)
    - "paragraph" (full word)
    - "letter" (full word)
    - "FSC" (Federal Supreme Court)

mixed_language_detection:
  scenario: "Citation combines elements from different languages"
  example: "art. 97 Abs. 1 OR" (FR + DE)
  action: "Flag as error, suggest corrections in both languages"
```

### Cross-Language Citation Mapping

```yaml
statute_mapping:
  civil_code:
    de: "ZGB"
    fr: "CCS"
    it: "CC"
    en: "SCC"

  obligations:
    de: "OR"
    fr: "CO"
    it: "CO"
    en: "CO"

  criminal_code:
    de: "StGB"
    fr: "CP"
    it: "CP"
    en: "SCC"  # Swiss Criminal Code (unofficial)

bge_mapping:
  german: "BGE"
  french: "ATF"
  italian: "DTF"
  english: "FSC"  # Federal Supreme Court (unofficial)

element_mapping:
  article:
    de: "Art."
    fr: "art."
    it: "art."
    en: "Article"

  paragraph:
    de: "Abs."
    fr: "al."
    it: "cpv."
    en: "paragraph"

  letter:
    de: "Bst."
    fr: "let."
    it: "lett."
    en: "letter"

  consideration:
    de: "E."
    fr: "consid."
    it: "consid."
    en: "consideration"
```

---

## Error Handling and Quality Assurance

### Common Citation Errors

```yaml
format_errors:
  mixed_language:
    error: "art. 97 Abs. 1 OR"
    problem: "French 'art.' with German 'Abs.'"
    fix: "Art. 97 Abs. 1 OR (DE) or art. 97 al. 1 CO (FR)"

  wrong_abbreviation:
    error: "Art. 97 Abs. 1 CO"
    problem: "German format with French statute abbreviation"
    fix: "Art. 97 Abs. 1 OR (DE) or art. 97 al. 1 CO (FR)"

  missing_spacing:
    error: "Art.97 OR"
    problem: "No space after 'Art.'"
    fix: "Art. 97 OR"

  incorrect_capitalization:
    error: "Art. 97 Abs. 1 or"
    problem: "Lowercase statute abbreviation"
    fix: "Art. 97 Abs. 1 OR"

  bge_format:
    error: "BGE 145/III/229"
    problem: "Slashes instead of spaces"
    fix: "BGE 145 III 229"

provision_errors:
  non_existent_article:
    error: "Art. 999 OR"
    problem: "OR only has articles up to 964"
    action: "Verify intended article number"

  wrong_paragraph:
    error: "Art. 97 Abs. 5 OR"
    problem: "Art. 97 OR only has 2 paragraphs"
    action: "Check correct paragraph number"

  outdated_citation:
    error: "Art. 123 OR" (repealed provision)
    problem: "Provision no longer in force"
    action: "Note repeal date, suggest current equivalent"
```

### Verification Accuracy Standards

```yaml
accuracy_targets:
  federal_statutes: ">99% (verified against Fedlex)"
  bge_citations: ">98% (verified against bundesgericht.ch)"
  cantonal_statutes: ">95% (verified against cantonal databases)"

verification_methods:
  method_1_fedlex_api:
    coverage: "All federal statutes"
    reliability: "100% (official source)"

  method_2_bundesgericht_database:
    coverage: "All BGE/ATF/DTF"
    reliability: "100% (official source)"

  method_3_cantonal_databases:
    coverage: "6 major cantons"
    reliability: "95-100% (official cantonal sources)"

  method_4_pattern_matching:
    coverage: "Fallback for unavailable sources"
    reliability: "Format verification only, not existence"

quality_gates:
  gate_1_format:
    check: "Citation format matches language standards"
    threshold: "100% (no format errors)"

  gate_2_existence:
    check: "Provision exists in official database"
    threshold: ">95% verification rate"

  gate_3_consistency:
    check: "Same citation formatted consistently throughout document"
    threshold: "100%"
```

---

## Performance Optimization

### Caching Strategy

```yaml
provision_text_cache:
  cache_duration: "90 days (provisions are stable)"
  cache_key: "citation + language + as_of_date"
  invalidation: "On Fedlex update notification"

citation_verification_cache:
  cache_duration: "30 days"
  cache_key: "citation + strict_format_flag"
  invalidation: "On reported error or Fedlex update"

bge_metadata_cache:
  cache_duration: "Permanent (BGE don't change)"
  cache_key: "bge_citation"
  note: "BGE decisions are final and unchanging"

format_conversion_cache:
  cache_duration: "Permanent (format rules don't change)"
  cache_key: "citation + source_lang + target_lang"
```

### Batch Processing Optimization

```yaml
batch_verification:
  strategy: "Group citations by statute for batch Fedlex queries"
  max_batch_size: 50
  performance_gain: "5-10x faster than individual requests"

parallel_extraction:
  strategy: "Extract different citation types in parallel"
  concurrent_extractors: 3  # federal, BGE, cantonal
  performance_gain: "3x faster for mixed documents"

multi_language_retrieval:
  strategy: "Fetch all language versions in single Fedlex request"
  performance_gain: "3x faster than separate language requests"
```

---

## Implementation Notes

### Phase 2 Development Tasks

```yaml
infrastructure:
  task_1: "Set up MCP server framework"
  task_2: "Integrate Fedlex REST API"
  task_3: "Build bundesgericht.ch integration"
  task_4: "Set up cantonal database connections (6 cantons)"
  task_5: "Implement Redis caching layer"

core_functionality:
  task_6: "Implement citation parsing engine (regex + NLP)"
  task_7: "Implement verify_citation tool"
  task_8: "Implement format_citation tool"
  task_9: "Implement get_provision_text tool"
  task_10: "Implement extract_citations tool"
  task_11: "Implement standardize_document_citations tool"
  task_12: "Implement compare_citation_versions tool"

quality_assurance:
  task_13: "Build comprehensive test suite (1000+ test citations)"
  task_14: "Implement error detection and suggestion system"
  task_15: "Create citation format validation rules"
  task_16: "Set up accuracy monitoring dashboard"

integration:
  task_17: "Integrate with entscheidsuche MCP"
  task_18: "Integrate with multi-lingual-glossary MCP"
  task_19: "Test with all three personas"
  task_20: "Performance optimization and load testing"
```

### Technical Stack Recommendations

```yaml
backend:
  runtime: "Node.js 20+ with TypeScript"
  framework: "Express.js for MCP protocol"
  database: "PostgreSQL for citation cache"
  cache: "Redis for high-speed lookups"

parsing:
  regex_engine: "XRegExp for Unicode support"
  nlp: "compromise.js for context analysis"
  text_diff: "diff-match-patch for version comparison"

external_apis:
  fedlex:
    library: "axios with retry logic"
    rate_limiting: "bottleneck.js"
    api_key: "Environment variable"

  bundesgericht:
    approach: "API if available, else web scraping with Playwright"
    caching: "Aggressive (decisions are immutable)"

cantonal_sources:
  approach: "Web scraping with Playwright"
  rate_limiting: "Respect robots.txt and rate limits"
  error_handling: "Graceful degradation if source unavailable"
```

---

## Testing Strategy

### Unit Tests

```yaml
citation_parsing:
  - test_parse_federal_statute_de
  - test_parse_federal_statute_fr
  - test_parse_federal_statute_it
  - test_parse_bge_citation
  - test_parse_cantonal_citation
  - test_detect_mixed_language_citation
  - test_extract_citation_from_text

format_conversion:
  - test_convert_de_to_fr
  - test_convert_fr_to_it
  - test_convert_bge_to_atf
  - test_preserve_provision_structure

verification:
  - test_verify_valid_citation
  - test_verify_invalid_citation
  - test_verify_nonexistent_provision
  - test_fedlex_integration
  - test_bundesgericht_integration
```

### Integration Tests

```yaml
persona_integration:
  - test_legal_researcher_citation_workflow
  - test_case_strategist_verification
  - test_legal_drafter_standardization

mcp_integration:
  - test_entscheidsuche_coordination
  - test_multi_lingual_glossary_coordination

end_to_end:
  - test_full_document_standardization
  - test_multi_language_research_workflow
  - test_cross_mcp_citation_verification
```

### Accuracy Tests

```yaml
benchmark_suite:
  federal_statutes:
    sample_size: 500
    sources: "All major statutes (ZGB, OR, StGB, BV, ZPO, StPO)"
    target_accuracy: ">99%"

  bge_citations:
    sample_size: 200
    sources: "Recent BGE decisions (2015-2024)"
    target_accuracy: ">98%"

  cantonal_statutes:
    sample_size: 100
    sources: "6 major cantons"
    target_accuracy: ">95%"

manual_review:
  frequency: "Quarterly"
  sample_size: "100 random citations"
  threshold: ">95% accuracy"
```

---

## Monitoring and Maintenance

### Metrics

```yaml
performance_metrics:
  - verification_latency_p50
  - verification_latency_p95
  - verification_latency_p99
  - cache_hit_rate
  - fedlex_api_response_time

accuracy_metrics:
  - verification_accuracy_rate
  - false_positive_rate
  - false_negative_rate
  - user_reported_errors

operational_metrics:
  - requests_per_minute
  - error_rate
  - fedlex_api_availability
  - cache_memory_usage
```

### Maintenance Tasks

```yaml
daily:
  - monitor_error_logs
  - check_fedlex_api_status
  - verify_cache_health

weekly:
  - check_fedlex_updates
  - review_user_error_reports
  - update_cantonal_database_status

monthly:
  - recalculate_accuracy_metrics
  - review_and_optimize_cache_strategy
  - update_citation_format_rules

quarterly:
  - comprehensive_accuracy_audit
  - performance_optimization_review
  - update_benchmark_suite
```

---

## Version History

**v1.0.0** - 2025-11-12
- Initial specification for legal-citations MCP server
- 6 core tools defined
- Multi-lingual support (DE/FR/IT/EN)
- Fedlex and Bundesgericht integration specified
- Quality assurance framework (>95% accuracy target)
- Integration with all personas

---

*Legal Citations MCP Server - Swiss Legal Citation Verification and Formatting*
*Part of BetterCallClaude Legal Intelligence Framework v1.0.0*
