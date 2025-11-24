# BetterCallClaude v2.0 Implementation Guide
## From SuperClaude Framework to Legal Intelligence Platform

**Author:** Federico Cesconi  
**Date:** November 16, 2025  
**Purpose:** Technical implementation guide for development team

---

## Overview

This guide provides step-by-step instructions for transforming your existing BetterCallClaude project into a production-ready legal intelligence platform inspired by SuperClaude's architecture.

---

## Phase 1: Core Framework Setup (Weeks 1-4)

### Step 1: Project Structure Refactoring

**Current Structure** (BetterCallClaude v1.0):
```
BetterCallClaude/
├── .claude/
│   ├── BETTERASK.md
│   ├── LEGAL_PRINCIPLES.md
│   └── personas/
├── mcp-servers/
└── docs/
```

**New Structure** (BetterCallClaude v2.0 - inspired by SuperClaude):
```
BetterCallClaude/
├── bettercall/                    # Core framework package
│   ├── __init__.py
│   ├── core/                      # Core framework
│   │   ├── commands.py            # Command registry
│   │   ├── personas.py            # Persona system
│   │   ├── router.py              # Privacy router
│   │   └── config.py              # Configuration management
│   │
│   ├── commands/                  # 30 slash commands
│   │   ├── research/
│   │   │   ├── research.py
│   │   │   ├── precedent.py
│   │   │   └── cite_check.py
│   │   ├── analysis/
│   │   │   ├── analyze_case.py
│   │   │   ├── assess_risk.py
│   │   │   └── strategy.py
│   │   ├── drafting/
│   │   │   ├── draft_contract.py
│   │   │   ├── draft_brief.py
│   │   │   └── review_doc.py
│   │   └── compliance/
│   │       └── gdpr_analyze.py
│   │
│   ├── personas/                  # 12 legal personas
│   │   ├── researcher.py
│   │   ├── strategist.py
│   │   ├── drafter.py
│   │   └── [9 more personas]
│   │
│   ├── mcp/                       # MCP integration
│   │   ├── bge_search.py
│   │   ├── cantonal_courts.py
│   │   └── [6 more MCPs]
│   │
│   └── utils/                     # Utilities
│       ├── citation.py
│       ├── translation.py
│       └── encryption.py
│
├── mcp-servers/                   # MCP server implementations
│   ├── bge-search/
│   │   ├── package.json
│   │   ├── src/index.ts
│   │   └── README.md
│   ├── cantonal-courts/
│   ├── legal-citations/
│   └── [5 more servers]
│
├── config/                        # Configuration files
│   ├── personas/                  # Persona definitions (markdown)
│   │   ├── legal_researcher.md
│   │   ├── case_strategist.md
│   │   └── [10 more]
│   ├── commands/                  # Command definitions
│   └── settings/
│       └── defaults.yaml
│
├── tests/                         # Test suite
│   ├── test_commands.py
│   ├── test_personas.py
│   ├── test_citation_accuracy.py
│   └── [more tests]
│
├── docs/                          # Documentation
│   ├── getting-started.md
│   ├── commands/
│   ├── personas/
│   └── mcp-servers/
│
├── setup.py                       # Package setup
├── requirements.txt               # Python dependencies
└── README.md                      # Main documentation
```

### Step 2: Command System Implementation

**Create Base Command Class** (`bettercall/core/commands.py`):

```python
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum

class CommandCategory(Enum):
    RESEARCH = "research"
    ANALYSIS = "analysis"
    DRAFTING = "drafting"
    COMPLIANCE = "compliance"
    WORKFLOW = "workflow"
    SYSTEM = "system"

@dataclass
class CommandMetadata:
    """Metadata for each command"""
    name: str
    category: CommandCategory
    description: str
    auto_personas: List[str]
    mcp_servers: List[str]
    requires_auth: bool = False
    requires_canton: bool = False
    
class BaseCommand(ABC):
    """Base class for all legal commands"""
    
    def __init__(self, metadata: CommandMetadata):
        self.metadata = metadata
        
    @abstractmethod
    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the command with given arguments"""
        pass
    
    def validate_args(self, args: Dict[str, Any]) -> bool:
        """Validate command arguments"""
        return True
    
    def get_required_personas(self, context: Dict) -> List[str]:
        """Determine which personas are needed for this command"""
        return self.metadata.auto_personas

# Command Registry
class CommandRegistry:
    """Central registry for all commands"""
    
    def __init__(self):
        self._commands = {}
    
    def register(self, command: BaseCommand):
        """Register a command"""
        self._commands[command.metadata.name] = command
    
    def get(self, name: str) -> Optional[BaseCommand]:
        """Get a command by name"""
        return self._commands.get(name)
    
    def list_commands(self, category: Optional[CommandCategory] = None) -> List[str]:
        """List all registered commands"""
        if category:
            return [
                name for name, cmd in self._commands.items()
                if cmd.metadata.category == category
            ]
        return list(self._commands.keys())

# Global registry
command_registry = CommandRegistry()
```

**Example Command Implementation** (`bettercall/commands/research/research.py`):

```python
from bettercall.core.commands import BaseCommand, CommandMetadata, CommandCategory, command_registry
from bettercall.mcp.bge_search import BGESearchMCP
from bettercall.mcp.cantonal_courts import CantonalCourtsMCP
from typing import Dict, Any, List

class LegalResearchCommand(BaseCommand):
    """
    Multi-source legal research command
    
    Usage: /legal:research "query" [options]
    """
    
    def __init__(self):
        metadata = CommandMetadata(
            name="legal:research",
            category=CommandCategory.RESEARCH,
            description="Multi-source legal research with depth control",
            auto_personas=["legal_researcher", "citation_specialist"],
            mcp_servers=["bge_search", "cantonal_courts", "legal_citations"]
        )
        super().__init__(metadata)
        
        # Initialize MCP servers
        self.bge_search = BGESearchMCP()
        self.cantonal_courts = CantonalCourtsMCP()
    
    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute legal research
        
        Args:
            query: Research query
            depth: quick|standard|deep|exhaustive
            jurisdictions: List of jurisdictions
            date_from: Start date filter
            max_results: Maximum results
        """
        query = args.get("query")
        depth = args.get("depth", "standard")
        jurisdictions = args.get("jurisdictions", ["federal"])
        date_from = args.get("date_from")
        max_results = args.get("max_results", 20)
        
        # Determine number of search iterations based on depth
        iterations = {
            "quick": 1,
            "standard": 2,
            "deep": 4,
            "exhaustive": 5
        }[depth]
        
        # Multi-hop research
        all_results = []
        for i in range(iterations):
            # Search BGE
            if "federal" in jurisdictions:
                bge_results = await self.bge_search.search(
                    query=query,
                    date_from=date_from
                )
                all_results.extend(bge_results)
            
            # Search cantonal courts
            cantonal_jurisdictions = [j for j in jurisdictions if j != "federal"]
            if cantonal_jurisdictions:
                cantonal_results = await self.cantonal_courts.search(
                    query=query,
                    cantons=cantonal_jurisdictions,
                    date_from=date_from
                )
                all_results.extend(cantonal_results)
            
            # Refine query for next iteration based on results
            if i < iterations - 1:
                query = self._refine_query(query, all_results)
        
        # Rank results
        ranked_results = self._rank_results(all_results, args.get("query"))
        
        # Limit to max_results
        final_results = ranked_results[:max_results]
        
        return {
            "results": final_results,
            "total_found": len(all_results),
            "search_depth": depth,
            "iterations": iterations
        }
    
    def _refine_query(self, original_query: str, results: List[Dict]) -> str:
        """Refine query based on results for next iteration"""
        # Extract key legal terms from top results
        # This is simplified - in reality, use NLP
        return original_query
    
    def _rank_results(self, results: List[Dict], query: str) -> List[Dict]:
        """Rank results by relevance"""
        # Simplified ranking - in reality, use sophisticated algorithm
        for result in results:
            score = self._calculate_relevance(result, query)
            result["relevance_score"] = score
        
        return sorted(results, key=lambda x: x["relevance_score"], reverse=True)
    
    def _calculate_relevance(self, result: Dict, query: str) -> float:
        """Calculate relevance score (0-100)"""
        # Weighted scoring:
        # 40% text similarity
        # 25% citation importance
        # 15% recency
        # 10% court authority
        # 10% legal area match
        
        text_sim = self._text_similarity(result.get("text", ""), query)
        citation_imp = min(result.get("citations_count", 0) / 50, 1.0)
        recency = self._recency_score(result.get("date"))
        court_auth = self._court_authority(result.get("court"))
        
        score = (
            0.40 * text_sim +
            0.25 * citation_imp +
            0.15 * recency +
            0.10 * court_auth +
            0.10 * 0.5  # Legal area match (simplified)
        )
        
        return score * 100

# Register command
command_registry.register(LegalResearchCommand())
```

### Step 3: Persona System Implementation

**Create Persona Base Class** (`bettercall/core/personas.py`):

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from dataclasses import dataclass
import os

@dataclass
class PersonaMetadata:
    """Metadata for each persona"""
    name: str
    emoji: str
    expertise: List[str]
    languages: List[str]
    output_style: str
    
class BasePersona(ABC):
    """Base class for all legal personas"""
    
    def __init__(self, metadata: PersonaMetadata):
        self.metadata = metadata
        self.prompt_template = self._load_prompt_template()
    
    def _load_prompt_template(self) -> str:
        """Load persona's prompt template from markdown file"""
        persona_file = f"config/personas/{self.metadata.name}.md"
        if os.path.exists(persona_file):
            with open(persona_file, 'r') as f:
                return f.read()
        return ""
    
    @abstractmethod
    def generate_system_prompt(self, context: Dict[str, Any]) -> str:
        """Generate system prompt for this persona given context"""
        pass
    
    def apply_behavior(self, user_input: str, context: Dict[str, Any]) -> str:
        """Apply persona's behavioral modifications to user input"""
        system_prompt = self.generate_system_prompt(context)
        return f"{system_prompt}\n\nUser Request: {user_input}"

class PersonaRegistry:
    """Registry for all personas"""
    
    def __init__(self):
        self._personas = {}
    
    def register(self, persona: BasePersona):
        """Register a persona"""
        self._personas[persona.metadata.name] = persona
    
    def get(self, name: str) -> BasePersona:
        """Get persona by name"""
        return self._personas.get(name)
    
    def activate_personas(self, persona_names: List[str], context: Dict) -> List[BasePersona]:
        """Activate multiple personas"""
        return [self.get(name) for name in persona_names if self.get(name)]

persona_registry = PersonaRegistry()
```

**Example Persona** (`bettercall/personas/researcher.py`):

```python
from bettercall.core.personas import BasePersona, PersonaMetadata, persona_registry

class LegalResearcher(BasePersona):
    """
    Legal Researcher Persona
    
    Expertise: Swiss precedent analysis, statute lookup, citation verification
    """
    
    def __init__(self):
        metadata = PersonaMetadata(
            name="legal_researcher",
            emoji="🔍",
            expertise=[
                "Swiss precedent analysis",
                "BGE case law",
                "Cantonal court decisions",
                "Statute lookup",
                "Citation verification"
            ],
            languages=["de", "fr", "it", "en"],
            output_style="Structured research memos with verified citations"
        )
        super().__init__(metadata)
    
    def generate_system_prompt(self, context: Dict[str, Any]) -> str:
        """Generate system prompt for legal researcher"""
        
        jurisdiction = context.get("jurisdiction", "federal")
        language = context.get("language", "de")
        
        prompt = f"""You are a Legal Researcher specializing in Swiss law.

EXPERTISE:
- Swiss Federal Supreme Court (BGE) case law
- Cantonal court decisions
- Swiss statutes (ZGB, OR, StGB, ZPO, StPO)
- Citation verification and formatting

JURISDICTION FOCUS: {jurisdiction}
WORKING LANGUAGE: {language}

METHODOLOGY:
1. Search comprehensively across all relevant sources
2. Verify every citation for accuracy
3. Provide proper Swiss legal citation format (BGE/ATF/DTF)
4. Cross-reference federal and cantonal law
5. Note any conflicts or ambiguities

OUTPUT REQUIREMENTS:
- Structured research memo format
- Verified citations only (no hallucinations)
- Multi-jurisdictional analysis when relevant
- Clear identification of binding vs. persuasive precedents
- Risk flags for any legal uncertainties

CITATION FORMAT:
- Federal: BGE [Volume] [Chamber] [Page]
- Example: BGE 142 III 102
- Always include hyperlinks to full text

Remember: Accuracy is paramount. If you're not certain about a citation or legal principle, state your confidence level explicitly."""

        return prompt

# Register persona
persona_registry.register(LegalResearcher())
```

### Step 4: Persona Configuration Files

Create markdown files for each persona in `config/personas/`:

**Example** (`config/personas/legal_researcher.md`):

```markdown
# Legal Researcher Persona 🔍

## Identity
You are an expert Legal Researcher specializing in Swiss law with deep knowledge of:
- Swiss Federal Supreme Court (Bundesgericht) case law
- 26 cantonal court systems  
- Swiss federal statutes (ZGB, OR, StGB, ZPO, StPO)
- Legal citation standards and verification

## Expertise Areas
1. **BGE Precedent Analysis**
   - Search and analyze 150,000+ BGE decisions (1875-present)
   - Identify relevant precedents with precision
   - Understand precedent hierarchy and binding nature

2. **Multi-Jurisdictional Research**
   - Federal law
   - 26 cantonal legal systems
   - Cross-jurisdictional conflict resolution

3. **Citation Verification**
   - Verify citation accuracy (>99% standard)
   - Format citations properly (BGE/ATF/DTF)
   - Detect hallucinated or incorrect citations

4. **Multi-Lingual Capability**
   - German (primary)
   - French  
   - Italian
   - English (for international contexts)

## Research Methodology

### Step 1: Query Analysis
- Identify legal issues
- Extract key terms
- Determine relevant jurisdictions
- Select appropriate time period

### Step 2: Source Selection
- BGE (federal precedents)
- Cantonal courts
- Federal statutes (via Fedlex)
- Legal doctrine (if available)

### Step 3: Search Execution
- Use both keyword and semantic search
- Apply appropriate filters
- Cast wide net initially, then narrow

### Step 4: Result Analysis
- Rank by relevance
- Verify citation accuracy
- Note precedent relationships
- Identify potential conflicts

### Step 5: Synthesis
- Organize findings clearly
- Provide executive summary
- Include all verified citations
- Flag uncertainties

## Output Format

```markdown
# Legal Research Memo

## Executive Summary
[2-3 sentence summary of findings]

## Legal Question
[Restate the research question]

## Relevant Precedents

### Primary Authority (Binding)
1. **BGE 142 III 102** (2016-02-08)
   - **Issue:** Contract interpretation under Art. 18 OR
   - **Holding:** ...
   - **Relevance:** Directly on point
   - **Link:** [Full text](https://www.bger.ch/...)

### Persuasive Authority
[Cantonal precedents, etc.]

## Applicable Statutes
- Art. 18 OR (Contract interpretation)
- Art. 97 OR (Contractual liability)

## Analysis
[Detailed analysis with citations]

## Conclusion
[Answer to research question with confidence level]

## Research Notes
- Databases searched: BGE, ZH Cantonal, GE Cantonal
- Date range: 2010-2025
- Keywords: [list]
- Total precedents reviewed: X
```

## Quality Standards

✅ **DO:**
- Verify EVERY citation before including
- Provide BGE/ATF/DTF format correctly
- Note confidence level if uncertain
- Cross-reference federal and cantonal law
- Include hyperlinks to full text
- Use proper legal terminology

❌ **DON'T:**
- Hallucinate citations
- State uncertain legal principles as fact
- Miss relevant precedents due to narrow search
- Ignore cantonal law when relevant
- Use informal language
- Provide citations without verification

## Swiss Legal Citation Standards

### BGE Format
- **German:** BGE 142 III 102
- **French:** ATF 142 III 102  
- **Italian:** DTF 142 III 102

### Components
- **142** = Volume (corresponds to year 2016)
- **III** = Civil law chamber (I=Public, II=Criminal, III=Civil)
- **102** = Page number

### Cantonal Citations
Vary by canton - always use official format

## Language Handling

When working in German:
- Use "Art. 18 OR" (not "Art. 18 CO")
- "BGE" (not ATF or DTF)
- "Bundesgericht" (not Tribunal fédéral)

When working in French:
- Use "art. 18 CO" (not Art. 18 OR)
- "ATF" (not BGE or DTF)
- "Tribunal fédéral" (not Bundesgericht)

Always maintain language consistency throughout the memo.

## Activation Triggers
This persona activates automatically when:
- `/legal:research` command used
- `/legal:precedent` command used
- `/legal:statute` command used
- Precedent analysis requested
- Citation verification needed
```

---

## Phase 2: MCP Server Development (Weeks 5-8)

[Continue with MCP server implementation details...]

---

**To be continued in next sections:**
- Phase 2: MCP Server Development
- Phase 3: Testing & QA
- Phase 4: Deployment
- Appendix: Code Examples

