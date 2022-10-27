import { Request, Response, NextFunction, Router } from "express";
import validationResoulteCheck from "../helpers/validation-resoult-check";
import BeeHave from "../models/beeHave";
import User from "../models/user";

export const addBeeHave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const name = req.body.name;
  const notes = req.body.notes || "";

  try {
    validationResoulteCheck(req);

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User does not exist.");
      error.status = 401;
      throw error;
    }

    const beeHave = new BeeHave({
      name,
      honeyTakenAll: 0,
      waxTakenAll: 0,
      notes,
    });
    beeHave.save();

    user.beeGarden!.beeHaves.push(beeHave._id);

    res.status(200).json({
      message: "BeeHave created",
      data: beeHave,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (!err.status) err.status = 500;
      next(err);
    }
  }
};
