interface StrengthListProps {
  strengths: string[];
}

/**
 * Renders analysis.strengths verbatim. The backend prompt is careful to
 * keep claims evidence-bound, so the text is displayed as-is rather than
 * reworded or re-scored.
 */
export default function StrengthList({ strengths }: StrengthListProps) {
  return (
    <ul className="bullets">
      {strengths.map((strength) => (
        <li key={strength} className="bullets__item bullets__item--positive">
          <span className="bullets__marker" aria-hidden="true">
            +
          </span>
          <span>{strength}</span>
        </li>
      ))}
    </ul>
  );
}
