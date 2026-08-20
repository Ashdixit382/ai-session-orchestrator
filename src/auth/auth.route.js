import { Router } from "express";
import { registerUserController, loginUserController } from "./auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(registerUserController));
router.post("/login", asyncHandler(loginUserController));

export default router;
