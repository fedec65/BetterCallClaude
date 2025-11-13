# Cantonal Law Mode

Specialized mode for Swiss cantonal law analysis with jurisdiction-specific routing and federal-cantonal coordination.

---

## Mode Purpose

Activate when analyzing canton-specific Swiss law to ensure:
- Correct canton identification and routing
- Cantonal competence verification
- Federal law baseline integration
- Canton-specific data source access
- Multi-lingual cantonal terminology

---

## Activation Triggers

### Automatic Activation
```yaml
explicit_canton_mention:
  codes: [ZH, BE, GE, BS, VD, TI]
  names:
    de: [Zürich, Bern, Genf, Basel-Stadt, Waadt, Tessin]
    fr: [Zurich, Berne, Genève, Bâle-Ville, Vaud, Tessin]
    it: [Zurigo, Berna, Ginevra, Basilea-Città, Vaud, Ticino]

cantonal_law_keywords:
  - "cantonal law", "kantonales Recht", "droit cantonal", "diritto cantonale"
  - "Kantonsgericht", "Tribunal cantonal", "Tribunale cantonale"
  - Canton-specific court references

cantonal_competence_areas:
  - Tax law (cantonal taxes)
  - Construction and zoning (Baurecht)
  - Education law
  - Local police law
  - Cantonal administrative law

cantonal_court_citations:
  - "Obergericht Zürich"
  - "Cour de justice de Genève"
  - "Tribunale d'appello del Canton Ticino"
```

### Manual Activation
```yaml
user_commands:
  - "--cantonal [canton_code]"
  - "--zh", "--ge", "--ti" (specific canton)
  - "analyze under [Canton] law"
```

---

## Supported Cantons (v1.0 MVP)

**Note**: Full configuration details in `.claude/SWISS_LAW_CONFIG.md`

### Canton Overview Matrix

| Canton | Code | Language | Population | Key Characteristics |
|--------|------|----------|------------|---------------------|
| Zürich | ZH | DE | ~1.5M | Economic center, commercial law |
| Bern | BE | DE/FR | ~1.0M | Bilingual, federal capital, admin law |
| Genève | GE | FR | ~500K | International arbitration, banking |
| Basel-Stadt | BS | DE | ~200K | Life sciences, cross-border |
| Vaud | VD | FR | ~800K | Olympic capital, liberal canton |
| Ticino | TI | IT | ~350K | Italian-speaking, cross-border IT |

---

## Routing Logic

### Step 1: Canton Detection

```yaml
detection_hierarchy:
  priority_1_explicit_code:
    - "ZH", "BE", "GE", "BS", "VD", "TI" in query
    - Direct activation

  priority_2_canton_name:
    - "Zürich", "Genève", "Ticino" etc. in query
    - Map to canton code

  priority_3_court_reference:
    - "Obergericht Zürich" → ZH
    - "Cour de justice de Genève" → GE
    - "Tribunale d'appello del Canton Ticino" → TI

  priority_4_contextual:
    - Address mentions (e.g., "Zürich, Switzerland")
    - Company registry (e.g., "CHE-XXX.XXX.XXX, ZH")
    - Postal code ranges

  fallback:
    - If no canton detected → Federal Law Mode
    - If multiple cantons → Federal Law Mode + note variations
```

### Step 2: Competence Verification

```yaml
check_cantonal_competence:
  cantonal_primary_areas:
    - Cantonal tax law (income, wealth, inheritance)
    - Construction and zoning law (Baurecht)
    - Education law (primary/secondary)
    - Local police law (Polizeirecht)
    - Cantonal administrative organization

  mixed_competence_areas:
    - Administrative law (federal framework, cantonal execution)
    - Health law (federal principles, cantonal implementation)
    - Environmental law (federal standards, cantonal enforcement)
    - Social welfare (federal minimums, cantonal programs)

  federal_competence_only:
    - Civil law (ZGB, OR) → Federal Law Mode
    - Criminal law (StGB) → Federal Law Mode
    - Intellectual property → Federal Law Mode

decision:
  - If federal competence → Switch to Federal Law Mode
  - If cantonal competence → Continue in Cantonal Mode
  - If mixed → Analyze both (federal baseline + cantonal specifics)
```

### Step 3: Federal-Cantonal Coordination

```yaml
analysis_sequence:
  step_1_federal_baseline:
    - Identify applicable federal law framework
    - Establish minimum federal standards
    - Note mandatory federal provisions

  step_2_cantonal_variations:
    - Identify canton-specific legislation
    - Note differences from federal baseline (if allowed)
    - Check for cantonal execution provisions

  step_3_synthesis:
    - Combine federal framework with cantonal specifics
    - Highlight practical differences
    - Note conflict resolution (federal supremacy)

  output:
    - Federal law baseline stated explicitly
    - Cantonal variations clearly marked
    - Cross-references to both levels
```

---

## Canton-Specific Configurations

### Zürich (ZH)

```yaml
code: ZH
language: de
population: ~1.5M

legal_characteristics:
  - Sophisticated commercial law practice
  - Strong precedent database
  - Liberal economic regulation
  - Major M&A and banking center

practice_areas_primary:
  - Corporate and M&A
  - Banking and finance
  - Litigation (commercial)
  - Tax planning

court_system:
  supreme: Obergericht Zürich
  first_instance: Bezirksgerichte
  specialized: Handelsgericht (Commercial Court)
  administrative: Verwaltungsgericht

data_sources:
  legislation: zhlex.zh.ch
  court_decisions: gerichte.zh.ch
  government: zh.ch

citation_format: "Obergericht Zürich, Urteil vom [date], [ref]"

cantonal_specifics:
  tax_law: Progressive income tax, wealth tax
  construction: Strict zoning (Bauordnung)
  procedure: ZPO plus local court rules
```

### Bern (BE)

```yaml
code: BE
language: [de, fr]
bilingual: true
population: ~1.0M

legal_characteristics:
  - Bilingual canton (German/French)
  - Federal capital influence
  - Strong administrative law
  - Conservative legal approach

practice_areas_primary:
  - Administrative and public law
  - Employment law
  - Real estate
  - Family law

court_system:
  supreme: "Obergericht / Tribunal supérieur"
  first_instance: Regional courts
  administrative: "Verwaltungsgericht / Tribunal administratif"

bilingual_handling:
  - Decisions in German or French
  - Both languages have equal status
  - Terminology database critical
  - Translation between DE/FR required

data_sources:
  legislation: belex.sites.be.ch
  court_decisions: gerichte.be.ch
  government: be.ch

citation_format: "Obergericht des Kantons Bern, Urteil vom [date], [ref]"
```

### Genève (GE)

```yaml
code: GE
language: fr
population: ~500K

legal_characteristics:
  - International arbitration hub
  - French legal tradition
  - Banking and private wealth center
  - International organizations (UN, WTO)

practice_areas_primary:
  - International arbitration
  - Banking and finance
  - Private wealth management
  - International law

court_system:
  supreme: Cour de justice
  first_instance: Tribunal de première instance
  specialized: Chambre civile, Chambre pénale
  administrative: Chambre administrative

data_sources:
  legislation: ge.ch (République et canton de Genève)
  court_decisions: justice.ge.ch
  government: ge.ch

citation_format: "Cour de justice de Genève, arrêt du [date], [ref]"

cantonal_specifics:
  arbitration: Strong international arbitration practice
  language: French legal terminology exclusively
  international: Interface with international organizations
```

### Basel-Stadt (BS)

```yaml
code: BS
language: de
population: ~200K

legal_characteristics:
  - Pharmaceutical and life sciences hub
  - Cross-border commerce (DE/FR)
  - Strong commercial law
  - Urban canton (smallest by area)

practice_areas_primary:
  - Life sciences and pharma
  - Corporate law
  - IP and patent law
  - Cross-border transactions

court_system:
  supreme: Appellationsgericht
  first_instance: Zivilgericht, Strafgericht

data_sources:
  legislation: gesetzessammlung.bs.ch
  court_decisions: gerichte.bs.ch
  government: bs.ch

citation_format: "Appellationsgericht Basel-Stadt, Urteil vom [date], [ref]"

cantonal_specifics:
  cross_border: Strong German/French border connections
  pharma: Specialized life sciences legal practice
```

### Vaud (VD)

```yaml
code: VD
language: fr
population: ~800K

legal_characteristics:
  - French-speaking
  - Olympic capital (Lausanne)
  - Liberal canton
  - Wine law specialization

practice_areas_primary:
  - Corporate law
  - Real estate
  - Litigation
  - Administrative law
  - Sports law

court_system:
  supreme: Tribunal cantonal
  first_instance: Tribunaux civils et pénaux
  specialized: Tribunal administratif

data_sources:
  legislation: vd.ch
  court_decisions: tribunaux.vd.ch
  government: vd.ch

citation_format: "Tribunal cantonal du Canton de Vaud, arrêt du [date], [ref]"

cantonal_specifics:
  sports_law: Olympic capital → sports arbitration (CAS/TAS)
  wine_law: Specialized wine and vineyard regulations
```

### Ticino (TI)

```yaml
code: TI
language: it
population: ~350K

legal_characteristics:
  - Italian-speaking (only canton)
  - Cross-border with Italy
  - Tourism and finance
  - Mediterranean legal culture

practice_areas_primary:
  - Cross-border Italy transactions
  - Real estate (tourism)
  - Corporate law
  - Tax planning

court_system:
  supreme: Tribunale d'appello
  first_instance: Preture
  administrative: Tribunale amministrativo

data_sources:
  legislation: ti.ch
  court_decisions: giustizia.ti.ch
  government: ti.ch

citation_format: "Tribunale d'appello del Canton Ticino, sentenza del [date], [ref]"

cantonal_specifics:
  cross_border_italy: Strong Italian cross-border practice
  language: Italian legal terminology exclusively
  culture: Mediterranean legal approach
```

---

## Cantonal Competence Areas

### Primary Cantonal Competence

**Tax Law (Cantonal Taxes)**
```yaml
federal_framework:
  - Federal direct tax (DBG) - federal competence
  - Harmonization requirement (StHG)

cantonal_autonomy:
  - Income tax rates (progressive scales)
  - Wealth tax (most cantons)
  - Inheritance tax (most cantons)
  - Real estate tax
  - Capital gains tax on real estate

practical_significance:
  - Significant tax rate variations between cantons
  - Tax competition (lower rates to attract residents/companies)
  - Planning opportunities (domicile selection)

example_analysis:
  Query: "Tax implications of moving from ZH to TI"
  Mode: Cantonal Law Mode (tax comparison)
  Analysis: Compare ZH vs TI income/wealth tax rates
  Note: Federal tax (DBG) identical regardless of canton
```

**Construction and Zoning Law (Baurecht)**
```yaml
federal_framework:
  - Spatial planning Act (RPG) - federal principles
  - Environmental protection - federal standards

cantonal_competence:
  - Cantonal construction codes (Baugesetze)
  - Zoning plans and building permits
  - Building regulations and standards
  - Heritage protection (cantonal designation)

practical_significance:
  - Building permit procedures vary significantly
  - Different aesthetic requirements (heritage protection)
  - Different density and height restrictions
  - Canton-specific environmental requirements

example_analysis:
  Query: "Building permit requirements in Geneva"
  Mode: Cantonal Law Mode (GE)
  Analysis: GE construction law (Loi sur les constructions et installations diverses)
  Note: Federal environmental standards must be met
```

**Education Law**
```yaml
federal_framework:
  - Federal Constitution Art. 62 (education principles)
  - Federal coordination (EDK/CDIP)

cantonal_competence:
  - Primary and secondary education (curriculum, teachers)
  - Cantonal universities
  - Vocational training (cantonal implementation)
  - Language of instruction

practical_significance:
  - Different school systems by canton
  - Different curricula (HarmoS harmonization ongoing)
  - Language requirements vary (e.g., BE bilingual)
```

**Local Police Law (Polizeirecht)**
```yaml
cantonal_competence:
  - Public order and safety
  - Local police organizations
  - Opening hours regulations
  - Noise ordinances
  - Local traffic regulations

practical_significance:
  - Different shop opening hours by canton
  - Different noise regulations
  - Different police powers
```

### Mixed Federal-Cantonal Competence

**Administrative Law**
```yaml
federal_component:
  - Federal Administrative Procedure Act (VwVG) - federal administration
  - Federal principles (Rechtsgleichheit, Verhältnismässigkeit)

cantonal_component:
  - Cantonal administrative procedure acts
  - Cantonal administrative courts
  - Specific cantonal administrative regulations

coordination:
  - Federal principles apply to cantonal procedures
  - Cantonal procedures supplement federal framework
  - Appeal to Federal Supreme Court on federal law questions
```

**Health Law**
```yaml
federal_component:
  - Health Insurance Act (KVG) - mandatory insurance
  - Epidemics Act (EpG) - disease control
  - Medicinal Products Act (HMG)

cantonal_component:
  - Cantonal health systems (hospitals, clinics)
  - Cantonal health insurance supervision
  - Cantonal health promotion programs
  - Doctor licensing (cantonal execution)

coordination:
  - Federal minimum standards (KVG basic coverage)
  - Cantonal hospitals and health infrastructure
  - Cantonal premium setting (KVG framework)
```

---

## Analysis Workflow

### Standard Cantonal Law Analysis

```yaml
Step 1 - Canton Identification:
  - Detect canton from query
  - Verify canton in supported list (ZH, BE, GE, BS, VD, TI)
  - Load canton configuration from SWISS_LAW_CONFIG.md

Step 2 - Competence Check:
  - Verify cantonal competence for legal area
  - If federal → redirect to Federal Law Mode
  - If mixed → prepare federal-cantonal coordinated analysis

Step 3 - Federal Baseline:
  - Identify applicable federal law framework
  - Note mandatory federal provisions
  - Establish minimum standards

Step 4 - Cantonal Specifics:
  - Load canton-specific legislation
  - Identify cantonal variations (if permitted)
  - Note procedural differences

Step 5 - Data Source Access:
  - Access cantonal legislation database
  - Search cantonal court decisions (via entscheidsuche MCP)
  - Reference canton-specific government sources

Step 6 - Multi-Lingual Handling:
  - Apply canton's primary language(s)
  - Use correct legal terminology for that canton
  - Note bilingual requirements (BE)

Step 7 - Synthesis:
  - Federal law baseline explicitly stated
  - Cantonal variations highlighted
  - Practical differences noted
  - Disclaimer on federal supremacy
```

### Cross-Cantonal Analysis

```yaml
Scenario: Question involves multiple cantons

Step 1 - Identify All Relevant Cantons:
  - Extract canton mentions from query
  - Determine if comparative analysis needed

Step 2 - Federal Framework:
  - Switch to Federal Law Mode for baseline
  - Establish federal law that applies uniformly
  - Note areas where cantons may vary

Step 3 - Canton-by-Canton Analysis:
  - For each canton: load specific configuration
  - Identify canton-specific variations
  - Note practical differences

Step 4 - Comparative Synthesis:
  - Create comparison table if helpful
  - Highlight key differences
  - Note common elements

Output Format:
  ## Federal Law Baseline
  [Federal framework applicable to all cantons]

  ## Cantonal Variations
  **Zürich (ZH)**:
  - [ZH-specific provisions]

  **Genève (GE)**:
  - [GE-specific provisions]

  ## Practical Implications
  [Key differences and considerations]
```

---

## Integration with Personas

### Legal Researcher
**Cantonal Court Decisions**:
```typescript
// Search cantonal court decisions
search_decisions({
  query: "construction permit appeal",
  courts: ["obergericht_zh", "cour_justice_ge"],
  canton: "ZH", // or "GE"
  date_range: { from: "2020-01-01", to: "2024-12-31" },
  language: "de" // or "fr" for GE
})
```

### Case Strategist
**Cantonal Procedural Strategy**:
```yaml
Coordination:
  - Cantonal Law Mode provides ZPO + cantonal rules
  - Case Strategist develops strategy
  - Accounts for canton-specific court practices
  - Note: ZH Handelsgericht vs. regular courts
```

### Legal Drafter
**Cantonal Contract Provisions**:
```yaml
Example: Real estate purchase contract in Ticino
  - Federal law: ZGB Art. 216-220 (property purchase)
  - Federal form: Public deed required (Art. 657 ZGB)
  - Cantonal execution: TI notary procedures
  - Cantonal specifics: TI land registry rules
  - Language: Italian
```

---

## Quality Checks

### Pre-Analysis
- ✅ Canton correctly identified
- ✅ Canton in supported list (ZH, BE, GE, BS, VD, TI)
- ✅ Cantonal competence verified
- ✅ Federal baseline identified
- ✅ Canton configuration loaded from SWISS_LAW_CONFIG.md

### During Analysis
- ✅ Federal law baseline explicitly stated
- ✅ Cantonal variations clearly marked
- ✅ Federal-cantonal interplay explained
- ✅ Correct language terminology used
- ✅ Canton-specific data sources cited

### Post-Analysis
- ✅ Federal supremacy principle noted
- ✅ Practical differences highlighted
- ✅ Cross-references to both federal and cantonal law
- ✅ Canton-specific citations verified
- ✅ Professional disclaimer included

---

## Output Template

```markdown
## Cantonal Law Analysis: [Canton Name]

**Canton**: [Full name] ([Code])
**Language**: [DE/FR/IT]
**Legal Area**: [Area of law]

### Federal Law Baseline

[Applicable federal law framework that applies uniformly]

**Key Federal Provisions**:
- [Federal statute Art. X]
- [Federal principle/standard]

### Cantonal Law Specifics ([Canton])

**Cantonal Legislation**:
- [Cantonal statute reference]
- [Canton-specific provisions]

**Cantonal Court Practice**:
- [Cite cantonal court decisions if available]

**Practical Differences from Federal/Other Cantons**:
- [Highlight key differences]

### Federal-Cantonal Coordination

**Competence Allocation**:
- Federal: [What federal law governs]
- Cantonal: [What canton may regulate]

**Conflict Resolution**:
- Federal law prevails (Art. 49 BV)
- Cantonal execution within federal framework

### Practical Implications

[How federal-cantonal interplay affects the specific situation]

---

⚖️ **Federal-Cantonal Disclaimer**: This analysis addresses [Canton] cantonal law within the framework of Swiss federal law. Federal law prevails in case of conflict (Art. 49 BV). Other cantons may have different cantonal regulations in areas of cantonal competence. This analysis is current as of [date]. For specific legal advice, consultation with a licensed Swiss attorney practicing in [Canton] is recommended.
```

---

## Data Source Access

### Cantonal Legislation Databases

```yaml
ZH: zhlex.zh.ch
BE: belex.sites.be.ch
GE: ge.ch (legislation)
BS: gesetzessammlung.bs.ch
VD: vd.ch (legislation)
TI: ti.ch (legislation)
```

### Cantonal Court Decisions

```yaml
ZH: gerichte.zh.ch
BE: gerichte.be.ch
GE: justice.ge.ch
BS: gerichte.bs.ch
VD: tribunaux.vd.ch
TI: giustizia.ti.ch
```

### MCP Server Integration

```typescript
// entscheidsuche MCP - cantonal courts
search_cantonal_decisions({
  canton: "ZH",
  court: "obergericht",
  query: "contract interpretation",
  language: "de"
})

// legal-citations MCP - cantonal statutes
verify_cantonal_statute({
  canton: "ZH",
  statute: "Baugesetz",
  article: 15,
  language: "de"
})
```

---

## Professional Disclaimers

```markdown
⚖️ **Cantonal Law Disclaimer**: This analysis is based on [Canton Name] cantonal law within the framework of Swiss federal law. Federal law prevails in case of conflict (Art. 49 BV). Cantonal law may change through legislative amendments or cantonal court decisions. Other Swiss cantons may have different regulations in areas of cantonal competence. For specific legal advice regarding [Canton] law, consultation with a licensed attorney practicing in [Canton] is recommended.

🗺️ **Multi-Cantonal Note**: This framework currently supports 6 Swiss cantons (ZH, BE, GE, BS, VD, TI). For legal questions involving other cantons, federal law analysis may be provided, but canton-specific details may not be available.
```

---

**Cantonal Law Mode - BetterCallClaude v1.0.0**
*Swiss Cantonal Law Analysis Specialist*
