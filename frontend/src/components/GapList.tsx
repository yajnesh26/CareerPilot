interface GapListProps {
  gaps: string[];
}

/**
 * Renders analysis.gaps verbatim. The backend deliberately phrases gaps as
 * "not demonstrated in the provided evidence" rather than asserting the
 * candidate lacks a skill, so no wording is softened or strengthened here.
 *
 * The amber marker is a warning icon, not a negative verdict badge.
 */
export default function GapList({ gaps }: GapListProps) {
  return (
    <ul className="items">
      {gaps.map((gap) => (
        <li key={gap} className="items__item">
          <span className="items__marker items__marker--warn" aria-hidden="true">
            !
          </span>
          {gap}
        </li>
      ))}
    </ul>
  );
}