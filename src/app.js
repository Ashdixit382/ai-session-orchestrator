import express from "express";
import healthRoutes from "./health/health.routes.js";
import loggerMiddleware from "./middleware/logger.middleware.js";
import notfoundMiddleware from "./middleware/notfound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./auth/auth.route.js";
import userRouter from "./users/user.route.js";

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRouter);

// 404 Handler (must be last)
app.use(notfoundMiddleware);

app.use(errorMiddleware);

export default app;
