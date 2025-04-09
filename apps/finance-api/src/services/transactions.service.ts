import { DatabaseFactory } from "../providers/database.factory";
import { getUserByEmail } from "./users.service";
import { HttpError } from "../errors/http-error";
import {
  TransactionFilters,
  Transaction,
  CreateTransactionRequest,
} from "@finance/types";

const database = DatabaseFactory.get<Transaction>("transactions");

export async function getTransactions(
  filters?: TransactionFilters
): Promise<Transaction[]> {
  const obj: TransactionFilters = {};
  if (filters?.senderemail) obj.senderemail = String(filters.senderemail);
  if (filters?.receiveremail) obj.receiveremail = String(filters.receiveremail);

  if (!obj || Object.keys(obj).length === 0) {
    return await database.read();
  }
  return await database.getByFields(obj);
}

export async function createTransaction(
  transaction: CreateTransactionRequest
): Promise<CreateTransactionRequest> {
  const { senderemail, receiveremail, amount } = transaction;

  if (senderemail === receiveremail)
    throw new HttpError("Emails should be different", 400);

  const senderExists = await getUserByEmail(senderemail);
  if (!senderExists) throw new HttpError("Sender email not exists", 400);

  const receiverExists = await getUserByEmail(receiveremail);
  if (!receiverExists) throw new HttpError("Receiver email not exists", 400);

  const newTransaction: CreateTransactionRequest = {
    senderemail,
    receiveremail,
    amount,
  };
  const transactionCreated = await database.create(newTransaction);

  return {...transactionCreated, amount: Number(transactionCreated.amount)};
}
