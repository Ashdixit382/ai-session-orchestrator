import express from "express";
import healthRoutes from "./health/health.routes.js";
import loggerMiddleware from "./middleware/logger.middleware.js";
import notfoundMiddleware from "./middleware/notfound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./auth/auth.route.js";
import userRouter from "./users/user.route.js";
import conversationRoutes from "./conversations/conversation.routes.js";
import helmet from "helmet";
import cors from "cors";
import config from "./config/index.js";
import httpLogger from "./middleware/httpLogger.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "100kb",
  }),
);

app.use(httpLogger);

app.use("/", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRouter);
app.use("/conversations", conversationRoutes);

// 404 Handler (must be last)
app.use(notfoundMiddleware);

app.use(errorMiddleware);

export default app;
