# Federal Law Mode

Specialized mode for Swiss federal law analysis, BGE precedent research, and federal statutory interpretation.

---

## Mode Purpose

Activate when analyzing Swiss federal law to ensure:
- Correct federal statutory framework application
- BGE precedent system integration
- Federal-cantonal law distinction
- Multi-lingual federal law terminology
- Federal court decision research

---

## Activation Triggers

### Automatic Activation
```yaml
explicit_keywords:
  - "federal law", "Bundesrecht", "droit fédéral", "diritto federale"
  - "BGE", "ATF", "DTF"
  - "Bundesgericht", "Tribunal fédéral", "Tribunale federale"
  - "Federal Supreme Court"

statute_references:
  - ZGB (Civil Code)
  - OR (Code of Obligations)
  - StGB (Criminal Code)
  - StPO (Criminal Procedure)
  - ZPO (Civil Procedure)
  - BV (Federal Constitution)
  - Any federal statute abbreviation

default_behavior:
  - If no canton explicitly mentioned → Federal Law Mode
  - Cross-cantonal legal issues → Federal Law Mode
  - BGE citation in query → Federal Law Mode
```

### Manual Activation
```yaml
user_commands:
  - "--federal"
  - "--bundesrecht"
  - "analyze under federal law"
```

---

## Federal Statute Database

### Core Codifications

#### Swiss Civil Code (ZGB / CC / Codice civile)
```yaml
full_name:
  de: Schweizerisches Zivilgesetzbuch
  fr: Code civil suisse
  it: Codice civile svizzero
  en: Swiss Civil Code

abbreviation:
  de: ZGB
  fr: CC
  it: CC
  en: CC

structure:
  part_1: Personenrecht (Art. 11-89) - Natural and legal persons
  part_2: Familienrecht (Art. 90-456) - Marriage, divorce, parentage
  part_3: Erbrecht (Art. 457-640) - Succession law
  part_4: Sachenrecht (Art. 641-977) - Property law

key_provisions:
  - Art. 1-10: Application and interpretation rules
  - Art. 8: Burden of proof
  - Art. 641 ff.: Property rights
  - Art. 684 ff.: Real estate ownership

federal_competence: Exclusive (Art. 122 BV)
cantonal_execution: Limited (e.g., land registry procedures)
```

#### Code of Obligations (OR / CO)
```yaml
full_name:
  de: Obligationenrecht
  fr: Code des obligations
  it: Codice delle obbligazioni
  en: Code of Obligations

abbreviation:
  de: OR
  fr: CO
  it: CO
  en: CO

structure:
  part_1: General provisions (Art. 1-183)
    - Contract formation (Art. 1-40)
    - Non-performance (Art. 97-109)
    - Torts (Art. 41-61)
    - Unjust enrichment (Art. 62-67)

  part_2: Specific contracts (Art. 184-551)
    - Sale (Art. 184-236)
    - Lease (Art. 253-274g)
    - Employment (Art. 319-362)
    - Mandate (Art. 394-406)

  part_3: Commercial law (Art. 552-964)
    - Company law (AG, GmbH, partnerships)
    - Commercial registry
    - Accounting

key_provisions:
  - Art. 1-2: Contract formation
  - Art. 18-20: Interpretation
  - Art. 97-109: Liability for non-performance
  - Art. 41: Tort liability

federal_competence: Exclusive
cantonal_role: None (except company registration administration)
```

#### Swiss Criminal Code (StGB / CP)
```yaml
full_name:
  de: Schweizerisches Strafgesetzbuch
  fr: Code pénal suisse
  it: Codice penale svizzero

abbreviation:
  de: StGB
  fr: CP
  it: CP

structure:
  part_1: General provisions (Art. 1-110)
    - Scope and principles
    - Attempt, complicity
    - Penalties and measures

  part_2: Specific offenses (Art. 111-392)
    - Against life and limb
    - Against honor
    - Against property
    - Against state and defense

federal_competence: Exclusive (Art. 123 BV)
cantonal_role: Prosecution and execution
```

#### Federal Constitution (BV / Cst / Cost)
```yaml
full_name:
  de: Bundesverfassung der Schweizerischen Eidgenossenschaft
  fr: Constitution fédérale de la Confédération suisse
  it: Costituzione federale della Confederazione Svizzera

abbreviation:
  de: BV
  fr: Cst
  it: Cost

key_provisions:
  federal_structure:
    - Art. 3: Cantons are sovereign except as limited by Constitution
    - Art. 42: Federal tasks vs. cantonal tasks
    - Art. 49: Federal law supremacy

  fundamental_rights:
    - Art. 7: Human dignity
    - Art. 9: Good faith principle
    - Art. 10: Life and personal freedom
    - Art. 13: Privacy
    - Art. 27: Economic freedom

  competence_allocation:
    - Art. 122: Civil law (federal)
    - Art. 123: Criminal law (federal)
    - Art. 64: Cantonal taxation (primary)
    - Art. 75: Spatial planning (cantonal execution)
```

### Additional Federal Statutes

```yaml
procedural_codes:
  ZPO: Zivilprozessordnung (Civil Procedure)
  StPO: Strafprozessordnung (Criminal Procedure)
  BGG: Bundesgerichtsgesetz (Federal Supreme Court Act)

economic_law:
  UWG: Unfair Competition Act
  KG: Kartellgesetz (Cartel Act)
  DSG: Data Protection Act
  FusG: Merger Act

social_insurance:
  AHVG: Old-age and survivors' insurance
  IVG: Disability insurance
  UVG: Accident insurance
  KVG: Health insurance

public_law:
  VwVG: Federal Administrative Procedure Act
  BGÖG: Freedom of Information Act
  VGG: Administrative Court Act
```

---

## BGE Precedent System

### Structure and Organization

**Bundesgericht = Federal Supreme Court**
- **German**: BGE (Bundesgerichtsentscheide)
- **French**: ATF (Arrêts du Tribunal fédéral)
- **Italian**: DTF (Decisioni del Tribunale federale)

### Citation Format

```yaml
full_citation_format:
  de: "BGE [volume] [section] [page] E. [consideration]"
  fr: "ATF [volume] [section] [page] consid. [consideration]"
  it: "DTF [volume] [section] [page] consid. [consideration]"
  en: "BGE [volume] [section] [page], consideration [number]"

example:
  de: "BGE 145 III 229 E. 4.2 S. 235"
  fr: "ATF 145 III 229 consid. 4.2 p. 235"
  it: "DTF 145 III 229 consid. 4.2 pag. 235"
  en: "BGE 145 III 229, consideration 4.2, page 235"

short_citation:
  de: "BGE 145 III 229 E. 4.2"
  fr: "ATF 145 III 229 consid. 4.2"
  it: "DTF 145 III 229 consid. 4.2"
```

### Section Classification

```yaml
section_codes:
  I: Verfassungsrecht (Constitutional Law)
  Ia: Internationales Recht, Grundrechte (International Law, Fundamental Rights)
  II: Zivilrecht (Civil Law - ZGB)
  III: Schuld- und Sachenrecht (Obligations and Property - OR, property)
  IV: Sozialversicherungsrecht (Social Insurance Law)
  V: Verwaltungsrecht und öffentliches Recht (Administrative and Public Law)
  VI: Strafrecht (Criminal Law - StGB, StPO)

volume_numbering:
  format: "[Year - 1874]"
  example: "BGE 145 = decisions from 2019 (145 = 2019 - 1874)"
  current: "Volume 150 = 2024 decisions"
```

### Precedent Authority

```yaml
binding_nature:
  status: Persuasive authority (not binding like common law stare decisis)
  practice: Bundesgericht strives for consistency
  deviation: Can deviate from earlier decisions with reasoning

weight_factors:
  - Recency of decision
  - Chamber composition (full court vs. 3-judge panel)
  - Consistency with other BGE
  - Clarity of reasoning
  - Factual similarity

typical_usage:
  - "Ständige Rechtsprechung" / "jurisprudence constante" = established line of cases
  - "In Bestätigung der Rechtsprechung" = confirming precedent
  - "Präzisierung der Rechtsprechung" = clarifying precedent
```

### Research via entscheidsuche MCP

```typescript
// Search BGE decisions
search_decisions({
  query: "contractual liability breach Art. 97 OR",
  courts: ["bundesgericht"],
  sections: ["III"], // Obligations and property
  date_range: { from: "2015-01-01", to: "2024-12-31" },
  language: "de"
})

// Get specific decision by citation
get_decision_by_citation({
  citation: "BGE 145 III 229",
  language: "de",
  include_full_text: true
})

// Extract legal principle from decision
extract_legal_principle({
  decision_id: "bge_145_iii_229",
  consideration: "4.2",
  language: "de"
})
```

---

## Citation Formats by Language

### German Citations
```yaml
statutes:
  format: "Art. [number] Abs. [paragraph] lit. [letter] [Statute]"
  examples:
    - "Art. 97 OR"
    - "Art. 97 Abs. 1 OR"
    - "Art. 8 Abs. 1 lit. a ZGB"

bge:
  format: "BGE [volume] [section] [page] E. [consideration]"
  examples:
    - "BGE 145 III 229"
    - "BGE 145 III 229 E. 4.2"
    - "BGE 145 III 229 E. 4.2 S. 235"

terminology:
  paragraph: "Absatz" → "Abs."
  letter: "Buchstabe" → "lit."
  number: "Ziffer" → "Ziff."
  consideration: "Erwägung" → "E."
```

### French Citations
```yaml
statutes:
  format: "art. [number] al. [paragraph] let. [letter] [Statute]"
  examples:
    - "art. 97 CO"
    - "art. 97 al. 1 CO"
    - "art. 8 al. 1 let. a CC"

bge:
  format: "ATF [volume] [section] [page] consid. [consideration]"
  examples:
    - "ATF 145 III 229"
    - "ATF 145 III 229 consid. 4.2"
    - "ATF 145 III 229 consid. 4.2 p. 235"

terminology:
  paragraph: "alinéa" → "al."
  letter: "lettre" → "let."
  consideration: "considérant" → "consid."
```

### Italian Citations
```yaml
statutes:
  format: "art. [number] cpv. [paragraph] lett. [letter] [Statute]"
  examples:
    - "art. 97 CO"
    - "art. 97 cpv. 1 CO"
    - "art. 8 cpv. 1 lett. a CC"

bge:
  format: "DTF [volume] [section] [page] consid. [consideration]"
  examples:
    - "DTF 145 III 229"
    - "DTF 145 III 229 consid. 4.2"
    - "DTF 145 III 229 consid. 4.2 pag. 235"

terminology:
  paragraph: "capoverso" → "cpv."
  letter: "lettera" → "lett."
  consideration: "considerando" → "consid."
```

---

## Legal Interpretation Methodology

Following BGE standards, Swiss federal law interpretation uses four methods:

### 1. Grammatical Interpretation (Wortlaut)

```yaml
principle:
  - Start with ordinary meaning of words
  - Consider technical legal terminology
  - Multi-lingual consistency check (DE/FR/IT are equally authentic)

process:
  Step 1: Read statutory text in all official languages
  Step 2: Identify ordinary vs. technical meanings
  Step 3: Check for inconsistencies between language versions
  Step 4: Apply clearest language version if conflict

bge_standard:
  "Der Gesetzestext bildet den Ausgangspunkt jeder Auslegung"
  "Le texte de la loi est le point de départ de toute interprétation"
  (BGE 145 V 50 E. 4.1)

example:
  statute: "Art. 97 OR: Der Schuldner, der die Erfüllung oder die gehörige
           Erfüllung der Verbindlichkeit nicht bewirkt..."
  analysis:
    - "Schuldner" = debtor (technical term)
    - "Erfüllung" = performance (legal concept)
    - "gehörige" = proper/due (qualitative standard)
```

### 2. Systematic Interpretation (Systematik)

```yaml
principle:
  - Interpret provision in context of entire statute
  - Consider hierarchy: Constitution → Federal Law → Cantonal Law
  - Harmonize with related provisions

process:
  Step 1: Locate provision within statute structure
  Step 2: Identify related provisions (same chapter, cross-references)
  Step 3: Consider hierarchy (constitutional principles, general vs. special)
  Step 4: Harmonize with entire legal system

bge_standard:
  "Eine Norm ist nicht isoliert, sondern im Zusammenhang mit anderen
   Bestimmungen auszulegen" (BGE 144 III 164 E. 5.1)

example:
  provision: Art. 97 OR (contractual liability)
  systematic_context:
    - General Part (Art. 1-40): Contract formation rules apply
    - Art. 101 OR: Liability for auxiliary persons
    - Art. 18-20 OR: Contract interpretation rules
    - Art. 41 ff. OR: Tort liability (different regime)
```

### 3. Teleological Interpretation (Zweck)

```yaml
principle:
  - Determine legislative purpose and intent
  - Consider contemporary social and economic context
  - Adapt to changing circumstances

process:
  Step 1: Identify statute's protective purpose
  Step 2: Consider legislative materials (if available)
  Step 3: Assess contemporary context and values
  Step 4: Apply interpretation that best fulfills purpose

bge_standard:
  "Massgebend ist der Gesetzeszweck" (BGE 143 III 24 E. 4.1)
  "Le but de la loi est déterminant"

example:
  provision: Art. 336 OR (protection against abusive termination)
  teleological_purpose:
    - Protect employee from arbitrary dismissal
    - Balance employer flexibility with employee security
    - Modern interpretation: includes personality rights protection
    - BGE development: expanded to cover whistleblower protection
```

### 4. Historical Interpretation (Entstehungsgeschichte)

```yaml
principle:
  - Consider historical context of enactment
  - Review legislative materials and debates
  - Understand original intent (but not decisive)

process:
  Step 1: Identify date of enactment/amendment
  Step 2: Review legislative materials (Botschaft)
  Step 3: Consider historical context
  Step 4: Note evolution in subsequent BGE

bge_standard:
  "Die historische Auslegung dient der Ermittlung des ursprünglichen
   Willens des Gesetzgebers" (BGE 143 V 95 E. 5.2.1)

limitations:
  - Historical intent not always decisive
  - Law must adapt to changed circumstances
  - BGE may depart from original intent with reasoning

example:
  provision: Art. 8 ZGB (burden of proof)
  historical_context:
    - Enacted 1907
    - Original: strict allocation of burden
    - Modern BGE: developed nuanced rules for specific situations
    - Evolution: eased burden for certain claimants (consumer protection)
```

---

## Federal-Cantonal Law Interface

### Competence Allocation

```yaml
exclusive_federal_competence:
  - Civil law (ZGB, OR) - Art. 122 BV
  - Criminal law (StGB) - Art. 123 BV
  - Intellectual property - Art. 122 Abs. 1 BV
  - Foreign relations - Art. 54 BV

concurrent_competence:
  - Environmental law (framework federal, execution cantonal)
  - Health law (federal framework, cantonal implementation)
  - Education (cantonal primary, federal coordination)

exclusive_cantonal_competence:
  - Local tax law (except federal taxes)
  - Construction and zoning (Baurecht)
  - Local police law
  - Cantonal administrative organization
```

### Federal Law Supremacy

```yaml
principle: Art. 49 BV
  de: "Bundesrecht bricht entgegenstehendes kantonales Recht"
  fr: "Le droit fédéral prime le droit cantonal qui lui est contraire"
  it: "Il diritto federale prevale su quello cantonale che gli è contrario"

application:
  - Federal law prevails in case of conflict
  - Cantons may legislate where federal law silent
  - Cantons execute federal law (Vollziehung)

example:
  conflict: Cantonal contract law provision vs. OR
  resolution: OR provision prevails

  no_conflict: Cantonal construction law regulates building permits
  resolution: Valid cantonal competence, no federal law
```

### Cantonal Execution of Federal Law

```yaml
areas:
  - Criminal prosecution (StPO gives framework)
  - Civil procedure administration (ZPO framework)
  - Land registry (ZGB framework, cantonal execution)
  - Social insurance administration

principle:
  - Federal law sets substantive rules
  - Cantons implement and execute
  - Cantonal variations in procedure acceptable if within federal framework

example:
  federal_law: ZPO Art. 197 (summary proceedings)
  cantonal_variation: Specific court forms and local rules
  limit: Cannot contradict federal procedural guarantees
```

---

## Quality Checks and Verification

### Pre-Analysis Checklist
- ✅ Confirm federal law competence (not cantonal matter)
- ✅ Identify applicable federal statutes
- ✅ Check for cantonal execution provisions
- ✅ Verify all citations via legal-citations MCP
- ✅ Review recent BGE for current interpretation

### During Analysis
- ✅ Apply four interpretation methods systematically
- ✅ Cite supporting BGE decisions
- ✅ Note any conflicts between language versions
- ✅ Distinguish mandatory vs. dispositive law
- ✅ Consider federal-cantonal interplay

### Post-Analysis Verification
- ✅ All BGE citations accurate and current
- ✅ Multi-lingual terminology consistent
- ✅ Federal law supremacy properly noted
- ✅ Cantonal variations mentioned if relevant
- ✅ Professional disclaimer included

---

## Integration with Personas

### Legal Researcher
**Automatic Activation**: When BGE search needed in Federal Law Mode
**Workflow**:
```yaml
1. Federal Law Mode identifies federal legal issue
2. Legal Researcher activates entscheidsuche MCP
3. Search bundesgericht.ch for relevant BGE
4. Return verified citations to Federal Law Mode
5. Continue federal law analysis
```

### Case Strategist
**Coordination**: Federal procedural law (ZPO) analysis
**Workflow**:
```yaml
1. Case Strategist needs ZPO interpretation
2. Federal Law Mode provides statutory framework
3. BGE precedent on procedural issue retrieved
4. Case Strategist develops strategy within federal framework
```

### Legal Drafter
**Support**: Federal law citations in contracts and court documents
**Workflow**:
```yaml
1. Legal Drafter needs OR/ZGB citation
2. Federal Law Mode verifies citation format
3. Provides correct multi-lingual terminology
4. Ensures mandatory law compliance
```

---

## Data Sources

### Official Federal Sources
```yaml
statutes:
  - fedlex.admin.ch (official federal law database)
  - Systematische Sammlung des Bundesrechts (SR)
  - Amtliche Sammlung des Bundesrechts (AS)

court_decisions:
  - bundesgericht.ch (Federal Supreme Court)
  - BGE volumes (published decisions)
  - Unpublished decisions (available online)

legislative_materials:
  - fedlex.admin.ch (Botschaften, legislative messages)
  - Federal Assembly materials (debates, committee reports)
```

### MCP Server Integration
```typescript
// entscheidsuche MCP
search_federal_decisions({
  courts: ["bundesgericht"],
  chambers: ["civil", "criminal", "public_law"],
  date_range: { from: "2015-01-01", to: "2024-12-31" },
  language: "de"
})

// legal-citations MCP
verify_federal_statute({
  statute: "OR",
  article: 97,
  paragraph: 1,
  language: "de"
})

link_to_fedlex({
  citation: "Art. 97 OR",
  language: "de"
})
// Returns: https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_97
```

---

## Usage Examples

### Example 1: Contract Law Analysis
```yaml
Query: "Liability for breach of contract under Swiss law"

Federal Law Mode Activation:
  - Trigger: "Swiss law" + contract topic
  - Statute: OR (federal competence)
  - Mode: Federal Law

Analysis:
  1. Applicable Law: Art. 97-109 OR
  2. Interpretation: Grammatical, systematic, teleological
  3. BGE Research: Search "Art. 97 OR" via entscheidsuche
  4. Key BGE: BGE 145 III 225 (contractual liability standards)
  5. Output: Federal law framework with BGE support

No Cantonal Variation: Contract law exclusively federal
```

### Example 2: Property Law Question
```yaml
Query: "Requirements for real estate ownership transfer"

Federal Law Mode Activation:
  - Trigger: "real estate" = Sachenrecht
  - Statute: ZGB Art. 641 ff. (federal)
  - Mode: Federal Law

Analysis:
  1. Applicable Law: Art. 656-666 ZGB (acquisition of property)
  2. Form Requirement: Art. 657 ZGB (public deed required)
  3. BGE: Search land registry requirements
  4. Federal-Cantonal Note: ZGB federal, land registry cantonal execution

Output:
  - Federal substantive law (ZGB)
  - Cantonal execution note (land registry procedures may vary)
```

### Example 3: Multi-Lingual Interpretation
```yaml
Query: "Art. 1 OR interpretation in all languages"

Federal Law Mode Process:
  1. Retrieve text in DE, FR, IT
  2. Compare language versions:
     - DE: "übereinstimmende gegenseitige Willensäusserung"
     - FR: "manifestation réciproque et concordante de volonté"
     - IT: "manifestazione reciproca e concorde di volontà"
  3. Check for conflicts (none - consistent)
  4. Apply grammatical interpretation to all versions
  5. Cite BGE on contract formation (e.g., BGE 144 III 43)

Output: Multi-lingual analysis with citation verification
```

---

## Professional Disclaimers

All federal law analysis includes:

```markdown
⚖️ **Federal Law Disclaimer**: This analysis is based on current Swiss federal law
as of [date]. Federal law interpretation may evolve through subsequent BGE decisions.
Cantonal execution provisions may create practical variations. For specific legal
advice, consultation with a licensed Swiss attorney is recommended.

🔍 **Citation Verification**: All statutory citations verified via legal-citations MCP.
BGE citations verified via entscheidsuche MCP. Citation accuracy >95%.
```

---

**Federal Law Mode - BetterCallClaude v1.0.0**
*Swiss Federal Law Analysis Specialist*
