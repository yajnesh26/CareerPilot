import NoResultNotice from "../components/NoResultNotice";
import PageShell from "../components/PageShell";
import { useAnalysis } from "../analysis/useAnalysis";

/** The full analysis.summary, presented as the headline verdict. */
export default function SummaryPage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const { summary } = result.analysis;

  return (
    <PageShell
      path="/analysis/summary"
      eyebrow="Summary"
      title="Analysis Summary"
      lede="The model's overall read on this role, written using only the evidence retrieved from your resume."
    >
      <section className="summary summary--page">
        <p className="summary__text">{summary}</p>
      </section>

      <p className="page__footnote">
        This summary is the model's judgement of the retrieved evidence. Open{" "}
        <strong>Supporting Evidence</strong> to check each claim against your
        own resume.
      </p>
    </PageShell>
  );
}
