import { Router, Response, Request } from "express";
import { isValidEmail } from "../utils.service";
import { getUserByEmail } from "../services/users.service";

const router = Router();

interface Transactions {
  senderEmail: string;
  receiverEmail: string;
  amount: number;
}

const transactions: Transactions[] = [];

export function validateEmailExists(
  email: string,
  type: "Sender" | "Receiver"
): string | null {
  if (!isValidEmail(email)) {
    return `${type} email should be valid`;
  }
  if (!getUserByEmail(email)) {
    return `${type} email not found: ${email}`;
  }
  return null;
}


router.get("/", (req: Request, res: Response) => {
  const { senderEmail, receiverEmail } = req.body;

  const senderError = senderEmail
    ? validateEmailExists(senderEmail, "Sender")
    : null;
  if (senderError) {
    res.status(400).json({ error: senderError });
    return;
  }

  const receiverError = receiverEmail
    ? validateEmailExists(receiverEmail, "Receiver")
    : null;
  if (receiverError) {
    res.status(400).json({ error: receiverError });
    return;
  }

  const filteredTransactions = transactions.filter((x) => {
    return (
      (!senderEmail || x.senderEmail == senderEmail) &&
      (!receiverEmail || receiverEmail == x.receiverEmail)
    );
  });

  res.status(200).json(filteredTransactions);
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { senderEmail, receiverEmail, amount } = req.body;

  if (senderEmail === receiverEmail) {
    res.status(400).json({ error: "Emails should be different" });
    return;
  }

  const senderError = validateEmailExists(senderEmail, "Sender");
  if (senderError) {
    res.status(400).json({ error: senderError });
    return;
  }

  const receiverError = validateEmailExists(receiverEmail, "Receiver");
  if (receiverError) {
    res.status(400).json({ error: receiverError });
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    res.status(400).json({ error: "Amount should be positive" });
    return;
  }

  transactions.push({ senderEmail, receiverEmail, amount });
  res.status(201).json({ message: "Transaction created successfully" });
});

export default router;
