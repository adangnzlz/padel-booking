import { Router } from "express";
import asyncHandler from "express-async-handler";
import { body, query } from "express-validator";
import {
  createTransaction,
  getTransactions,
} from "../controllers/transactions.controller";

const router = Router();

router.get(
  "/",
  [
    query("senderEmail")
      .optional()
      .isEmail()
      .withMessage("Invalid sender email"),
    query("receiverEmail")
      .optional()
      .isEmail()
      .withMessage("Invalid sender email"),
  ],
  asyncHandler(getTransactions)
);

router.post(
  "/",
  [
    body("senderEmail")
      .notEmpty()
      .withMessage("Sender email required")
      .trim()
      .isEmail()
      .withMessage("Invalid sender email"),
    body("receiverEmail")
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
  asyncHandler(createTransaction)
);

export default router;
