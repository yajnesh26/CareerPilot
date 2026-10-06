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
      eyebrow="Gaps"
      title="Gaps"
      lede="Requirements that were not demonstrated in the retrieved evidence. This is a statement about the evidence available, not a verdict on the candidate."
      aside={
        <span className="badge badge--caution">
          {gaps.length} {gaps.length === 1 ? "item" : "items"}
        </span>
      }
    >
      <div className="notice">
        <p>
          A requirement listed here means the model could not find support for
          it in the retrieved resume evidence. It does not mean the candidate
          is incapable of it.
        </p>
      </div>

      {gaps.length === 0 ? (
        <p className="page__empty">
          The model did not identify any gaps for this role.
        </p>
      ) : (
        <GapList gaps={gaps} />
      )}
    </PageShell>
  );
}
