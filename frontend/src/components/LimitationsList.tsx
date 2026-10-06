interface LimitationsListProps {
  limitations: string[];
}

/**
 * Limitations are given their own treatment because they are a core part of
 * the grounding design: the system states what it could not determine rather
 * than guessing. This panel is styled to read as a disclosure, not a warning.
 */
export default function LimitationsList({ limitations }: LimitationsListProps) {
  return (
    <div className="limitations">
      <p className="limitations__note">
        What could <strong>not</strong> be determined from the retrieved
        evidence. Absence of evidence is not evidence of absence.
      </p>

      <ul className="limitations__list">
        {limitations.map((limitation) => (
          <li key={limitation} className="limitations__item">
            {limitation}
          </li>
        ))}
      </ul>
    </div>
  );
}
