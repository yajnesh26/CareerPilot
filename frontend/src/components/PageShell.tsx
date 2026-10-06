import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { adjacentSections } from "../routes/analysisSections";

interface PageShellProps {
  /** Route path of this page, used to work out previous/next links. */
  path: string;
  /** Small uppercase label above the title, e.g. "ANALYSIS". */
  eyebrow: string;
  title: string;
  description: string;
  /** Optional trailing metadata, e.g. "8 gaps". */
  meta?: ReactNode;
  children: ReactNode;
}

/**
 * Shared frame for every analysis sub-page: back link, title block, content,
 * and prev/next pager. Centralising it keeps the six pages visually identical
 * apart from their content.
 */
export default function PageShell({
  path,
  eyebrow,
  title,
  description,
  meta,
  children,
}: PageShellProps) {
  const { previous, next } = adjacentSections(path);

  return (
    <div className="page">
      <Link to="/analysis" className="backlink">
        Analysis
      </Link>

      <div className="page__head">
        <p className="page__eyebrow">{eyebrow}</p>
        <h1 className="page__title">{title}</h1>
        <p className="page__lede">{description}</p>
        {meta && <p className="page__meta">{meta}</p>}
      </div>

      <div className="page__body">{children}</div>

      <nav className="pager" aria-label="Analysis sections">
        {previous ? (
          <Link to={previous.path} className="pager__link">
            <span className="pager__direction">Previous</span>
            <span className="pager__target">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link to={next.path} className="pager__link pager__link--next">
            <span className="pager__direction">Next</span>
            <span className="pager__target">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}