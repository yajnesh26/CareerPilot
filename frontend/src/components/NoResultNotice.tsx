import { Link } from "react-router-dom";
import { ANALYZE_PATH, ANALYSIS_OVERVIEW_PATH } from "../routes/analysisSections";

/**
 * Shown when an /analysis/* route is opened without a result, either by
 * typing a URL or by reloading mid-session. Makes the dead end recoverable
 * with one click.
 */
export default function NoResultNotice() {
  return (
    <section className="noResult">
      <div className="noResult__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 7.5v5.2M12 16.3v.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="noResult__heading">No analysis to show yet</h2>

      <p className="noResult__body">
        This page reads the results of the most recent analysis, and there is
        none in this session. Paste a job description to generate one.
      </p>

      <div className="noResult__actions">
        <Link to={ANALYZE_PATH} className="button">
          Go to Analyze
        </Link>
        <Link to={ANALYSIS_OVERVIEW_PATH} className="button button--subtle">
          Try the overview
        </Link>
      </div>
    </section>
  );
}
