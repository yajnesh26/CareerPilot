import type { ApiErrorKind } from "../api";

interface ErrorMessageProps {
  kind: ApiErrorKind;
  message: string;
  fieldErrors: string[];
  onRetry: () => void;
}

const HEADINGS: Record<ApiErrorKind, string> = {
  validation: "Job description needs attention",
  unavailable: "Analysis model unavailable",
  server: "Analysis service error",
  network: "Cannot reach the API",
  timeout: "Request timed out",
};

const HINTS: Record<ApiErrorKind, string> = {
  validation:
    "Add a little more detail to the job description and try again.",
  unavailable:
    "The backend retried Gemini three times without success. This is usually temporary.",
  server:
    "This is a backend fault rather than an input problem. Retrying may not help until the service is restarted.",
  network:
    "Start the backend with uvicorn from the backend directory, then retry. In development this request goes through the Vite proxy at /analyze.",
  timeout:
    "The retrieval and generation steps can take a while. Retrying is safe.",
};

/**
 * Explains a failed /analyze call in terms of what the user can act on,
 * rather than surfacing a raw status code.
 */
export default function ErrorMessage({
  kind,
  message,
  fieldErrors,
  onRetry,
}: ErrorMessageProps) {
  return (
    <section className="error" role="alert" aria-live="assertive">
      <div className="error__icon" aria-hidden="true">
        !
      </div>

      <div className="error__body">
        <h2 className="error__heading">{HEADINGS[kind]}</h2>
        <p className="error__message">{message}</p>

        {fieldErrors.length > 0 && (
          <ul className="error__fields">
            {fieldErrors.map((fieldError) => (
              <li key={fieldError}>{fieldError}</li>
            ))}
          </ul>
        )}

        <p className="error__hint">{HINTS[kind]}</p>

        <button type="button" className="button button--ghost" onClick={onRetry}>
          Try again
        </button>
      </div>
    </section>
  );
}
