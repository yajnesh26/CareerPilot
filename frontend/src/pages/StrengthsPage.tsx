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
      eyebrow="Strengths"
      title="Strengths"
      lede="Capabilities the retrieved resume evidence supports directly. Each one traces back to a specific location in the indexed resume."
      aside={
        <span className="badge badge--positive">
          {strengths.length} {strengths.length === 1 ? "item" : "items"}
        </span>
      }
    >
      {strengths.length === 0 ? (
        <p className="page__empty">
          The model did not identify any strengths for this role from the
          retrieved evidence.
        </p>
      ) : (
        <StrengthList strengths={strengths} />
      )}
    </PageShell>
  );
}
