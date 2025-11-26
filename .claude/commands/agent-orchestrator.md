# /agent:orchestrator - AgentOrchestrator Framework Integration

**Activates the Python AgentOrchestrator for multi-agent pipeline coordination with data passing and checkpoint aggregation.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: AgentOrchestrator (Python)
**Version**: 1.2.0
**Manages**: ResearcherAgent, StrategistAgent, DrafterAgent

---

## What This Command Does

When you use `/agent:orchestrator`, you activate the **pipeline coordination framework** with:

- **Multi-Agent Pipelines**: Chain Research → Strategy → Draft workflows
- **Data Passing**: Automatic output-to-input mapping between agents
- **Checkpoint Aggregation**: Collect and manage checkpoints across all agents
- **Error Handling**: Fail-fast or continue-on-error execution modes
- **Pipeline Templates**: Pre-built workflows for common legal tasks

---

## Available Pipelines

### research_to_strategy
```
ResearcherAgent → StrategistAgent
```
Research legal precedents, then develop litigation strategy.

### strategy_to_draft
```
StrategistAgent → DrafterAgent
```
Finalize strategy, then draft legal document.

### full_pipeline
```
ResearcherAgent → StrategistAgent → DrafterAgent
```
Complete workflow: Research → Strategy → Draft.

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Checkpoint between each agent execution
use_case: Complex cases, client work, first-time pipelines
activation: /agent:orchestrator --mode cautious
```

### Balanced Mode
```yaml
behavior: Checkpoint at major transitions only
use_case: Routine pipelines, familiar workflows
activation: /agent:orchestrator --mode balanced
```

### Autonomous Mode
```yaml
behavior: Run full pipeline with final review only
use_case: Batch processing, preliminary drafts
activation: /agent:orchestrator --mode autonomous
```

---

## Usage Examples

### Full Pipeline (Research → Strategy → Draft)
```
/agent:orchestrator --pipeline full "Contract breach under Art. 97 OR" --type klageschrift --language de
```

### Research to Strategy
```
/agent:orchestrator --pipeline research_to_strategy "BGE precedents on good faith" --jurisdiction ZH
```

### Strategy to Draft
```
/agent:orchestrator --pipeline strategy_to_draft --type rechtsgutachten --from-strategy [previous output]
```

### Custom Pipeline
```
/agent:orchestrator --steps "researcher,strategist" --task "Analyze and strategize for tenant dispute"
```

---

## Pipeline Configuration

### Default Configuration
```yaml
autonomy_mode: cautious
language: de
jurisdiction: federal
fail_fast: true
aggregate_checkpoints: true
max_retries: 2
timeout_seconds: 600
```

### Override Options
```
/agent:orchestrator --pipeline full \
  --language fr \
  --jurisdiction GE \
  --fail-fast false \
  --timeout 900
```

---

## Data Flow

### Research → Strategy Data Passing
```yaml
research_output:
  findings: → strategy_input.research_results
  citations: → strategy_input.precedents
  confidence: → strategy_input.research_confidence
```

### Strategy → Draft Data Passing
```yaml
strategy_output:
  recommendation: → draft_input.strategy_input
  risk_assessment: → draft_input.risk_context
  cost_estimate: → draft_input.cost_context
```

---

## Pipeline Execution Output

```markdown
### Pipeline Execution Summary

**Pipeline ID**: abc12345
**Status**: COMPLETED
**Total Duration**: 127.4 seconds

#### Steps Completed
1. ✅ research_output (34.2s)
2. ✅ strategy_output (48.7s)
3. ✅ document_output (44.5s)

#### Checkpoints Encountered
- strategy_output: High-risk strategy checkpoint (approved)
- document_output: Long document checkpoint (approved)

#### Aggregated Metrics
- Total Research Sources: 15
- Risk Level: MEDIUM
- Document Word Count: 3,250
- Citations: 8 (all verified)

#### Final Deliverables
- Research Memo: [summary]
- Strategy Recommendation: HYBRID
- Document: Klageschrift (draft)
```

---

## Pipeline Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Pipeline created, not started |
| `IN_PROGRESS` | Currently executing |
| `AWAITING_CHECKPOINT` | Paused for user confirmation |
| `COMPLETED` | All steps finished successfully |
| `FAILED` | Error occurred (check errors) |
| `CANCELLED` | User cancelled execution |

---

## Checkpoint Aggregation

### Cross-Agent Checkpoint Management
```markdown
### Aggregated Checkpoints

**Checkpoint 1** (from StrategistAgent)
- Type: high_risk_strategy
- Message: "Aggressive strategy recommended for high-value dispute"
- Action Required: Approve/Modify/Reject

**Checkpoint 2** (from DrafterAgent)
- Type: long_document
- Message: "Document exceeds 5000 words, review recommended"
- Action Required: Continue/Review/Stop
```

### Resume from Checkpoint
```
/agent:orchestrator --resume abc12345 --checkpoint-response approve
```

---

## Error Handling

### Fail-Fast Mode (Default)
```yaml
behavior: Stop pipeline on first error
recovery: Partial results saved, resume possible
```

### Continue Mode
```yaml
behavior: Skip failed step, continue pipeline
recovery: Marked failed steps, complete what's possible
activation: /agent:orchestrator --fail-fast false
```

### Error Output
```markdown
### Pipeline Error

**Pipeline ID**: abc12345
**Status**: FAILED
**Failed Step**: strategy_output

**Error Details**:
- Error: Risk assessment timeout
- Partial Results: research_output (completed)
- Recovery Options: Resume, Retry, Cancel

**Command to Resume**:
/agent:orchestrator --resume abc12345
```

---

## Custom Pipeline Definition

### Step Definition Format
```python
OrchestrationStep(
    agent_type="strategist",
    task="Develop litigation strategy",
    input_mapping={"research_results": "research_output.findings"},
    output_key="strategy_output",
    checkpoint_required=True,
    condition=lambda results: results.get("research_confidence", 0) > 0.6
)
```

### Conditional Execution
```
/agent:orchestrator --pipeline custom \
  --step "researcher:Research contract law" \
  --step "strategist:Develop strategy if research confidence > 0.6" \
  --step "drafter:Draft klageschrift if strategy approved"
```

---

## Pipeline History

### View History
```
/agent:orchestrator --history
```

### Get Specific Result
```
/agent:orchestrator --get-result abc12345
```

### Clear History
```
/agent:orchestrator --clear-history
```

---

## Integration Examples

### From Case Facts
```
/agent:orchestrator --pipeline full \
  --case-facts "Contract breach, value CHF 150,000, defendant ABC GmbH" \
  --parties "Plaintiff: XYZ AG, Defendant: ABC GmbH" \
  --type klageschrift \
  --language de \
  --jurisdiction ZH
```

### Multi-Lingual Pipeline
```
/agent:orchestrator --pipeline full \
  --language fr \
  --jurisdiction GE \
  "Litige commercial, valeur CHF 200,000"
```

### With External Research
```
/agent:orchestrator --pipeline strategy_to_draft \
  --import-research ./research_output.json \
  --type rechtsgutachten
```

---

## Performance Considerations

| Pipeline | Typical Duration | Token Usage |
|----------|------------------|-------------|
| research_to_strategy | 60-120s | 8-15K |
| strategy_to_draft | 45-90s | 10-20K |
| full_pipeline | 120-300s | 20-40K |

### Optimization Tips
- Use `--mode autonomous` for faster execution
- Set appropriate `--timeout` for long pipelines
- Use `--fail-fast false` for batch processing

---

## Comparison with Individual Agents

| Feature | Orchestrator | Individual Agents |
|---------|--------------|-------------------|
| Data Passing | Automatic | Manual |
| Checkpoints | Aggregated | Per-agent |
| Error Recovery | Coordinated | Independent |
| Pipeline History | Tracked | Not tracked |
| Multi-agent State | Managed | Separate |

**When to use Orchestrator:**
- Complete legal workflows
- Data needs to flow between agents
- Coordinated checkpoint management
- Pipeline tracking and history

**When to use Individual Agents:**
- Single-task operations
- Fine-grained control needed
- Exploratory work
- Debugging specific agents

---

## Related Commands

- `/agent:researcher` - Individual research agent
- `/agent:strategist` - Individual strategy agent
- `/agent:drafter` - Individual drafting agent
- `/legal:help` - Show all available commands

---

**AgentOrchestrator is now ready. Specify pipeline and provide your task description.**
