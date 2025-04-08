import { Router } from "express";
import asyncHandler from "express-async-handler";
import { body, query } from "express-validator";
import {
  createTransactionController,
  getTransactionsController,
} from "../../controllers/transactions.controller";
import { validateRequest } from "../../decorators/validator-request.decorator";
  
const router = Router();

router.get(
  "/",
  [
    query("senderemail")
      .optional()
      .isEmail()
      .withMessage("Invalid sender email"),
    query("receiveremail")
      .optional()
      .isEmail()
      .withMessage("Invalid receiver email"),
  ],
  validateRequest,
  asyncHandler(getTransactionsController)
);

router.post(
  "/",
  [
    body("senderemail")
      .notEmpty()
      .withMessage("Sender email required")
      .trim()
      .isEmail()
      .withMessage("Invalid sender email"),
    body("receiveremail")
      .notEmpty()
      .withMessage("Receiver email required")
      .trim()
      .isEmail()
      .withMessage("Invalid receiver email"),
    body("amount")
      .trim()
      .isFloat({ gt: 0 })
      .withMessage("Positive amount required"),
  ],
  validateRequest,
  asyncHandler(createTransactionController)
);

export default router;
