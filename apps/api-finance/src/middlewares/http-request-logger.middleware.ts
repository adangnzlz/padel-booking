import { Request, Response, NextFunction } from "express";
import { logger } from "../winston";


export function httpRequestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  };
}
