import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { config } from "../config.js";

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  const refreshId = nanoid();
  const refreshToken = jwt.sign({ sub: userId, jti: refreshId }, config.jwtSecret, {
    expiresIn: config.refreshExpiresIn,
  });
  return { accessToken, refreshToken };
};
