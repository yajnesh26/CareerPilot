import ErrorMessage from "../components/ErrorMessage";
import JobDescriptionForm from "../components/JobDescriptionForm";
import LoadingState from "../components/LoadingState";
import { useAnalysis } from "../analysis/useAnalysis";

/**
 * Landing page. Owns no state itself; everything comes from the shared
 * analysis context, and a successful run navigates away to /analysis.
 */
export default function AnalyzePage() {
  const { jobDescription, loading, error, setJobDescription, submit, retry } =
    useAnalysis();

  return (
    <div className="page">
      <section className="hero">
        <p className="hero__eyebrow">Evidence-grounded job fit</p>
        <h1 className="hero__title">
          See what your resume actually proves about a role.
        </h1>
        <p className="hero__lede">
          Paste a job description. CareerPilot retrieves the matching evidence
          from your indexed resume and reports only what that evidence
          supports, citing the source, page, and section for every claim.
        </p>
      </section>

      <JobDescriptionForm
        jobDescription={jobDescription}
        loading={loading}
        onJobDescriptionChange={setJobDescription}
        onSubmit={submit}
      />

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorMessage
          kind={error.kind}
          message={error.message}
          fieldErrors={error.fieldErrors}
          onRetry={retry}
        />
      )}

      {!loading && !error && (
        <section className="intro">
          <h2 className="intro__heading">How this works</h2>
          <ol className="intro__steps">
            <li className="intro__step">
              <span className="intro__stepNumber">1</span>
              <div>
                <h3>Retrieve</h3>
                <p>
                  The job description is embedded and matched against the
                  sections of your resume already stored in the vector
                  database.
                </p>
              </div>
            </li>
            <li className="intro__step">
              <span className="intro__stepNumber">2</span>
              <div>
                <h3>Analyze</h3>
                <p>
                  The model reasons only over the retrieved chunks. It is
                  instructed not to fill gaps from general knowledge.
                </p>
              </div>
            </li>
            <li className="intro__step">
              <span className="intro__stepNumber">3</span>
              <div>
                <h3>Show the evidence</h3>
                <p>
                  Every claim comes back with the source, page, and section it
                  came from, so you can verify it against your own resume.
                </p>
              </div>
            </li>
          </ol>
        </section>
      )}
    </div>
  );
}
