import { registerUser, loginUser, logoutUser } from "./auth.service.js";
import { refreshAccessToken } from "./refreshToken.service.js";

export const registerUserController = async (req, res) => {
  const userData = req.body;

  const user = await registerUser(userData);

  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const userData = req.body;

  const user = await loginUser(userData);

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.body;
  const data = await refreshAccessToken(refreshToken);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const logoutController = async (req, res) => {
  const { refreshToken } = req.body;

  await logoutUser(refreshToken);

  return res.status(200).json({
    success: true,
    message: "User logout successful",
  });
};
