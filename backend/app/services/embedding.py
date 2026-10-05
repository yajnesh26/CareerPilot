from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


EMBEDDING_MODEL = "gemini-embedding-001"


def create_document_embedding(text: str) -> list[float]:
    """Create an embedding for a document chunk."""

    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
        ),
    )

    return result.embeddings[0].values


def create_query_embedding(text: str) -> list[float]:
    """Create an embedding for a user's search query."""

    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
        ),
    )

    return result.embeddings[0].values