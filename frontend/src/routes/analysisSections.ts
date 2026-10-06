import type { AnalyzeResponse } from "../types";

/**
 * Metadata for every analysis sub-page, in the order they appear in the
 * sidebar, on the overview, and in the prev/next pager.
 *
 * This is the single source of navigation truth: the sidebar, the overview
 * grid, and the pager all read from it, so they cannot drift apart. Paths
 * match the route table in App.tsx.
 */
export interface AnalysisSection {
  /** Route path, absolute. Matches the route defined in App.tsx. */
  path: string;
  /** Key for React lists and for locating the previous/next sibling. */
  id: string;
  title: string;
  /** One-line description shown on the overview card. */
  blurb: string;
  /**
   * Number of items in this section. Returns null when the section is a
   * single narrative rather than a list, i.e. the summary.
   */
  count: (result: AnalyzeResponse) => number | null;
  /** Plural noun for the count, e.g. "strengths", "chunks". */
  unit: string;
  /** Icon key, resolved to an SVG in OverviewCard. */
  icon: string;
  /** Accent variant. Drives the icon and hover colour, not the card fill. */
  tone: "neutral" | "teal" | "amber" | "sky";
}

export const ANALYSIS_SECTIONS: AnalysisSection[] = [
  {
    path: "/analysis/summary",
    id: "summary",
    title: "Summary",
    blurb: "Overall assessment based on the available resume evidence.",
    count: () => null,
    unit: "sections",
    icon: "summary",
    tone: "neutral",
  },
  {
    path: "/analysis/strengths",
    id: "strengths",
    title: "Strengths",
    blurb: "Skills and experience relevant to this role.",
    count: (result) => result.analysis.strengths.length,
    unit: "strengths",
    icon: "strengths",
    tone: "teal",
  },
  {
    path: "/analysis/gaps",
    id: "gaps",
    title: "Gaps",
    blurb: "Requirements not clearly demonstrated in the resume.",
    count: (result) => result.analysis.gaps.length,
    unit: "gaps",
    icon: "gaps",
    tone: "amber",
  },
  {
    path: "/analysis/limitations",
    id: "limitations",
    title: "Limitations",
    blurb: "Things the available evidence cannot determine.",
    count: (result) => result.analysis.limitations.length,
    unit: "limitations",
    icon: "limitations",
    tone: "sky",
  },
  {
    path: "/analysis/evidence",
    id: "evidence",
    title: "Evidence",
    blurb: "Resume sections supporting the analysis.",
    count: (result) => result.analysis.evidence.length,
    unit: "supporting claims",
    icon: "evidence",
    tone: "teal",
  },
  {
    path: "/analysis/retrieval",
    id: "retrieval",
    title: "Retrieval",
    blurb: "Resume chunks retrieved for this analysis.",
    count: (result) => result.retrieved_evidence.length,
    unit: "chunks retrieved",
    icon: "retrieval",
    tone: "teal",
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
