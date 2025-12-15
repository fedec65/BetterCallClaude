# /agent:orchestrator - AgentOrchestrator Framework Integration

**Activates the Python AgentOrchestrator for multi-agent pipeline coordination with data passing and checkpoint aggregation.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: AgentOrchestrator (Python)
**Version**: 2.0.0
**Manages**: All 14 registered agents (Python + Command-based)

---

## What This Command Does

When you use `/agent:orchestrator`, you activate the **pipeline coordination framework** with:

- **Multi-Agent Pipelines**: Chain any combination of agents in workflows
- **Dynamic Agent Discovery**: Auto-discovers Python agents and command files
- **Data Passing**: Automatic output-to-input mapping between agents
- **Checkpoint Aggregation**: Collect and manage checkpoints across all agents
- **Parallel Execution**: Run independent agents concurrently
- **Conditional Routing**: Execute agents based on runtime conditions
- **Error Handling**: Fail-fast or continue-on-error execution modes
- **Pipeline Templates**: Pre-built workflows for common legal tasks

---

## Available Agents (v2.0)

### Python Agents (Native)
| Agent | Type | Description |
|-------|------|-------------|
| `researcher` | Python | Legal research and precedent analysis |
| `strategist` | Python | Litigation strategy and risk assessment |
| `drafter` | Python | Legal document drafting |

### Command-Based Agents (Extensible)
| Agent | Type | Description |
|-------|------|-------------|
| `citation_validator` | Command | Verify and validate legal citations |
| `contract_analyzer` | Command | Analyze contract terms and risks |
| `deadline_tracker` | Command | Track legal deadlines and limitations |
| `document_formatter` | Command | Format legal documents to standards |
| `jurisdiction_advisor` | Command | Advise on jurisdiction selection |
| `opponent_analyzer` | Command | Analyze opposing counsel patterns |
| `precedent_finder` | Command | Find relevant legal precedents |
| `risk_assessor` | Command | Comprehensive risk assessment |
| `settlement_calculator` | Command | Calculate settlement values |
| `statute_interpreter` | Command | Interpret statutory provisions |
| `timeline_builder` | Command | Build case timelines |

---

## PipelineBuilder API (NEW in v2.0)

### Fluent Builder Pattern

Create custom pipelines with a fluent, chainable API:

```python
from src.agents import PipelineBuilder, PipelineExecutor

# Build a custom pipeline
pipeline = (
    PipelineBuilder("custom_analysis")
    .add_step("researcher", "Research Art. 97 OR precedents", output_key="research")
    .with_timeout(120)
    .add_step("strategist", "Develop litigation strategy", output_key="strategy")
    .with_input_mapping({"research_results": "research.findings"})
    .with_checkpoint()
    .add_step("drafter", "Draft complaint document", output_key="document")
    .with_input_mapping({"strategy": "strategy.recommendation"})
    .build()
)

# Execute the pipeline
executor = PipelineExecutor(orchestrator)
result = await executor.execute(pipeline, initial_context)
```

### Parallel Execution

Run independent agents concurrently:

```python
from src.agents import PipelineBuilder, PipelineStep

pipeline = (
    PipelineBuilder("parallel_analysis")
    # Run multiple analyses in parallel
    .add_parallel_group([
        PipelineStep("citation_validator", "Verify all citations", output_key="citations"),
        PipelineStep("risk_assessor", "Assess case risks", output_key="risks"),
        PipelineStep("deadline_tracker", "Check limitation periods", output_key="deadlines"),
    ], merge_strategy="all")
    # Then synthesize results
    .add_step("strategist", "Synthesize parallel analyses", output_key="synthesis")
    .with_input_mapping({
        "citations": "citations.validated",
        "risks": "risks.assessment",
        "deadlines": "deadlines.critical"
    })
    .build()
)
```

### Conditional Execution

Execute steps based on runtime conditions:

```python
pipeline = (
    PipelineBuilder("conditional_flow")
    .add_step("researcher", "Initial research", output_key="research")
    .add_conditional_step(
        condition=lambda ctx: ctx.get("research", {}).get("confidence", 0) > 0.7,
        step=PipelineStep("strategist", "Full strategy analysis"),
        else_step=PipelineStep("researcher", "Extended research")
    )
    .build()
)
```

### Dynamic Routing

Route to different agents based on context:

```python
def route_by_complexity(ctx):
    complexity = ctx.get("research", {}).get("complexity", "low")
    return complexity  # Returns "low", "medium", or "high"

pipeline = (
    PipelineBuilder("routed_analysis")
    .add_step("researcher", "Analyze case complexity", output_key="research")
    .add_router(
        router_fn=route_by_complexity,
        task="Process based on complexity",
        routes={
            "low": PipelineStep("drafter", "Quick draft"),
            "medium": PipelineStep("strategist", "Standard strategy"),
            "high": PipelineStep("strategist", "Deep analysis"),
        },
        default_route="medium"
    )
    .build()
)
```

---

## Pre-Built Pipeline Templates

### research_to_strategy
```
ResearcherAgent -> StrategistAgent
```
Research legal precedents, then develop litigation strategy.

### strategy_to_draft
```
StrategistAgent -> DrafterAgent
```
Finalize strategy, then draft legal document.

### full_pipeline
```
ResearcherAgent -> StrategistAgent -> DrafterAgent
```
Complete workflow: Research -> Strategy -> Draft.

### Convenience Functions

```python
from src.agents import create_research_pipeline, create_full_case_pipeline

# Quick research pipeline
research_pipeline = create_research_pipeline()

# Full case analysis pipeline
case_pipeline = create_full_case_pipeline()
```

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

### Full Pipeline (Research -> Strategy -> Draft)
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

### Custom Multi-Agent Pipeline
```
/agent:orchestrator --steps "researcher,citation_validator,strategist,drafter" --task "Full verified analysis"
```

### Parallel Analysis
```
/agent:orchestrator --parallel "risk_assessor,deadline_tracker,citation_validator" --then strategist
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

### Research -> Strategy Data Passing
```yaml
research_output:
  findings: -> strategy_input.research_results
  citations: -> strategy_input.precedents
  confidence: -> strategy_input.research_confidence
```

### Strategy -> Draft Data Passing
```yaml
strategy_output:
  recommendation: -> draft_input.strategy_input
  risk_assessment: -> draft_input.risk_context
  cost_estimate: -> draft_input.cost_context
```

### Custom Input Mapping
```python
step.with_input_mapping({
    "source_key": "target_key",
    "research.findings": "analysis_input",
    "parallel_results.risks": "risk_data"
})
```

---

## Pipeline Execution Output

```markdown
### Pipeline Execution Summary

**Pipeline ID**: abc12345
**Status**: COMPLETED
**Total Duration**: 127.4 seconds

#### Steps Completed
1. research_output (34.2s)
2. strategy_output (48.7s)
3. document_output (44.5s)

#### Parallel Groups Executed
- Group 1: [citation_validator, risk_assessor, deadline_tracker] (12.3s)

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
| `PARTIALLY_COMPLETED` | Some steps completed, some failed |
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

### Retry Configuration
```python
step.with_retry(count=3)  # Retry failed steps up to 3 times
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

## Advanced Pipeline Definition

### Step Configuration Options
```python
PipelineBuilder("advanced")
    .add_step("researcher", "Research task")
    .with_input_mapping({"key": "value"})  # Map inputs
    .with_checkpoint()                      # Require checkpoint
    .with_timeout(120)                      # Set timeout (seconds)
    .with_retry(3)                          # Retry on failure
```

### Parallel Group Options
```python
.add_parallel_group(
    steps=[...],
    group_id="analysis_group",
    merge_strategy="all",        # 'all', 'first_success', 'majority'
    timeout_seconds=300
)
```

### Conditional Execution
```python
.add_conditional_step(
    condition=lambda ctx: ctx.get("confidence") > 0.7,
    step=high_confidence_step,
    else_step=low_confidence_step,
    condition_name="confidence_check"
)
```

### Dynamic Routing
```python
.add_router(
    router_fn=lambda ctx: ctx.get("case_type", "default"),
    task="Route by case type",
    routes={
        "contract": contract_step,
        "tort": tort_step,
        "criminal": criminal_step
    },
    default_route="contract"
)
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

### Custom Pipeline with All Features
```python
pipeline = (
    PipelineBuilder("comprehensive_analysis")
    # Phase 1: Parallel initial analysis
    .add_parallel_group([
        PipelineStep("researcher", "Research precedents", output_key="research"),
        PipelineStep("deadline_tracker", "Check deadlines", output_key="deadlines"),
        PipelineStep("jurisdiction_advisor", "Analyze jurisdiction", output_key="jurisdiction"),
    ])
    # Phase 2: Conditional routing based on complexity
    .add_conditional_step(
        condition=lambda ctx: ctx.get("research", {}).get("complexity") == "high",
        step=PipelineStep("strategist", "Deep strategy analysis", output_key="strategy"),
        else_step=PipelineStep("strategist", "Quick strategy", output_key="strategy")
    )
    .with_checkpoint()
    # Phase 3: Parallel document preparation
    .add_parallel_group([
        PipelineStep("drafter", "Draft main document", output_key="document"),
        PipelineStep("citation_validator", "Validate citations", output_key="citations"),
    ])
    # Phase 4: Final formatting
    .add_step("document_formatter", "Format final document", output_key="final")
    .build()
)
```

---

## Performance Considerations

| Pipeline | Typical Duration | Token Usage |
|----------|------------------|-------------|
| research_to_strategy | 60-120s | 8-15K |
| strategy_to_draft | 45-90s | 10-20K |
| full_pipeline | 120-300s | 20-40K |
| parallel_3_agents | 40-80s | 15-25K |
| comprehensive_analysis | 180-400s | 35-60K |

### Optimization Tips
- Use `--mode autonomous` for faster execution
- Use parallel groups for independent analyses
- Set appropriate `--timeout` for long pipelines
- Use `--fail-fast false` for batch processing
- Use conditional routing to skip unnecessary steps

---

## Agent Registry

### List Available Agents
```
/agent:orchestrator --list-agents
```

### Agent Details
```
/agent:orchestrator --agent-info researcher
```

### Custom Agent Registration
Agents are auto-discovered from:
- Python classes in `src/agents/` implementing `AgentBase`
- Command files in `.claude/commands/agent:*.md`

---

## Comparison with Individual Agents

| Feature | Orchestrator | Individual Agents |
|---------|--------------|-------------------|
| Data Passing | Automatic | Manual |
| Checkpoints | Aggregated | Per-agent |
| Error Recovery | Coordinated | Independent |
| Pipeline History | Tracked | Not tracked |
| Multi-agent State | Managed | Separate |
| Parallel Execution | Supported | Not available |
| Conditional Logic | Built-in | Manual |
| Dynamic Routing | Supported | Not available |

**When to use Orchestrator:**
- Complete legal workflows
- Data needs to flow between agents
- Coordinated checkpoint management
- Pipeline tracking and history
- Parallel agent execution
- Complex conditional workflows

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

**AgentOrchestrator v2.0 is now ready. Specify pipeline and provide your task description.**
