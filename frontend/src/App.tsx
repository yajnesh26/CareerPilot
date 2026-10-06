import { Navigate, Route, Routes } from "react-router-dom";
import { AnalysisProvider } from "./analysis/AnalysisProvider";
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
export default function App() {
  return (
    <AnalysisProvider>
      <div className="app">
        <TopBar />

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

        <footer className="footer">
          <p>
            Grounded in retrieved resume evidence. No match score is produced,
            because the model is not permitted to invent one.
          </p>
        </footer>
      </div>
    </AnalysisProvider>
  );
}
