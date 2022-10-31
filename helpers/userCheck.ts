import { Document, Types } from "mongoose";
import User, { IUser } from "../models/user";

type userType =
  | (Document<unknown, any, IUser> &
      IUser & {
        _id: Types.ObjectId;
      })
  | null;

const userCheck = (user: userType | null, userId: string) => {
  try {
    if (!user) {
      errorThrow(401, `User of id:${userId} does not exists.`);
    }
    return user!;
  } catch (err) {
    throw err;
  }
};

export default userCheck;
