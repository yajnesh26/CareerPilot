from app.services.embedding import create_query_embedding
from app.services.vector_store import query_chunks
from app.services.analysis import analyze_candidate


JOB_DESCRIPTION = """
We are looking for an AI Solution Builder Intern.

Requirements:
- Strong Python programming skills
- Understanding of machine learning and deep learning
- Experience with LLMs or RAG systems
- Ability to build backend APIs
- Experience with React or modern frontend development
- Understanding of databases
- Ability to build practical AI-powered applications
"""


query = """
What experience and skills does the candidate have that are relevant
to this AI Solution Builder role?
"""

print("Creating query embedding...")
query_embedding = create_query_embedding(query)

print("Retrieving relevant evidence...")
results = query_chunks(
    query_embedding=query_embedding,
    n_results=5,
)

documents = results["documents"][0]
metadatas = results["metadatas"][0]

retrieved_evidence = []

for document, metadata in zip(documents, metadatas):
    retrieved_evidence.append(
        {
            "text": document,
            "source": metadata["source"],
            "page": metadata["page"],
            "section": metadata["section"],
        }
    )

print(f"Retrieved {len(retrieved_evidence)} evidence chunks.")

print("\nRunning grounded Gemini analysis...")
analysis = analyze_candidate(
    job_description=JOB_DESCRIPTION,
    retrieved_evidence=retrieved_evidence,
)

print("\n" + "=" * 80)
print("CAREERPILOT ANALYSIS")
print("=" * 80)

print("\nSUMMARY")
print(analysis.summary)

print("\nSTRENGTHS")
for strength in analysis.strengths:
    print(f"- {strength}")

print("\nGAPS")
for gap in analysis.gaps:
    print(f"- {gap}")

print("\nEVIDENCE")
for item in analysis.evidence:
    print(
        f"- {item.claim} "
        f"[{item.source}, page {item.page}, {item.section}]"
    )

print("\nLIMITATIONS")
for limitation in analysis.limitations:
    print(f"- {limitation}")