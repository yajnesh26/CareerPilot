import { Link } from "react-router-dom";
import {
  ANALYZE_PATH,
  ANALYSIS_OVERVIEW_PATH,
} from "../routes/analysisSections";

/**
 * Shown when an /analysis/* route is opened without a result, either by
 * typing a URL or by reloading mid-session. Makes the dead end recoverable
 * with one click.
 */
export default function NoResultNotice() {
  return (
    <section className="noResult">
      <h2 className="noResult__heading">No analysis to show</h2>

      <p className="noResult__body">
        These pages read the results of the most recent analysis, and there is
        none in this session.
      </p>

      <div className="noResult__actions">
        <Link to={ANALYZE_PATH} className="button">
          Start an analysis
        </Link>
        <Link to={ANALYSIS_OVERVIEW_PATH} className="button button--subtle">
          Overview
        </Link>
      </div>
    </section>
  );
}
