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

  const evidenceCount = result.analysis.evidence.length;
  const retrievedCount = result.retrieved_evidence.length;

  return (
    <div className="page page--wide">
      <div className="page__head">
        <p className="page__eyebrow">Analysis</p>
        <h1 className="page__title">Overview</h1>
        <p className="page__lede">
          Here&apos;s what we found from your resume and the job description.
        </p>
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

      <footer className="runMeta">
        <dl className="runMeta__items">
          <div className="runMeta__item">
            <dt className="runMeta__label">Evidence</dt>
            <dd className="runMeta__value">
              {evidenceCount} {evidenceCount === 1 ? "claim" : "claims"}
            </dd>
          </div>
          <div className="runMeta__item">
            <dt className="runMeta__label">Retrieved</dt>
            <dd className="runMeta__value">
              {retrievedCount} {retrievedCount === 1 ? "chunk" : "chunks"}
            </dd>
          </div>
          </dl>

        <p className="runMeta__note">
          Match score is not shown because it is not calculated by the system.
        </p>
      </footer>
    </div>
  );
}