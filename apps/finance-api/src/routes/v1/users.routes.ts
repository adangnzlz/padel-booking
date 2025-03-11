import { NextFunction, Router } from "express";
import asyncHandler from "express-async-handler";
import { body } from "express-validator";
import { strictRateLimiter } from "../../middlewares/rate-limiter.middleware";
import {
  createUserController,
  getUsersController,
} from "../../controllers/users.controller";
import { validateRequest } from "../../decorators/validator-request.decorator";

const router = Router();

router.get("/", asyncHandler(getUsersController));

// router.get(
//   "/:email",
//   [param("email").isEmail().withMessage("Invalid email format")],
//   asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const email = req.params.email;
//     const user = getUserByEmail(email);
//     if (!user) throw new HttpError("User not found", 404);
//     res.status(200).json(user);
//   })
// );

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
