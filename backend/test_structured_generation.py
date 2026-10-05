from google import genai
from google.genai import types
from pydantic import BaseModel, Field

from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


class TestResponse(BaseModel):
    summary: str = Field(description="A short summary.")
    strengths: list[str] = Field(description="A list of strengths.")
    gaps: list[str] = Field(description="A list of gaps.")


response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="""
Analyze this candidate evidence against the job requirement.

Candidate evidence:
- Python
- Machine Learning
- TensorFlow/Keras
- RAG
- LLM Integration
- React
- FastAPI

Job requirements:
- Python
- Machine Learning
- RAG
- Backend APIs
- React

Return a concise analysis.
""",
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=TestResponse,
        temperature=0.1,
    ),
)

print("Structured Gemini response:")
print(response.text)