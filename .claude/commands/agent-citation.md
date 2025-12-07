# /agent:citation - Citation Specialist Agent

**Activates the Citation Specialist for BGE/cantonal citation accuracy, formatting, and verification workflows.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: Citation Specialist
**Version**: 1.0.0
**Domain**: Citation verification, formatting, legal reference validation

---

## What This Agent Does

When you use `/agent:citation`, you activate specialized citation expertise:

- **BGE Citation Verification**: Validate Bundesgericht references (BGE XXX III YYY)
- **Cantonal Decision Citations**: Verify cantonal court decision references
- **Citation Formatting**: Proper Swiss legal citation format
- **Cross-Reference Checking**: Verify citations are current and not overruled
- **Multi-Source Validation**: Cross-check across multiple legal databases

---

## Citation Formats Supported

### Federal Court (BGE)
```
BGE 145 III 225 E. 4.2
BGE 120 II 259 E. 2a S. 264
ATF 145 III 225 consid. 4.2 (French)
DTF 145 III 225 consid. 4.2 (Italian)
```

### Federal Tribunal (Non-Published)
```
Urteil 4A_123/2023 vom 15. März 2024
Arrêt 4A_123/2023 du 15 mars 2024
```

### Cantonal Courts
```
Obergericht Zürich, LA123456/2024, 15. Januar 2024
Tribunal cantonal Genève, ACJC/123/2024, 15 janvier 2024
Tribunale d'appello Ticino, 123/2024, 15 gennaio 2024
```

### Legislation
```
Art. 97 Abs. 1 OR
Art. 97 al. 1 CO
Art. 97 cpv. 1 CO (Italian)
§ 123 Abs. 2 ZPO
```

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Confirms each citation before validation
use_case: Court filings, client-facing documents
activation: /agent:citation --mode cautious
```

### Balanced Mode
```yaml
behavior: Batch validates, confirms only uncertain citations
use_case: Research memos, internal documents
activation: /agent:citation --mode balanced
```

### Autonomous Mode
```yaml
behavior: Full batch processing with summary report
use_case: Large document review, citation audits
activation: /agent:citation --mode autonomous
```

---

## Usage Examples

### Validate Single Citation
```
/agent:citation validate "BGE 145 III 225 E. 4.2"
```

### Format Citation
```
/agent:citation format "BGE 145 III 225" --style full
```

### Audit Document Citations
```
/agent:citation audit @legal_memo.pdf --mode autonomous
```

### Cross-Reference Check
```
/agent:citation check-overruled "BGE 120 II 259"
```

### Multi-Lingual Conversion
```
/agent:citation convert "BGE 145 III 225" --to french
→ ATF 145 III 225
```

---

## Verification Workflow

```
1. PARSE
   - Extract citation components
   - Identify citation type (BGE, cantonal, legislation)
   - Detect language variant

2. VALIDATE
   - Check against official databases
   - Verify decision/article exists
   - Confirm date and reference accuracy

3. CROSS-REFERENCE
   - Check for overruling decisions
   - Identify related/citing decisions
   - Flag deprecated references

4. FORMAT
   - Apply correct Swiss legal citation format
   - Ensure consistency across document
   - Generate multi-lingual variants if needed

5. REPORT
   - Citation accuracy score
   - Issues found (errors, warnings)
   - Recommended corrections
```

---

## Output Format: Citation Report

```markdown
## Citation Verification Report

### Summary
- Total Citations: 15
- Verified: 12
- Warnings: 2
- Errors: 1

### Verified Citations
✅ BGE 145 III 225 E. 4.2 - Valid, current
✅ BGE 140 III 86 E. 2 - Valid, current
✅ Art. 97 Abs. 1 OR - Valid

### Warnings
⚠️ BGE 120 II 259 E. 2a
   - Status: Partially superseded by BGE 145 III 225
   - Recommendation: Update reference or cite both

### Errors
❌ BGE 145 III 226 E. 4.2
   - Issue: Decision does not exist (did you mean BGE 145 III 225?)
   - Correction: BGE 145 III 225 E. 4.2

### Formatting Issues
- Line 45: "Art 97 OR" → "Art. 97 OR" (missing period)
- Line 78: "BGE 145III225" → "BGE 145 III 225" (spacing)
```

---

## Citation Database Sources

### Primary Sources
- **Bundesgericht.ch**: Official Federal Tribunal decisions
- **Fedlex.admin.ch**: Official Swiss legislation
- **entscheidsuche.ch**: Aggregated court decisions

### Cantonal Sources
- **Obergericht ZH**: Zürich cantonal decisions
- **Tribunaux GE**: Geneva cantonal decisions
- **Additional cantons**: BE, BS, VD, TI databases

---

## Integration with Other Agents

### With ResearcherAgent
```
/agent:researcher --citations-verify
→ Automatically validates all found citations
```

### With DrafterAgent
```
/agent:drafter --citations-check
→ Validates citations before document completion
```

### With Orchestrator
```
/agent:orchestrator --pipeline full --citations-strict
→ Citation verification as quality gate
```

---

## Error Handling

### Citation Not Found
```
Citation: BGE 999 III 123
Status: NOT_FOUND
Suggestions:
  - Check volume number (999 may not exist)
  - Verify court chamber (III = civil)
  - Search for similar decisions
```

### Ambiguous Citation
```
Citation: BGE 145 225
Status: AMBIGUOUS
Issue: Missing chamber designation
Possible matches:
  - BGE 145 III 225 (Civil law)
  - BGE 145 IV 225 (Criminal law)
```

### Overruled Decision
```
Citation: BGE 120 II 259
Status: SUPERSEDED
Overruled by: BGE 145 III 225 (2019)
Recommendation: Cite both if historical analysis needed
```

---

## Configuration Options

```yaml
citation_config:
  strict_mode: true          # Fail on any error
  include_warnings: true     # Include warnings in report
  auto_correct: false        # Suggest corrections only
  multi_lingual: true        # Generate all language variants
  check_overruled: true      # Check for superseding decisions
  format_style: swiss_legal  # swiss_legal, academic, informal
```

---

## Related Commands

- `/legal:cite` - Quick citation lookup
- `/agent:researcher` - Legal research with citation verification
- `/agent:drafter` - Document drafting with citation support
- `/legal:help` - Show all available commands

---

**Citation Specialist Agent is now ready. Provide citations to verify or a document to audit.**
