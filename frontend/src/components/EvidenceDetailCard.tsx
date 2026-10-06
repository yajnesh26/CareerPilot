import type { EvidenceItem } from "../types";

interface EvidenceDetailCardProps {
  item: EvidenceItem;
}

/**
 * One claim and the resume location it came from. The citation sits below a
 * hairline rule in monospace, so the source, page, and section stay legible
 * and are never confused with the claim text itself.
 */
export default function EvidenceDetailCard({ item }: EvidenceDetailCardProps) {
  return (
    <li className="evidenceItem">
      <p className="evidenceItem__claim">{item.claim}</p>

      <div className="evidenceItem__rule" />

      <div className="evidenceItem__meta">
        <span className="evidenceItem__source">{item.source}</span>
        <span className="evidenceItem__ref">Page {item.page}</span>
        <span className="evidenceItem__ref">{item.section}</span>
      </div>
    </li>
  );
}