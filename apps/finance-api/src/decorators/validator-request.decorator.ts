import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HttpError } from "../errors/http-error";

export const validateRequest = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array(), 400));
    }

    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
