from pathlib import Path

import chromadb

from app.services.document import DocumentChunk


BASE_DIR = Path(__file__).resolve().parents[2]
CHROMA_PATH = BASE_DIR / "chroma_db"

COLLECTION_NAME = "careerpilot_documents"


client = chromadb.PersistentClient(
    path=str(CHROMA_PATH)
)


collection = client.get_or_create_collection(
    name=COLLECTION_NAME
)


def add_chunks(
    chunks: list[DocumentChunk],
    embeddings: list[list[float]],
) -> None:
    """
    Store document chunks and their pre-computed embeddings.
    """

    if len(chunks) != len(embeddings):
        raise ValueError(
            "The number of chunks must match the number of embeddings."
        )

    ids = [
        f"{chunk.source}-{chunk.chunk_index}"
        for chunk in chunks
    ]

    documents = [
        chunk.text
        for chunk in chunks
    ]

    metadatas = [
        {
            "source": chunk.source,
            "page": chunk.page,
            "section": chunk.section,
            "chunk_index": chunk.chunk_index,
        }
        for chunk in chunks
    ]

    collection.upsert(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )


def query_chunks(
    query_embedding: list[float],
    n_results: int = 3,
) -> dict:
    """
    Retrieve the most similar chunks for a query embedding.
    """

    return collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=[
            "documents",
            "metadatas",
            "distances",
        ],
    )