import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  getUsersController,
} from "../../controllers/users.controller";

const router = Router();

router.get("/", asyncHandler(getUsersController));


export default router;
