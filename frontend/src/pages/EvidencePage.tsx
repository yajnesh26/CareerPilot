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
      eyebrow="Evidence"
      title="Supporting Evidence"
      lede="Every claim in this analysis, paired with the exact resume coordinates that support it. Check each citation against your own document."
      aside={
        <span className="badge badge--accent">
          {evidence.length} {evidence.length === 1 ? "claim" : "claims"}
        </span>
      }
    >
      <div className="notice notice--accent">
        <p>
          CareerPilot does not generate an opinion and then search for support.
          It retrieves the evidence first, then reasons only from what it
          found.
        </p>
      </div>

      {evidence.length === 0 ? (
        <p className="page__empty">
          The model returned no supporting citations for this role.
        </p>
      ) : (
        <ul className="evidenceDetailList">
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
