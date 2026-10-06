import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { adjacentSections } from "../routes/analysisSections";

interface PageShellProps {
  /** Route path of this page, used to work out previous/next links. */
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  /** Optional trailing element, e.g. a count badge. */
  aside?: ReactNode;
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
  lede,
  aside,
  children,
}: PageShellProps) {
  const { previous, next } = adjacentSections(path);

  return (
    <div className="page">
      <Link to="/analysis" className="backlink">
        <span aria-hidden="true">&larr;</span> Back to Analysis
      </Link>

      <div className="page__head">
        <div className="page__headText">
          <p className="page__eyebrow">{eyebrow}</p>
          <h1 className="page__title">{title}</h1>
          <p className="page__lede">{lede}</p>
        </div>
        {aside && <div className="page__aside">{aside}</div>}
      </div>

      <div className="page__body">{children}</div>

      <nav className="pager" aria-label="Analysis sections">
        {previous ? (
          <Link to={previous.path} className="pager__link pager__link--prev">
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
