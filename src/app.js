import express from "express";
import healthRoutes from "./routes/health.routes.js";
import loggerMiddleware from "./middleware/logger.middleware.js";
import notfoundMiddleware from "./middleware/notfound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(loggerMiddleware);

app.use("/health", healthRoutes);

// 404 Handler (must be last)
app.use(notfoundMiddleware);

app.use(errorMiddleware);

export default app;
