import express from "express";
import healthRoutes from "./routes/health.routes.js";
import loggerMiddleware from "./middleware/logger.middleware.js";

const app = express();

app.use(loggerMiddleware);

app.use("/health", healthRoutes);

export default app;
