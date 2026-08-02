import { Router } from "express";
import { registerUserController } from "./auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(registerUserController));

export default router;
