# Agent Framework package
# Contains ResearcherAgent and base classes for autonomous legal research

from src.agents.base import (
    ActionType,
    AgentOutcome,
    AutonomyMode,
    CaseContext,
    Party,
)
from src.agents.researcher import (
    LegalDomain,
    ResearchDepth,
    ResearcherAgent,
    SearchStrategy,
)

__all__ = [
    # Base classes
    "ActionType",
    "AgentOutcome",
    "AutonomyMode",
    "CaseContext",
    "Party",
    # Researcher
    "LegalDomain",
    "ResearchDepth",
    "ResearcherAgent",
    "SearchStrategy",
]
