import NoResultNotice from "../components/NoResultNotice";
import PageShell from "../components/PageShell";
import GapList from "../components/GapList";
import { useAnalysis } from "../analysis/useAnalysis";

/**
 * Gaps are shown exactly as the backend phrased them. The system prompt
 * requires gaps to read as "not demonstrated in the provided evidence" rather
 * than an assertion that the candidate lacks the skill, so nothing here
 * strengthens that language.
 */
export default function GapsPage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const gaps = result.analysis.gaps;

  return (
    <PageShell
      path="/analysis/gaps"
      eyebrow="Analysis"
      title="Gaps"
      description="Requirements not clearly demonstrated in the resume."
      meta={`${gaps.length} ${gaps.length === 1 ? "gap" : "gaps"}`}
    >
      <p className="page__note">
        A requirement listed here was not found in the retrieved resume
        evidence. It does not mean the candidate is incapable of it.
      </p>

      <section className="panel panel--amber">
        {gaps.length === 0 ? (
          <p className="page__empty">No gaps were found for this role.</p>
        ) : (
          <GapList gaps={gaps} />
        )}
      </section>
    </PageShell>
  );
}