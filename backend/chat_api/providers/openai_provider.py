import base64

from openai import OpenAI

from .base import ChatRequest

SYSTEM_PROMPT = (
    "You are a prototype assistant for comparing a circuit reference image with "
    "photographs of a breadboard assembly. Describe only observations supported by "
    "the images and conversation. Distinguish observations from hypotheses, name "
    "uncertainty, and ask for a clearer view when a connection is obscured. Do not "
    "claim to have reconstructed all electrical connections, verified circuit "
    "operation, or detected hidden contact faults. Do not present visual guesses "
    "as definitive electrical diagnoses."
)


def image_url(mime_type: str, data: bytes) -> str:
    encoded = base64.b64encode(data).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"


class OpenAIProvider:
    def __init__(self, api_key: str, model: str, client=None):
        self.model = model
        self.client = client or OpenAI(api_key=api_key)

    def reply(self, request: ChatRequest) -> str:
        conversation = [
            {"role": turn.role, "content": turn.content} for turn in request.history
        ]
        conversation.append(
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": request.message},
                    {"type": "input_text", "text": "Reference circuit image:"},
                    {
                        "type": "input_image",
                        "image_url": image_url(
                            request.reference.mime_type, request.reference.data
                        ),
                        "detail": "high",
                    },
                    {
                        "type": "input_text",
                        "text": "Photograph of the actual breadboard assembly:",
                    },
                    {
                        "type": "input_image",
                        "image_url": image_url(
                            request.photo.mime_type, request.photo.data
                        ),
                        "detail": "high",
                    },
                ],
            }
        )
        response = self.client.responses.create(
            model=self.model,
            instructions=SYSTEM_PROMPT,
            input=conversation,
            store=False,
        )
        reply = response.output_text.strip()
        if not reply:
            raise RuntimeError("The model returned no text response")
        return reply
