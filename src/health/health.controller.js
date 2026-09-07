import mongoose from "mongoose";

export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
  });
};

export const readinessCheck = (req, res) => {
  const isDatabaseReady = mongoose.connection.readyState === 1;

  if (!isDatabaseReady) {
    return res.status(503).json({
      success: false,
      status: "not_ready",
    });
  }

  return res.status(200).json({
    success: true,
    status: "ready",
  });
};
