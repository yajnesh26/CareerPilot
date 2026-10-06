import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import { useAnalysis } from "../analysis/useAnalysis";
import {
  ANALYSIS_OVERVIEW_PATH,
  ANALYSIS_SECTIONS,
} from "../routes/analysisSections";

/**
 * Compact navigation rail for the analysis section.
 *
 * Purely presentational: it links to the same paths the route table already
 * defines and reads counts from the shared context. No routing logic of its
 * own, and nothing here decides what a result contains.
 */
export default function SideNav() {
  const { result } = useAnalysis();

  return (
    <nav className="sideNav" aria-label="Analysis sections">
      <p className="sideNav__heading">Sections</p>

      <NavLink
        to={ANALYSIS_OVERVIEW_PATH}
        end
        className={({ isActive }) =>
          `sideNav__link${isActive ? " sideNav__link--active" : ""}`
        }
      >
        <Icon name="home" size={14} />
        Overview
      </NavLink>

      {ANALYSIS_SECTIONS.map((section) => {
        const count = result ? section.count(result) : null;

        return (
          <NavLink
            key={section.id}
            to={section.path}
            className={({ isActive }) =>
              `sideNav__link${isActive ? " sideNav__link--active" : ""}`
            }
          >
            <span className="sideNav__dot" />
            {section.title}
            {count !== null && (
              <span className="sideNav__count">{count}</span>
            )}
          </NavLink>
        );
      })}

      <p className="sideNav__footer">
        Results live in this session only. Reloading the page clears them.
      </p>
    </nav>
  );
}