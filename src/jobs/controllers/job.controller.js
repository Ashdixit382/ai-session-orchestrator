import { AppError } from "../../utils/AppError.js";
import { getJobStatus } from "../services/jobStatus.service.js";

export const getJobStatusController = async (req, res) => {
  const { jobId } = req.params;

  const job = await getJobStatus(jobId, req.user.userId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  res.status(200).json({
    success: true,
    data: job,
  });
};
