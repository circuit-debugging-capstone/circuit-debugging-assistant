from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class ImageInput:
    mime_type: str
    data: bytes


@dataclass(frozen=True)
class ChatTurn:
    role: str
    content: str


@dataclass(frozen=True)
class ChatRequest:
    reference: ImageInput
    photo: ImageInput
    message: str
    history: list[ChatTurn]


class VisionChatProvider(Protocol):
    def reply(self, request: ChatRequest) -> str: ...
