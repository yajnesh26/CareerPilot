import { Link } from "react-router-dom";
import type { AnalysisSection } from "../routes/analysisSections";
import Icon from "./Icon";

interface OverviewCardProps {
  section: AnalysisSection;
  count: number | null;
}

/**
 * One clickable section of the analysis.
 *
 * Horizontal row rather than a stat tile: icon, title and description, then
 * the count and a chevron. The accent variant tints only the icon, the count,
 * and the hover border, so the six cards read as one set instead of six
 * colours.
 */
export default function OverviewCard({ section, count }: OverviewCardProps) {
  return (
    <Link
      to={section.path}
      className={`overviewCard overviewCard--${section.tone}`}
    >
      <span className="overviewCard__icon">
        <Icon name={section.icon} size={17} />
      </span>

      <span className="overviewCard__text">
        <span className="overviewCard__title">{section.title}</span>
        <span className="overviewCard__blurb">{section.blurb}</span>
      </span>

      <span className="overviewCard__count">
        {count === null ? "1 section" : `${count} ${section.unit}`}
      </span>

      <Icon name="chevron" size={14} className="overviewCard__chevron" />
    </Link>
  );
}