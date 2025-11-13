# Swiss Law Configuration and Jurisdiction Routing

Configuration system for multi-jurisdictional Swiss law analysis within BetterCallClaude framework.

---

## 🇨🇭 Swiss Legal System Overview

### Federal Structure

Switzerland operates a **dual-level legal system**:
1. **Federal Law** (Bundesrecht / Droit fédéral / Diritto federale)
2. **Cantonal Law** (Kantonales Recht / Droit cantonal / Diritto cantonale)

**Key Principle**: Federal law prevails (Art. 49 BV), but cantons retain sovereignty in areas not delegated to federal level.

---

## 🎯 Jurisdiction Detection and Routing

### Automatic Detection Triggers

#### Federal Law Indicators
```yaml
federal_triggers:
  explicit_mentions:
    - "federal law", "Bundesrecht", "droit fédéral", "diritto federale"
    - "BGE", "ATF", "DTF" (Federal Supreme Court decisions)
    - "Bundesgericht", "Tribunal fédéral", "Tribunale federale"

  statute_references:
    - "ZGB", "CC" (Civil Code)
    - "OR", "CO" (Code of Obligations)
    - "StGB", "CP" (Criminal Code)
    - "StPO", "CPP" (Criminal Procedure)
    - "ZPO", "CPC" (Civil Procedure)
    - "BV", "Cst", "Cost" (Federal Constitution)

  default_behavior:
    - If no canton specified → Federal Law Mode
    - Cross-cantonal issues → Federal Law Mode
```

#### Cantonal Law Indicators
```yaml
cantonal_triggers:
  explicit_canton_mention:
    - Canton codes: ZH, BE, GE, BS, VD, TI
    - Canton names (any language)
    - "cantonal law", "kantonales Recht", "droit cantonal"

  cantonal_court_references:
    - "Obergericht Zürich", "Cour de justice de Genève"
    - "Kantonsgericht", "Tribunal cantonal"

  cantonal_specific_areas:
    - Cantonal tax law
    - Cantonal administrative law
    - Cantonal construction law
    - Cantonal procedural specifics
```

---

## 🗺️ Canton Configuration (v1.0)

### Supported Cantons

#### 1. Zürich (ZH)
```yaml
canton: Zürich
code: ZH
language: de
population: ~1.5M (largest canton)
legal_system: Germanic legal tradition

key_characteristics:
  - Major economic center
  - Sophisticated commercial law practice
  - Strong precedent database
  - Liberal economic regulation

practice_areas:
  primary: [corporate, M&A, banking, litigation]
  strong: [tax, real_estate, employment]

court_system:
  supreme: Obergericht Zürich
  first_instance: Bezirksgerichte
  specialized: Handelsgericht (Commercial Court)

data_sources:
  - gerichte.zh.ch (cantonal court decisions)
  - zhlex.zh.ch (cantonal legislation)
  - zh.ch (official government portal)

citation_format: "ZH Urteil vom [date], [reference]"
example: "Obergericht Zürich, Urteil vom 15.03.2023, LB220045"
```

#### 2. Bern (BE)
```yaml
canton: Bern
code: BE
language: [de, fr]  # Bilingual canton
population: ~1.0M (second largest)
legal_system: Germanic + Romanistic (bilingual)

key_characteristics:
  - Bilingual (German/French)
  - Federal capital influence
  - Strong administrative law
  - Conservative legal approach

practice_areas:
  primary: [administrative, public_law, litigation]
  strong: [employment, real_estate, family]

court_system:
  supreme: Obergericht / Tribunal supérieur
  first_instance: Regional courts
  administrative: Verwaltungsgericht / Tribunal administratif

data_sources:
  - gerichte.be.ch (court decisions)
  - belex.sites.be.ch (legislation)
  - be.ch (government portal)

bilingual_handling:
  - Decisions in German or French
  - Translate terminology as needed
  - Both languages have equal status

citation_format: "BE [Gericht] / [Tribunal], [date], [ref]"
```

#### 3. Genève (GE)
```yaml
canton: Genève
code: GE
language: fr
population: ~500K
legal_system: Romanistic legal tradition

key_characteristics:
  - International arbitration hub
  - French legal tradition
  - Banking and finance center
  - International organizations

practice_areas:
  primary: [international_arbitration, banking, corporate]
  strong: [private_wealth, IP, international_law]

court_system:
  supreme: Cour de justice
  first_instance: Tribunal de première instance
  specialized: Chambre civile, Chambre pénale

data_sources:
  - justice.ge.ch (court decisions)
  - ge.ch (legislation and government)

citation_format: "GE, [Tribunal], arrêt du [date], [ref]"
example: "Cour de justice de Genève, arrêt du 15.03.2023, C/12345/2022"
```

#### 4. Basel-Stadt (BS)
```yaml
canton: Basel-Stadt
code: BS
language: de
population: ~200K (smallest by area)
legal_system: Germanic legal tradition

key_characteristics:
  - Pharmaceutical/life sciences hub
  - Cross-border commerce (Germany/France)
  - Strong commercial law
  - Urban canton

practice_areas:
  primary: [life_sciences, corporate, IP]
  strong: [cross_border, employment, litigation]

court_system:
  supreme: Appellationsgericht
  first_instance: Zivilgericht, Strafgericht

data_sources:
  - gerichte.bs.ch (court decisions)
  - gesetzessammlung.bs.ch (legislation)

citation_format: "BS [Gericht], Urteil vom [date], [ref]"
```

#### 5. Vaud (VD)
```yaml
canton: Vaud
code: VD
language: fr
population: ~800K
legal_system: Romanistic legal tradition

key_characteristics:
  - French-speaking
  - Olympic capital (Lausanne)
  - Wine law specialization
  - Liberal canton

practice_areas:
  primary: [corporate, real_estate, litigation]
  strong: [administrative, sports_law, wine_law]

court_system:
  supreme: Tribunal cantonal
  first_instance: Tribunaux civils et pénaux

data_sources:
  - tribunaux.vd.ch (court decisions)
  - vd.ch (legislation)

citation_format: "VD, [Tribunal], arrêt du [date], [ref]"
```

#### 6. Ticino (TI)
```yaml
canton: Ticino
code: TI
language: it
population: ~350K
legal_system: Romanistic legal tradition

key_characteristics:
  - Italian-speaking (only canton)
  - Cross-border with Italy
  - Tourism and finance
  - Mediterranean influence

practice_areas:
  primary: [cross_border_IT, real_estate, corporate]
  strong: [tax_planning, tourism, family]

court_system:
  supreme: Tribunale d'appello
  first_instance: Preture

data_sources:
  - giustizia.ti.ch (court decisions)
  - ti.ch (legislation)

citation_format: "TI, [Tribunale], sentenza del [date], [ref]"
example: "Tribunale d'appello del Canton Ticino, sentenza del 15.03.2023, 12.2022.45"
```

---

## 🔀 Routing Logic

### Decision Flow

```
┌─────────────────────────┐
│ User Query Received     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Language Detection      │
│ (DE/FR/IT/EN)          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Jurisdiction Analysis   │
└───────────┬─────────────┘
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
┌──────────┐  ┌──────────┐
│ Federal? │  │ Cantonal?│
└─────┬────┘  └─────┬────┘
      │             │
      │             ▼
      │      ┌────────────────┐
      │      │ Which Canton?  │
      │      │ ZH/BE/GE/BS/   │
      │      │ VD/TI          │
      │      └────────┬───────┘
      │               │
      ▼               ▼
┌──────────────────────────┐
│ Activate Appropriate Mode│
│ - Federal Law Mode       │
│ - Cantonal Law Mode + CT │
│ - Multi-Lingual Mode     │
└──────────────────────────┘
```

### Routing Rules

#### Rule 1: Explicit Canton Mention
```python
if canton_code in ["ZH", "BE", "GE", "BS", "VD", "TI"]:
    activate_mode("Cantonal_Law", canton=canton_code)
    apply_language(canton_primary_language[canton_code])
```

#### Rule 2: Federal Statute Citation
```python
if statute in ["ZGB", "OR", "StGB", "StPO", "ZPO", "BV"]:
    activate_mode("Federal_Law")
    # But check for cantonal execution provisions
```

#### Rule 3: BGE Citation
```python
if "BGE" in query or "ATF" in query or "DTF" in query:
    activate_mode("Federal_Law")
    primary_source = "bundesgericht"
```

#### Rule 4: Cross-Cantonal Issue
```python
if multiple_cantons_mentioned:
    activate_mode("Federal_Law")
    note_cantonal_variations = True
```

#### Rule 5: Ambiguous Query
```python
if no_clear_jurisdiction:
    activate_mode("Federal_Law")  # Default
    allow_clarification_questions = True
```

---

## ⚖️ Federal vs. Cantonal Law Matrix

### Areas of Law by Jurisdiction

| Legal Area | Federal | Cantonal | Notes |
|------------|---------|----------|-------|
| Civil Law (ZGB) | ✓ Primary | - | Federal competence |
| Obligations (OR) | ✓ Primary | - | Federal competence |
| Criminal Law | ✓ Primary | Limited | Federal StGB, cantonal execution |
| Civil Procedure | ✓ Framework | ✓ Details | ZPO federal, cantonal specifics |
| Criminal Procedure | ✓ Primary | ✓ Execution | StPO federal framework |
| Administrative Law | ✓ Federal matters | ✓ Cantonal matters | Divided competence |
| Tax Law | ✓ Federal taxes | ✓ Cantonal taxes | Parallel systems |
| Construction Law | - | ✓ Primary | Cantonal competence |
| Education Law | - | ✓ Primary | Cantonal competence |
| Police Law | Limited | ✓ Primary | Cantonal competence |
| Health Law | ✓ Framework | ✓ Execution | Mixed competence |
| Environmental Law | ✓ Framework | ✓ Execution | Mixed competence |

---

## 🌐 Multi-Lingual Routing

### Language Detection

```yaml
language_detection:
  primary_indicators:
    german: ["der", "und", "das", "ist", "Recht", "Gesetz"]
    french: ["le", "la", "et", "droit", "loi", "sont"]
    italian: ["il", "la", "diritto", "legge", "sono"]
    english: ["the", "and", "law", "act", "are"]

  legal_term_indicators:
    german: ["Vertrag", "Haftung", "Schaden", "Anspruch"]
    french: ["contrat", "responsabilité", "dommage", "prétention"]
    italian: ["contratto", "responsabilità", "danno", "pretesa"]

  citation_format:
    german: "Art. 123 OR", "BGE"
    french: "art. 123 CO", "ATF"
    italian: "art. 123 CO", "DTF"
```

### Language-Canton Mapping

```yaml
primary_language_by_canton:
  ZH: de
  BE: [de, fr]  # Bilingual
  GE: fr
  BS: de
  VD: fr
  TI: it

language_handling:
  - Detect input language
  - Use canton's primary language for output
  - Maintain terminology consistency
  - Allow language switching mid-conversation
```

---

## 🔧 Configuration File Structure

### User Configuration (~/.betterask/config.yaml)

```yaml
# BetterCallClaude Configuration
version: "1.0.0"

# Geographic/Practice Focus
canton_focus:
  - ZH  # Primary jurisdiction
  - GE  # Secondary jurisdiction

practice_areas:
  - corporate
  - litigation

# Language Preferences
languages:
  input: [de, fr, en]  # Accept these input languages
  output_preference: de  # Prefer German output
  auto_detect: true  # Auto-detect input language

# Jurisdiction Routing
jurisdiction:
  default_mode: federal  # federal | cantonal
  default_canton: ZH  # If cantonal mode without specification
  cross_cantonal_strategy: federal_analysis  # federal_analysis | comparative

# Federal Law Settings
federal_law:
  bge_search_enabled: true
  precedent_depth: comprehensive  # quick | standard | comprehensive
  doctrine_references: true

# Cantonal Law Settings
cantonal_law:
  enabled_cantons: [ZH, BE, GE, BS, VD, TI]
  court_decisions: true
  local_specifics: true

# Multi-Lingual Settings
multi_lingual:
  terminology_verification: strict  # strict | relaxed
  citation_format_adaptation: true
  translation_notes: true  # Note when terms don't translate directly
```

---

## 📊 Routing Examples

### Example 1: Federal Contract Law
```
Query: "Vertragshaftung gemäss Art. 97 OR"
Detection:
  - Language: German
  - Statute: OR (federal)
  - Domain: Contract law
Routing: Federal Law Mode
Output Language: German
```

### Example 2: Zürich Cantonal Tax
```
Query: "cantonal tax law in Zurich"
Detection:
  - Language: English
  - Canton: ZH
  - Domain: Tax law (cantonal competence)
Routing: Cantonal Law Mode (ZH)
Output Language: German (ZH primary) or English (user preference)
```

### Example 3: Geneva Arbitration
```
Query: "procédure d'arbitrage international à Genève"
Detection:
  - Language: French
  - Canton: GE
  - Domain: International arbitration
Routing: Cantonal Law Mode (GE) + International Law aspects
Output Language: French
```

### Example 4: Ticino Cross-Border
```
Query: "diritto successorio transfrontaliero Ticino-Italia"
Detection:
  - Language: Italian
  - Canton: TI
  - Domain: Succession law (cross-border)
Routing: Federal Law Mode (ZGB) + Cantonal specifics (TI) + International
Output Language: Italian
```

### Example 5: Ambiguous Query
```
Query: "liability for breach of contract"
Detection:
  - Language: English
  - No explicit jurisdiction
  - Federal domain (OR)
Routing: Federal Law Mode (default)
Output Language: English
Note: "This analysis applies federal Swiss law (OR). Please specify if cantonal aspects are relevant."
```

---

## 🎯 Integration with Personas

### Persona-Jurisdiction Coordination

**Legal Researcher**:
- Activates appropriate court decision databases
- ZH query → searches gerichte.zh.ch
- BGE query → searches bundesgericht.ch
- Multi-canton → searches all relevant sources

**Case Strategist**:
- Considers procedural law jurisdiction
- Federal ZPO vs. cantonal procedural specifics
- Forum shopping analysis when multiple jurisdictions possible

**Legal Drafter**:
- Applies correct legal framework
- Canton-specific contract clauses
- Proper citation format for jurisdiction

---

## 🔄 Dynamic Routing

### Context-Aware Switching

```python
# Conversation context management
conversation_context = {
    "primary_jurisdiction": "federal",
    "secondary_jurisdiction": ["ZH"],
    "language": "de",
    "practice_area": "corporate"
}

# Allow jurisdiction switching mid-conversation
if new_canton_mentioned:
    update_context(canton=new_canton)
    note_to_user("Switching to [Canton] cantonal law context")

if federal_question_in_cantonal_context:
    temporarily_switch("federal")
    note_federal_cantonal_interplay()
```

---

## ⚠️ Quality Assurance

### Jurisdiction Verification

Before providing legal analysis:
1. ✓ Confirm jurisdiction is correctly identified
2. ✓ Verify federal vs. cantonal competence
3. ✓ Check for conflicts between levels
4. ✓ Note any cantonal variations if federal law
5. ✓ Provide jurisdiction disclaimer if ambiguous

### Multi-Level Analysis

For complex issues:
```
1. Federal Law baseline (ZGB, OR, etc.)
2. Cantonal law variations (if applicable)
3. BGE precedents (federal)
4. Cantonal court precedents
5. Conflicts and harmonization
```

---

**Swiss Law Jurisdiction Routing - BetterCallClaude v1.0.0**
