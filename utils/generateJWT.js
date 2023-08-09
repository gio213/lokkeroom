import jwt from "jsonwebtoken";
import { config } from "dotenv";

config({ path: "./.env" });

export const generateJwt = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
};
