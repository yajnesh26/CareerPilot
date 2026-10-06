import type { AnalyzeRequest, AnalyzeResponse } from "./types";

/**
 * Which failure mode the user should see. Each kind maps to a distinct
 * message in ErrorMessage.tsx, because "the backend is down" and "your
 * input was too short" need different advice.
 */
export type ApiErrorKind =
  | "validation"
  | "unavailable"
  | "server"
  | "network"
  | "timeout";

export interface ApiErrorOptions {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  /** Field-level messages from a FastAPI 422 response. */
  fieldErrors?: string[];
}

/** Typed error thrown by every function in this module. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly fieldErrors: string[];

  constructor({ kind, message, status, fieldErrors = [] }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const ANALYZE_ENDPOINT = "/analyze";

/**
 * The pipeline embeds the job description, queries ChromaDB, then calls
 * Gemini with up to 3 attempts and exponential backoff. Thirty seconds is
 * comfortable for that without leaving the user hanging forever.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * FastAPI reports validation problems as `detail: [{ loc, msg, type }, ...]`.
 * Flatten it into plain strings, dropping the "body" prefix that is not
 * meaningful to someone filling in a textarea.
 */
function parseValidationDetail(detail: unknown): string[] {
  if (!Array.isArray(detail)) {
    return typeof detail === "string" && detail.length > 0
      ? [detail]
      : ["The job description was rejected as invalid."];
  }

  const messages = detail
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;
      const msg = (item as { msg?: unknown }).msg;
      return typeof msg === "string" ? msg : null;
    })
    .filter((msg): msg is string => msg !== null);

  return messages.length > 0
    ? messages
    : ["The job description was rejected as invalid."];
}

/**
 * Every non-2xx response becomes an ApiError with a useful message.
 * Unexpected bodies fall back to a status-based message rather than
 * leaking "[object Object]" into the UI.
 */
async function toApiError(response: Response): Promise<ApiError> {
  let detail: unknown;
  try {
    const body = (await response.json()) as { detail?: unknown };
    detail = body?.detail;
  } catch {
    detail = undefined;
  }

  if (response.status === 422) {
    const fieldErrors = parseValidationDetail(detail);
    return new ApiError({
      kind: "validation",
      status: response.status,
      message: "The job description did not pass validation.",
      fieldErrors,
    });
  }

  if (response.status === 503) {
    return new ApiError({
      kind: "unavailable",
      status: response.status,
      message:
        typeof detail === "string" && detail.length > 0
          ? detail
          : "The analysis model is temporarily unavailable.",
    });
  }

  if (response.status >= 500) {
    return new ApiError({
      kind: "server",
      status: response.status,
      message:
        "The analysis service hit an unexpected error. Check that the " +
        "backend is running and that the resume is indexed.",
    });
  }

  return new ApiError({
    kind: "server",
    status: response.status,
    message: `The request was rejected with status ${response.status}.`,
  });
}

/**
 * Analyze a job description against the indexed resume.
 *
 * @param jobDescription Raw text from the textarea.
 * @param signal Caller-supplied signal, used to cancel on unmount.
 * @throws {ApiError} For validation, upstream, network, and timeout failures.
 */
export async function analyzeJobDescription(
  jobDescription: string,
  signal?: AbortSignal,
): Promise<AnalyzeResponse> {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const forwardAbort = () => controller.abort();
  signal?.addEventListener("abort", forwardAbort);

  const body: AnalyzeRequest = { job_description: jobDescription };

  try {
    const response = await fetch(ANALYZE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw await toApiError(response);
    }

    return (await response.json()) as AnalyzeResponse;
  } catch (error) {
    // Already classified above; pass it through untouched.
    if (error instanceof ApiError) {
      throw error;
    }

    if (timedOut) {
      throw new ApiError({
        kind: "timeout",
        message:
          "The analysis took longer than 30 seconds and was cancelled. " +
          "The retrieval or generation step may be slow.",
      });
    }

    // fetch rejects with a TypeError for DNS failures, refused
    // connections, and blocked cross-origin requests alike.
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        kind: "network",
        message: "The request was cancelled.",
      });
    }

    throw new ApiError({
      kind: "network",
      message:
        "Could not reach the CareerPilot API. Confirm the backend is " +
        "running on http://localhost:8000.",
    });
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", forwardAbort);
  }
}
