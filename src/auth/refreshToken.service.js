import crypto from "crypto";
import RefreshToken from "../auth/refreshToken.model.js";
import config from "../config/index.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const createRefreshToken = async (userId) => {
  const rawToken = crypto.randomBytes(64).toString("hex");

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date(Date.now() + config.refreshTokenExpiresIn);

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt,
  });

  return rawToken;
};

export const refreshAccessToken = async (rawToken) => {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const existingRefreshToken = await RefreshToken.findOne({
    tokenHash,
  });

  if (!existingRefreshToken) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (existingRefreshToken.expiresAt <= new Date()) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const accessToken = jwt.sign({ userId: existingRefreshToken.user }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  const newRefreshToken = await createRefreshToken(existingRefreshToken.user);

  await existingRefreshToken.deleteOne();

  return { accessToken, refreshToken: newRefreshToken };
};

export const revokeRefreshToken = async (rawToken) => {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const existingRefreshToken = await RefreshToken.findOne({ tokenHash });

  if (!existingRefreshToken) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  await existingRefreshToken.deleteOne();
};
