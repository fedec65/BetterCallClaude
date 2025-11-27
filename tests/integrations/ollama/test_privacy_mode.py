"""
Tests for Ollama privacy mode and routing.

Tests PrivacyLevel, PrivacyConfig, PrivacyRouter, and routing decisions.
"""

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

import pytest

from src.integrations.ollama.client import (
    ChatMessage,
    OllamaClient,
    OllamaResponse,
)
from src.integrations.ollama.privacy_mode import (
    PrivacyConfig,
    PrivacyLevel,
    PrivacyRouter,
    PrivacyRoutingResult,
    PrivacyViolationError,
    RoutingDecision,
)


class TestPrivacyLevel:
    """Tests for PrivacyLevel enum."""

    def test_privacy_level_values(self):
        """Test all privacy level values."""
        assert PrivacyLevel.PUBLIC.value == "public"
        assert PrivacyLevel.CONFIDENTIAL.value == "confidential"
        assert PrivacyLevel.PRIVILEGED.value == "privileged"

    def test_allows_cloud(self):
        """Test cloud allowance for each level."""
        assert PrivacyLevel.PUBLIC.allows_cloud is True
        assert PrivacyLevel.CONFIDENTIAL.allows_cloud is True
        assert PrivacyLevel.PRIVILEGED.allows_cloud is False

    def test_requires_local(self):
        """Test local requirement for each level."""
        assert PrivacyLevel.PUBLIC.requires_local is False
        assert PrivacyLevel.CONFIDENTIAL.requires_local is False
        assert PrivacyLevel.PRIVILEGED.requires_local is True

    def test_description_languages(self):
        """Test multilingual descriptions."""
        for level in PrivacyLevel:
            desc = level.description
            # Description should be a dict with language keys
            assert isinstance(desc, dict)
            assert "de" in desc
            assert "fr" in desc
            assert "it" in desc
            assert "en" in desc


class TestPrivacyConfig:
    """Tests for PrivacyConfig dataclass."""

    def test_default_config(self):
        """Test default configuration values."""
        config = PrivacyConfig()
        assert config.default_level == PrivacyLevel.CONFIDENTIAL
        assert config.allow_cloud_fallback is True
        assert config.log_routing_decisions is True
        assert config.auto_detect_sensitivity is True
        assert len(config.local_only_patterns) > 0

    def test_custom_config(self):
        """Test custom configuration."""
        config = PrivacyConfig(
            default_level=PrivacyLevel.PRIVILEGED,
            allow_cloud_fallback=False,
            log_routing_decisions=False,
        )
        assert config.default_level == PrivacyLevel.PRIVILEGED
        assert config.allow_cloud_fallback is False
        assert config.log_routing_decisions is False

    def test_swiss_legal_patterns(self):
        """Test Swiss legal patterns are included."""
        config = PrivacyConfig()

        # Check for key Swiss legal terms
        patterns_str = str(config.local_only_patterns)
        assert "anwalt" in patterns_str.lower() or "geheimnis" in patterns_str.lower()
        assert "321" in patterns_str  # Art. 321 StGB


class TestRoutingDecision:
    """Tests for RoutingDecision dataclass."""

    def test_basic_decision(self):
        """Test basic routing decision creation."""
        decision = RoutingDecision(
            timestamp=datetime.now(),
            privacy_level=PrivacyLevel.CONFIDENTIAL,
            backend_used="local",
            fallback_used=False,
            reason="Ollama available",
        )
        assert decision.privacy_level == PrivacyLevel.CONFIDENTIAL
        assert decision.backend_used == "local"
        assert decision.fallback_used is False

    def test_to_dict(self):
        """Test serialization to dictionary."""
        decision = RoutingDecision(
            timestamp=datetime.now(),
            privacy_level=PrivacyLevel.PRIVILEGED,
            backend_used="local",
            fallback_used=False,
            reason="Required by privacy level",
            prompt_hash="abc123",
        )
        data = decision.to_dict()
        assert data["privacy_level"] == "privileged"
        assert data["backend_used"] == "local"
        assert "timestamp" in data
        assert data["prompt_hash"] == "abc123"


class TestPrivacyRoutingResult:
    """Tests for PrivacyRoutingResult dataclass."""

    def test_basic_result(self):
        """Test basic routing result."""
        decision = RoutingDecision(
            timestamp=datetime.now(),
            privacy_level=PrivacyLevel.PUBLIC,
            backend_used="cloud",
            fallback_used=False,
            reason="Cloud preferred for public",
        )
        result = PrivacyRoutingResult(
            backend="cloud",
            response=None,
            decision=decision,
            cloud_response="Test response",
        )
        assert result.backend == "cloud"
        assert result.decision.backend_used == "cloud"
        assert result.cloud_response == "Test response"

    def test_result_with_ollama_response(self):
        """Test result with Ollama response."""
        decision = RoutingDecision(
            timestamp=datetime.now(),
            privacy_level=PrivacyLevel.CONFIDENTIAL,
            backend_used="local",
            fallback_used=False,
            reason="Test",
        )
        ollama_response = OllamaResponse(
            content="Response",
            model="llama3.1:8b",
            tokens_used=50,
            prompt_tokens=30,
            generation_time=1.0,
            is_complete=True,
        )
        result = PrivacyRoutingResult(
            backend="local",
            response=ollama_response,
            decision=decision,
        )
        assert result.backend == "local"
        assert result.response is not None
        assert result.response.content == "Response"


class TestPrivacyLevelDetection:
    """Tests for privacy level detection from content."""

    @pytest.fixture
    def router(self):
        """Create a router for testing."""
        mock_client = MagicMock(spec=OllamaClient)
        return PrivacyRouter(ollama_client=mock_client)

    def test_detect_privileged_german(self, router):
        """Test detection of privileged content in German."""
        text = "Dies betrifft das Anwaltsgeheimnis gemäss Art. 321 StGB"
        level = router.detect_privacy_level(text)
        assert level == PrivacyLevel.PRIVILEGED

    def test_detect_privileged_french(self, router):
        """Test detection of privileged content in French."""
        text = "Ceci concerne le secret professionnel de l'avocat"
        level = router.detect_privacy_level(text)
        assert level == PrivacyLevel.PRIVILEGED

    def test_detect_privileged_italian(self, router):
        """Test detection of privileged content in Italian."""
        text = "Questo riguarda il segreto professionale dell'avvocato"
        level = router.detect_privacy_level(text)
        assert level == PrivacyLevel.PRIVILEGED

    def test_detect_confidential_internal(self, router):
        """Test detection of confidential internal content."""
        text = "Dieses Dokument ist nur zur internen Verwendung"
        level = router.detect_privacy_level(text)
        assert level == PrivacyLevel.CONFIDENTIAL

    def test_detect_default_level(self, router):
        """Test detection returns default for non-sensitive content."""
        text = "What is the capital of Switzerland?"
        level = router.detect_privacy_level(text)
        assert level == PrivacyLevel.CONFIDENTIAL  # Default level

    def test_detect_mandatsgeheimnis(self, router):
        """Test detection of mandate confidentiality."""
        text = "Das Mandatsgeheimnis muss gewahrt werden"
        level = router.detect_privacy_level(text)
        assert level == PrivacyLevel.PRIVILEGED


class TestPrivacyRouterRouting:
    """Tests for PrivacyRouter routing logic."""

    @pytest.fixture
    def mock_ollama_client(self):
        """Create a mock Ollama client."""
        mock = MagicMock(spec=OllamaClient)
        mock.is_available = AsyncMock(return_value=True)
        mock.generate = AsyncMock()
        mock.chat = AsyncMock()
        return mock

    @pytest.fixture
    def router(self, mock_ollama_client):
        """Create a router with mocked clients."""
        return PrivacyRouter(ollama_client=mock_ollama_client)

    @pytest.mark.asyncio
    async def test_route_privileged_ollama_available(self, router, mock_ollama_client):
        """Test routing privileged content when Ollama is available."""
        mock_response = OllamaResponse(
            content="Local response",
            model="llama3.1:8b",
            tokens_used=50,
            prompt_tokens=30,
            generation_time=1.0,
            is_complete=True,
        )
        mock_ollama_client.generate.return_value = mock_response

        result = await router.route_request(
            "Anwaltsgeheimnis content",
            privacy_level=PrivacyLevel.PRIVILEGED,
        )

        assert result.backend == "local"
        assert result.response.content == "Local response"

    @pytest.mark.asyncio
    async def test_route_privileged_ollama_unavailable(self, router, mock_ollama_client):
        """Test routing privileged content when Ollama is unavailable."""
        mock_ollama_client.is_available.return_value = False

        with pytest.raises(PrivacyViolationError):
            await router.route_request(
                "Anwaltsgeheimnis content",
                privacy_level=PrivacyLevel.PRIVILEGED,
            )

    @pytest.mark.asyncio
    async def test_route_confidential_prefers_local(self, router, mock_ollama_client):
        """Test confidential content prefers local when available."""
        mock_response = OllamaResponse(
            content="Local confidential response",
            model="llama3.1:8b",
            tokens_used=50,
            prompt_tokens=30,
            generation_time=1.0,
            is_complete=True,
        )
        mock_ollama_client.generate.return_value = mock_response

        result = await router.route_request(
            "Client data",
            privacy_level=PrivacyLevel.CONFIDENTIAL,
        )

        assert result.backend == "local"

    @pytest.mark.asyncio
    async def test_route_confidential_fallback_to_cloud(self, mock_ollama_client):
        """Test confidential content falls back to cloud when local unavailable."""
        mock_ollama_client.is_available.return_value = False

        async def mock_cloud_handler(**kwargs):
            return "Cloud response"

        router = PrivacyRouter(
            ollama_client=mock_ollama_client,
            cloud_handler=mock_cloud_handler,
        )

        result = await router.route_request(
            "General client inquiry",
            privacy_level=PrivacyLevel.CONFIDENTIAL,
        )

        assert result.backend == "cloud"
        assert result.decision.fallback_used is True

    @pytest.mark.asyncio
    async def test_route_public_prefers_cloud(self, mock_ollama_client):
        """Test public content prefers cloud when cloud handler exists."""

        async def mock_cloud_handler(**kwargs):
            return "Cloud response"

        router = PrivacyRouter(
            ollama_client=mock_ollama_client,
            cloud_handler=mock_cloud_handler,
        )

        result = await router.route_request(
            "What is Swiss law?",
            privacy_level=PrivacyLevel.PUBLIC,
        )

        assert result.backend == "cloud"


class TestPrivacyRouterAudit:
    """Tests for routing audit trail."""

    @pytest.fixture
    def mock_ollama_client(self):
        """Create a mock Ollama client."""
        mock = MagicMock(spec=OllamaClient)
        mock.is_available = AsyncMock(return_value=True)
        mock.generate = AsyncMock()
        return mock

    @pytest.fixture
    def router(self, mock_ollama_client):
        """Create a router for testing."""
        config = PrivacyConfig(log_routing_decisions=True)
        return PrivacyRouter(ollama_client=mock_ollama_client, config=config)

    @pytest.mark.asyncio
    async def test_routing_history_recorded(self, router, mock_ollama_client):
        """Test that routing decisions are recorded."""
        mock_response = OllamaResponse(
            content="Response",
            model="llama3.1:8b",
            tokens_used=50,
            prompt_tokens=30,
            generation_time=1.0,
            is_complete=True,
        )
        mock_ollama_client.generate.return_value = mock_response

        await router.route_request(
            "Test prompt",
            privacy_level=PrivacyLevel.CONFIDENTIAL,
        )

        history = router.get_routing_history()
        assert len(history) == 1
        assert history[0].privacy_level == PrivacyLevel.CONFIDENTIAL

    @pytest.mark.asyncio
    async def test_routing_statistics(self, router, mock_ollama_client):
        """Test routing statistics calculation."""
        mock_response = OllamaResponse(
            content="Response",
            model="llama3.1:8b",
            tokens_used=50,
            prompt_tokens=30,
            generation_time=1.0,
            is_complete=True,
        )
        mock_ollama_client.generate.return_value = mock_response

        # Make multiple requests
        for _ in range(3):
            await router.route_request(
                "Test",
                privacy_level=PrivacyLevel.CONFIDENTIAL,
            )

        stats = router.get_routing_statistics()
        assert stats["total"] == 3
        assert "by_privacy_level" in stats
        assert "local_count" in stats


class TestPrivacyRouterChat:
    """Tests for chat with privacy routing."""

    @pytest.fixture
    def mock_ollama_client(self):
        """Create a mock Ollama client."""
        mock = MagicMock(spec=OllamaClient)
        mock.is_available = AsyncMock(return_value=True)
        mock.chat = AsyncMock()
        return mock

    @pytest.fixture
    def router(self, mock_ollama_client):
        """Create a router for testing."""
        return PrivacyRouter(ollama_client=mock_ollama_client)

    @pytest.mark.asyncio
    async def test_chat_with_privacy(self, router, mock_ollama_client):
        """Test chat completion with privacy routing."""
        mock_response = OllamaResponse(
            content="Chat response",
            model="llama3.1:8b",
            tokens_used=50,
            prompt_tokens=30,
            generation_time=1.0,
            is_complete=True,
        )
        mock_ollama_client.chat.return_value = mock_response

        messages = [
            ChatMessage(role="user", content="Hello"),
        ]
        result = await router.chat_with_privacy(
            messages,
            privacy_level=PrivacyLevel.CONFIDENTIAL,
        )

        assert result.response.content == "Chat response"
        assert result.backend == "local"


class TestPrivacyConfigPatterns:
    """Tests for Swiss legal pattern matching."""

    @pytest.fixture
    def router(self):
        """Create a router for testing."""
        mock_client = MagicMock(spec=OllamaClient)
        return PrivacyRouter(ollama_client=mock_client)

    def test_art_321_stgb_detection(self, router):
        """Test Article 321 StGB (professional secrecy) detection."""
        texts = [
            "gemäss Art. 321 StGB",
            "nach Art. 321 StGB geschützt",
            "Artikel 321 StGB Berufsgeheimnis",
        ]
        for text in texts:
            level = router.detect_privacy_level(text)
            assert level == PrivacyLevel.PRIVILEGED, f"Failed for: {text}"

    def test_berufsgeheimnis_detection(self, router):
        """Test professional secrecy detection."""
        texts = [
            "Das Berufsgeheimnis schützt",
            "unter das Berufsgeheimnis fallend",
        ]
        for text in texts:
            level = router.detect_privacy_level(text)
            assert level == PrivacyLevel.PRIVILEGED, f"Failed for: {text}"

    def test_french_secret_professionnel(self, router):
        """Test French professional secrecy detection."""
        texts = [
            "le secret professionnel s'applique",
            "protégé par le secret professionnel",
        ]
        for text in texts:
            level = router.detect_privacy_level(text)
            assert level == PrivacyLevel.PRIVILEGED, f"Failed for: {text}"

    def test_case_insensitive_detection(self, router):
        """Test case-insensitive pattern matching."""
        texts = [
            "ANWALTSGEHEIMNIS",
            "Anwaltsgeheimnis",
            "anwaltsgeheimnis",
        ]
        for text in texts:
            level = router.detect_privacy_level(text)
            assert level == PrivacyLevel.PRIVILEGED, f"Failed for: {text}"

    def test_vertraulich_detection(self, router):
        """Test confidential marking detection."""
        texts = [
            "Dieses Dokument ist streng vertraulich",
            "STRENG VERTRAULICH",
        ]
        for text in texts:
            level = router.detect_privacy_level(text)
            assert level == PrivacyLevel.PRIVILEGED, f"Failed for: {text}"
