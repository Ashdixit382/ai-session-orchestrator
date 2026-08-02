import User from "../users/users.model.js";

export const registerUser = async (userData) => {
  const user = await User.create(userData);

  return user;
};