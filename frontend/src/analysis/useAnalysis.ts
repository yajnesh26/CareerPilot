import { useContext } from "react";
import { AnalysisContext, type AnalysisState } from "./analysisContext";

/**
 * Access the shared analysis state.
 *
 * @throws When called outside <AnalysisProvider>, which would mean the
 * provider is missing from the route tree.
 */
export function useAnalysis(): AnalysisState {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error(
      "useAnalysis must be used inside an <AnalysisProvider>. Check that " +
        "App wraps the router in the provider.",
    );
  }

  return context;
}
