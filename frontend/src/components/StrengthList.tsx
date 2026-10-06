interface StrengthListProps {
  strengths: string[];
}

/**
 * Renders analysis.strengths verbatim. The backend prompt keeps claims
 * evidence-bound, so the text is shown as-is rather than reworded.
 *
 * The teal check is a status marker only: it says the backend returned this
 * as a positive signal, not that the claim is verified.
 */
export default function StrengthList({ strengths }: StrengthListProps) {
  return (
    <ul className="items">
      {strengths.map((strength) => (
        <li key={strength} className="items__item">
          <span className="items__marker items__marker--ok" aria-hidden="true">
            ✓
          </span>
          {strength}
        </li>
      ))}
    </ul>
  );
}