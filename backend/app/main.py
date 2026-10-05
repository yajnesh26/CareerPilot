from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.services.analysis import analyze_candidate
from app.services.embedding import create_query_embedding
from app.services.vector_store import query_chunks


app = FastAPI(
    title="CareerPilot API",
    description="AI-powered career and job matching assistant",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    job_description: str = Field(
        min_length=20,
        description="The job description to analyze the candidate against.",
    )


@app.get("/")
def root():
    return {
        "message": "CareerPilot API is running",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    """
    Analyze the indexed resume against a job description.
    """

    query = f"""
Analyze the candidate's resume for the following job description.
Identify the most relevant skills, projects, experience, and potential
gaps that should be considered when evaluating the candidate.

JOB DESCRIPTION:
{request.job_description}
"""

    # Step 1: Convert the job description into a query embedding.
    query_embedding = create_query_embedding(query)

    # Step 2: Retrieve the most relevant resume evidence.
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

    # Step 3: Ask Gemini to analyze only the retrieved evidence.
    try:
        analysis = analyze_candidate(
            job_description=request.job_description,
            retrieved_evidence=retrieved_evidence,
        )
    except RuntimeError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error

    # Step 4: Return structured analysis to the frontend.
    return {
        "analysis": analysis.model_dump(),
        "retrieved_evidence": retrieved_evidence,
    }