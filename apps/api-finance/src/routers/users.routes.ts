import { Router, Request, Response } from "express";
import { createUser, getUserByEmail, getUsers, User } from "../services/users.service";
import { isValidEmail } from "../utils.service";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const response: Partial<User>[] = await Promise.resolve(
      getUsers().map((x) => ({ ...x, password: undefined }))
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send("Bad Request");
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password too short" });
    return;
  }


  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  if (getUserByEmail(email)) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const user = await createUser({ name, email, password });
  if (user) {
    res.status(201).json({ message: "User created successfully" });
  } else {
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;
