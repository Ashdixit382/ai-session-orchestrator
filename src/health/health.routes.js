import { getHealth } from "../health/health.controller.js";
import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getHealth));

export default router;
