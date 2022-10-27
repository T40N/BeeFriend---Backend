import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";
import validationResoulteCheck from "../helpers/validation-resoult-check";
import config from "../config";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationResoulteCheck(req);

    const email = req.body.email;
    const name = req.body.name;
    const surname = req.body.surname;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      const error = new Error(
        "Password and ConfirmPassword should be the same"
      );
      error.status = 422;
      throw error;
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      surname,
    });
    await user.save();

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      config.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({ message: "User created!", userId: user._id, token });
  } catch (err) {
    if (err instanceof Error) {
      if (!err.status) err.status = 500;
      next(err);
    }
  }
};

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationResoulteCheck(req);

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("A user with this email could not be found");
      error.status = 401;
      throw error;
    }

    const isEqual = await bcryptjs.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      config.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    if (err instanceof Error) {
      if (!err.status) err.status = 500;
      next(err);
    }
  }
};
