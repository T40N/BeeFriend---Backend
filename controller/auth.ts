import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";
import validationResoulteCheck from "../helpers/validation-resoult-check";
import config from "../config";
import errorCatch from "../helpers/error-catch";
import Magazyn from "../models/magazyn";

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
      errorThrow(401, `Password and Confirm password are not the same.`);
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const magazyn = new Magazyn({
      tools: [],
      fodder: [],
    });

    await magazyn.save();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      surname,
      magazyn,
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
    errorCatch(err, next);
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
      errorThrow(401, `User of email:${email} does not exists.`);
    }
    const checkedUser = user!;

    const isPasswordCorrect = await bcryptjs.compare(password, user!.password);

    if (!isPasswordCorrect) {
      errorThrow(401, `Password is not correct`);
    }

    const token = jwt.sign(
      {
        email: checkedUser.email,
        userId: checkedUser._id.toString(),
      },
      config.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({ token: token, userId: checkedUser._id.toString() });
  } catch (err) {
    errorCatch(err, next);
  }
};
