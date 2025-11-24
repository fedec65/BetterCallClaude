# Legal Citations MCP Server

Multi-lingual Swiss legal citation verification and formatting MCP server for BetterCallClaude.

## Features

- ✅ **Citation Validation**: Validate BGE/ATF/DTF and federal statutory citations
- 🌐 **Multi-Lingual Support**: Native DE/FR/IT/EN citation formatting
- 🔄 **Citation Conversion**: Convert citations between languages while preserving legal meaning
- 📝 **Citation Parsing**: Extract components and detect citation types automatically

## Supported Citation Types

### Court Decisions
- **BGE** (Bundesgericht - German)
- **ATF** (Arrêts du Tribunal fédéral - French)
- **DTF** (Decisioni del Tribunale federale - Italian)

Format: `BGE/ATF/DTF [volume] [chamber] [page]`
Example: `BGE 147 IV 73`

### Federal Statutes
Supported statutes: ZGB/CC, OR/CO, StGB/CP, StPO/CPP, ZPO/CPC, BV/Cst, SchKG/LP, DSG/LPD, and more

Format (German): `Art. [number] [Abs. X] [lit. a] [statute]`
Example: `Art. 97 Abs. 1 OR`

Format (French): `art. [number] [al. X] [let. a] [statute]`
Example: `art. 97 al. 1 CO`

Format (Italian): `art. [number] [cpv. X] [lett. a] [statute]`
Example: `art. 97 cpv. 1 CO`

## MCP Tools

### 1. validate_citation
Validate a Swiss legal citation.

**Input:**
```json
{
  "citation": "BGE 147 IV 73"
}
```

**Output:**
```json
{
  "valid": true,
  "type": "bge",
  "normalized": "BGE 147 IV 73",
  "components": {
    "volume": "147",
    "chamber": "IV",
    "page": "73"
  }
}
```

### 2. format_citation
Format a citation to a specific language.

**Input:**
```json
{
  "citation": "BGE 147 IV 73",
  "targetLanguage": "fr",
  "fullStatuteName": false
}
```

**Output:**
```json
{
  "original": "BGE 147 IV 73",
  "formatted": "ATF 147 IV 73",
  "language": "fr",
  "type": "bge"
}
```

### 3. convert_citation
Convert a citation from one language to another (auto-detects source).

**Input:**
```json
{
  "citation": "Art. 97 Abs. 1 OR",
  "targetLanguage": "fr"
}
```

**Output:**
```json
{
  "original": "Art. 97 Abs. 1 OR",
  "sourceLanguage": "de",
  "targetLanguage": "fr",
  "converted": "art. 97 al. 1 CO",
  "allTranslations": {
    "de": "Art. 97 Abs. 1 OR",
    "fr": "art. 97 al. 1 CO",
    "it": "art. 97 cpv. 1 CO",
    "en": "Art. 97 para. 1 CO"
  }
}
```

### 4. parse_citation
Parse and extract components from a citation.

**Input:**
```json
{
  "citation": "Art. 97 Abs. 1 lit. a OR"
}
```

**Output:**
```json
{
  "original": "Art. 97 Abs. 1 lit. a OR",
  "type": "statute",
  "language": "de",
  "components": {
    "statute": "OR",
    "article": "97",
    "paragraph": "1",
    "letter": "a"
  },
  "isValid": true
}
```

## Installation

```bash
cd mcp-servers/legal-citations
npm install
npm run build
```

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run watch

# Run tests
npm test

# Test coverage
npm run test:coverage

# Development server
npm run dev
```

## Testing

Comprehensive unit tests with >85% coverage:
- Citation validation tests
- Multi-lingual formatting tests
- Citation parsing tests
- Component extraction tests

Run tests:
```bash
npm test
```

## Integration with BetterCallClaude

This MCP server integrates with the BetterCallClaude framework:

1. **Legal Researcher Persona**: Uses citation validation for BGE/ATF/DTF searches
2. **Multi-Lingual Mode**: Leverages multi-lingual formatting for DE/FR/IT/EN
3. **Legal Drafter Persona**: Uses citation formatting for document creation

## Technical Details

- **TypeScript**: Fully typed with strict mode
- **MCP SDK**: @modelcontextprotocol/sdk ^1.0.4
- **Testing**: Vitest with comprehensive coverage
- **Architecture**: Validator → Parser → Formatter pattern

## Citation Examples

### German → French Conversion
```
Input:  Art. 97 Abs. 1 OR
Output: art. 97 al. 1 CO
```

### French → Italian Conversion
```
Input:  ATF 147 IV 73
Output: DTF 147 IV 73
```

### Complete Citation with All Components
```
German:  Art. 97 Abs. 1 lit. a Ziff. 2 OR
French:  art. 97 al. 1 let. a ch. 2 CO
Italian: art. 97 cpv. 1 lett. a n. 2 CO
```

## License

Part of BetterCallClaude Framework v1.0.0-alpha

## Author

Federico Cesconi - BetterCallClaude Project

---

**BetterCallClaude** - Legal Intelligence Framework for Swiss Lawyers
