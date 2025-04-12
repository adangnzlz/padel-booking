import { Request, Response } from "express";

export const getUsersController = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello from Users API!",
    timestamp: new Date().toISOString()
  });
};


