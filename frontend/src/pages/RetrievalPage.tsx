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
      eyebrow="Retrieval Debug"
      title="Retrieved Evidence"
      lede="The raw chunks pulled from the vector store, shown exactly as they were provided to the generation model."
      aside={
        <span className="badge badge--dark">
          {chunks.length} {chunks.length === 1 ? "chunk" : "chunks"}
        </span>
      }
    >
      <p className="page__lede page__lede--tight">
        These are the exact text fragments retrieved from the vector store and
        provided to the generation model. Only this evidence was available
        when the analysis was produced.
      </p>

      {chunks.length === 0 ? (
        <div className="retrieval retrieval--static">
          <div className="retrieval__body">
            <p className="retrieval__empty">
              No evidence was retrieved. The resume may not be indexed yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="retrieval retrieval--static">
          <div className="retrieval__body">
            <ol className="retrieval__list">
              {chunks.map((item, index) => (
                <li
                  key={`${item.source}-${item.page}-${index}`}
                  className="retrieval__item"
                >
                  <div className="retrieval__itemHeader">
                    <span className="retrieval__index">
                      EVIDENCE {index + 1}
                    </span>
                    <span className="retrieval__source">
                      {item.source} &middot; Page {item.page} &middot;{" "}
                      {item.section}
                    </span>
                  </div>
                  <pre className="retrieval__text">{item.text}</pre>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </PageShell>
  );
}
