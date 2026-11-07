import os

from .openai_provider import OpenAIProvider


class ProviderConfigurationError(Exception):
    pass


def get_provider():
    provider = os.environ.get("AI_PROVIDER", "openai").lower()
    if provider == "openai":
        key = os.environ.get("OPENAI_API_KEY", "").strip()
        model = os.environ.get("AI_MODEL", "gpt-6-astra").strip()
        if not key:
            raise ProviderConfigurationError("OPENAI_API_KEY is not configured")
        if not model:
            raise ProviderConfigurationError("AI_MODEL is not configured")
        return OpenAIProvider(api_key=key, model=model)
    raise ProviderConfigurationError(f"AI_PROVIDER '{provider}' is not supported")
