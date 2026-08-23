import User from "../users/users.model.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const registerUser = async (userData) => {
  // console.log(`${userData.email}  ${userData.password}`);
  const existUser = await User.findOne({
    email: userData.email,
  });

  if (existUser) {
    throw new AppError("User Already Exists", 409);
  }

  const hashPassword = await bcrypt.hash(userData.password, config.bcryptSaltRounds);

  const user = await User.create({ ...userData, password: hashPassword });

  const userResponse = user.toObject();

  delete userResponse.password;

  return userResponse;
};

export const loginUser = async (userData) => {
  const existingUser = await User.findOne({
    email: userData.email,
  }).select("+password");

  if (!existingUser) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const userResponse = existingUser.toObject();
  delete userResponse.password;

  const token = jwt.sign({ userId: existingUser._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return {
    user: userResponse,
    token,
  };
};
