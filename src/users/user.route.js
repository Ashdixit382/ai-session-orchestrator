import {
  deleteUserController,
  getCurrentUserController,
  updateUserController,
  updateUserPasswordController,
} from "./user.controller.js";
import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { authorizeUser } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { updateUserSchema, updateUserPasswordSchema } from "../users/user.validation.js";

const router = Router();

router.get("/me", authorizeUser, asyncHandler(getCurrentUserController));
router.patch("/me", authorizeUser, validate(updateUserSchema), asyncHandler(updateUserController));
router.patch(
  "/me/password",
  authorizeUser,
  validate(updateUserPasswordSchema),
  asyncHandler(updateUserPasswordController),
);
router.delete("/me", authorizeUser, asyncHandler(deleteUserController));

export default router;
