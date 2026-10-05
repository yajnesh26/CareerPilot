from app.services.document import ingest_pdf
from app.services.embedding import create_document_embedding
from app.services.vector_store import add_chunks, query_chunks


PDF_PATH = "../test-data/resume.pdf"


# ---------------------------------------------------------
# 1. Extract and chunk the resume
# ---------------------------------------------------------

chunks = ingest_pdf(
    file_path=PDF_PATH,
    source="resume",
)

print(f"Loaded {len(chunks)} chunks.")


# ---------------------------------------------------------
# 2. Generate embeddings
# ---------------------------------------------------------

embeddings = []

for index, chunk in enumerate(chunks, start=1):
    print(
        f"Embedding chunk {index}/{len(chunks)}: "
        f"{chunk.section}"
    )

    embedding = create_document_embedding(
        chunk.text
    )

    embeddings.append(embedding)


# ---------------------------------------------------------
# 3. Store embeddings in Chroma
# ---------------------------------------------------------

add_chunks(
    chunks=chunks,
    embeddings=embeddings,
)

print("\nChunks stored in Chroma.")


# ---------------------------------------------------------
# 4. Test semantic retrieval
# ---------------------------------------------------------

query = "What AI and machine learning experience does the candidate have?"

print(f"\nQuery: {query}")

from app.services.embedding import create_query_embedding

query_embedding = create_query_embedding(query)

results = query_chunks(
    query_embedding=query_embedding,
    n_results=3,
)


# ---------------------------------------------------------
# 5. Display retrieved evidence
# ---------------------------------------------------------

print("\nRetrieved evidence:")
print("=" * 80)

documents = results["documents"][0]
metadatas = results["metadatas"][0]
distances = results["distances"][0]

for index, (document, metadata, distance) in enumerate(
    zip(documents, metadatas, distances),
    start=1,
):
    print(f"\nResult {index}")
    print("-" * 80)
    print(f"Distance: {distance}")
    print(f"Source: {metadata['source']}")
    print(f"Page: {metadata['page']}")
    print(f"Section: {metadata['section']}")
    print()
    print(document)