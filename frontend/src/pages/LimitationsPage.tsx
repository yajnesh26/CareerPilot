import NoResultNotice from "../components/NoResultNotice";
import PageShell from "../components/PageShell";
import LimitationsList from "../components/LimitationsList";
import { useAnalysis } from "../analysis/useAnalysis";

/**
 * Limitations get their own page rather than a footnote because stating what
 * could not be determined is a deliberate part of the grounding design.
 */
export default function LimitationsPage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const limitations = result.analysis.limitations;

  return (
    <PageShell
      path="/analysis/limitations"
      eyebrow="Analysis"
      title="Limitations"
      description="Things the available evidence cannot determine."
      meta={`${limitations.length} ${limitations.length === 1 ? "item" : "items"}`}
    >
      <p className="page__note">
        Absence of evidence is not evidence of absence. These items were
        undetermined from the retrieved chunks, not concluded to be false.
      </p>

      <section className="panel">
        {limitations.length === 0 ? (
          <p className="page__empty">
            No limitations were reported for this role.
          </p>
        ) : (
          <LimitationsList limitations={limitations} />
        )}
      </section>
    </PageShell>
  );
}