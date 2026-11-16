import logging

from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .providers.factory import ProviderConfigurationError, get_provider
from .validation import parse_chat_request

logger = logging.getLogger(__name__)


class ChatView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        chat_request = parse_chat_request(request.data, request.FILES)
        try:
            provider = get_provider()
        except ProviderConfigurationError as exc:
            logger.error("AI provider configuration error: %s", exc)
            return Response(
                {"error": "AI service is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        try:
            reply = provider.reply(chat_request)
        except Exception as exc:
            logger.warning("AI provider request failed: %s", type(exc).__name__)
            return Response(
                {"error": "AI service could not complete the request."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response({"reply": reply})
