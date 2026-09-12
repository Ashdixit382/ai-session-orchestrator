import { Router } from "express";
import { authorizeUser } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getJobStatusController } from "../controllers/job.controller.js";

const router = Router();

router.get("/:jobId", authorizeUser, asyncHandler(getJobStatusController));

export default router;
