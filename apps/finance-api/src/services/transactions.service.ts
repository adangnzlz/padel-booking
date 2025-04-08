import { DatabaseFactory } from "../providers/database.factory";
import { getUserByEmail } from "./users.service";
import { Transaction, TransactionFilters } from "@finance/types";
import { HttpError } from "../errors/http-error";

const database = DatabaseFactory.get<Transaction>("transactions");

export async function getTransactions(
  filters?: TransactionFilters
): Promise<Transaction[]> {
  const obj: TransactionFilters = {};
  if (filters?.senderemail) obj.senderemail = String(filters.senderemail);
  if (filters?.receiveremail) obj.receiveremail = String(filters.receiveremail);

  if (!filters || Object.keys(filters).length === 0) {
    return await database.read();
  }
  return await database.getByFields(obj);
}

export async function createTransaction(
  transaction: Transaction
): Promise<Transaction> {
  const { senderemail, receiveremail, amount } = transaction;

  if (senderemail === receiveremail)
    throw new HttpError("Emails should be different", 400);

  const senderExists = await getUserByEmail(senderemail);
  if (!senderExists) throw new HttpError("Sender email not exists", 400);

  const receiverExists = await getUserByEmail(receiveremail);
  if (!receiverExists) throw new HttpError("Receiver email not exists", 400);

  const newTransaction = {
    senderemail,
    receiveremail,
    amount,
  };
  await database.create(newTransaction);

  return newTransaction;
}
