import type { AnalyzeResponse } from "../types";

/**
 * Metadata for every analysis sub-page, in the order they should appear on
 * the overview and in the prev/next footer navigation.
 *
 * Keeping this in one place means the overview grid and the section pager
 * can never drift out of sync.
 */
export interface AnalysisSection {
  /** Route path, absolute. */
  path: string;
  /** Key for React lists and for locating the previous/next sibling. */
  id: string;
  title: string;
  /** One-line explanation shown on the overview card. */
  blurb: string;
  /**
   * Number shown on the overview card. Returns null when a count would be
   * meaningless, such as the summary, which is always a single narrative.
   */
  count: (result: AnalyzeResponse) => number | null;
  /** Plural noun for the count, e.g. "claims", "chunks". */
  unit: string;
}

export const ANALYSIS_SECTIONS: AnalysisSection[] = [
  {
    path: "/analysis/summary",
    id: "summary",
    title: "Summary",
    blurb: "The overall evidence-grounded verdict on this role.",
    count: () => null,
    unit: "items",
  },
  {
    path: "/analysis/strengths",
    id: "strengths",
    title: "Strengths",
    blurb: "Capabilities the retrieved resume evidence directly supports.",
    count: (result) => result.analysis.strengths.length,
    unit: "items",
  },
  {
    path: "/analysis/gaps",
    id: "gaps",
    title: "Gaps",
    blurb: "Requirements not demonstrated in the retrieved evidence.",
    count: (result) => result.analysis.gaps.length,
    unit: "items",
  },
  {
    path: "/analysis/limitations",
    id: "limitations",
    title: "Limitations",
    blurb: "What the available evidence could not settle either way.",
    count: (result) => result.analysis.limitations.length,
    unit: "items",
  },
  {
    path: "/analysis/evidence",
    id: "evidence",
    title: "Supporting Evidence",
    blurb: "Every claim traced to its source, page, and section.",
    count: (result) => result.analysis.evidence.length,
    unit: "claims",
  },
  {
    path: "/analysis/retrieval",
    id: "retrieval",
    title: "Retrieval Debug",
    blurb: "The raw chunks pulled from the vector store and sent to the model.",
    count: (result) => result.retrieved_evidence.length,
    unit: "chunks",
  },
];

export const ANALYSIS_OVERVIEW_PATH = "/analysis";

export const ANALYZE_PATH = "/";

/**
 * The previous and next sections around `path`, for the pager at the bottom
 * of each page. Returns null at either end of the list.
 */
export function adjacentSections(
  path: string,
): { previous: AnalysisSection | null; next: AnalysisSection | null } {
  const index = ANALYSIS_SECTIONS.findIndex((section) => section.path === path);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: ANALYSIS_SECTIONS[index - 1] ?? null,
    next: ANALYSIS_SECTIONS[index + 1] ?? null,
  };
}
