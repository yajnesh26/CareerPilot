import OverviewCard from "../components/OverviewCard";
import NoResultNotice from "../components/NoResultNotice";
import { useAnalysis } from "../analysis/useAnalysis";
import { ANALYSIS_SECTIONS } from "../routes/analysisSections";

/**
 * Navigation hub for a completed analysis. Shows where to go next rather
 * than dumping the whole result on one page.
 */
export default function AnalysisOverviewPage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const { analysis } = result;
  const retrievedCount = result.retrieved_evidence.length;
  const evidenceCount = analysis.evidence.length;

  return (
    <div className="page">
      <div className="page__head">
        <div className="page__headText">
          <p className="page__eyebrow">Analysis</p>
          <h1 className="page__title">Overview</h1>
          <p className="page__lede">
            Six sections, each one part of the reasoning. Start with the
            summary, then follow the claims back to the resume lines that
            support them.
          </p>
        </div>
      </div>

      <div className="overviewGrid">
        {ANALYSIS_SECTIONS.map((section) => (
          <OverviewCard
            key={section.id}
            section={section}
            count={section.count(result)}
          />
        ))}
      </div>

      {/*
        Two facts about the run itself. Both are counts of what the backend
        returned, not derived scores.
      */}
      <section className="overviewStats" aria-label="Run details">
        <div className="overviewStats__item">
          <span className="overviewStats__label">Evidence citations</span>
          <span className="overviewStats__value">
            {evidenceCount} {evidenceCount === 1 ? "claim" : "claims"}
          </span>
        </div>
        <div className="overviewStats__divider" aria-hidden="true" />
        <div className="overviewStats__item">
          <span className="overviewStats__label">Chunks retrieved</span>
          <span className="overviewStats__value">
            {retrievedCount} {retrievedCount === 1 ? "chunk" : "chunks"}
          </span>
        </div>
        <div className="overviewStats__note">
          No match score is shown because the model is not permitted to invent
          one.
        </div>
      </section>
    </div>
  );
}
