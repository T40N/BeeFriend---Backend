import { Router } from "express";
import { body } from "express-validator";
import { changeEmail, changePassword, deleteUser } from "../controller/user";

import isAuth from "../middleware/is-auth";

const userRouter = Router();

userRouter.put(
  "/changePassword",
  isAuth,
  [
    body("oldPassword").isString().trim().notEmpty().isLength({ min: 5 }),
    body("newPassword").isString().trim().notEmpty().isLength({ min: 5 }),
  ],
  changePassword
);
userRouter.put(
  "/changeEmail",
  isAuth,
  [
    body("oldEmail")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("newEmail")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
  ],
  changeEmail
);
userRouter.delete(
  "/delete",
  isAuth,
  [body("password").isString().trim().notEmpty().isLength({ min: 5 })],
  deleteUser
);

export default userRouter;
