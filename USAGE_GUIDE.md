# BetterCallClaude - Usage Guide

**Comprehensive Guide for Swiss Legal Intelligence Framework**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [Using Legal Personas](#using-legal-personas)
4. [Operational Modes](#operational-modes)
5. [Multi-Lingual Usage](#multi-lingual-usage)
6. [Canton-Specific Workflows](#canton-specific-workflows)
7. [Citation System](#citation-system)
8. [Common Workflows](#common-workflows)
9. [Advanced Features](#advanced-features)
10. [Best Practices](#best-practices)
11. [Examples Library](#examples-library)

---

## Quick Start

### Your First Query

After installation (see INSTALLATION.md), launch Claude Code:

```bash
cd /path/to/BetterCallClaude
claude-code
```

Try your first legal query:

```
What does Art. 97 OR say about liability for damages?
```

**What happens**:
1. Framework detects Swiss legal citation (Art. 97 OR)
2. Federal Law mode activates automatically
3. Legal Researcher persona engages
4. Response includes proper citation and explanation

---

## Core Concepts

### Framework Architecture

BetterCallClaude operates on three layers:

#### 1. **Personas** (Who)
Specialized legal experts that handle different task types:
- **Legal Researcher**: BGE precedent research, statute interpretation
- **Case Strategist**: Litigation strategy, risk assessment
- **Legal Drafter**: Contract drafting, document creation

#### 2. **Modes** (What)
Operational contexts that define jurisdiction and language:
- **Federal Law Mode**: Swiss federal statutes and BGE precedents
- **Cantonal Law Mode**: Canton-specific regulations (6 cantons)
- **Multi-Lingual Mode**: Native DE/FR/IT/EN legal reasoning

#### 3. **MCP Servers** (How - Phase 2)
Specialized tools for data access:
- **Entscheidsuche**: Court decision search
- **Legal Citations**: Citation verification via Fedlex

### Automatic Activation

**You don't need to manually activate personas or modes.** The framework automatically detects:
- Legal citations → Federal/Cantonal Law mode
- Query language → Multi-Lingual mode
- Task type → Appropriate persona
- Canton mentions → Canton-specific routing

---

## Using Legal Personas

### 1. Legal Researcher Persona

**When it activates**: Research questions, precedent requests, statute interpretation

**Capabilities**:
- BGE precedent research
- Federal statute interpretation
- Cantonal law research
- Multi-lingual legal research
- Citation verification

**Example Queries**:

```
Research BGE cases on employer liability under Art. 97 OR
```

```
Find all relevant precedents for breach of contract damages
```

```
What are the key principles from BGE 145 III 229?
```

**Output Format**:
```
🔍 **Legal Research Analysis**

**Statutory Basis**: Art. 97 OR (Haftung für Schaden)

**Key Precedents**:
1. **BGE 145 III 229** - Employer liability standards
   - Holding: [Summary]
   - Relevance: [Application]

2. **BGE 138 III 641** - Causation requirements
   - Holding: [Summary]
   - Relevance: [Application]

**Legal Interpretation**:
[Systematic analysis]

**Multi-Lingual Citations**:
- DE: Art. 97 OR
- FR: art. 97 CO
- IT: art. 97 CO
```

### 2. Case Strategist Persona

**When it activates**: Strategy questions, risk assessment, litigation planning

**Capabilities**:
- Case strength analysis
- Success probability calculation
- Risk assessment with BGE statistics
- Procedural strategy planning
- Settlement evaluation

**Example Queries**:

```
Analyze the strength of a breach of contract case with these facts: [facts]
```

```
What are the litigation risks for a dispute under Art. 97 OR?
```

```
Should we settle or proceed to trial? Here are the case facts: [facts]
```

**Output Format**:
```
⚖️ **Case Strategy Analysis**

**Legal Claims**:
1. Breach of Contract (Art. 97 OR)
2. [Additional claims]

**Strengths** ✅:
- Strong BGE support (BGE 145 III 229)
- Clear causation chain
- Documented damages

**Weaknesses** ⚠️:
- Contributory negligence argument
- Causation may be challenged

**Success Probability**: 65% ± 10% (Confidence: High)
**Basis**: Analysis of 47 similar BGE cases

**Strategic Recommendation**:
[Detailed strategy with risk mitigation]

**Procedural Considerations**:
- Jurisdiction: [Analysis]
- Timeline: [Estimate]
- Cost-benefit: [Assessment]
```

### 3. Legal Drafter Persona

**When it activates**: Drafting requests, contract creation, document generation

**Capabilities**:
- Swiss contract drafting (OR-compliant)
- Legal brief writing
- Multi-lingual document generation
- Citation formatting
- Template customization

**Example Queries**:

```
Draft a Swiss employment contract compliant with OR
```

```
Create a non-disclosure agreement for Swiss jurisdiction
```

```
Write a legal brief arguing for damages under Art. 97 OR
```

**Output Format**:
```
📝 **Legal Document Draft**

**Document Type**: Employment Contract
**Jurisdiction**: Swiss (Federal OR)
**Language**: [DE/FR/IT/EN]

**Structure**:

**PRÄAMBEL**
Zwischen [Party A] und [Party B]...

**ARTIKEL 1 - VERTRAGSGEGENSTAND**
1.1 Der Arbeitnehmer wird angestellt als...
    (Basis: Art. 319 ff. OR)

**ARTIKEL 2 - ARBEITSZEIT**
2.1 Die ordentliche Arbeitszeit beträgt...
    (Basis: Art. 321c OR)

[Complete draft with proper OR citations]

**Citation Verification**: ✅ All citations verified
**Compliance Check**: ✅ OR-compliant
```

---

## Operational Modes

### Federal Law Mode

**Auto-activates when**:
- Federal statute citations (ZGB, OR, StGB, BV, etc.)
- BGE precedent requests
- Federal competence questions

**Coverage**:
- Civil Law (ZGB, OR)
- Criminal Law (StGB, StPO)
- Constitutional Law (BV)
- Federal procedure (ZPO, StPO)

**Example Usage**:

```
Explain the formation of contracts under Art. 1-40 OR
```

```
What are the constitutional principles in BV Art. 9?
```

### Cantonal Law Mode

**Auto-activates when**:
- Canton name mentioned (Zürich, Bern, Geneva, Basel, Vaud, Ticino)
- Cantonal code citation
- Canton-specific questions

**Coverage**: 6 Cantons
- **ZH** (Zürich): German
- **BE** (Bern): German/French bilingual
- **GE** (Geneva): French
- **BS** (Basel-Stadt): German
- **VD** (Vaud): French
- **TI** (Ticino): Italian

**Canton Routing Logic**:
```
1. Detect canton (explicit code, name, or context)
2. Verify competence (cantonal vs. federal)
3. Apply canton-specific rules
4. Coordinate with federal baseline (Art. 49 BV)
```

**Example Usage**:

```
What are the construction regulations in Zürich?
```
**Output**: Canton ZH detected → Cantonal construction law analysis

```
Explain tax law in Geneva canton
```
**Output**: Canton GE detected → Geneva tax code (French)

```
How does Ticino handle inheritance law?
```
**Output**: Canton TI detected → TI specifics + federal ZGB baseline (Italian)

### Multi-Lingual Mode

**Always active** - Adapts to query language automatically

**Supported Languages**:
- **German (DE)**: Primary legal language
- **French (FR)**: Equal authenticity (Art. 70 BV)
- **Italian (IT)**: Equal authenticity (Art. 70 BV)
- **English (EN)**: Working language

**Language Detection**:
- Automatic from query language
- Maintains language consistency in response
- Provides cross-language equivalents for citations

**Example Usage**:

**German Query**:
```
Erkläre mir Art. 97 OR bezüglich Schadensersatz
```
**Response**: Complete German legal analysis with DE citations

**French Query**:
```
Explique-moi l'art. 97 CO concernant les dommages-intérêts
```
**Response**: Complete French legal analysis with FR citations

**Italian Query**:
```
Spiegami l'art. 97 CO riguardo al risarcimento danni
```
**Response**: Complete Italian legal analysis with IT citations

**Cross-Language Support**:
```
Provide Art. 97 OR in all official languages
```
**Response**:
- **DE**: Art. 97 Abs. 1 OR - Haftung für Schaden
- **FR**: art. 97 al. 1 CO - Responsabilité pour le dommage
- **IT**: art. 97 cpv. 1 CO - Responsabilità per danno

---

## Canton-Specific Workflows

### Zürich (ZH) - German

**Competence Areas**: Construction, police, education, cantonal tax

**Example**:
```
What are Zürich's building regulations for residential construction?
```

**Framework Response**:
1. Detects: Canton ZH
2. Identifies: Cantonal construction law competence
3. Analyzes: ZH Baugesetz + federal minimum standards
4. Language: German
5. Output: ZH-specific regulations with federal coordination

### Geneva (GE) - French

**Competence Areas**: Construction, police, education, cantonal tax

**Example**:
```
Quelles sont les réglementations fiscales à Genève?
```

**Framework Response**:
1. Detects: Canton GE + French language
2. Identifies: Cantonal tax competence
3. Analyzes: GE tax code + federal harmonization
4. Language: French
5. Output: GE tax law with federal baseline

### Ticino (TI) - Italian

**Competence Areas**: Construction, police, education, cantonal tax

**Example**:
```
Quali sono le leggi sulla costruzione in Ticino?
```

**Framework Response**:
1. Detects: Canton TI + Italian language
2. Identifies: Cantonal construction competence
3. Analyzes: TI construction law + federal standards
4. Language: Italian
5. Output: TI-specific construction regulations

---

## Citation System

### Federal Statute Citations

**Format Patterns**:

| Language | Article | Paragraph | Example |
|----------|---------|-----------|---------|
| German | Art. | Abs. | Art. 97 Abs. 1 OR |
| French | art. | al. | art. 97 al. 1 CO |
| Italian | art. | cpv. | art. 97 cpv. 1 CO |
| English | Article | paragraph | Article 97 paragraph 1 CO |

**Automatic Formatting**:
```
Query: "Explain Art. 97 OR"
Framework: Detects German → formats as "Art. 97 OR"

Query: "Explique art. 97 CO"
Framework: Detects French → formats as "art. 97 CO"
```

### BGE Precedent Citations

**Format**: BGE/ATF/DTF [Band] [Abteilung] [Seite] E. [Erwägung]

**Examples**:
- **German**: BGE 145 III 229 E. 3.1
- **French**: ATF 145 III 229 consid. 3.1
- **Italian**: DTF 145 III 229 consid. 3.1

**Usage**:
```
Find and analyze BGE 145 III 229
```
**Framework**:
1. Recognizes BGE citation format
2. Extracts: Volume 145, Section III, Page 229
3. Searches precedent database (Phase 2 with MCP)
4. Provides citation in all languages
5. Analyzes legal holding and relevance

---

## Common Workflows

### Workflow 1: Legal Research

**Goal**: Find relevant BGE precedents and statutory provisions

**Steps**:
1. **Formulate Research Question**:
   ```
   Research BGE cases on employer liability for workplace accidents
   ```

2. **Framework Processes**:
   - Legal Researcher persona activates
   - Federal Law mode engages
   - Searches BGE database (Phase 2)

3. **Review Results**:
   - Precedent summaries
   - Statutory citations
   - Legal interpretation

4. **Deep Dive** (if needed):
   ```
   Analyze BGE 145 III 229 in detail
   ```

### Workflow 2: Case Strategy Development

**Goal**: Assess litigation risks and develop strategy

**Steps**:
1. **Provide Case Facts**:
   ```
   Analyze case strength: Employer failed to provide safety equipment,
   worker injured, claiming damages under Art. 97 OR
   ```

2. **Framework Processes**:
   - Case Strategist persona activates
   - Analyzes legal claims
   - Researches precedent success rates
   - Calculates probabilities

3. **Review Strategy**:
   - Strengths and weaknesses
   - Success probability
   - Risk assessment
   - Strategic recommendations

4. **Refine Strategy**:
   ```
   What if we add a claim under Art. 328 OR?
   ```

### Workflow 3: Contract Drafting

**Goal**: Create Swiss-compliant legal document

**Steps**:
1. **Specify Requirements**:
   ```
   Draft employment contract for Swiss company, 6-month probation,
   42-hour work week, termination notice 3 months
   ```

2. **Framework Processes**:
   - Legal Drafter persona activates
   - Federal Law mode (OR compliance)
   - Generates structured document

3. **Review Draft**:
   - OR citations for each provision
   - Compliance verification
   - Language consistency

4. **Customize**:
   ```
   Add confidentiality clause referencing Art. 321a OR
   ```

### Workflow 4: Multi-Lingual Legal Analysis

**Goal**: Analyze law in multiple official languages

**Steps**:
1. **Request Multi-Lingual Analysis**:
   ```
   Explain Art. 97 OR in all official languages
   ```

2. **Framework Processes**:
   - Multi-Lingual mode activates
   - Generates parallel analyses
   - Ensures terminology consistency

3. **Review Translations**:
   - German, French, Italian versions
   - Citation format adaptation
   - Legal terminology verification

### Workflow 5: Canton-Specific Analysis

**Goal**: Research cantonal regulations with federal coordination

**Steps**:
1. **Specify Canton**:
   ```
   What are construction permit requirements in Zürich (ZH)?
   ```

2. **Framework Processes**:
   - Canton ZH detection
   - Cantonal Law mode activates
   - Coordinates with federal baseline

3. **Review Analysis**:
   - ZH-specific regulations
   - Federal minimum standards
   - Application process

4. **Compare Cantons** (if needed):
   ```
   How do Geneva (GE) construction regulations differ from Zürich?
   ```

---

## Advanced Features

### Cross-Jurisdictional Analysis

**Use Case**: Compare federal and cantonal approaches

**Example**:
```
Compare tax treatment of holding companies: Federal vs. Zürich vs. Geneva
```

**Framework Output**:
- Federal baseline (Art. 49 BV)
- ZH cantonal tax code (German)
- GE cantonal tax code (French)
- Comparative analysis matrix

### Precedent Success Rate Analysis (Phase 2)

**Use Case**: Statistical analysis of BGE outcomes

**Example**:
```
What is the success rate for Art. 97 OR claims in BGE cases?
```

**Framework Output** (with Entscheidsuche MCP):
- Total BGE cases analyzed
- Success rate percentage
- Confidence intervals
- Trend analysis

### Automated Citation Verification (Phase 2)

**Use Case**: Verify all citations in a document

**Example**:
```
Verify all citations in this brief: [document text]
```

**Framework Output** (with Legal Citations MCP):
- Citation accuracy: 95%+
- Invalid citations flagged
- Fedlex cross-references
- Format corrections suggested

---

## Best Practices

### Query Formulation

**✅ Good Queries**:
```
Research BGE cases on employer liability under Art. 97 OR
```
- Specific legal provision
- Clear task type
- Relevant jurisdiction

```
Draft employment contract compliant with Swiss OR
```
- Explicit document type
- Jurisdiction specified
- Compliance requirement clear

**❌ Unclear Queries**:
```
Tell me about liability
```
- Too vague (which liability? which jurisdiction?)

```
Write a contract
```
- Missing type, jurisdiction, requirements

### Persona Selection

**Let the framework auto-select personas** based on query type:
- Research questions → Legal Researcher
- Strategy questions → Case Strategist
- Drafting requests → Legal Drafter

**Manual activation** (if needed):
```
I need the Legal Researcher persona to help with...
```

### Language Consistency

**Maintain language consistency** within a workflow:
```
# German workflow
Erkläre Art. 97 OR
[Framework responds in German]

Was sind die wichtigsten BGE Fälle?
[Framework continues in German]
```

**Switching languages** (if needed):
```
Now explain this in French: [concept]
```

### Citation Precision

**Use exact citations** when available:
```
✅ Analyze BGE 145 III 229
❌ Analyze that BGE case about liability
```

**For exploration**:
```
Find BGE cases related to employer liability
```

---

## Examples Library

### Example 1: Contract Law Research (German)

**Query**:
```
Erkläre mir die Vertragsbildung nach Art. 1-40 OR
```

**Expected Response**:
```
📚 **Vertragsrecht - Art. 1-40 OR**

**Rechtsgrundlagen**:
- Art. 1 OR: Vertragsabschluss durch Angebot und Annahme
- Art. 11 OR: Form des Vertrags
- Art. 19-20 OR: Willensmängel

**BGE Rechtsprechung**:
- BGE 138 III 401 - Angebot und Annahme
- BGE 145 III 1 - Vertragsauslegung

**Systematische Erklärung**:
[Detailed German legal analysis]
```

### Example 2: Litigation Strategy (English)

**Query**:
```
Analyze the strength of a breach of contract case where the defendant
failed to deliver goods worth CHF 50,000, citing force majeure
```

**Expected Response**:
```
⚖️ **Case Strategy Analysis - Breach of Contract**

**Legal Framework**: Art. 97, 107, 119 OR

**Claims**:
1. Breach of delivery obligation
2. Damages for non-performance

**Strengths** ✅:
- Written contract with clear delivery terms
- Documented damages (CHF 50,000)
- No valid force majeure (BGE standard)

**Weaknesses** ⚠️:
- Defendant's force majeure defense requires analysis
- Mitigation duty (Art. 44 OR)

**Success Probability**: 70% ± 12%
**Basis**: 23 similar BGE cases analyzed

**Strategic Recommendation**:
Proceed to litigation. Force majeure defense unlikely to succeed
based on BGE 142 III 433 standards...
```

### Example 3: Canton-Specific (French)

**Query**:
```
Quelles sont les règles de construction à Genève?
```

**Expected Response**:
```
🏗️ **Réglementation de la Construction - Canton de Genève**

**Compétence**: Cantonale (art. 75 Cst.)

**Loi genevoise**:
- Loi sur les constructions et installations diverses (LCI)
- Règlement d'application

**Coordination fédérale**:
- LAT (Loi sur l'aménagement du territoire)
- Standards minimaux fédéraux

**Procédure d'autorisation**:
1. Demande préalable de renseignements
2. Dépôt du dossier complet
3. Enquête publique (30 jours)
4. Décision du département

**Particularités genevoises**:
[GE-specific regulations in French]
```

### Example 4: Multi-Lingual Citation

**Query**:
```
Provide Art. 97 OR in all languages with explanation
```

**Expected Response**:
```
📖 **Art. 97 OR - Haftung für Schaden (Multi-Lingual)**

**Deutsch**:
Art. 97 Abs. 1 OR: "Kann die Erfüllung der Verbindlichkeit überhaupt
nicht oder nicht gehörig bewirkt werden, so hat der Schuldner für den
daraus entstehenden Schaden Ersatz zu leisten..."

**Français**:
art. 97 al. 1 CO: "Lorsque le créancier ne peut obtenir l'exécution
de l'obligation ou ne peut l'obtenir qu'imparfaitement, le débiteur
est tenu de réparer le dommage en résultant..."

**Italiano**:
art. 97 cpv. 1 CO: "Quando l'adempimento dell'obbligazione non sia
più possibile o non sia divenuto regolarmente possibile, il debitore
è tenuto al risarcimento del danno derivatone..."

**English** (Working Language):
Article 97 paragraph 1 CO: "Where performance of an obligation becomes
impossible or improperly performed, the obligor must compensate for
the resulting damage..."

**Legal Analysis**:
[Explanation in requested language]
```

---

## Troubleshooting Usage

### Issue: Wrong Persona Activates

**Problem**: Legal Researcher activates when you need Case Strategist

**Solution**: Be explicit about task type:
```
❌ "I have a case about Art. 97 OR"
✅ "Analyze litigation strategy for Art. 97 OR case with these facts..."
```

### Issue: Language Switching Mid-Query

**Problem**: Started in German, response switches to English

**Solution**: Maintain language consistency throughout:
```
✅ Keep entire query in one language
✅ If switching needed: "Now continue in French"
```

### Issue: Canton Not Detected

**Problem**: Query about Zürich treated as federal law

**Solution**: Use explicit canton codes:
```
❌ "construction law in Zurich"
✅ "construction law in Zürich (ZH)"
✅ "ZH construction law"
```

### Issue: Citation Format Wrong

**Problem**: Expected German format, got French

**Solution**: Query language determines citation format:
```
Query in German → Art. 97 Abs. 1 OR
Query in French → art. 97 al. 1 CO
```

---

## Quick Reference Card

### Essential Queries

```bash
# Framework Status
"Show BetterCallClaude framework status"

# Legal Research
"Research BGE cases on [topic]"
"Explain Art. [X] [statute]"

# Case Strategy
"Analyze case strength: [facts]"
"What is litigation risk for [situation]?"

# Contract Drafting
"Draft [document type] compliant with Swiss law"

# Multi-Lingual
"Erkläre [concept]"  # German
"Explique [concept]"  # French
"Spiega [concept]"   # Italian

# Canton-Specific
"[Question] in Zürich (ZH)"
"[Question] à Genève (GE)"
"[Question] in Ticino (TI)"
```

### Key Shortcuts

| Task | Query Pattern |
|------|---------------|
| Statute lookup | "Explain Art. [X] [statute]" |
| BGE research | "Find BGE on [topic]" |
| Case analysis | "Analyze: [facts]" |
| Draft contract | "Draft [type] contract" |
| Canton query | "[Question] in [canton] ([code])" |
| Multi-lingual | Use query language naturally |

---

## Getting Help

### In-Framework Help

```
Show me how to use BetterCallClaude
```

```
What can the Legal Researcher persona do?
```

```
How do I query canton-specific law?
```

### External Resources

- **Installation Issues**: See INSTALLATION.md
- **Development Roadmap**: See IMPLEMENTATION_STATUS.md
- **GitHub Issues**: https://github.com/fedec65/BetterCallClaude/issues
- **Claude Code Docs**: https://docs.claude.com/claude-code

---

## Feedback and Contributions

Help improve BetterCallClaude:

1. **Report Issues**: GitHub Issues with detailed description
2. **Suggest Features**: Feature requests with use cases
3. **Contribute Code**: See IMPLEMENTATION_STATUS.md for priorities
4. **Share Workflows**: Document successful usage patterns

---

**Usage Guide Version**: 1.0.0
**Last Updated**: 2025-01-12
**Framework Version**: v1.0.0-alpha (Foundation Phase Complete)

**Built with ❤️ for the Swiss legal community**
