import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";

import errorCatch from "../helpers/error-catch";
import userCheck from "../helpers/userCheck";
import Magazyn from "../models/magazyn";
import Event from "../models/event";
import BeeHave from "../models/beeHave";
import validationResoultCheck from "../helpers/validation-resoult-check";

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;

  try {
    validationResoultCheck(req);
    const checkedUser = await userCheck(userId);

    const isPasswordCorrect = await bcryptjs.compare(
      oldPassword,
      checkedUser.password
    );

    if (!isPasswordCorrect) {
      errorThrow(401, `Old password is not correct`);
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 12);

    checkedUser.password = hashedNewPassword;
    await checkedUser.save();

    res.status(201).json({
      message: "Password changed succesfully.",
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const changeEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldEmail, newEmail } = req.body;
  const userId = req.userId;

  try {
    validationResoultCheck(req);
    const checkedUser = await userCheck(userId);

    if (oldEmail !== checkedUser.email) {
      errorThrow(401, `Old email is invalid.`);
    }

    checkedUser.email = newEmail;
    await checkedUser.save();

    res.status(201).json({
      message: "Email changed succesfully.",
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const userId = req.userId;

  try {
    validationResoultCheck(req);

    const checkedUser = await userCheck(userId);

    const isPasswordCorrect = bcryptjs.compare(password, checkedUser.password);
    if (!isPasswordCorrect) {
      errorThrow(401, `Password is not correct`);
    }

    await Magazyn.findByIdAndDelete(checkedUser.magazyn);

    checkedUser.calendar.forEach(async (eventId) => {
      await Event.findByIdAndDelete(eventId);
    });

    checkedUser.beeGarden?.beeHaves.forEach(async (beeHaveId) => {
      await BeeHave.findByIdAndDelete(beeHaveId);
    });

    await checkedUser.remove();

    res.status(200).json({
      message: "User and his data removed succesfully.",
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
