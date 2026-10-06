import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnalysisProvider } from "./analysis/AnalysisProvider";
import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";
import AnalyzePage from "./pages/AnalyzePage";
import AnalysisOverviewPage from "./pages/AnalysisOverviewPage";
import SummaryPage from "./pages/SummaryPage";
import StrengthsPage from "./pages/StrengthsPage";
import GapsPage from "./pages/GapsPage";
import LimitationsPage from "./pages/LimitationsPage";
import EvidencePage from "./pages/EvidencePage";
import RetrievalPage from "./pages/RetrievalPage";

/**
 * Route table and the persistent shell.
 *
 * The provider sits above <Routes> so every page reads the same analysis
 * result; navigating between /analysis/* re-renders from context instead of
 * issuing another POST /analyze.
 */
function Shell() {
  const { pathname } = useLocation();

  // The rail belongs to the analysis section. On the analyze page it would
  // point at six empty pages, so it is only rendered under /analysis.
  const showSideNav = pathname.startsWith("/analysis");

  return (
    <div className="app">
      <TopBar />

      <div className="shell">
        {showSideNav && <SideNav />}

        <main className="main">
          <Routes>
            <Route path="/" element={<AnalyzePage />} />
            <Route path="/analysis" element={<AnalysisOverviewPage />} />
            <Route path="/analysis/summary" element={<SummaryPage />} />
            <Route path="/analysis/strengths" element={<StrengthsPage />} />
            <Route path="/analysis/gaps" element={<GapsPage />} />
            <Route path="/analysis/limitations" element={<LimitationsPage />} />
            <Route path="/analysis/evidence" element={<EvidencePage />} />
            <Route path="/analysis/retrieval" element={<RetrievalPage />} />
            {/* Anything unrecognised falls back to the analyze page. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <footer className="footer">
        <div className="footer__inner">
          <p>
            Analysis is based only on the resume evidence that was retrieved.
            No match score is calculated.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AnalysisProvider>
      <Shell />
    </AnalysisProvider>
  );
}