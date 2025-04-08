import { Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import { Transaction, TransactionFilters } from "@finance/types";
import {
  getTransactions,
  createTransaction,
} from "../services/transactions.service";

export const getTransactionsController = async (
  req: Request,
  res: Response
) => {
  const { senderemail, receiveremail } = req.query;

  const filteredTransactions = await getTransactions({
    senderemail: senderemail as string,
    receiveremail: receiveremail as string,
  });

  res.status(200).json(filteredTransactions);
};

export const createTransactionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { senderemail, receiveremail, amount } = req.body;

  if (senderemail === receiveremail)
    throw new HttpError("Emails should be different", 400);

  await createTransaction({ senderemail, receiveremail, amount });
  res.status(201).json({ message: "Transaction created successfully" });
};
