# Upgrading BetterCallClaude

This guide covers upgrading BetterCallClaude from any previous version to v2.0.0.

---

## Quick Upgrade (Recommended)

The fastest way to upgrade is using the installer script:

```bash
curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/main/install.sh | bash
```

The installer automatically:
- Detects existing installations
- Backs up your configuration
- Updates all components
- Preserves your settings

---

## Manual Upgrade

### Step 1: Update Repository

```bash
cd /path/to/BetterCallClaude
git fetch origin
git pull origin main
```

### Step 2: Update Python Dependencies

```bash
# Activate virtual environment if using one
source venv/bin/activate

# Update dependencies
pip install -e ".[dev]"
```

### Step 3: Update Node.js Dependencies

```bash
npm install
```

### Step 4: Verify Installation

```bash
bettercallclaude doctor
```

---

## Version-Specific Upgrade Notes

### Upgrading to v2.0.0

#### What's New

v2.0.0 introduces the **PipelineBuilder API** and **Dynamic Agent Registry**:

| Feature | Description |
|---------|-------------|
| **PipelineBuilder** | Fluent builder pattern for custom multi-agent workflows |
| **Parallel Execution** | Run independent agents concurrently |
| **Conditional Routing** | Execute different paths based on runtime context |
| **Dynamic Registry** | Auto-discovers all 14 agents (3 Python + 11 Command-based) |
| **CommandAgentAdapter** | Seamless integration of command-file agents |

#### Backward Compatibility

**v2.0.0 is fully backward compatible.** All existing code continues to work:

```python
# v1.x code - STILL WORKS in v2.0.0
from src.agents import AgentOrchestrator, PipelineStatus
orchestrator = AgentOrchestrator()
result = await orchestrator.execute_pipeline("full", context)
```

#### New API (Optional)

The new PipelineBuilder API is additive - use it when you need custom workflows:

```python
# v2.0.0 new feature - PipelineBuilder
from src.agents import PipelineBuilder, PipelineExecutor, PipelineStep

pipeline = (
    PipelineBuilder("custom_analysis")
    .add_step("researcher", "Research precedents", output_key="research")
    .with_timeout(120)
    .add_parallel_group([
        PipelineStep("citation_validator", "Verify citations", output_key="citations"),
        PipelineStep("risk_assessor", "Assess risks", output_key="risks"),
    ])
    .add_conditional_step(
        condition=lambda ctx: ctx.get("risks", {}).get("level") == "high",
        step=PipelineStep("strategist", "Deep analysis"),
        else_step=PipelineStep("drafter", "Quick summary"),
    )
    .build()
)

executor = PipelineExecutor(orchestrator)
result = await executor.execute(pipeline, initial_context)
```

#### New Imports Available

```python
# New exports in v2.0.0
from src.agents import (
    # Pipeline Builder API
    PipelineBuilder,
    PipelineExecutor,
    PipelineStep,
    PipelineExecutionResult,
    Pipeline,

    # Step Types
    ConditionalStep,
    ParallelGroup,
    RouterStep,
    StepType,

    # Convenience Functions
    create_research_pipeline,
    create_full_case_pipeline,
)
```

#### Agent Command Files

Command-based agents now use colon-separated naming:

```
# v1.x naming (deprecated but still discovered)
agent-citation_validator.md

# v2.0.0 naming (recommended)
agent:citation_validator.md
```

Both naming conventions are auto-discovered by the registry.

---

### Upgrading from v1.3.x to v2.0.0

No breaking changes. Simply update and enjoy new features:

1. Run the installer or pull latest changes
2. Your existing pipelines continue to work
3. Optionally adopt PipelineBuilder for new workflows

---

### Upgrading from v1.2.x to v2.0.0

The v1.2.x Orchestrator API remains unchanged:

```python
# v1.2.x orchestrator code - works in v2.0.0
orchestrator = AgentOrchestrator()
result = await orchestrator.execute_pipeline("research_to_strategy", context)
```

New in v2.0.0:
- PipelineBuilder for custom workflows
- Parallel execution groups
- Conditional and router steps

---

### Upgrading from v1.1.x or Earlier

1. **Ollama Integration** (v1.1+): Ensure Ollama is installed if using local LLM features
2. **Agent Discovery**: Command files now auto-discovered from `.claude/commands/agent:*.md`
3. **Configuration**: Check `~/.betterask/config.yaml` for new options

---

## Configuration Migration

### v1.x to v2.0.0

Your existing `~/.betterask/config.yaml` is compatible. New optional settings:

```yaml
# New v2.0.0 options (all optional)
pipeline:
  default_timeout: 600        # Pipeline timeout in seconds
  parallel_max_workers: 5     # Max concurrent agents
  checkpoint_enabled: true    # Enable checkpoint aggregation

agent_registry:
  auto_discover: true         # Auto-discover command agents
  cache_descriptors: true     # Cache agent metadata
```

---

## Verifying the Upgrade

### Check Version

```bash
bettercallclaude --version
```

Expected output:
```
BetterCallClaude v2.0.0
Legal Intelligence Framework for Swiss Lawyers
```

### Run Health Check

```bash
bettercallclaude doctor
```

This verifies:
- Python dependencies
- Node.js dependencies
- MCP server status
- Agent discovery
- Configuration validity

### Run Tests

```bash
# Python tests
pytest

# TypeScript tests (MCP servers)
npm test

# E2E integration tests
pytest src/tests/integration/test_orchestrator_e2e.py -v
```

---

## Troubleshooting

### Import Errors After Upgrade

If you see import errors for new v2.0.0 features:

```bash
# Reinstall the package
pip install -e ".[dev]" --force-reinstall
```

### Agent Discovery Issues

If agents aren't being discovered:

1. Check command file naming: `agent:*.md` (with colon)
2. Verify files are in `.claude/commands/` directory
3. Run discovery manually:

```python
from src.agents.registry import AgentRegistry
registry = AgentRegistry(auto_discover=True)
print(registry.list_agents())
```

### MCP Server Connection Issues

```bash
# Reinstall MCP servers
cd mcp-servers
npm install

# Check server status
bettercallclaude doctor
```

### Configuration Not Loading

```bash
# Validate configuration
cat ~/.betterask/config.yaml

# Reset to defaults if needed
bettercallclaude config reset
```

---

## Rollback Procedure

If you need to rollback to a previous version:

### Using Git

```bash
cd /path/to/BetterCallClaude

# List available versions
git tag -l

# Rollback to specific version
git checkout v1.3.2

# Reinstall dependencies
pip install -e ".[dev]"
npm install
```

### Using Installer

```bash
# Install specific version
curl -fsSL https://raw.githubusercontent.com/fedec65/BetterCallClaude/v1.3.2/install.sh | bash
```

---

## Getting Help

- **Documentation**: See `docs/` directory
- **GitHub Issues**: [Report bugs](https://github.com/fedec65/BetterCallClaude/issues)
- **Discussions**: Community Q&A and best practices

---

## Changelog

For detailed version history, see [CHANGELOG.md](CHANGELOG.md).

---

**BetterCallClaude v2.0.0** - Legal Intelligence Framework for Swiss Lawyers
