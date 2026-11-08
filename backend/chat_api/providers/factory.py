import os

from .base import ChatRequest
from .openai_provider import OpenAIProvider


class ProviderConfigurationError(Exception):
    pass

class MockProvider:
    def reply(self, request: ChatRequest) -> str:
        return (
            f"[Mock AI Reply] Received message: '{request.message}' | "
            f"Reference: {request.reference.mime_type} ({len(request.reference.data)} bytes) | "
            f"Photo: {request.photo.mime_type} ({len(request.photo.data)} bytes) | "
            f"History turns: {len(request.history)}"
        )

def get_provider():
    provider = os.environ.get("AI_PROVIDER", "openai").lower()
    if provider == "mock":
        return MockProvider()
    if provider == "openai":
        key = os.environ.get("OPENAI_API_KEY", "").strip()
        model = os.environ.get("AI_MODEL", "gpt-6-astra").strip()
        if not key:
            raise ProviderConfigurationError("OPENAI_API_KEY is not configured")
        if not model:
            raise ProviderConfigurationError("AI_MODEL is not configured")
        return OpenAIProvider(api_key=key, model=model)
    raise ProviderConfigurationError(f"AI_PROVIDER '{provider}' is not supported")