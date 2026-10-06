import { MIN_JOB_DESCRIPTION_LENGTH } from "../types";

interface JobDescriptionFormProps {
  jobDescription: string;
  loading: boolean;
  onJobDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

const PLACEHOLDER = `Paste the full job description here.

For example:

We are looking for an AI Solution Builder Intern.

Requirements:
- Strong Python programming skills
- Understanding of machine learning and deep learning
- Experience with LLMs or RAG systems
- Ability to build backend APIs
- Experience with React or modern frontend development

Include responsibilities and required skills if the posting lists them.`;

/** Minimum accepted before the submit button unlocks. */
const MIN_LENGTH = MIN_JOB_DESCRIPTION_LENGTH;

/**
 * The single input surface: a job description textarea plus validation
 * feedback that mirrors the backend's min_length rule.
 */
export default function JobDescriptionForm({
  jobDescription,
  loading,
  onJobDescriptionChange,
  onSubmit,
}: JobDescriptionFormProps) {
  const trimmedLength = jobDescription.trim().length;
  const tooShort = trimmedLength > 0 && trimmedLength < MIN_LENGTH;
  const empty = trimmedLength === 0;
  const canSubmit = !empty && trimmedLength >= MIN_LENGTH && !loading;
  const remaining = MIN_LENGTH - trimmedLength;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd+Enter submits, matching the convention in most chat UIs.
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canSubmit) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      className="composer"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <div className="composer__field">
        <div className="composer__labelRow">
          <label className="composer__label" htmlFor="job-description">
            Job Description
          </label>
          <span className="composer__counter">
            {trimmedLength.toLocaleString()} character
            {trimmedLength === 1 ? "" : "s"}
          </span>
        </div>

        <textarea
          id="job-description"
          className={`composer__textarea${
            tooShort ? " composer__textarea--invalid" : ""
          }`}
          value={jobDescription}
          placeholder={PLACEHOLDER}
          rows={12}
          spellCheck={false}
          disabled={loading}
          aria-invalid={tooShort}
          aria-describedby="job-description-help"
          onChange={(event) => onJobDescriptionChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="composer__help" id="job-description-help">
          {tooShort ? (
            <span className="composer__help--invalid">
              Add {remaining} more character{remaining === 1 ? "" : "s"}. The
              backend requires at least {MIN_LENGTH}.
            </span>
          ) : (
            <span>
              Tip: paste the complete posting. Requirements you leave out
              cannot be assessed against the resume.
            </span>
          )}
        </div>
      </div>

      <div className="composer__actions">
        <button type="submit" className="button" disabled={!canSubmit}>
          {loading ? "Analyzing…" : "Analyze Job"}
        </button>
        <span className="composer__shortcut">
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
        </span>
      </div>
    </form>
  );
}
