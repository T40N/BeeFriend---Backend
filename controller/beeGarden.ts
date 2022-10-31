import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
import userCheck from "../helpers/userCheck";
import validationResoultCheck from "../helpers/validation-resoult-check";

import User from "../models/user";

export const addBeeGarden = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationResoultCheck(req);

    const userId = req.userId;

    const xCordinate = req.body.xCordinate;
    const yCordinate = req.body.yCordinate;

    const user = await User.findById(userId);

    const checkedUser = userCheck(user, userId);

    checkedUser.beeGarden!.xCordinate = xCordinate;
    checkedUser.beeGarden!.yCordinate = yCordinate;

    user!.save();

    res.status(201).json({
      message: "BeeGarden created",
      data: checkedUser.beeGarden,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getBeeGarden = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    const checkedUser = userCheck(user, userId);

    res.status(200).json({
      message: `BeeGarden of user: ${checkedUser._id}`,
      data: checkedUser.beeGarden,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const changeCordinates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    validationResoultCheck(req);

    const xCordinate = req.body.xCordinate;
    const yCordinate = req.body.yCordinate;

    const user = await User.findById(userId);

    const checkedUser = userCheck(user, userId);

    checkedUser.beeGarden!.xCordinate = xCordinate;
    checkedUser.beeGarden!.yCordinate = yCordinate;
    checkedUser.save();

    res.status(201).json({
      message: "Cordinates succesfully updated",
      data: checkedUser.beeGarden,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
