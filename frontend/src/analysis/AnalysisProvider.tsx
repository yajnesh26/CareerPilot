import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeJobDescription, ApiError } from "../api";
import { MIN_JOB_DESCRIPTION_LENGTH, type AnalyzeResponse } from "../types";
import { AnalysisContext, type AnalysisState } from "./analysisContext";
import { ANALYSIS_OVERVIEW_PATH } from "../routes/analysisSections";

/** Shown when retry is requested but the textarea has been emptied. */
const EMPTY_JOB_DESCRIPTION_MESSAGE =
  "Paste a job description to start an analysis.";

/**
 * Owns the analysis state for the whole app.
 *
 * The result is held here rather than per-page, so moving between
 * /analysis/* routes reads the same object instead of refetching. It is
 * intentionally not persisted: a page reload starts a fresh analysis.
 */
export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [jobDescription, setJobDescriptionRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const navigate = useNavigate();

  // Lets an in-flight request be cancelled if the app unmounts.
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const runAnalysis = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeJobDescription(
        jobDescription.trim(),
        controller.signal,
      );

      setResult(response);
      // Only navigate once the request resolves, so the analyze page keeps
      // its loading and error states instead of flashing an empty page.
      navigate(ANALYSIS_OVERVIEW_PATH);
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught);
      } else {
        // api.ts classifies every failure; this guards a programming slip
        // rather than a real network condition.
        setError(
          new ApiError({
            kind: "server",
            message: "Something went wrong while running the analysis.",
          }),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [jobDescription, navigate]);

  const submit = useCallback(() => {
    if (jobDescription.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
      return;
    }
    void runAnalysis();
  }, [jobDescription, runAnalysis]);

  const retry = useCallback(() => {
    if (!jobDescription.trim()) {
      setError(
        new ApiError({
          kind: "validation",
          message: EMPTY_JOB_DESCRIPTION_MESSAGE,
        }),
      );
      return;
    }
    void runAnalysis();
  }, [jobDescription, runAnalysis]);

  const setJobDescription = useCallback((value: string) => {
    setJobDescriptionRaw(value);
    // Clear a stale failure as soon as the user edits. The previous result
    // stays visible until a new analysis succeeds.
    setError(null);
  }, []);

  const value: AnalysisState = {
    jobDescription,
    loading,
    result,
    error,
    setJobDescription,
    submit,
    retry,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}
