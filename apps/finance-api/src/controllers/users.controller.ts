import { validationResult } from "express-validator";
import { HttpError } from "../errors/http-error";
import { createUser, getUsers, User } from "../services/users.service";
import { Request, Response } from "express";
import { validateRequest } from "../decorators/validator-request.decorator";

export const getUsersController = async (req: Request, res: Response) => {
  const response: Omit<User, "password">[] = await getUsers();
  res.status(200).json(response);
};

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    await createUser({ name, email, password });
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      throw new HttpError(error.message, 400);
    }
    throw new HttpError("Internal Server Error", 500);
  }

  res.status(201).json({ message: "User created successfully" });
};
