import time

from google import genai
from google.genai import types
from google.genai import errors
from pydantic import BaseModel, Field

from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)

GENERATION_MODEL = "gemini-3.8-flash"


class EvidenceItem(BaseModel):
    claim: str = Field(description="A claim supported by the provided evidence.")
    source: str = Field(description="Source document name.")
    page: int = Field(description="Page number of the supporting evidence.")
    section: str = Field(description="Section containing the supporting evidence.")


class CareerAnalysis(BaseModel):
    summary: str = Field(
        description="A concise evidence-grounded summary of the candidate's fit."
    )
    strengths: list[str] = Field(
        description="Strengths supported directly by the provided evidence."
    )
    gaps: list[str] = Field(
        description="Potential gaps or missing requirements based only on the evidence."
    )
    evidence: list[EvidenceItem] = Field(
        description="Important claims and the evidence supporting them."
    )
    limitations: list[str] = Field(
        description="Important information that cannot be determined from the provided evidence."
    )


SYSTEM_INSTRUCTION = """
You are CareerPilot, an evidence-grounded career analysis assistant.

Your job is to compare a candidate against a job description using ONLY the
candidate evidence provided in the prompt.

STRICT GROUNDING RULES:

1. The provided candidate evidence is the ONLY source of truth about the candidate.

2. Do NOT use outside knowledge about the candidate.

3. Do NOT invent or assume:
   - skills
   - work experience
   - years of experience
   - project experience
   - professional experience
   - education
   - achievements
   - certifications
   - responsibilities
   - proficiency levels

4. A skill listed in a resume may be described as a demonstrated skill,
   but do not automatically describe it as professional or production
   experience unless the evidence explicitly says so.

5. A project demonstrating a technology can support a statement that the
   candidate has project experience with that technology.

6. If a job requirement is not explicitly demonstrated by the provided
   evidence, classify it as:
   "Not demonstrated in the provided evidence."

7. Never claim that the candidate "fully meets", "definitely meets",
   "is qualified", or "is guaranteed to qualify" unless the provided
   evidence explicitly supports every relevant requirement.

8. Do NOT invent a numerical match score or percentage.

9. Do NOT infer years of experience.

10. Distinguish carefully between:
    - demonstrated evidence
    - partial alignment
    - requirements not demonstrated
    - information that cannot be determined

11. When identifying a gap, do NOT claim that the candidate definitely
    lacks the skill. Instead say that the requirement is not demonstrated
    in the provided evidence.

12. Every important factual claim about the candidate must be traceable
    to the supplied evidence.

13. Evidence citations must use the exact source, page, and section metadata
    supplied with the evidence.

14. If there is insufficient evidence to support a claim, explicitly state
    that there is insufficient evidence.

15. Prefer cautious, evidence-based language over optimistic assumptions.

The goal is not to make the candidate look good.
The goal is to produce an accurate, defensible comparison between the
job requirements and the available evidence.
"""


def analyze_candidate(
    job_description: str,
    retrieved_evidence: list[dict],
) -> CareerAnalysis:

    evidence_text_parts = []

    for index, item in enumerate(retrieved_evidence, start=1):
        evidence_text_parts.append(
            f"""
EVIDENCE {index}
Source: {item["source"]}
Page: {item["page"]}
Section: {item["section"]}

{item["text"]}
""".strip()
        )

    evidence_text = "\n\n".join(evidence_text_parts)

    prompt = f"""
Analyze the candidate for the following job description.

JOB DESCRIPTION
---------------
{job_description}

CANDIDATE EVIDENCE
------------------
{evidence_text}

Produce a grounded career analysis.

Important:
- Use only the candidate evidence above.
- Do not fill missing information using your general knowledge.
- If a requirement is not demonstrated, put it in gaps or limitations.
- Do not calculate or invent a numerical match score.
"""

    max_attempts = 3
    response = None

    for attempt in range(1, max_attempts + 1):
        try:
            print(
                f"Generation attempt {attempt}/{max_attempts} "
                f"using {GENERATION_MODEL}"
            )

            response = client.models.generate_content(
                model=GENERATION_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=CareerAnalysis,
                    temperature=0.1,
                ),
            )

            if response.text:
                break

        except errors.ServerError as error:
            print(f"Gemini returned a temporary server error: {error}")

            if attempt == max_attempts:
                raise RuntimeError(
                    "Gemini generation remained unavailable after "
                    f"{max_attempts} attempts."
                ) from error

            wait_seconds = 2 ** (attempt - 1)
            print(f"Retrying in {wait_seconds} seconds...")
            time.sleep(wait_seconds)

    if response is None or not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    return CareerAnalysis.model_validate_json(response.text)