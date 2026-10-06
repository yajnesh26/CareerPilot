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
      eyebrow="Limitations"
      title="Limitations"
      lede="What the available evidence could not settle, in either direction. Reporting these is a feature of the system, not an apology for it."
      aside={
        <span className="badge">
          {limitations.length} {limitations.length === 1 ? "item" : "items"}
        </span>
      }
    >
      <div className="notice notice--accent">
        <p>
          <strong>Absence of evidence is not evidence of absence.</strong> These
          items were undetermined from the chunks that were retrieved, not
          concluded to be false.
        </p>
      </div>

      {limitations.length === 0 ? (
        <p className="page__empty">
          The model did not report any limitations for this role.
        </p>
      ) : (
        <LimitationsList limitations={limitations} />
      )}
    </PageShell>
  );
}
