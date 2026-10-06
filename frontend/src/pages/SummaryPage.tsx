import NoResultNotice from "../components/NoResultNotice";
import PageShell from "../components/PageShell";
import { useAnalysis } from "../analysis/useAnalysis";

/**
 * The full analysis.summary. Given one large reading panel rather than
 * several small ones, because this is the only page whose content is
 * uninterrupted prose.
 */
export default function SummaryPage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const { summary } = result.analysis;

  return (
    <PageShell
      path="/analysis/summary"
      eyebrow="Analysis"
      title="Summary"
      description="Overall assessment based on the available resume evidence."
    >
      <section className="panel">
        <p className="prose">{summary}</p>
      </section>
    </PageShell>
  );
}