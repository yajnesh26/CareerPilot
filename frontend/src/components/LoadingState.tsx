/**
 * Stages shown in sequence while /analyze is in flight. They mirror the
 * real backend pipeline: embed the query, search ChromaDB, then generate.
 */
const STAGES = [
  "Retrieving relevant evidence from your resume",
  "Comparing evidence against the job requirements",
  "Generating a grounded analysis",
];

const STAGE_INTERVAL_MS = 3500;

const ADVICE =
  "Analysis usually takes several seconds while the evidence is retrieved and the model generates a grounded response.";

/**
 * Communicates that work is genuinely happening. The rotating stages stop
 * at the last item rather than looping, so the list reads as progress
 * toward completion instead of an animation.
 */
export default function LoadingState() {
  return (
    <section
      className="loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading__spinner" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <h2 className="loading__heading">Analyzing this role</h2>

      <ol className="loading__stages">
        {STAGES.map((stage, index) => (
          <li
            key={stage}
            className="loading__stage"
            style={{ animationDelay: `${index * STAGE_INTERVAL_MS}ms` }}
          >
            {stage}
          </li>
        ))}
      </ol>

      <p className="loading__advice">{ADVICE}</p>
    </section>
  );
}
