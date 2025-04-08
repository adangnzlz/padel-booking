import { Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import { getUserByEmail } from "../services/users.service";
import { Transaction } from "@finance/types";

const transactions: Transaction[] = [];

export const getTransactions = (req: Request, res: Response) => {
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
};

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { senderEmail, receiverEmail, amount } = req.body;

  if (senderEmail === receiverEmail)
    throw new HttpError("Emails should be different", 400);
  if (!getUserByEmail(senderEmail))
    throw new HttpError("Sender email not exists", 400);
  if (!getUserByEmail(receiverEmail))
    throw new HttpError("Receiver email not exists", 400);

  transactions.push({ senderEmail, receiverEmail, amount});
  res.status(201).json({ message: "Transaction created successfully" });
};
