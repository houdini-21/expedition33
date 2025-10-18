/**
 * Generic API response wrapper used by all backend endpoints.
 * Matches the standard format: { code, message, data }
 */
export interface ApiResponse<T> {
  /** HTTP-like code (e.g. 200, 400, 500) */
  code: number;

  /** Human-readable message or description */
  message: string;

  /** Main payload returned by the API */
  data: T;
}
