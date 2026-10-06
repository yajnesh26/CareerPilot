import NoResultNotice from "../components/NoResultNotice";
import PageShell from "../components/PageShell";
import StrengthList from "../components/StrengthList";
import { useAnalysis } from "../analysis/useAnalysis";

/**
 * Strengths are rendered verbatim from analysis.strengths. The backend
 * prompt is careful to keep claims evidence-bound, so no wording is
 * reworded, ranked, or upgraded here.
 */
export default function StrengthsPage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const strengths = result.analysis.strengths;

  return (
    <PageShell
      path="/analysis/strengths"
      eyebrow="Analysis"
      title="Strengths"
      description="Skills and experience relevant to this role."
      meta={`${strengths.length} ${strengths.length === 1 ? "strength" : "strengths"}`}
    >
      <section className="panel panel--teal">
        {strengths.length === 0 ? (
          <p className="page__empty">No strengths were found for this role.</p>
        ) : (
          <StrengthList strengths={strengths} />
        )}
      </section>
    </PageShell>
  );
}