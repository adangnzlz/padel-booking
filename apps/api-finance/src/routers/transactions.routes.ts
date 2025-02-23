import { Router, Response, Request } from "express";
import { getUserByEmail } from "../services/users.service";
import asyncHandler from "express-async-handler";
import { HttpError } from "../errors/http-error";
import { body, query, validationResult } from "express-validator";

const router = Router();

interface Transactions {
  senderEmail: string;
  receiverEmail: string;
  amount: number;
}

const transactions: Transactions[] = [];

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
  asyncHandler((req: Request, res: Response) => {
    const senderEmail = req.query.senderEmail
      ? String(req.query.senderEmail)
      : undefined;
    const receiverEmail = req.query.receiverEmail
      ? String(req.query.receiverEmail)
      : undefined;
    if (senderEmail && !getUserByEmail(senderEmail))
      throw new HttpError("Sender email not exists", 400);
    if (receiverEmail && !getUserByEmail(receiverEmail))
      throw new HttpError("Receiver email not exists", 400);

    const filteredTransactions = transactions.filter((x) => {
      return (
        (!senderEmail || x.senderEmail == senderEmail) &&
        (!receiverEmail || receiverEmail == x.receiverEmail)
      );
    });

    res.status(200).json(filteredTransactions);
  })
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
    body("amount").trim().isFloat({ gt: 0 }).withMessage("Positive amount required"),
  ],
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { senderEmail, receiverEmail, amount } = req.body;

    const errors = validationResult(req);
    if (errors && !errors.isEmpty()) throw new HttpError(errors.array(), 400);

    if (senderEmail === receiverEmail)
      throw new HttpError("Emails should be different", 400);
    if (!getUserByEmail(senderEmail))
      throw new HttpError("Sender email not exists", 400);
    if (!getUserByEmail(receiverEmail))
      throw new HttpError("Receiver email not exists", 400);

    if (isNaN(amount) || amount <= 0)
      throw new HttpError("Amount should be positive", 400);

    transactions.push({ senderEmail, receiverEmail, amount });
    res.status(201).json({ message: "Transaction created successfully" });
  })
);

export default router;
