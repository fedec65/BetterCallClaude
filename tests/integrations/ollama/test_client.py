"""
Tests for Ollama client.

Tests OllamaClient, OllamaConfig, OllamaModel, and OllamaResponse classes.
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from src.integrations.ollama.client import (
    ChatMessage,
    OllamaClient,
    OllamaConfig,
    OllamaModel,
    OllamaModelNotFoundError,
    OllamaResponse,
    OllamaUnavailableError,
)


class TestOllamaModel:
    """Tests for OllamaModel enum."""

    def test_model_values(self):
        """Test all model values are accessible."""
        assert OllamaModel.LLAMA3_70B.value == "llama3.1:70b"
        assert OllamaModel.LLAMA3_8B.value == "llama3.1:8b"
        assert OllamaModel.MIXTRAL.value == "mixtral:8x7b"
        assert OllamaModel.PHI3.value == "phi3:medium"
        assert OllamaModel.CODELLAMA.value == "codellama:13b"

    def test_recommended_for(self):
        """Test recommended use case descriptions."""
        assert "legal" in OllamaModel.LLAMA3_70B.recommended_for.lower()
        assert "quick" in OllamaModel.LLAMA3_8B.recommended_for.lower()
        assert "multilingual" in OllamaModel.MIXTRAL.recommended_for.lower()
        assert "code" in OllamaModel.CODELLAMA.recommended_for.lower()

    def test_context_length(self):
        """Test context length properties."""
        assert OllamaModel.LLAMA3_70B.context_length == 128000
        assert OllamaModel.LLAMA3_8B.context_length == 128000
        assert OllamaModel.MIXTRAL.context_length == 32000
        assert OllamaModel.PHI3.context_length == 4096


class TestOllamaConfig:
    """Tests for OllamaConfig dataclass."""

    def test_default_config(self):
        """Test default configuration values."""
        config = OllamaConfig()
        assert config.host == "http://localhost:11434"
        assert config.timeout == 120.0
        assert config.default_model == OllamaModel.LLAMA3_8B
        assert config.max_retries == 3

    def test_custom_config(self):
        """Test custom configuration values."""
        config = OllamaConfig(
            host="http://192.168.1.100:11434",
            timeout=60.0,
            default_model=OllamaModel.LLAMA3_70B,
            max_retries=5,
        )
        assert config.host == "http://192.168.1.100:11434"
        assert config.timeout == 60.0
        assert config.default_model == OllamaModel.LLAMA3_70B
        assert config.max_retries == 5


class TestOllamaResponse:
    """Tests for OllamaResponse dataclass."""

    def test_basic_response(self):
        """Test basic response creation."""
        response = OllamaResponse(
            content="Test response",
            model="llama3.1:8b",
            tokens_used=100,
            prompt_tokens=50,
            generation_time=1.5,
            is_complete=True,
        )
        assert response.content == "Test response"
        assert response.model == "llama3.1:8b"
        assert response.tokens_used == 100
        assert response.is_complete

    def test_tokens_per_second(self):
        """Test tokens per second calculation."""
        response = OllamaResponse(
            content="Test",
            model="llama3.1:8b",
            tokens_used=100,
            prompt_tokens=50,
            generation_time=2.0,
            is_complete=True,
        )
        assert response.tokens_per_second == 50.0

    def test_tokens_per_second_zero_time(self):
        """Test tokens per second with zero generation time."""
        response = OllamaResponse(
            content="Test",
            model="llama3.1:8b",
            tokens_used=100,
            prompt_tokens=50,
            generation_time=0.0,
            is_complete=True,
        )
        assert response.tokens_per_second == 0.0

    def test_to_dict(self):
        """Test serialization to dictionary."""
        response = OllamaResponse(
            content="Test",
            model="llama3.1:8b",
            tokens_used=100,
            prompt_tokens=50,
            generation_time=1.5,
            is_complete=True,
        )
        data = response.to_dict()
        assert "content" in data
        assert "model" in data
        assert "tokens_used" in data
        assert "tokens_per_second" in data
        assert data["tokens_per_second"] == pytest.approx(66.67, rel=0.01)


class TestChatMessage:
    """Tests for ChatMessage dataclass."""

    def test_basic_message(self):
        """Test basic message creation."""
        msg = ChatMessage(role="user", content="Hello")
        assert msg.role == "user"
        assert msg.content == "Hello"

    def test_to_dict(self):
        """Test conversion to API format."""
        msg = ChatMessage(role="assistant", content="Hi there!")
        data = msg.to_dict()
        assert data == {"role": "assistant", "content": "Hi there!"}


class TestOllamaClientAvailability:
    """Tests for OllamaClient availability checking."""

    @pytest.mark.asyncio
    async def test_is_available_success(self):
        """Test availability check when Ollama is running."""
        client = OllamaClient()

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "models": [
                {"name": "llama3.1:8b"},
                {"name": "llama3.1:70b"},
            ]
        }

        with patch.object(client, "_http_client") as mock_http:
            mock_http.get = AsyncMock(return_value=mock_response)
            client._http_client = mock_http

            result = await client.is_available()
            assert result is True
            assert "llama3.1:8b" in client._available_models

    @pytest.mark.asyncio
    async def test_is_available_connection_error(self):
        """Test availability check when connection fails."""
        import httpx

        client = OllamaClient()

        with patch.object(client, "_http_client") as mock_http:
            mock_http.get = AsyncMock(side_effect=httpx.ConnectError("Connection refused"))
            client._http_client = mock_http

            result = await client.is_available()
            assert result is False

    @pytest.mark.asyncio
    async def test_list_models_unavailable(self):
        """Test listing models when Ollama is unavailable."""
        client = OllamaClient()
        client._available = False

        with patch.object(client, "is_available", return_value=False):
            models = await client.list_models()
            assert models == []


class TestOllamaClientGenerate:
    """Tests for OllamaClient generate method."""

    @pytest.fixture
    def mock_client(self):
        """Create a mock Ollama client."""
        client = OllamaClient()
        client._available = True
        client._available_models = ["llama3.1:8b", "llama3.1:70b"]
        return client

    @pytest.mark.asyncio
    async def test_generate_success(self, mock_client):
        """Test successful generation."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "response": "Generated text",
            "eval_count": 50,
            "prompt_eval_count": 30,
            "total_duration": 1500000000,  # 1.5 seconds in nanoseconds
            "done": True,
        }

        with patch.object(mock_client, "_http_client") as mock_http:
            mock_http.get = AsyncMock()  # For is_available
            mock_http.post = AsyncMock(return_value=mock_response)
            mock_client._http_client = mock_http

            with patch.object(mock_client, "is_available", return_value=True):
                with patch.object(mock_client, "has_model", return_value=True):
                    response = await mock_client.generate("Test prompt")

                    assert response.content == "Generated text"
                    assert response.tokens_used == 50
                    assert response.is_complete

    @pytest.mark.asyncio
    async def test_generate_unavailable(self, mock_client):
        """Test generation when Ollama is unavailable."""
        with patch.object(mock_client, "is_available", return_value=False):
            with pytest.raises(OllamaUnavailableError):
                await mock_client.generate("Test prompt")

    @pytest.mark.asyncio
    async def test_generate_model_not_found(self, mock_client):
        """Test generation with unavailable model."""
        with patch.object(mock_client, "is_available", return_value=True):
            with patch.object(mock_client, "has_model", return_value=False):
                with pytest.raises(OllamaModelNotFoundError):
                    await mock_client.generate("Test", model=OllamaModel.LLAMA3_70B)


class TestOllamaClientModelSelection:
    """Tests for model selection logic."""

    def test_select_model_for_analysis(self):
        """Test model selection for analysis tasks."""
        client = OllamaClient()
        model = client.select_model_for_task("analysis")
        assert model == OllamaModel.LLAMA3_70B

    def test_select_model_for_legal_analysis(self):
        """Test model selection for legal analysis."""
        client = OllamaClient()
        model = client.select_model_for_task("legal_analysis")
        assert model == OllamaModel.LLAMA3_70B

    def test_select_model_for_simple_task(self):
        """Test model selection for simple tasks."""
        client = OllamaClient()
        model = client.select_model_for_task("simple")
        assert model == OllamaModel.PHI3

    def test_select_model_for_code(self):
        """Test model selection for code tasks."""
        client = OllamaClient()
        model = client.select_model_for_task("code")
        assert model == OllamaModel.CODELLAMA

    def test_select_model_for_multilingual(self):
        """Test model selection for multilingual tasks."""
        client = OllamaClient()
        model = client.select_model_for_task("multilingual")
        assert model == OllamaModel.MIXTRAL

    def test_select_model_default(self):
        """Test default model selection for unknown task."""
        client = OllamaClient()
        model = client.select_model_for_task("unknown_task")
        assert model == OllamaModel.LLAMA3_8B

    def test_select_model_context_length_override(self):
        """Test model selection with context length requirement."""
        client = OllamaClient()
        # PHI3 has 4096 context, but we need more
        model = client.select_model_for_task("simple", context_length_needed=10000)
        assert model == OllamaModel.LLAMA3_70B


class TestOllamaClientContextManager:
    """Tests for async context manager."""

    @pytest.mark.asyncio
    async def test_context_manager_entry_exit(self):
        """Test context manager creates and closes client."""
        config = OllamaConfig()
        client = OllamaClient(config)

        # Mock the HTTP client
        with patch.object(client, "_ensure_client") as mock_ensure:
            mock_ensure.return_value = None

            async with client as c:
                assert c is client

    @pytest.mark.asyncio
    async def test_close_without_client(self):
        """Test close when client was never created."""
        client = OllamaClient()
        client._http_client = None
        await client.close()  # Should not raise


class TestOllamaClientChat:
    """Tests for chat completion."""

    @pytest.mark.asyncio
    async def test_chat_success(self):
        """Test successful chat completion."""
        client = OllamaClient()
        client._available = True
        client._available_models = ["llama3.1:8b"]

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "message": {"role": "assistant", "content": "Hello!"},
            "eval_count": 10,
            "prompt_eval_count": 5,
            "total_duration": 500000000,
            "done": True,
        }

        with patch.object(client, "_http_client") as mock_http:
            mock_http.post = AsyncMock(return_value=mock_response)
            client._http_client = mock_http

            with patch.object(client, "is_available", return_value=True):
                messages = [
                    ChatMessage(role="user", content="Hi"),
                ]
                response = await client.chat(messages)

                assert response.content == "Hello!"
                assert response.is_complete
