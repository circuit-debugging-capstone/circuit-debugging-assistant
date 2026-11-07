import io
import json
from types import SimpleNamespace
from unittest.mock import Mock, patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase
from PIL import Image
from rest_framework.test import APIClient

from .providers.base import ChatRequest, ChatTurn, ImageInput
from .providers.openai_provider import OpenAIProvider


def image_upload(name="image.png"):
    buffer = io.BytesIO()
    Image.new("RGB", (2, 2), "white").save(buffer, "PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")


class ChatEndpointTests(SimpleTestCase):
    def setUp(self):
        self.client = APIClient()

    def payload(self):
        return {
            "reference": image_upload("reference.png"),
            "photo": image_upload("photo.png"),
            "message": "Does the photo match the reference?",
            "history": json.dumps([
                {"role": "user", "content": "Can you compare these?"},
                {"role": "assistant", "content": "Please upload both images."},
            ]),
        }

    @patch("chat_api.views.get_provider")
    def test_valid_request_passes_images_and_history_to_provider(self, get_provider):
        get_provider.return_value.reply.return_value = "The LED connection is unclear."
        response = self.client.post("/api/chat/", self.payload(), format="multipart")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"reply": "The LED connection is unclear."})
        request = get_provider.return_value.reply.call_args.args[0]
        self.assertEqual(request.reference.mime_type, "image/png")
        self.assertEqual(request.photo.mime_type, "image/png")
        self.assertEqual(request.message, "Does the photo match the reference?")
        self.assertEqual(request.history[0], ChatTurn("user", "Can you compare these?"))

    @patch("chat_api.views.get_provider")
    def test_invalid_reference_is_rejected_before_provider_call(self, get_provider):
        payload = self.payload()
        payload["reference"] = SimpleUploadedFile("wrong.sch", b"not an image")
        response = self.client.post("/api/chat/", payload, format="multipart")

        self.assertEqual(response.status_code, 400)
        self.assertIn("reference", response.json())
        get_provider.assert_not_called()

    @patch("chat_api.views.get_provider")
    def test_invalid_history_is_rejected(self, get_provider):
        payload = self.payload()
        payload["history"] = '{"role":"user"}'
        response = self.client.post("/api/chat/", payload, format="multipart")

        self.assertEqual(response.status_code, 400)
        self.assertIn("history", response.json())
        get_provider.assert_not_called()

    def test_missing_key_returns_service_unavailable(self):
        with patch.dict("os.environ", {"AI_PROVIDER": "openai"}, clear=True):
            response = self.client.post("/api/chat/", self.payload(), format="multipart")
        self.assertEqual(response.status_code, 503)

    @patch("chat_api.views.get_provider")
    def test_provider_error_does_not_expose_details(self, get_provider):
        get_provider.return_value.reply.side_effect = RuntimeError("secret upstream details")
        response = self.client.post("/api/chat/", self.payload(), format="multipart")
        self.assertEqual(response.status_code, 502)
        self.assertNotIn("secret", response.content.decode())


class OpenAIProviderTests(SimpleTestCase):
    def test_adapter_sends_both_images_and_disables_response_storage(self):
        client = Mock()
        client.responses.create.return_value = SimpleNamespace(output_text="  Unclear connection.  ")
        provider = OpenAIProvider(api_key="test", model="gpt-6-astra", client=client)
        image = ImageInput("image/png", b"png-bytes")
        request = ChatRequest(image, image, "Compare these", [ChatTurn("user", "Hello")])

        self.assertEqual(provider.reply(request), "Unclear connection.")
        args = client.responses.create.call_args.kwargs
        self.assertEqual(args["model"], "gpt-6-astra")
        self.assertFalse(args["store"])
        self.assertEqual(args["input"][0], {"role": "user", "content": "Hello"})
        images = [part for part in args["input"][-1]["content"] if part["type"] == "input_image"]
        self.assertEqual(len(images), 2)
        self.assertTrue(all(part["image_url"].startswith("data:image/png;base64,") for part in images))
