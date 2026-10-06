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
      <div className="page__head">
        <p className="page__eyebrow">CareerPilot</p>
        <h1 className="page__title">New Analysis</h1>
        <p className="page__lede">
          Paste a job description and CareerPilot will compare it against the
          resume you have indexed.
        </p>
      </div>

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
              <span className="intro__stepNumber">01</span>
              <h3>Retrieve</h3>
              <p>
                The job description is embedded and matched against the
                sections of your resume in the vector database.
              </p>
            </li>
            <li className="intro__step">
              <span className="intro__stepNumber">02</span>
              <h3>Analyze</h3>
              <p>
                The model reasons only over the retrieved chunks. It is
                instructed not to fill gaps from general knowledge.
              </p>
            </li>
            <li className="intro__step">
              <span className="intro__stepNumber">03</span>
              <h3>Show the evidence</h3>
              <p>
                Every claim comes back with the source, page, and section it
                came from, so you can check it against your own resume.
              </p>
            </li>
          </ol>
        </section>
      )}
    </div>
  );
}