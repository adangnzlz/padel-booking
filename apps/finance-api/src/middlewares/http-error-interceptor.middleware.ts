import { NextFunction, Request, Response } from "express";
import { logger } from "../config/winston";
import { HttpError } from "../errors/http-error";

export function httpErrorInterceptor() {
  return (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    const errorMessage = err.message || "Unknown server error";

    const logMessage = `${req.method} ${req.url} - ${JSON.stringify(
      errorMessage
    )}`;
    if (statusCode >= 500) {
      logger.error({ message: `❌ Server Error: ${logMessage}` });
    } else if (statusCode >= 400) {
      logger.warn({ message: `⚠️ Client Error: ${logMessage}` });
    }
    res.status(statusCode).json({
      error: Array.isArray(err.errors)
        ? err.errors
        : err.message || "Internal Server Error",
    });
  };
}
