# /agent:strategist - StrategistAgent Framework Integration

**Activates the Python StrategistAgent for litigation strategy development with risk assessment, cost estimation, and opponent profiling.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: StrategistAgent (Python)
**Version**: 1.2.0
**Dependencies**: ResearcherAgent (optional), Legal Models

---

## What This Command Does

When you use `/agent:strategist`, you activate the **strategic analysis framework** with:

- **Risk Assessment**: Multi-dimensional risk analysis (litigation, cost, reputation)
- **Cost Estimation**: CHF-based calculations with Swiss court cost tables
- **Opponent Profiling**: Settlement tendency, financial capacity analysis
- **Strategy Recommendations**: Aggressive, Defensive, Settlement, or Hybrid approaches
- **Checkpoint System**: User confirmation for high-risk strategies

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Confirms before high-risk recommendations
use_case: Complex cases, high-value disputes, new clients
activation: /agent:strategist --mode cautious
```

### Balanced Mode
```yaml
behavior: Confirms at major checkpoints only
use_case: Routine litigation, familiar case types
activation: /agent:strategist --mode balanced
```

### Autonomous Mode
```yaml
behavior: Runs to completion with minimal interruption
use_case: Batch analysis, preliminary assessments
activation: /agent:strategist --mode autonomous
```

---

## Usage Examples

### Basic Strategy Development
```
/agent:strategist Analyze case: Contract breach under Art. 97 OR, dispute value CHF 150,000
```

### With Language Specification
```
/agent:strategist --language fr Développer une stratégie pour un litige de bail
```

### With Jurisdiction
```
/agent:strategist --jurisdiction ZH --language de Vertragsstreitigkeit gegen ABC GmbH
```

### With Opponent Information
```
/agent:strategist --opponent "XYZ AG, financial capacity high, settlement tendency likely" Analyze breach of contract case
```

---

## Strategy Types

| Strategy | Risk Level | When Recommended |
|----------|------------|------------------|
| **Aggressive** | High | Strong case, sufficient resources, time available |
| **Defensive** | Medium | Weaknesses present, cost concerns, risk mitigation |
| **Settlement** | Low | Both parties motivated, costs exceed benefits |
| **Hybrid** | Variable | Phased approach, flexible positioning |

---

## Agent Workflow

```
1. ANALYZE
   - Parse case facts
   - Identify legal issues
   - Assess evidence quality
   - Determine jurisdiction

2. ASSESS
   - Litigation risk analysis
   - Cost risk evaluation
   - Reputation impact assessment
   - Confidence scoring

3. ESTIMATE
   - Court costs calculation (Swiss tariffs)
   - Attorney fees estimation
   - Recovery potential analysis
   - Net outcome projection

4. STRATEGIZE
   - Strategy type selection
   - Success probability calculation
   - Alternative strategies
   - Timeline development

5. REVIEW
   - High-risk checkpoint (if applicable)
   - User confirmation for aggressive strategies
   - Final recommendation delivery
```

---

## Risk Assessment Output

```markdown
### Risk Assessment Summary

#### Overall Risk Level: [VERY_LOW|LOW|MEDIUM|HIGH|VERY_HIGH]

| Risk Dimension | Level | Score | Details |
|----------------|-------|-------|---------|
| Litigation Risk | HIGH | 0.7 | [analysis] |
| Cost Risk | MEDIUM | 0.5 | [analysis] |
| Reputation Risk | LOW | 0.3 | [analysis] |

**Weighted Score**: 0.52
**Confidence**: 0.85
**Requires Checkpoint**: Yes/No
```

---

## Cost Estimation Output

```markdown
### Cost Estimation (CHF)

| Category | Minimum | Most Likely | Maximum |
|----------|---------|-------------|---------|
| Court Costs | 8,000 | 12,000 | 18,000 |
| Attorney Fees | 15,000 | 25,000 | 40,000 |
| **Total** | 23,000 | 37,000 | 58,000 |

**Recovery Potential**: CHF 150,000
**Net if Successful**: CHF 113,000
**Uncertainty Factor**: 0.95

*Estimates based on Swiss court cost tables and standard attorney rates*
```

---

## Strategy Recommendation Output

```markdown
### Strategic Recommendation

**Recommended Strategy**: HYBRID
**Success Probability**: GOOD (60-80%)
**Expected Value**: CHF 67,500

#### Recommended Actions
1. Send formal demand letter with 30-day deadline
2. Prepare for mediation if demand rejected
3. File suit if settlement negotiations fail
4. Focus on documented evidence

#### Alternative Strategies
- AGGRESSIVE: Higher risk, potentially higher recovery
- SETTLEMENT: Lower risk, faster resolution

#### Timeline
- Phase 1 (Settlement Attempt): 4 weeks
- Phase 2 (Litigation Prep): 6 weeks
- Phase 3 (Court Proceedings): 16-24 weeks
```

---

## Multi-Language Support

### German (de)
```
/agent:strategist --language de Analysieren Sie den Vertragsstreit
```
Output includes German legal terminology and Swiss-specific formatting.

### French (fr)
```
/agent:strategist --language fr Analyser le litige contractuel
```
Output uses French legal terms and CO/CC references.

### Italian (it)
```
/agent:strategist --language it Analizzare la controversia contrattuale
```
Output in Italian with Ticino jurisdiction awareness.

---

## Checkpoint System

### Risk Checkpoints
- **HIGH/VERY_HIGH Risk**: Always requires user confirmation
- **Aggressive Strategy**: Checkpoint before recommendation
- **Costs > CHF 50,000**: Checkpoint for cost approval

### Checkpoint Format
```
🔴 CHECKPOINT: High-Risk Strategy Recommendation

Risk Level: HIGH
Proposed Strategy: AGGRESSIVE
Estimated Costs: CHF 45,000

Do you want to proceed with this recommendation?
[Approve] [Modify] [Reject]
```

---

## Comparison: /agent:strategist vs /legal:strategy

| Feature | /agent:strategist | /legal:strategy |
|---------|-------------------|-----------------|
| Framework | Python Agent | Persona-based |
| Risk Scoring | Quantitative | Qualitative |
| Cost Tables | Swiss tariffs | Estimates |
| Checkpoints | Automated | Manual |
| Multi-lingual | DE/FR/IT/EN | Session-based |
| Opponent Profile | Structured | Ad-hoc |

**When to use /agent:strategist:**
- Formal litigation strategy development
- Quantified risk/cost analysis needed
- Multi-lingual output required
- Checkpoint-controlled recommendations

**When to use /legal:strategy:**
- Quick strategic discussions
- Exploratory case analysis
- Mixed legal/business sessions

---

## Integration with Other Agents

### Research → Strategy Pipeline
```
/agent:orchestrator --pipeline research_to_strategy "Contract breach Art. 97 OR"
```

### Strategy → Draft Pipeline
```
/agent:orchestrator --pipeline strategy_to_draft --type klageschrift
```

---

## Related Commands

- `/agent:researcher` - Legal research with MCP integration
- `/agent:drafter` - Legal document generation
- `/agent:orchestrator` - Multi-agent pipeline coordination
- `/legal:strategy` - Persona-based strategic analysis
- `/legal:help` - Show all available commands

---

**StrategistAgent is now ready. Provide your case facts for strategic analysis.**
