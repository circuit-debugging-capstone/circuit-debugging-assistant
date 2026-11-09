# Local chat backend

This Django REST Framework service accepts a reference circuit **image**, a breadboard photo, and a message. It passes both images and the text conversation to a configured vision-capable AI provider. It is an exploratory visual baseline, not a verified circuit comparison engine.

## Start locally

Use Python 3.12 or newer. From `backend/`:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
export OPENAI_API_KEY="your-key"
export AI_PROVIDER=openai
export AI_MODEL=gpt-6-astra
.venv/bin/python manage.py runserver 127.0.0.1:8000
```

Keep the key in your local environment. `.env` files are ignored, but Django does not load them automatically. Restart the server after changing environment variables.

The local Vite frontend at `localhost:5173` or `127.0.0.1:5173` is allowed to call this route directly.

## API

`POST http://127.0.0.1:8000/api/chat/` with `multipart/form-data`:

| Field | Required | Meaning |
| --- | --- | --- |
| `reference` | Yes | Reference JPEG, PNG, or WebP image, up to 10 MB and 20 megapixels |
| `photo` | Yes | Breadboard JPEG, PNG, or WebP image, up to 10 MB and 20 megapixels |
| `message` | Yes | Current question, 1–2000 characters |
| `history` | No | JSON array of up to 12 prior `{ "role": "user" or "assistant", "content": "text" }` turns |

Returns `{ "reply": "..." }`. Validation errors return `400`, missing provider configuration returns `503`, and provider failures return `502`. The service stores neither images nor chat history. The frontend must resend both images and previous text turns for each message. This initial route accepts image references; `.sch` files need a separate parser or conversion step.

Example request:

```sh
curl -F 'reference=@reference.png' -F 'photo=@breadboard.jpg' \
  -F 'message=What visible differences do you see?' \
  http://127.0.0.1:8000/api/chat/
```

The provider interface is in `chat_api/providers/base.py`. `AI_MODEL` and `OPENAI_API_KEY` can change without code changes for OpenAI models that accept image input. To use Gemini or another API, add one adapter implementing `reply(ChatRequest)` and register it in `chat_api/providers/factory.py`; the HTTP contract can stay the same.

The route is intended for local development. Add authentication, request limits, deployment settings, and a deliberate data retention policy before exposing it publicly.

Run tests with `.venv/bin/python manage.py test`.
