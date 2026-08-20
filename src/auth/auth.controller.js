import { registerUser, loginUser } from "./auth.service.js";

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
