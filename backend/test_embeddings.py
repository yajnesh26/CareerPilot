from app.services.embedding import (
    create_document_embedding,
    create_query_embedding,
)


document = """
The candidate has experience building web applications using
React, Python, FastAPI, and SQL. They have also worked on
machine learning and retrieval augmented generation projects.
"""

query = "What experience does the candidate have with Python?"


document_vector = create_document_embedding(document)
query_vector = create_query_embedding(query)


print("Document embedding dimensions:", len(document_vector))
print("Query embedding dimensions:", len(query_vector))

print("\nFirst 5 document values:")
print(document_vector[:5])

print("\nFirst 5 query values:")
print(query_vector[:5])