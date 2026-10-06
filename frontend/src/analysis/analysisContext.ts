import { createContext } from "react";
import type { ApiError } from "../api";
import type { AnalyzeResponse } from "../types";

/**
 * High-level analysis state, lifted out of App so that every routed page can
 * read the current result without another POST /analyze call.
 *
 * The result lives for the lifetime of the tab. Navigating between analysis
 * pages re-reads this context and never refetches.
 */
export interface AnalysisState {
  jobDescription: string;
  loading: boolean;
  result: AnalyzeResponse | null;
  error: ApiError | null;
  setJobDescription: (value: string) => void;
  submit: () => void;
  retry: () => void;
}

export const AnalysisContext = createContext<AnalysisState | null>(null);
