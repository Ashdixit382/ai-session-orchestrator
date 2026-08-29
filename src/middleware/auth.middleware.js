import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { AppError } from "../utils/AppError.js";

export const authorizeUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Authorization header missing", 401));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization format", 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
