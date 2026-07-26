/**
 * A typed error carrying an HTTP status code, so route handlers can
 * `throw new HttpError(...)` and let the central error middleware
 * translate it into the standard ApiError envelope.
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Authentication required") {
    return new HttpError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "Not allowed") {
    return new HttpError(403, "FORBIDDEN", message);
  }

  static notFound(message = "Resource not found") {
    return new HttpError(404, "NOT_FOUND", message);
  }

  static conflict(message: string) {
    return new HttpError(409, "CONFLICT", message);
  }

  static internal(message = "Internal server error") {
    return new HttpError(500, "INTERNAL_ERROR", message);
  }
}
