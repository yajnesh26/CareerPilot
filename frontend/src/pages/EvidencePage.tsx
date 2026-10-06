import EvidenceDetailCard from "../components/EvidenceDetailCard";
import NoResultNotice from "../components/NoResultNotice";
import PageShell from "../components/PageShell";
import { useAnalysis } from "../analysis/useAnalysis";

/**
 * The evidence claims on their own page. This is the product's central
 * differentiator, so the cards are laid out to make the claim-to-source
 * pairing explicit rather than compressing it into citation chips.
 */
export default function EvidencePage() {
  const { result } = useAnalysis();

  if (!result) {
    return <NoResultNotice />;
  }

  const evidence = result.analysis.evidence;

  return (
    <PageShell
      path="/analysis/evidence"
      eyebrow="Analysis"
      title="Evidence"
      description="Resume sections supporting the analysis."
      meta={`${evidence.length} ${evidence.length === 1 ? "claim" : "claims"}`}
    >
      <p className="page__note">
        Each claim is listed with the resume location it came from, so you can
        check it against your own document.
      </p>

      {evidence.length === 0 ? (
        <p className="page__empty">No supporting claims were returned.</p>
      ) : (
        <ul className="evidenceList">
          {evidence.map((item, index) => (
            <EvidenceDetailCard
              key={`${item.source}-${item.page}-${item.section}-${index}`}
              item={item}
            />
          ))}
        </ul>
      )}
    </PageShell>
  );
}
