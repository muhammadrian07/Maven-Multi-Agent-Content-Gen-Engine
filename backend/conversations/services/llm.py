"""
Local Ollama LLM client.

Maven talks to a model already running on the machine (e.g. gemma3:270m).
No cloud API key required for this path.
"""

from __future__ import annotations

from typing import Any

import requests
from django.conf import settings


class LlmError(Exception):
    """Raised when the local model cannot be reached or returns an invalid payload."""


def chat(
    messages: list[dict[str, str]],
    *,
    model: str | None = None,
    temperature: float = 0.7,
) -> str:
    """
    Non-streaming chat completion via Ollama /api/chat.
    `messages` items: {"role": "system"|"user"|"assistant", "content": "..."}.
    """
    base = settings.OLLAMA_BASE_URL.rstrip("/")
    model_name = model or settings.OLLAMA_MODEL
    url = f"{base}/api/chat"

    payload: dict[str, Any] = {
        "model": model_name,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": temperature,
        },
    }

    try:
        response = requests.post(
            url,
            json=payload,
            timeout=settings.OLLAMA_TIMEOUT_SECONDS,
        )
    except requests.RequestException as exc:
        raise LlmError(
            "Cannot reach the local LLM (Ollama). "
            "Confirm Ollama is running and the model is pulled "
            f"(`ollama run {model_name}`)."
        ) from exc

    if response.status_code >= 400:
        detail = response.text[:300]
        raise LlmError(
            f"Ollama returned HTTP {response.status_code} for model "
            f"'{model_name}'. {detail}"
        )

    try:
        data = response.json()
        content = data["message"]["content"]
    except (ValueError, KeyError, TypeError) as exc:
        raise LlmError("Ollama returned an unexpected response shape.") from exc

    text = (content or "").strip()
    if not text:
        raise LlmError("The local model returned an empty reply. Try again.")
    return text
