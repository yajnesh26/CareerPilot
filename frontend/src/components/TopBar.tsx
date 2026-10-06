import { NavLink } from "react-router-dom";

/** The shield-check glyph also used in the masthead. */
function LogoMark() {
  return (
    <span className="brand__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M12 3 4 7v6c0 4.4 3.4 7.4 8 8 4.6-.6 8-3.6 8-8V7l-8-4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="m8.6 12 2.3 2.4 4.5-4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Persistent top bar. The wordmark always links to the analyze page, which
 * doubles as the "start over" escape hatch during a demo.
 *
 * Deliberately not a sidebar: the overview page is the navigation hub, so a
 * persistent rail would duplicate it and crowd a laptop screen.
 */
export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <NavLink to="/" className="brand" aria-label="CareerPilot home">
          <LogoMark />
          <span className="brand__names">
            <span className="brand__title">CareerPilot</span>
            <span className="brand__tagline">AI Placement Copilot</span>
          </span>
        </NavLink>

        <nav className="topbar__nav" aria-label="Main">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `topbar__link${isActive ? " topbar__link--active" : ""}`
            }
          >
            New Analysis
          </NavLink>
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `topbar__link${isActive ? " topbar__link--active" : ""}`
            }
          >
            Analysis
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
