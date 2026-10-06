interface LimitationsListProps {
  limitations: string[];
}

/**
 * Renders analysis.limitations as a plain list. The sky marker marks these as
 * undetermined rather than as findings in either direction.
 */
export default function LimitationsList({ limitations }: LimitationsListProps) {
  return (
    <ul className="items">
      {limitations.map((limitation) => (
        <li key={limitation} className="items__item">
          <span className="items__marker items__marker--info" aria-hidden="true">
            i
          </span>
          {limitation}
        </li>
      ))}
    </ul>
  );
}