import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./database/connectDB.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";
import { connectRedis, disconnectRedis } from "../src/database/redis.js";
import http from "http";
import { Server } from "socket.io";
import { verifyAccessToken } from "./utils/jwt.js";
import Conversation from "./conversations/conversation.model.js";

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // const server = app.listen(config.port, () => {
    //   logger.info(`Server is listening on port ${config.port}`);
    // });
    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: config.clientUrl,
        credentials: true,
      },
    });

    app.set("io", io);

    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error("Authentication required"));
        }

        const decoded = verifyAccessToken(token);

        socket.data.userId = decoded.userId;

        next();
      } catch (error) {
        next(new Error("Invalid or expired token"));
      }
    });

    io.on("connection", (socket) => {
      logger.info(
        {
          socketId: socket.id,
          userId: socket.data.userId,
        },
        "Authenticated socket connected",
      );

      socket.on("conversation:join", async (conversationId) => {
        try {
          const conversation = await Conversation.findOne({
            _id: conversationId,
            user: socket.data.userId,
          });

          if (!conversation) {
            return socket.emit("conversation:error", {
              message: "Conversation not found",
            });
          }

          const room = `conversation:${conversationId}`;

          socket.join(room);

          logger.info(
            {
              socketId: socket.id,
              userId: socket.data.userId,
              conversationId,
            },
            "User joined conversation room",
          );

          socket.emit("conversation:joined", {
            conversationId,
          });
        } catch (error) {
          logger.error(
            {
              err: error,
              socketId: socket.id,
              userId: socket.data.userId,
              conversationId,
            },
            "Failed to join conversation room",
          );

          socket.emit("conversation:error", {
            message: "Failed to join conversation",
          });
        }
      });

      socket.on("message:test", async (conversationId) => {
        const room = `conversation:${conversationId}`;

        io.to(room).emit("message:new", {
          conversationId,
          message: "Hello conversation!",
        });
      });

      socket.on("conversation:leave", (conversationId) => {
        const room = `conversation:${conversationId}`;

        socket.leave(room);

        logger.info(
          {
            socketId: socket.id,
            userId: socket.data.userId,
            conversationId,
          },
          "User left conversation room",
        );

        socket.emit("conversation:left", conversationId);
      });

      socket.on("disconnect", (reason) => {
        logger.info(
          {
            socketId: socket.id,
            userId: socket.data.userId,
            reason,
          },
          "Socket client disconnected",
        );
      });
    });

    httpServer.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}`);
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      io.close();

      httpServer.close(async () => {
        logger.info("HTTP server closed");

        try {
          await mongoose.connection.close();
          await disconnectRedis();

          logger.info("MongoDB connection closed");

          process.exit(0);
        } catch (error) {
          logger.error(
            {
              err: error,
            },
            "Error during graceful shutdown",
          );

          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => {
      gracefulShutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      gracefulShutdown("SIGINT");
    });
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Failed to start application",
    );

    process.exit(1);
  }
};

startServer();
