export type LetterErrorCode =
  | "VALIDATION"
  | "INVALID_TRANSITION"
  | "LOCKED"
  | "NOT_FOUND"
  | "REVISION_CONFLICT"
  | "UNAVAILABLE"
  | "QUOTA"
  | "STORAGE"
  | "UPGRADE";
export class LetterError extends Error {
  constructor(
    public readonly code: LetterErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "LetterError";
  }
}
