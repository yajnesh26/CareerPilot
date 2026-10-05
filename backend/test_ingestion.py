import sys

from app.services.document import ingest_pdf


if len(sys.argv) != 2:
    print("Usage:")
    print('python test_ingestion.py "path\\to\\resume.pdf"')
    raise SystemExit(1)


pdf_path = sys.argv[1]

chunks = ingest_pdf(
    file_path=pdf_path,
    source="resume",
)


print(f"\nTotal chunks: {len(chunks)}\n")

for chunk in chunks:
    print("=" * 80)
    print(f"Source: {chunk.source}")
    print(f"Page: {chunk.page}")
    print(f"Section: {chunk.section}")
    print(f"Chunk index: {chunk.chunk_index}")
    print("-" * 80)
    print(chunk.text)
    print()