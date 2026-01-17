# Swiss Federal Court Search Command

Search Swiss Federal Supreme Court (Bundesgericht/BGE) decisions using both the BGE Search and Entscheidsuche MCP servers.

## Purpose
Find and analyze decisions from the Swiss Federal Supreme Court (Bundesgericht) across all chambers and legal areas.

## MCP Server Integration

This command integrates with two MCP servers:
1. **bge-search** - Specialized BGE citation search with validation
2. **entscheidsuche** - General court decision search with federal filter

## Available Tools

### From bge-search server:
- `search_bge`: Search BGE decisions by query, chamber, legal area, language
- `get_bge_decision`: Retrieve specific decision by citation (e.g., "BGE 147 V 321")
- `validate_citation`: Validate and normalize BGE citation format

### From entscheidsuche server:
- `search_decisions`: Search with `courtLevel: "federal"` filter
- `get_decision_details`: Retrieve full decision details by ID
- `get_related_decisions`: Find related federal decisions

## Usage Instructions

When this command is invoked, you should:

1. **Parse the user query** to understand their search intent
2. **Choose the appropriate MCP tool(s)**:
   - For BGE citation searches → use `search_bge` or `get_bge_decision`
   - For broader federal searches → use `search_decisions` with `courtLevel: "federal"`
   - For citation validation → use `validate_citation`
   - For precedent analysis → combine with `get_related_decisions`

3. **Execute MCP tool calls** with proper parameters
4. **Aggregate results** from both servers if needed
5. **Present formatted results** with decision citations, titles, summaries, and links

## Search Parameters

### Common filters:
- **query** (required): Search terms for title, summary, citation
- **language**: DE (German), FR (French), IT (Italian)
- **dateFrom/dateTo**: ISO 8601 date range (YYYY-MM-DD)
- **legalAreas**: Array of legal areas
- **limit**: Max results (1-100, default 10)

### BGE-specific filters:
- **chambers**: Array of chambers ["I", "II", "III", "IV", "V"]
  - I/III = Civil Law
  - II = Public Law
  - IV = Criminal Law
  - V = Social Insurance Law

## Example Workflows

### Simple federal search:
User: "Find federal decisions on employment law"
→ Call `search_decisions` with `courtLevel: "federal"` and `legalAreas: ["Arbeitsrecht"]`

### BGE citation lookup:
User: "Get BGE 147 V 321"
→ First validate with `validate_citation`
→ Then retrieve with `get_bge_decision`

### Comprehensive federal research:
User: "Research federal precedent on disability insurance since 2020"
→ Call `search_bge` with chambers=["V"], legalAreas=["Sozialversicherungsrecht"], dateFrom="2020-01-01"
→ For each result, call `get_related_decisions` to find precedent network
→ Synthesize findings across related decisions

## Error Handling

- If citation validation fails, inform user of correct format
- If no results found, suggest broadening search criteria
- If MCP server connection fails, provide clear error message
- Handle multilingual results appropriately
