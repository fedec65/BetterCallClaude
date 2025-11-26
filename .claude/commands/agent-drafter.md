# /agent:drafter - DrafterAgent Framework Integration

**Activates the Python DrafterAgent for professional Swiss legal document generation with multi-lingual support and jurisdiction-specific formatting.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: DrafterAgent (Python)
**Version**: 1.2.0
**Dependencies**: Legal Models, Citation Verification

---

## What This Command Does

When you use `/agent:drafter`, you activate the **document generation framework** with:

- **Document Templates**: Swiss legal document structures (Klageschrift, Rechtsgutachten, Vertrag, etc.)
- **Multi-lingual Support**: Full DE/FR/IT/EN capability with legal terminology
- **Citation Integration**: Automatic BGE/SR citation formatting and verification
- **Section Management**: Proper section ordering and formatting
- **Checkpoint System**: User review for long documents and citation validation

---

## Document Types

### Court Submissions (Prozessschriften)
| Type | German | French | Italian |
|------|--------|--------|---------|
| `klageschrift` | Klageschrift | Demande | Petizione |
| `klageantwort` | Klageantwort | Réponse | Risposta |
| `replik` | Replik | Réplique | Replica |
| `duplik` | Duplik | Duplique | Duplica |
| `berufung` | Berufung | Appel | Appello |

### Legal Opinions (Gutachten)
| Type | German | French | Italian |
|------|--------|--------|---------|
| `rechtsgutachten` | Rechtsgutachten | Avis de droit | Parere legale |
| `memorandum` | Memorandum | Mémorandum | Memorandum |
| `kurzgutachten` | Kurzgutachten | Note juridique | Nota legale |

### Contracts (Verträge)
| Type | German | French | Italian |
|------|--------|--------|---------|
| `vertrag` | Vertrag | Contrat | Contratto |
| `kaufvertrag` | Kaufvertrag | Contrat de vente | Contratto di vendita |
| `mietvertrag` | Mietvertrag | Bail | Contratto di locazione |
| `arbeitsvertrag` | Arbeitsvertrag | Contrat de travail | Contratto di lavoro |

### Correspondence
| Type | German | French | Italian |
|------|--------|--------|---------|
| `mahnung` | Mahnung | Mise en demeure | Diffida |
| `kuendigung` | Kündigung | Résiliation | Disdetta |

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Checkpoint after each major section
use_case: Client documents, court submissions, complex drafts
activation: /agent:drafter --mode cautious
```

### Balanced Mode
```yaml
behavior: Checkpoint for long documents and citations only
use_case: Internal memos, routine contracts
activation: /agent:drafter --mode balanced
```

### Autonomous Mode
```yaml
behavior: Complete draft with final review only
use_case: Template-based documents, preliminary drafts
activation: /agent:drafter --mode autonomous
```

---

## Usage Examples

### Basic Document Drafting
```
/agent:drafter --type memorandum Draft legal analysis of contract termination options
```

### Court Submission (German)
```
/agent:drafter --type klageschrift --language de --jurisdiction ZH Draft Klageschrift for breach of contract
```

### Legal Opinion (French)
```
/agent:drafter --type rechtsgutachten --language fr Rédiger un avis de droit sur la responsabilité contractuelle
```

### Contract (Italian)
```
/agent:drafter --type vertrag --language it Contratto di compravendita immobiliare
```

### With Strategy Input
```
/agent:drafter --type klageschrift --from-strategy [use previous StrategistAgent output]
```

---

## Agent Workflow

```
1. UNDERSTAND
   - Parse document requirements
   - Identify document type and purpose
   - Extract case facts and party information
   - Determine jurisdiction and language

2. STRUCTURE
   - Select appropriate template
   - Generate section outline
   - Identify required vs optional sections
   - Set section ordering

3. DRAFT
   - Generate content section by section
   - Apply jurisdiction-specific formatting
   - Include legal terminology in target language
   - Checkpoint for long sections (>1000 words)

4. CITE
   - Add legal citations (BGE, SR, cantonal)
   - Format according to Swiss standards
   - Validate citation accuracy
   - Checkpoint for unverified citations

5. FORMAT
   - Apply Swiss legal document formatting
   - Number sections and paragraphs
   - Format headers and footers
   - Add court-specific requirements

6. REVIEW
   - Final document review
   - Word count and page estimate
   - Citation summary
   - Delivery with any warnings
```

---

## Document Structure Examples

### Klageschrift (Statement of Claim)
```markdown
## KLAGESCHRIFT

An das Bezirksgericht Zürich

### I. Rubrum
[Parties, representation, addresses]

### II. Rechtsbegehren
[Claims/prayers for relief]

### III. Sachverhalt
[Statement of facts]

### IV. Rechtliches
[Legal arguments]

### V. Beweismittel
[Evidence]

### VI. Schlussantrag
[Closing submissions]

[Signature, date, attachments]
```

### Rechtsgutachten (Legal Opinion)
```markdown
## RECHTSGUTACHTEN

### I. Auftrag
[Mandate description]

### II. Sachverhalt
[Facts]

### III. Fragestellung
[Legal questions]

### IV. Rechtliche Würdigung
[Legal analysis]

### V. Ergebnis
[Conclusions]

### VI. Empfehlung
[Recommendations]
```

---

## Multi-Language Legal Terminology

### German (de)
```
Kläger, Beklagter, Rechtsbegehren, Sachverhalt,
Rechtliches, Beweismittel, Art. 97 OR
```

### French (fr)
```
Demandeur, Défendeur, Conclusions, État de fait,
En droit, Offres de preuves, art. 97 CO
```

### Italian (it)
```
Attore, Convenuto, Conclusioni, Fatti,
In diritto, Mezzi di prova, art. 97 CO
```

---

## Citation Formatting

### BGE Citations
```
BGE 145 III 225 E. 4.2
BGE 120 II 259 E. 2a
```

### Federal Law Citations
```
Art. 97 Abs. 1 OR (DE)
art. 97 al. 1 CO (FR)
art. 97 cpv. 1 CO (IT)
```

### Cantonal References
```
Obergericht Zürich, Urteil vom 15.3.2023
Tribunal cantonal vaudois, arrêt du 15.3.2023
```

---

## Output Format

```markdown
### Document Summary

**Type**: Klageschrift
**Language**: German (de)
**Jurisdiction**: Zurich (ZH)
**Word Count**: 2,450
**Page Estimate**: 8-9 pages
**Sections**: 6

### Citation Summary
- BGE Citations: 5 (all verified)
- Federal Law: 12 references
- Cantonal: 2 references

### Warnings
- Section IV exceeds typical length
- 1 citation requires manual verification

### Full Document
[Complete document text follows...]
```

---

## Checkpoint System

### Section Checkpoints
- **Long sections (>1000 words)**: Review before continuing
- **Court submissions**: Checkpoint after Rechtsbegehren/Conclusions

### Citation Checkpoints
- **Unverified citations**: Require user confirmation
- **Multiple BGE references**: Summary checkpoint

### Document Checkpoints
- **>5000 words**: Checkpoint at 50% and 75%
- **Court documents**: Final review before delivery

---

## Comparison: /agent:drafter vs /legal:draft

| Feature | /agent:drafter | /legal:draft |
|---------|----------------|--------------|
| Framework | Python Agent | Persona-based |
| Templates | Structured | Flexible |
| Citations | Auto-formatted | Manual |
| Checkpoints | Automated | None |
| Multi-lingual | Full support | Session-based |
| From Strategy | Direct integration | Manual transfer |

**When to use /agent:drafter:**
- Formal court submissions
- Structured document templates
- Multi-lingual requirements
- Citation-heavy documents
- Pipeline from StrategistAgent

**When to use /legal:draft:**
- Quick drafts and outlines
- Exploratory document creation
- Mixed content types
- Informal correspondence

---

## Integration with Other Agents

### Strategy → Draft Pipeline
```
/agent:orchestrator --pipeline strategy_to_draft --type klageschrift
```

### Full Pipeline
```
/agent:orchestrator --pipeline full "Research → Strategy → Draft for breach of contract"
```

### From Researcher Output
```
/agent:drafter --type rechtsgutachten --from-research [use previous ResearcherAgent output]
```

---

## Related Commands

- `/agent:researcher` - Legal research with MCP integration
- `/agent:strategist` - Litigation strategy development
- `/agent:orchestrator` - Multi-agent pipeline coordination
- `/legal:draft` - Persona-based document drafting
- `/legal:help` - Show all available commands

---

**DrafterAgent is now ready. Specify document type and provide your drafting requirements.**
