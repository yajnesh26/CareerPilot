import { Link } from "react-router-dom";
import type { AnalysisSection } from "../routes/analysisSections";

interface OverviewCardProps {
  section: AnalysisSection;
  count: number | null;
}

const ICONS: Record<string, React.ReactNode> = {
  summary: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M6 4.5h8.5L18 8v11.5H6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 4.5V8h4M8.8 12h6.4M8.8 15.5h4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  strengths: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m8.4 12.2 2.4 2.4 4.8-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  gaps: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M12 4.8 20 19.2H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.2v3.6M12 16.6v.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  limitations: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 11v5.2M12 8.1v.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  evidence: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M9.5 5.5 5 12l4.5 6.5M14.5 5.5 19 12l-4.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  retrieval: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <circle
        cx="10.8"
        cy="10.8"
        r="6.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m15.4 15.4 4.1 4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/**
 * One clickable entry point into a section of the analysis. Counts come
 * straight from the response and are omitted where meaningless, such as the
 * summary.
 */
export default function OverviewCard({ section, count }: OverviewCardProps) {
  const countLabel =
    count === null
      ? null
      : `${count} ${section.unit}${count === 1 ? "" : "s"}`;

  return (
    <Link to={section.path} className={`overviewCard overviewCard--${section.id}`}>
      <div className="overviewCard__top">
        <span className="overviewCard__icon" aria-hidden="true">
          {ICONS[section.id]}
        </span>
        {countLabel && <span className="overviewCard__count">{countLabel}</span>}
      </div>

      <h3 className="overviewCard__title">{section.title}</h3>
      <p className="overviewCard__blurb">{section.blurb}</p>

      <span className="overviewCard__cta">
        Open
        <span className="overviewCard__arrow" aria-hidden="true">
          &rarr;
        </span>
      </span>
    </Link>
  );
}
