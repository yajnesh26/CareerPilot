/**
 * Wire format for POST /analyze.
 *
 * These types mirror the FastAPI Pydantic models in
 * backend/app/services/analysis.py and backend/app/main.py.
 * Do not add fields the backend does not send.
 */

/** Request body for POST /analyze. */
export interface AnalyzeRequest {
  job_description: string;
}

/**
 * A single claim paired with the resume evidence supporting it.
 * Mirrors the backend `EvidenceItem` model.
 */
export interface EvidenceItem {
  claim: string;
  source: string;
  page: number;
  section: string;
}

/** The grounded analysis produced by the backend. */
export interface Analysis {
  summary: string;
  strengths: string[];
  gaps: string[];
  evidence: EvidenceItem[];
  limitations: string[];
}

/**
 * A raw chunk pulled from ChromaDB. Shown in the retrieval debug panel
 * so the RAG pipeline is inspectable during a demo.
 */
export interface RetrievedEvidence {
  text: string;
  source: string;
  page: number;
  section: string;
}

/** Successful response body from POST /analyze. */
export interface AnalyzeResponse {
  analysis: Analysis;
  retrieved_evidence: RetrievedEvidence[];
}

/**
 * The backend enforces min_length=20 on job_description, so the client
 * mirrors that rule to avoid a pointless round trip.
 */
export const MIN_JOB_DESCRIPTION_LENGTH = 20;
