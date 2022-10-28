import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
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
    await beeHave.save();

    user.beeGarden!.beeHaves.push(beeHave._id);

    await user.save();

    res.status(200).json({
      message: "BeeHave created",
      data: beeHave,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getBeeHave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beeHaveId = req.params.beeHaveId;

  try {
    const beeHave = await BeeHave.findById(beeHaveId);

    if (!beeHave) {
      const error = new Error("Bee have of this Id does not exist.");
      error.status = 401;
      throw error;
    }

    res.status(200).json({
      message: "Bee have found",
      data: beeHave,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getBeeHaves = async (
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

    const beeHaves = user.beeGarden!.beeHaves;

    if (beeHaves.length === 0) {
      res.status(200).json({
        message: "User have no bee haves in bee garden yet.",
        data: beeHaves,
      });
    }

    res.status(200).json({
      message: "Bee haves succesfully retrived.",
      data: beeHaves,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const updateBeeHave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beeHaveId = req.params.beeHaveId;
  try {
    validationResoulteCheck(req);

    const name = req.body.name;
    const notes = req.body.notes;

    const beeHave = await BeeHave.findById(beeHaveId);

    if (!beeHave) {
      const error = new Error(`BeeHave of id: ${beeHave} not found.`);
      error.status = 401;
      throw error;
    }

    beeHave.name = name;
    beeHave.notes = notes;

    await beeHave.save();

    res.status(201).json({
      message: "BeeHave succesfully updated.",
      beeHave,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
