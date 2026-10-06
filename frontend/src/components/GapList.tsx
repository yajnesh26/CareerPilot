interface GapListProps {
  gaps: string[];
}

/**
 * Renders analysis.gaps verbatim. The backend deliberately phrases gaps as
 * "not demonstrated in the provided evidence" rather than asserting the
 * candidate lacks a skill, so no wording is softened or strengthened here.
 */
export default function GapList({ gaps }: GapListProps) {
  return (
    <ul className="bullets">
      {gaps.map((gap) => (
        <li key={gap} className="bullets__item bullets__item--caution">
          <span className="bullets__marker" aria-hidden="true">
            !
          </span>
          <span>{gap}</span>
        </li>
      ))}
    </ul>
  );
}
