import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  refreshTokenController,
  logoutController,
} from "./auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "./auth.validation.js";
import validate from "../middleware/validate.middleware.js";
import { authRateLimiter, RefreshRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  asyncHandler(registerUserController),
);
router.post("/login", validate(loginSchema), asyncHandler(loginUserController));
router.post(
  "/refresh",
  RefreshRateLimiter,
  validate(refreshTokenSchema),
  asyncHandler(refreshTokenController),
);
router.post("/logout", validate(logoutSchema), asyncHandler(logoutController));

export default router;
