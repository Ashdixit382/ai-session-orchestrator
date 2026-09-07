import { healthCheck, readinessCheck } from "../health/health.controller.js";
import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/health", asyncHandler(healthCheck));
router.get("/ready", asyncHandler(readinessCheck));

export default router;
