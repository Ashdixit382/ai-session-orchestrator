import { AppError } from "../utils/AppError.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import RefreshToken from "../auth/refreshToken.model.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User Does not Exists", 404);
  }

  return user;
};

export const updateUser = async (userId, userData) => {
  if (userData.email) {
    const existUser = await User.findOne({
      email: userData.email,
      _id: { $ne: userId },
    });

    if (existUser) {
      throw new AppError("Email already in use", 409);
    }
  }

  const user = await User.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  return user;
};

export const updateUserPassword = async (userId, userData) => {
  const existingUser = await User.findById(userId).select("+password");

  if (!existingUser) {
    throw new AppError("User does not exist", 404);
  }

  const isPasswordValid = await bcrypt.compare(userData.currentPassword, existingUser.password);

  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  const hashedPassword = await bcrypt.hash(userData.newPassword, Number(config.bcryptSaltRounds));

  existingUser.password = hashedPassword;

  await existingUser.save();

  await RefreshToken.deleteMany({ user: userId });

  return {
    message: "Password updated successfully",
  };
};

export const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  await RefreshToken.deleteMany({ user: userId });

  await User.deleteOne({ _id: userId });
};
