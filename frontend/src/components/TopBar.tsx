import { NavLink } from "react-router-dom";
import Icon from "./Icon";

/**
 * Persistent top bar: wordmark on the left, the primary action on the right.
 *
 * The wordmark links to the analyze page, which doubles as the "start over"
 * escape hatch during a demo.
 */
export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <NavLink to="/" className="brand" aria-label="CareerPilot, new analysis">
          <span className="brand__title">
            Career<span className="brand__mark">Pilot</span>
          </span>
          <span className="brand__subtitle">Resume &amp; Job Analysis</span>
        </NavLink>

        <nav className="topbar__nav" aria-label="Main">
          <NavLink to="/" end className="button button--outline">
            <Icon name="plus" size={14} />
            New Analysis
          </NavLink>
        </nav>
      </div>
    </header>
  );
}