import { Request, Response, NextFunction } from "express";
import { logger } from "../winston";

function logObject(
  req: Request,
  res: Response,
  startTime: number,
  type: "finish" | "close" | "error"
): any {
  const duration = Date.now() - startTime;
  return {
    type,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };
}

export function httpRequestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on("finish", () =>
      logger.info(logObject(req, res, startTime, "finish"))
    );
    res.on("close", () => logger.info(logObject(req, res, startTime, "close")));
    res.on("error", () => logger.info(logObject(req, res, startTime, "error")));

    next();
  };
}
