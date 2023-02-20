import { Router } from "express";
import { body } from "express-validator";
import { changeEmail, changePassword, deleteUser } from "../controller/user";

import isAuth from "../middleware/is-auth";

const userRouter = Router();

userRouter.put("/changepassword", isAuth, changePassword);
userRouter.put("/changeemail", isAuth, changeEmail);
userRouter.delete(
  "/delete",
  isAuth,
  [body("password").isString().trim().notEmpty().isLength({ min: 5 })],
  deleteUser
);

export default userRouter;
