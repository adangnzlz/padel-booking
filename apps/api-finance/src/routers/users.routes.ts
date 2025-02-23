import { Router, Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  getUsers,
  User,
} from "../services/users.service";
import { isValidEmail } from "../utils/utils";
import { HttpError } from "../errors/http-error";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { strictRateLimiter } from "../middlewares/rate-limiter.middleware";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const response: Partial<User>[] = await Promise.resolve(
      getUsers().map((x) => ({ ...x, password: undefined }))
    );
    res.status(200).json(response);
  })
);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .trim()
      .isEmail()
      .withMessage("Invalid email"),
    body("password")
      .notEmpty()
      .trim()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password is required. Min lenght 6 characteres"),
  ],
  strictRateLimiter,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new HttpError(errors.array(), 400);

    if (getUserByEmail(email))
      throw new HttpError("Email already registered", 400);

    const user = await createUser({ name, email, password });
    if (user) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(500).json({ error: "Failed to process request" });
    }
  })
);

export default router;
