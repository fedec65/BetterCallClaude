# Swiss Precedent Analysis Command

Analyze precedent relationships and citation networks in Swiss court decisions using the Entscheidsuche MCP server.

## Purpose
Find related decisions, analyze precedent chains, and understand the evolution of legal doctrine in Swiss law.

## MCP Server Integration

This command primarily uses the **entscheidsuche** MCP server with these tools:
- `search_decisions`: Initial decision discovery
- `get_decision_details`: Retrieve full decision information
- `get_related_decisions`: Find related decisions by legal area and jurisdiction

## Usage Instructions

When this command is invoked, you should:

1. **Identify the base decision** either by:
   - Decision ID provided by user
   - Search query to find relevant decisions first
   - BGE citation that needs precedent analysis

2. **Execute precedent discovery** using `get_related_decisions`

3. **Analyze relationships** by:
   - Grouping by legal area overlap
   - Identifying same-canton decisions (for cantonal law)
   - Tracing chronological development
   - Finding contradictions or evolving interpretations

4. **Build precedent network** recursively if needed:
   - Get related decisions for each result
   - Map citation patterns
   - Identify leading cases

5. **Present analysis** showing:
   - Direct precedents (same legal issue)
   - Analogous cases (similar principles)
   - Distinguishing factors
   - Temporal evolution of doctrine

## Example Workflows

### Precedent chain analysis:
User: "Find precedent for decision BG-2021-001"
→ Call `get_decision_details("BG-2021-001")` to understand the case
→ Call `get_related_decisions("BG-2021-001", limit=10)`
→ For key related decisions, recursively call `get_related_decisions`
→ Build precedent tree showing relationships

### Legal doctrine evolution:
User: "How has employment law precedent evolved on unfair dismissal?"
→ Search for employment law decisions with `legalAreas: ["Arbeitsrecht"]`
→ For each major decision, get related cases
→ Sort chronologically to show doctrine development
→ Highlight shifts in interpretation

## Relationship Types

When analyzing related decisions, identify:

1. **Direct Precedent** (⬆️) - Explicitly cited, same legal question, binding
2. **Analogous Authority** (↔️) - Similar principles, persuasive reasoning
3. **Distinguishable** (⚡) - Different facts, limited applicability
4. **Superseded** (❌) - Overruled, modified standard

## Advanced Features

### Precedent Strength Scoring
Evaluate precedent weight by:
- Court level (federal > cantonal > district)
- Temporal proximity
- Number of citations
- Consistency of application

### Citation Network Visualization
Show interconnections between decisions:
- Hub decisions (highly cited)
- Authority chains (A cites B cites C)
- Divergent lines (conflicting interpretations)
