import { NextFunction, Router } from "express";
import asyncHandler from "express-async-handler";
import { body, param } from "express-validator";
import { strictRateLimiter } from "../../middlewares/rate-limiter.middleware";
import {
  createUserController,
  getUserByEmailController,
  getUsersController,
} from "../../controllers/users.controller";
import { validateRequest } from "../../decorators/validator-request.decorator";

const router = Router();

router.get("/", asyncHandler(getUsersController));

router.get(
  "/:email",
  [param("email").isEmail().withMessage("Invalid email format")],
  validateRequest,
  asyncHandler(getUserByEmailController)
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
  validateRequest,
  asyncHandler(createUserController)
);

export default router;
