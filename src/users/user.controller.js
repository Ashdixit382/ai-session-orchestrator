import { deleteUser, getUserById, updateUser, updateUserPassword } from "./user.service.js";

export const getCurrentUserController = async (req, res) => {
  const userId = req.user.userId;
  const user = await getUserById(userId);

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const updateUserController = async (req, res) => {
  const userId = req.user.userId;
  const userData = req.body;
  const user = await updateUser(userId, userData);

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const updateUserPasswordController = async (req, res) => {
  const userId = req.user.userId;
  const userData = req.body;
  const user = await updateUserPassword(userId, userData);

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const deleteUserController = async (req, res) => {
  const userId = req.user.userId;

  await deleteUser(userId);

  return res.status(200).json({
    success: true,
    message: "User Delete Successfully",
  });
};
