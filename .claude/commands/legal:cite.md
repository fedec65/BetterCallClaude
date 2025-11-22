# Legal Citation Command (Enhanced)

Format, validate, and manage legal citations for Swiss law with BGE citation validation using the bge-search MCP server.

## Purpose
Generate properly formatted legal citations following Swiss legal citation standards, validate citation accuracy, and provide citation management tools.

## MCP Server Integration

This enhanced command uses the **bge-search** MCP server:
- `validate_citation`: Validate and normalize BGE citation format
- `get_bge_decision`: Retrieve decision to verify citation accuracy
- `search_bge`: Find correct citation when partial info provided

## Citation Standards

### BGE Citation Format
**Standard**: `BGE {volume} {chamber} {page}`
- **Volume**: Year-based volume number (e.g., 147, 148)
- **Chamber**: Roman numeral I-V
- **Page**: Starting page number

**Examples**:
- `BGE 147 V 321` - Social Insurance chamber decision
- `BGE 146 II 150` - Public Law chamber decision
- `BGE 148 III 65` - Civil Law chamber decision

### Chambers Reference
- **I** - Zivilrecht (Civil Law)
- **II** - Öffentliches Recht (Public Law)
- **III** - Zivilrecht (Civil Law)
- **IV** - Strafrecht (Criminal Law)
- **V** - Sozialversicherungsrecht (Social Insurance Law)

### Other Swiss Citations
- **Cantonal courts**: `[Court] [Reference] ([Date])`
  - Example: `Obergericht Zürich LA220050 (10.05.2023)`
- **Statutes**: `Art. [number] [statute abbreviation]`
  - Example: `Art. 123 OR` (Obligationenrecht)

## Usage Instructions

When this command is invoked, you should:

### 1. Citation Validation
For BGE citations, always validate before using:
```
Tool: validate_citation
Arguments: { "citation": "bge 147 v 321" }
Result: { "valid": true, "normalized": "BGE 147 V 321" }
```

### 2. Citation Correction
If validation fails, help user correct it:
- Identify common errors (wrong separator, case, spacing)
- Suggest correction
- Re-validate corrected version

### 3. Citation Lookup
Find citation when user has partial information:
```
Tool: search_bge
Arguments: { "query": "disability insurance mental health", "chambers": ["V"] }
Extract: Correct citation from results
```

### 4. Citation Verification
Verify citation accuracy and context:
```
Tool: get_bge_decision
Arguments: { "citation": "BGE 147 V 321" }
Verify: Citation exists, cited correctly, still good law
```

## Citation Generation Modes

### Mode 1: Format Existing Citation
Input: "BGE 147 V 321"
→ Validate with MCP
→ Return normalized format
→ Optionally add full title and date

### Mode 2: Find Citation
Input: "The BGE case about disability insurance from 2021"
→ Search MCP with query
→ Present matching citations
→ Format properly

### Mode 3: Bibliography Generation
Input: List of citations
→ Validate each with MCP
→ Sort appropriately
→ Format consistently
→ Check for duplicates

## Common Citation Errors

### Wrong separator
```
Input:  "BGE 147-V-321"
Correct: "BGE 147 V 321"
```

### Lowercase chamber
```
Input:  "BGE 147 v 321"
Correct: "BGE 147 V 321"
```

### Missing spaces
```
Input:  "BGE147V321"
Correct: "BGE 147 V 321"
```

## Quality Checks

Before presenting citations:
1. ✅ Validate format via MCP `validate_citation`
2. ✅ Verify decision exists via `get_bge_decision`
3. ✅ Check not overruled (compare dates with related decisions)
4. ✅ Ensure consistent formatting

## Integration with Other Commands

- Use `/swiss:federal` to find federal citations
- Use `/doc:analyze` to extract and validate citations from documents
- Use `/swiss:precedent` to format precedent chain citations

## Privacy & Best Practices

- Never fabricate citations
- Always validate via MCP before presenting
- Indicate if citation couldn't be verified
- Note if citation is to non-BGE source
