# /agent:translator - Legal Translator Agent

**Activates the Legal Translator for multi-lingual Swiss legal terminology translation across German, French, and Italian.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: Legal Translator
**Version**: 1.0.0
**Domain**: Legal translation DE/FR/IT, terminology, official legal language

---

## What This Agent Does

When you use `/agent:translator`, you activate specialized legal translation expertise:

- **Official Terminology**: Swiss official legal terminology (Terminologie)
- **Multi-Lingual Translation**: German ↔ French ↔ Italian legal texts
- **Legal Register**: Appropriate legal language register and style
- **Citation Conversion**: BGE/ATF/DTF citation format conversion
- **Document Translation**: Full legal document translation
- **Terminology Lookup**: Specific legal term equivalents

---

## Language Support

### Official Swiss Languages
```yaml
German (DE):
  - Bundesgericht (Federal Supreme Court)
  - OR, ZGB, StGB, ZPO (legislation abbreviations)
  - BGE (Bundesgerichtsentscheide)
  - Formal legal German style

French (FR):
  - Tribunal fédéral
  - CO, CC, CP, CPC (legislation abbreviations)
  - ATF (Arrêts du Tribunal fédéral)
  - Formal legal French style

Italian (IT):
  - Tribunale federale
  - CO, CC, CP, CPC (legislation abbreviations)
  - DTF (Decisioni del Tribunale federale)
  - Formal legal Italian style
```

### Terminology Sources
```yaml
Official_Sources:
  - Termdat (Swiss Confederation terminology database)
  - Fedlex official translations
  - Federal Supreme Court trilingual decisions
  - Federal Chancellery translation guidelines
```

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Confirms terminology choices, flags ambiguities
use_case: Court filings, official documents
activation: /agent:translator --mode cautious
```

### Balanced Mode
```yaml
behavior: Standard translation with confirmation on complex terms
use_case: Internal memos, correspondence
activation: /agent:translator --mode balanced
```

### Autonomous Mode
```yaml
behavior: Full translation with terminology report
use_case: Research, informational documents
activation: /agent:translator --mode autonomous
```

---

## Usage Examples

### Term Translation
```
/agent:translator term "Vertragsverletzung" --to fr,it
→ FR: violation du contrat / IT: violazione del contratto
```

### Document Translation
```
/agent:translator document @klageschrift.md --from de --to fr
```

### Citation Conversion
```
/agent:translator citation "BGE 145 III 225" --to french
→ ATF 145 III 225
```

### Bilingual Document
```
/agent:translator bilingual @contract.md --languages de,fr
→ Side-by-side German/French version
```

### Terminology Glossary
```
/agent:translator glossary @document.pdf --output xlsx
→ Extract and translate all legal terms
```

### Style Verification
```
/agent:translator verify-style @translation.pdf --target-language fr
→ Check for appropriate legal register
```

---

## Legal Terminology Database

### Contract Law (OR/CO)
| German | French | Italian |
|--------|--------|---------|
| Vertrag | contrat | contratto |
| Vertragsbruch | rupture de contrat | rottura del contratto |
| Erfüllung | exécution | adempimento |
| Schadenersatz | dommages-intérêts | risarcimento del danno |
| Verzug | demeure | mora |
| Haftung | responsabilité | responsabilità |
| Gewährleistung | garantie | garanzia |
| Kündigung | résiliation | disdetta |
| Verjährung | prescription | prescrizione |
| Willenserklärung | déclaration de volonté | dichiarazione di volontà |

### Civil Procedure (ZPO/CPC)
| German | French | Italian |
|--------|--------|---------|
| Klage | demande | azione/domanda |
| Kläger | demandeur | attore |
| Beklagter | défendeur | convenuto |
| Urteil | jugement | sentenza |
| Berufung | appel | appello |
| Beschwerde | recours | ricorso |
| Schlichtung | conciliation | conciliazione |
| Beweismittel | moyens de preuve | mezzi di prova |
| Vollstreckung | exécution forcée | esecuzione |
| Rechtshängigkeit | litispendance | litispendenza |

### Criminal Law (StGB/CP)
| German | French | Italian |
|--------|--------|---------|
| Straftat | infraction | reato |
| Vergehen | délit | delitto |
| Verbrechen | crime | crimine |
| Freiheitsstrafe | peine privative de liberté | pena detentiva |
| Geldstrafe | peine pécuniaire | pena pecuniaria |
| Busse | amende | multa |
| Vorsatz | intention | intenzione/dolo |
| Fahrlässigkeit | négligence | negligenza |
| Täter | auteur | autore |
| Anklage | accusation | accusa |

### Courts and Institutions
| German | French | Italian |
|--------|--------|---------|
| Bundesgericht | Tribunal fédéral | Tribunale federale |
| Bundesverwaltungsgericht | Tribunal administratif fédéral | Tribunale amministrativo federale |
| Obergericht | Tribunal cantonal / Cour suprême | Tribunale d'appello |
| Bezirksgericht | Tribunal d'arrondissement | Tribunale distrettuale |
| Handelsgericht | Tribunal de commerce | Tribunale di commercio |
| Staatsanwaltschaft | Ministère public | Ministero pubblico |
| Friedensrichter | Juge de paix | Giudice di pace |

---

## Output Format: Translation Report

```markdown
## Legal Translation Report

### Document Information
- **Source Language**: German
- **Target Language**: French
- **Document Type**: Klageschrift (Demande en justice)
- **Word Count**: 2,450
- **Legal Domain**: Contract Law

### Translation Summary

**Original Title**: Klageschrift betreffend Vertragsverletzung
**Translated Title**: Demande en justice relative à une violation du contrat

### Terminology Decisions

| Source Term | Translation | Confidence | Notes |
|-------------|-------------|------------|-------|
| Vertragsverletzung | violation du contrat | HIGH | Standard term |
| positive Vertragsverletzung | violation positive du contrat | HIGH | Doctrinal term |
| Mangelfolgeschaden | dommage consécutif au défaut | MEDIUM | Multiple options exist |
| Nachbesserung | réparation de l'ouvrage | HIGH | Construction context |

### Ambiguous Terms (Confirmed)

#### Term 1: "Werkvertrag"
- **Context**: Construction contract
- **Options**:
  - "contrat d'entreprise" (general)
  - "contrat de construction" (specific)
- **Selected**: "contrat d'entreprise"
- **Rationale**: Legal precision per Art. 363 CO

#### Term 2: "Gewährleistung"
- **Context**: Warranty claims
- **Options**:
  - "garantie" (general)
  - "garantie pour les défauts" (specific)
- **Selected**: "garantie pour les défauts"
- **Rationale**: Specificity for Art. 197 CO context

### Citation Conversions

| Original | Converted |
|----------|-----------|
| BGE 145 III 225 E. 4.2 | ATF 145 III 225 consid. 4.2 |
| BGE 140 III 86 E. 2 | ATF 140 III 86 consid. 2 |
| Art. 97 Abs. 1 OR | art. 97 al. 1 CO |
| Art. 368 Abs. 2 OR | art. 368 al. 2 CO |

### Legislation References

| German | French |
|--------|--------|
| Obligationenrecht (OR) | Code des obligations (CO) |
| Zivilprozessordnung (ZPO) | Code de procédure civile (CPC) |
| Bundesgerichtsgesetz (BGG) | Loi sur le Tribunal fédéral (LTF) |

### Style Verification
- ✅ Formal legal register maintained
- ✅ Consistent terminology throughout
- ✅ Official legislation citations used
- ✅ Court names properly translated

### Quality Metrics
- **Terminology Accuracy**: 98%
- **Style Consistency**: 95%
- **Citation Accuracy**: 100%
- **Overall Quality Score**: 97%

### Translator Notes
1. "Positive Vertragsverletzung" translated as doctrinal term; consider explanatory footnote for non-Swiss French readers
2. Currency amounts maintained in CHF (standard for Swiss proceedings)
3. Date format converted to French style (15 janvier 2024)
```

---

## Specialized Translation Features

### Legal Style Guide
```
/agent:translator style-guide --language fr
→ French legal writing conventions and standards
```

### Comparative Terminology
```
/agent:translator compare "Haftung" --systems "CH,DE,AT"
→ Compare terminology across German-speaking jurisdictions
```

### Canton-Specific Terms
```
/agent:translator cantonal --canton GE --term "Staatsanwaltschaft"
→ Cantonal terminology variations
```

### Latinisms
```
/agent:translator latin --term "pacta sunt servanda" --explain-in fr
→ Latin terms with French explanation
```

---

## Integration with Other Agents

### With Drafter
```
/agent:drafter --translate-to fr
→ Draft document with automatic French translation
```

### With Researcher
```
/agent:researcher --multi-lingual
→ Research in all three languages
```

### With Citation Specialist
```
/agent:citation --trilingual
→ Citations in all official languages
```

---

## Bilingual/Trilingual Output

### Side-by-Side Format
```
/agent:translator parallel @document.md --languages de,fr

Output:
| Deutsch | Français |
|---------|----------|
| Der Kläger... | Le demandeur... |
| beantragt... | requiert... |
```

### Trilingual Glossary
```
/agent:translator trilingual-glossary @terms.txt

Output:
| DE | FR | IT |
|----|----|----|
| Vertrag | contrat | contratto |
```

---

## Configuration Options

```yaml
translator_config:
  primary_language: de
  target_languages: [fr, it]
  terminology_source: termdat
  include_latin: true
  canton_variations: true
  style_register: formal_legal
  preserve_citations: true
  date_format: target_locale
```

---

## Related Commands

- `/agent:drafter` - Document drafting with translation
- `/agent:citation` - Citation format conversion
- `/agent:researcher` - Multi-lingual research
- `/legal:help` - Show all available commands

---

**Legal Translator Agent is now ready. Provide text, terms, or document for translation.**
