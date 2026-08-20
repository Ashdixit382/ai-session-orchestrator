import User from "../users/users.model.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import jwt from "jsonwebtoken";

export const registerUser = async (userData) => {
  // console.log(`${userData.email}  ${userData.password}`);
  const existUser = await User.findOne({
    email: userData.email,
  });

  if (existUser) {
    throw new Error("User already exists");
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
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const userResponse = existingUser.toObject();
  delete userResponse.password;

  const token = jwt.sign({ userId: userResponse._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return {
    user: userResponse,
    token,
  };
};
