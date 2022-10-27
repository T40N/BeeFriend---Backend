import { Request, Response, NextFunction } from "express";
import validationResoulteCheck from "../helpers/validation-resoult-check";

import User from "../models/user";

export const addBeeGarden = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationResoulteCheck(req);

    const userId = req.userId;

    const xCordinate = req.body.xCordinate;
    const yCordinate = req.body.yCordinate;

    const user = await User.findById(userId);

    console.log(user);

    if (!user) {
      const error = new Error("User does not exist.");
      error.status = 401;
      throw error;
    }

    user.beeGarden!.xCordinate = xCordinate;
    user.beeGarden!.yCordinate = yCordinate;

    user!.save();

    res.status(201).json({
      message: "BeeGarden created",
      data: user.beeGarden,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (!err.status) err.status = 500;
      next(err);
    }
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

    if (!user) {
      const error = new Error("User does not exist.");
      error.status = 401;
      throw error;
    }

    res.status(200).json({
      message: `BeeGarden of user: ${user._id}`,
      data: user.beeGarden,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (!err.status) err.status = 500;
      next(err);
    }
  }
};
