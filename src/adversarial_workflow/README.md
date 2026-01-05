# Adversarial Workflow System

**Version**: 2.1.0
**Status**: In Development (Sprint 0)

## Overview

The Adversarial Workflow System implements a three-agent architecture for Swiss legal analysis within the BetterCallClaude framework. The system provides balanced, objective legal analysis through structured adversarial reasoning.

## Architecture

### Three-Agent System

1. **Advocate Agent** (`agents/advocate.py`)
   - Develops strongest pro-position arguments
   - Researches supporting precedents and statutory provisions
   - Identifies favorable legal interpretations

2. **Adversary Agent** (`agents/adversary.py`)
   - Develops strongest anti-position arguments
   - Researches opposing precedents and counterarguments
   - Identifies unfavorable legal interpretations

3. **Judicial Agent** (`agents/judicial.py`)
   - Synthesizes objective analysis from both positions
   - Applies Swiss legal reasoning principles
   - Provides balanced assessment with risk probabilities

### 11-State Workflow

```
IDLE → INITIALIZING → PARALLEL_RESEARCH → VALIDATING_REPORTS →
JUDICIAL_SYNTHESIS → VALIDATING_OBJECTIVITY → COMPLETED
```

Error handling states: `ERROR`, `FAILED`

## Directory Structure

```
src/adversarial-workflow/
├── __init__.py                 # Package initialization
├── README.md                   # This file
│
├── agents/                     # Three-agent implementations
│   ├── __init__.py
│   ├── advocate.py            # Pro-position agent
│   ├── adversary.py           # Anti-position agent
│   └── judicial.py            # Synthesis agent
│
├── data_structures/           # YAML communication schemas
│   ├── __init__.py
│   ├── user_query_package.py  # Input query schema
│   ├── advocate_report.py     # Advocate output schema
│   ├── adversary_report.py    # Adversary output schema
│   └── judicial_report.py     # Judicial output schema
│
├── quality_gates/             # Validation and quality control
│   ├── __init__.py
│   ├── input_validation.py    # UserQueryPackage validation
│   ├── report_validation.py   # Citation and structure validation
│   └── objectivity_validation.py  # Judicial objectivity validation
│
├── state_machine/             # Workflow orchestration
│   ├── __init__.py
│   └── workflow_state_machine.py  # 11-state FSM
│
├── utils/                     # Shared utilities
│   ├── __init__.py
│   ├── communication.py       # Agent message bus
│   ├── citation_parser.py     # Multi-lingual citation parsing
│   └── logging.py            # Structured logging/telemetry
│
└── tests/                     # Test suite (coverage target: ≥90%)
    ├── __init__.py
    ├── agents/               # Agent unit tests
    │   └── __init__.py
    ├── data_structures/      # Schema validation tests
    │   └── __init__.py
    ├── quality_gates/        # Quality gate tests
    │   └── __init__.py
    └── integration/          # End-to-end workflow tests
        └── __init__.py
```

## Development Methodology

### Test-Driven Development (TDD)

All components follow TDD methodology:
1. Write failing test
2. Implement minimal code to pass test
3. Refactor while maintaining green tests
4. Achieve ≥90% test coverage

### Code Quality Standards

- **Type Checking**: MyPy with strict settings (Python 3.11)
- **Formatting**: Black (line-length 100)
- **Linting**: Ruff (E, W, F, I, B, C4, UP rules)
- **Testing**: Pytest with coverage reporting

### Running Tests

```bash
# Run all tests
pytest src/adversarial-workflow/tests/

# Run with coverage
pytest src/adversarial-workflow/tests/ --cov=src/adversarial-workflow --cov-report=html

# Run specific test module
pytest src/adversarial-workflow/tests/agents/test_advocate.py
```

## Data Structures

### UserQueryPackage (YAML)

```yaml
query_text: "Legal query string (min 20 chars)"
jurisdiction:
  level: "federal" | "cantonal"
  canton_code: "ZH" | "BE" | "GE" | "BS" | "VD" | "TI"  # if cantonal
language:
  detected: "de" | "fr" | "it" | "en"
  confidence: 0.95  # ≥95% accuracy target
metadata:
  timestamp: "2024-01-05T10:30:00Z"
  session_id: "uuid"
```

### Agent Reports (YAML)

Common structure for AdvocateReport and AdversaryReport:

```yaml
position: "pro" | "anti"
arguments:
  - argument_id: "ARG_001"
    statutory_basis: ["Art. 97 OR"]
    precedents: ["BGE 145 III 229"]
    reasoning: "Argument text"
    strength: 0.85
citations:
  - citation_id: "CIT_001"
    type: "bge" | "statute" | "doctrine"
    reference: "BGE 145 III 229 E. 4.2"
    verified: true
```

### JudicialReport (YAML)

```yaml
synthesis:
  balanced_analysis: "Objective synthesis text"
  convergent_points: ["List of agreement areas"]
  divergent_points: ["List of disagreement areas"]
risk_assessment:
  favorable_probability: 0.65
  unfavorable_probability: 0.35
  confidence_level: 0.80
legal_conclusion:
  primary_outcome: "Likely outcome"
  alternative_outcomes: ["List of alternatives"]
```

## Quality Gates

### 1. Input Validation
- Query text minimum length (20 characters)
- Jurisdiction completeness (level + canton if cantonal)
- Language detection confidence (≥95%)

### 2. Report Validation
- Citation format verification (Swiss legal standards)
- Citation existence verification (via legal-citations MCP)
- Structural completeness (all required fields present)

### 3. Objectivity Validation
- Balanced coverage of both positions
- No partisan language in synthesis
- Risk probabilities sum to 1.0 (±0.05 tolerance)
- Confidence levels within valid range (0.0-1.0)

## Sprint Progress

### Sprint 0: Foundation & Data Structures (34 points)

- ✅ **Story 0.0**: Sprint Planning (5 points) - **COMPLETED**
- ✅ **Story 0.1**: Project Foundation Setup (5 points) - **COMPLETED**
  - ✅ Directory structure created
  - ✅ __init__.py files created
  - ✅ Test framework validated
- ✅ **Story 0.2**: UserQueryPackage Schema (8 points) - **COMPLETED**
  - ✅ 4 dataclasses implemented (UserQueryPackage, Jurisdiction, Language, Metadata)
  - ✅ 37 tests written and passing (100% pass rate)
  - ✅ 96.94% code coverage (exceeds ≥90% target)
  - ✅ YAML serialization/deserialization implemented
- ⏳ **Story 0.3**: Agent Report Schemas (13 points) - **PENDING**
- ⏳ **Story 0.4**: Communication Protocol (8 points) - **PENDING**

## Integration with BetterCallClaude

The adversarial workflow integrates with existing BetterCallClaude components:

- **MCP Servers**: Uses `entscheidsuche`, `bge-search`, `legal-citations` for research
- **Personas**: Extends legal research capabilities with adversarial analysis
- **Quality Standards**: Maintains >95% citation accuracy requirement
- **Multi-lingual**: Supports DE/FR/IT/EN with proper legal terminology

## Next Steps

1. ✅ ~~Complete Sprint 0.1: Validate test framework execution~~ - **COMPLETED**
2. ✅ ~~Sprint 0.2: Implement UserQueryPackage schema (TDD)~~ - **COMPLETED**
3. ⏳ Sprint 0.3: Implement agent report schemas (TDD) - **NEXT**
   - AdvocateReport dataclass with validation
   - AdversaryReport dataclass with validation
   - JudicialReport dataclass with validation
   - Citation validation logic
4. ⏳ Sprint 0.4: Implement communication protocol (TDD)
5. ⏳ Update version.txt to 2.1.0

## References

- Design Document: `docs/design/ADVERSARIAL_WORKFLOW_STRICT_MODE.md`
- Sprint Plan: `docs/project-management/SPRINT_PLAN_ADVERSARIAL_WORKFLOW.md`
- BetterCallClaude Framework: `.claude/BETTERASK.md`
