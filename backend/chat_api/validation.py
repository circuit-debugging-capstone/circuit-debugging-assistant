import io
import json

from PIL import Image, UnidentifiedImageError
from rest_framework.exceptions import ValidationError

from .providers.base import ChatRequest, ChatTurn, ImageInput

MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_HISTORY_TURNS = 12
MAX_TEXT_LENGTH = 2000
MIME_BY_FORMAT = {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}


def read_image(upload, field: str) -> ImageInput:
    if upload is None:
        raise ValidationError({field: "Upload an image."})
    if upload.size > MAX_IMAGE_BYTES:
        raise ValidationError({field: "Image must be 10 MB or smaller."})
    data = upload.read()
    try:
        with Image.open(io.BytesIO(data)) as image:
            mime_type = MIME_BY_FORMAT.get(image.format)
            if not mime_type:
                raise ValidationError({field: "Use a JPEG, PNG, or WebP image."})
            if image.width * image.height > 20_000_000:
                raise ValidationError({field: "Image must be 20 megapixels or smaller."})
            image.load()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValidationError({field: "Upload a valid JPEG, PNG, or WebP image."}) from exc
    return ImageInput(mime_type=mime_type, data=data)


def parse_history(raw) -> list[ChatTurn]:
    if raw in (None, ""):
        return []
    try:
        turns = json.loads(raw)
    except (TypeError, ValueError) as exc:
        raise ValidationError({"history": "Provide a JSON array of chat turns."}) from exc
    if not isinstance(turns, list) or len(turns) > MAX_HISTORY_TURNS:
        raise ValidationError({"history": "Provide at most 12 chat turns."})
    result = []
    for turn in turns:
        if not isinstance(turn, dict) or set(turn) != {"role", "content"}:
            raise ValidationError({"history": "Each turn needs role and content."})
        role, content = turn["role"], turn["content"]
        if role not in ("user", "assistant") or not isinstance(content, str) or not content.strip() or len(content) > MAX_TEXT_LENGTH:
            raise ValidationError({"history": "Turns need a user or assistant role and 1–2000 characters of text."})
        result.append(ChatTurn(role=role, content=content.strip()))
    return result


def parse_chat_request(data, files) -> ChatRequest:
    message = data.get("message", "")
    if not isinstance(message, str) or not message.strip() or len(message) > MAX_TEXT_LENGTH:
        raise ValidationError({"message": "Enter 1–2000 characters of text."})
    history = parse_history(data.get("history"))
    reference = read_image(files.get("reference"), "reference")
    photo = read_image(files.get("photo"), "photo")
    return ChatRequest(reference=reference, photo=photo, message=message.strip(), history=history)
