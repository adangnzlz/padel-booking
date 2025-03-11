import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HttpError } from "../errors/http-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array(), 400));
  }
  next()
};
