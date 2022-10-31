import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { TokenInterface } from "../extended-types/token";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string;
  }
}

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    errorThrow(401, "Not authenticated");
  }
  const checkedAuthHeader = authHeader!;

  const token = checkedAuthHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET) as TokenInterface;
  } catch (err) {
    if (err instanceof Error) err.status = 500;
    throw err;
  }

  if (!decodedToken) {
    errorThrow(401, "Not authorized");
  }
  const checkedDecodedToken = decodedToken!;

  req.userId = checkedDecodedToken.userId;
  next();
};

export default isAuth;
