import { Router } from "express";
import { body } from "express-validator";

import { logIn, signUp } from "../controller/auth";
import User from "../models/user";

const authRouter = Router();

authRouter.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("confirmPassword").trim().isLength({ min: 5 }),
    body("name").trim().notEmpty(),
    body("surname").trim().notEmpty(),
  ],
  signUp
);

authRouter.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  logIn
);

export default authRouter;
