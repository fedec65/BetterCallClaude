# /agent:researcher - ResearcherAgent Framework Integration

**Activates the TypeScript ResearcherAgent with MCP adapter integration for automated Swiss legal research workflows.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: ResearcherAgent (TypeScript)
**Version**: 1.0.0
**MCP Adapters**: entscheidsuche, legal-citations

---

## What This Command Does

When you use `/agent:researcher`, you activate the **full agent framework** with:

- **Autonomous Research Workflows**: Multi-step legal research with checkpoint recovery
- **MCP Server Integration**: Real connections to entscheidsuche and legal-citations
- **Audit Logging**: Complete action trail for professional compliance
- **Case Context Management**: Jurisdiction, parties, legal issues tracking
- **Autonomy Modes**: Cautious, Balanced, or Autonomous execution

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Confirms before each significant action
use_case: First-time usage, complex cases, client-facing work
activation: /agent:researcher --mode cautious
```

### Balanced Mode
```yaml
behavior: Confirms at key checkpoints only
use_case: Routine research, familiar topics
activation: /agent:researcher --mode balanced
```

### Autonomous Mode
```yaml
behavior: Runs to completion with minimal interruption
use_case: Batch processing, time-sensitive research
activation: /agent:researcher --mode autonomous
```

---

## Usage Examples

### Basic Legal Research
```
/agent:researcher Research BGE precedents on contractual liability under Art. 97 OR
```

### With Case Context
```
/agent:researcher --case "Contract Dispute 2024-001" Research foreseeability requirements for consequential damages
```

### With Autonomy Mode
```
/agent:researcher --mode autonomous --depth exhaustive Search all BGE on good faith in contract interpretation
```

### Multi-Jurisdictional Research
```
/agent:researcher --jurisdictions federal,ZH,BE Research construction permit procedures
```

---

## Research Depth Levels

| Level | Max Sources | Time Limit | Confidence Target |
|-------|-------------|------------|-------------------|
| quick | 10 | 2 min | 0.6 |
| standard | 20 | 5 min | 0.7 |
| deep | 40 | 8 min | 0.8 |
| exhaustive | 50+ | 10 min | 0.9 |

```
/agent:researcher --depth deep Research [topic]
```

---

## Agent Workflow

```
1. INITIALIZATION
   - Parse research question
   - Determine jurisdiction (federal/cantonal)
   - Set research depth and parameters
   - Initialize MCP connections

2. SEARCH PHASE
   - Connect to entscheidsuche MCP
   - Execute BGE/cantonal court searches
   - Filter by date, court, practice area
   - Multi-lingual query adaptation

3. VERIFICATION PHASE
   - Connect to legal-citations MCP
   - Validate all citations
   - Check for overruling/modification
   - Format citations properly

4. SYNTHESIS PHASE
   - Analyze patterns across precedents
   - Generate research findings
   - Calculate confidence scores
   - Identify gaps and conflicts

5. OUTPUT GENERATION
   - Create structured research memo
   - Include verified citations
   - Provide multi-lingual terminology
   - Add professional disclaimers
```

---

## Output Format: Research Memo

```markdown
## Legal Research Memo

### Executive Summary
[2-3 paragraph overview of findings]

### Methodology
- Research depth: [quick|standard|deep|exhaustive]
- Sources searched: [count]
- Date range: [from - to]
- Jurisdictions: [list]

### Key Findings

#### Finding 1: [Issue]
- **Conclusion**: [Legal position]
- **Supporting Citations**:
  - BGE 145 III 225 E. 4.2 Verified
  - BGE 120 II 259 E. 2a Verified
- **Confidence**: [0.0-1.0]
- **Conflicts**: [any contradicting precedents]

[Additional findings...]

### Verified Citations
[List of all verified citations with links]

### Limitations
- [Research limitations and gaps]

### Next Steps
- [Recommended follow-up research]

### Audit Information
- Agent ID: researcher
- Execution Time: [ms]
- Actions Taken: [count]
- Checkpoints: [count]
```

---

## Comparison: /agent:researcher vs /legal:research

| Feature | /agent:researcher | /legal:research |
|---------|-------------------|-----------------|
| Framework | TypeScript Agent | Persona-based |
| Autonomy Control | Yes (3 modes) | No |
| Checkpoint Recovery | Yes | No |
| Audit Logging | Comprehensive | Basic |
| Case Context | Full tracking | Query-based |
| Batch Processing | Supported | Limited |
| MCP Integration | Direct adapter | Via prompts |

**When to use /agent:researcher:**
- Complex multi-step research requiring checkpoints
- Professional compliance requiring audit trails
- Case-based research with context tracking
- Batch or autonomous processing needs

**When to use /legal:research:**
- Quick, interactive research queries
- Exploratory legal questions
- Mixed legal/non-legal sessions

---

## Error Handling and Recovery

### Checkpoint System
```
Pre-search checkpoint → Search checkpoint →
Verification checkpoint → Synthesis checkpoint
```

If research fails mid-way:
1. Agent saves state at last checkpoint
2. Partial results preserved
3. Recovery options presented
4. Resume capability for interrupted research

### Error Modes
```
recoverable: Escalates to cautious mode, continues
non_recoverable: Saves partial results, returns failure
```

---

## MCP Server Requirements

### entscheidsuche MCP
- **Purpose**: Swiss court decision search
- **Endpoint**: bundesgericht.ch, cantonal courts
- **Tools**: search_decisions, get_decision_details

### legal-citations MCP
- **Purpose**: Citation verification and formatting
- **Tools**: validate_citation, format_citation, parse_citation

Both servers must be running for full functionality.

---

## Related Commands

- `/legal:research` - Persona-based research (simpler)
- `/legal:strategy` - Case Strategist activation
- `/legal:draft` - Legal Drafter activation
- `/legal:help` - Show all available commands

---

## Configuration

### Agent Config (packages/agents/src)
```typescript
interface AgentConfig {
  autonomyMode: 'cautious' | 'balanced' | 'autonomous';
  caseContext?: CaseContext;
  userId?: string;
  firmId?: string;
}
```

### MCP Adapter Config
```typescript
interface MCPAdapterConfig {
  entscheidsuchePath?: string;
  legalCitationsPath?: string;
  timeout?: number;
}
```

---

**ResearcherAgent is now ready. Provide your research query.**
