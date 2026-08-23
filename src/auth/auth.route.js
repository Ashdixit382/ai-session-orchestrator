import { Router } from "express";
import { registerUserController, loginUserController } from "./auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import validate from "../middleware/validate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerUserController));
router.post("/login", validate(loginSchema), asyncHandler(loginUserController));

export default router;
