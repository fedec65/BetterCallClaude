"""
Entscheidsuche MCP Adapter

Provides high-level interface to Swiss court decision search across
federal and cantonal courts through MCP server integration.
"""

import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional

from ..protocol import MCPClient, MCPInvocationError

logger = logging.getLogger(__name__)


@dataclass
class CourtDecision:
    """Represents a Swiss court decision from any court level"""

    decision_id: str  # Unique decision identifier
    court_name: str  # Court name
    court_level: str  # federal, cantonal, district, municipal
    canton: Optional[str]  # Canton code (for cantonal/lower courts)
    title: str  # Decision title
    date: datetime  # Decision date
    language: str  # DE, FR, IT, or RM
    summary: str  # Decision summary
    legal_areas: List[str]  # Legal area classifications
    reference_number: str  # Court's own reference number
    related_decisions: List[str] = None  # Related decision IDs
    full_text_url: Optional[str] = None  # Link to full text


@dataclass
class EntscheidausucheSearchResult:
    """Results from Entscheidsuche query"""

    query: str
    total_results: int
    decisions: List[CourtDecision]
    facets: Dict[str, List[Dict[str, Any]]]  # Search facets (courts, areas, dates)
    search_time_ms: float
    metadata: Dict[str, Any]


class EntscheidausucheAdapter:
    """
    High-level adapter for Swiss court decision search

    Provides unified interface to search decisions across federal and
    cantonal courts, handling multi-lingual queries and court hierarchy.

    Example:
        adapter = EntscheidausucheAdapter(
            command=["node", "mcp-servers/entscheidsuche/dist/index.js"]
        )

        async with adapter:
            results = await adapter.search(
                query="arbeitsrecht kündigung",
                court_level="cantonal",
                canton="ZH",
                language="DE"
            )

            for decision in results.decisions:
                print(f"{decision.court_name}: {decision.title}")
    """

    def __init__(
        self,
        command: List[str],
        env: Optional[Dict[str, str]] = None,
        timeout: int = 30,
    ) -> None:
        """
        Initialize Entscheidsuche adapter

        Args:
            command: Command to start Entscheidsuche MCP server
            env: Optional environment variables
            timeout: Request timeout in seconds
        """
        self.client = MCPClient(
            command=command, server_id="entscheidsuche", env=env, timeout=timeout
        )

    async def connect(self) -> None:
        """Connect to Entscheidsuche MCP server"""
        await self.client.connect()
        await self.client.initialize()
        logger.info("Entscheidsuche adapter connected and initialized")

    async def disconnect(self) -> None:
        """Disconnect from Entscheidsuche MCP server"""
        await self.client.disconnect()

    async def search(
        self,
        query: str,
        court_level: Optional[str] = None,
        canton: Optional[str] = None,
        language: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        legal_areas: Optional[List[str]] = None,
        limit: int = 10,
    ) -> EntscheidausucheSearchResult:
        """
        Search Swiss court decisions

        Args:
            query: Search query (supports natural language)
            court_level: Filter by court level (federal, cantonal, district, municipal)
            canton: Filter by canton (2-letter code: ZH, BE, GE, etc.)
            language: Filter by language (DE, FR, IT, RM)
            date_from: Filter by date from (YYYY-MM-DD)
            date_to: Filter by date to (YYYY-MM-DD)
            legal_areas: Filter by legal areas
            limit: Maximum results to return

        Returns:
            EntscheidausucheSearchResult with matching decisions

        Raises:
            MCPInvocationError: If search fails
        """
        # Build search parameters
        params = {"query": query, "limit": limit}

        if court_level:
            params["courtLevel"] = court_level
        if canton:
            params["canton"] = canton.upper()
        if language:
            params["language"] = language.upper()
        if date_from:
            params["dateFrom"] = date_from
        if date_to:
            params["dateTo"] = date_to
        if legal_areas:
            params["legalAreas"] = legal_areas

        # Invoke search tool
        try:
            result = await self.client.invoke_tool("search_decisions", params)

            # Parse results
            decisions = []
            for item in result.get("decisions", []):
                decision = self._parse_decision(item)
                decisions.append(decision)

            return EntscheidausucheSearchResult(
                query=query,
                total_results=result.get("totalResults", len(decisions)),
                decisions=decisions,
                facets=result.get("facets", {}),
                search_time_ms=result.get("searchTimeMs", 0.0),
                metadata=result.get("metadata", {}),
            )

        except MCPInvocationError as e:
            logger.error(f"Entscheidsuche search failed: {e}")
            raise

    async def get_decision(self, decision_id: str) -> Optional[CourtDecision]:
        """
        Retrieve specific decision by ID

        Args:
            decision_id: Decision identifier

        Returns:
            CourtDecision or None if not found

        Raises:
            MCPInvocationError: If retrieval fails
        """
        try:
            result = await self.client.invoke_tool("get_decision", {"decisionId": decision_id})

            if result.get("found"):
                return self._parse_decision(result.get("decision", {}))
            return None

        except MCPInvocationError as e:
            logger.error(f"Decision retrieval failed: {e}")
            raise

    async def get_related_decisions(self, decision_id: str, limit: int = 5) -> List[CourtDecision]:
        """
        Find related decisions (cited, citing, similar)

        Args:
            decision_id: Decision identifier
            limit: Maximum related decisions to return

        Returns:
            List of related CourtDecision objects

        Raises:
            MCPInvocationError: If retrieval fails
        """
        try:
            result = await self.client.invoke_tool(
                "get_related_decisions", {"decisionId": decision_id, "limit": limit}
            )

            decisions = []
            for item in result.get("relatedDecisions", []):
                decision = self._parse_decision(item)
                decisions.append(decision)

            return decisions

        except MCPInvocationError as e:
            logger.error(f"Related decisions retrieval failed: {e}")
            raise

    def _parse_decision(self, data: Dict[str, Any]) -> CourtDecision:
        """Parse decision data from MCP server response"""
        # Parse date
        date_str = data.get("date", "")
        try:
            date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            date = datetime.now()  # Fallback

        return CourtDecision(
            decision_id=data.get("decisionId", ""),
            court_name=data.get("courtName", ""),
            court_level=data.get("courtLevel", ""),
            canton=data.get("canton"),
            title=data.get("title", ""),
            date=date,
            language=data.get("language", "DE"),
            summary=data.get("summary", ""),
            legal_areas=data.get("legalAreas", []),
            reference_number=data.get("referenceNumber", ""),
            related_decisions=data.get("relatedDecisions", []),
            full_text_url=data.get("fullTextUrl"),
        )

    async def __aenter__(self):
        """Async context manager entry"""
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.disconnect()
