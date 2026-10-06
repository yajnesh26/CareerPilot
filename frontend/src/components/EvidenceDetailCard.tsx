import type { EvidenceItem } from "../types";

interface EvidenceDetailCardProps {
  item: EvidenceItem;
}

/**
 * Full-width evidence card for the dedicated page.
 *
 * The layout is deliberate: the claim sits in a bordered block on top, the
 * citation in a contrasting band below it, joined by a connector. That
 * vertical pairing is what makes "this claim came from here" readable at a
 * glance.
 */
export default function EvidenceDetailCard({ item }: EvidenceDetailCardProps) {
  return (
    <li className="evidenceDetail">
      <div className="evidenceDetail__claimBlock">
        <span className="evidenceDetail__label">Claim</span>
        <p className="evidenceDetail__claim">{item.claim}</p>
      </div>

      <div className="evidenceDetail__connector" aria-hidden="true">
        <span className="evidenceDetail__connectorLine" />
        <span className="evidenceDetail__connectorText">supported by</span>
      </div>

      <div className="evidenceDetail__sourceBlock">
        <span className="evidenceDetail__label evidenceDetail__label--source">
          Source
        </span>

        <dl className="evidenceDetail__meta">
          <div className="evidenceDetail__metaRow">
            <dt>Document</dt>
            <dd className="evidenceDetail__doc">{item.source}</dd>
          </div>
          <div className="evidenceDetail__metaRow">
            <dt>Page</dt>
            <dd>{item.page}</dd>
          </div>
          <div className="evidenceDetail__metaRow">
            <dt>Section</dt>
            <dd>{item.section}</dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
