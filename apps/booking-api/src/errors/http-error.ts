export class HttpError extends Error {
  public statusCode: number;
  public errors: any;

  constructor(errors: any, statusCode: number) {
    super(typeof errors === "string" ? errors : JSON.stringify(errors)); // ✅ Ensure it's string for Error base class
    this.statusCode = statusCode;
    this.errors = errors; // ✅ Store raw errors for response
  }
}
