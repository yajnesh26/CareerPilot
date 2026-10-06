import NoResultNotice from "../components/NoResultNotice";
import PageShell from "../components/PageShell";
import { useAnalysis } from "../analysis/useAnalysis";

/**
 * Raw ChromaDB chunks on their own page, in the dark debug styling.
 *
 * Shown expanded rather than collapsed because it is now a page in its own
 * right; the collapsible treatment from the single-page layout would hide the
 * thing the viewer navigated here to see.
 */
export default function RetrievalPage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const chunks = result.retrieved_evidence;

  return (
    <PageShell
      path="/analysis/retrieval"
      eyebrow="Analysis"
      title="Retrieval"
      description="Resume chunks retrieved for this analysis."
      meta={`${chunks.length} ${chunks.length === 1 ? "chunk" : "chunks"}`}
    >
      <p className="page__note">
        These are the exact text fragments retrieved from the vector store and
        provided to the generation model.
      </p>

      {chunks.length === 0 ? (
        <p className="page__empty">
          No chunks were retrieved. The resume may not be indexed yet.
        </p>
      ) : (
        <ol className="chunkList">
          {chunks.map((item, index) => (
            <li key={`${item.source}-${item.page}-${index}`} className="chunk">
              <div className="chunk__meta">
                <span className="chunk__index">{index + 1}</span>
                <span className="chunk__source">{item.source}</span>
                <span className="chunk__ref">
                  Page {item.page} &middot; {item.section}
                </span>
              </div>
              <pre className="chunk__text">{item.text}</pre>
            </li>
          ))}
        </ol>
      )}
    </PageShell>
  );
}
