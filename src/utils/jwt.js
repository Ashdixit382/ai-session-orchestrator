import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
