import { Request } from "express";
import { validationResult } from "express-validator";
import { HttpError } from "../errors/http-error";

export const handleValidationErrors = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(errors.array(), 400);
  }
};
