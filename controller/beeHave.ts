import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
import validationResoultCheck from "../helpers/validation-resoult-check";
import { Types } from "mongoose";

import BeeHave from "../models/beeHave";
import User from "../models/user";
import userCheck from "../helpers/userCheck";

export const addBeeHave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const name = req.body.name;

  try {
    // validationResoultCheck(req);
    console.log(req.body);

    const checkedUser = await userCheck(userId);

    const beeHave = new BeeHave({
      name,
      honeyTakenAll: 0,
      waxTakenAll: 0,
      notes: [],
    });
    await beeHave.save();

    checkedUser.beeGarden!.beeHaves.push(beeHave._id);

    await checkedUser.save();

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
    const checkedUser = await userCheck(userId);

    const userPopulated = await checkedUser.populate("beeGarden.beeHaves");
    // console.log(checkedUser.beeGarden?.beeHaves);

    if (userPopulated!.beeGarden!.beeHaves.length === 0) {
      res.status(200).json({
        message: "User have no bee haves in bee garden yet.",
        data: userPopulated!.beeGarden!.beeHaves,
      });
    }

    res.status(200).json({
      message: "Bee haves succesfully retrived.",
      data: userPopulated!.beeGarden!.beeHaves,
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
    validationResoultCheck(req);

    const name = req.body.name;

    const beeHave = await BeeHave.findById(beeHaveId);

    if (!beeHave) {
      const error = new Error(`BeeHave of id: ${beeHave} not found.`);
      error.status = 401;
      throw error;
    }

    beeHave.name = name;

    await beeHave.save();

    res.status(201).json({
      message: "BeeHave succesfully updated.",
      beeHave,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const addData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beeHaveId = req.params.beeHaveId;

  try {
    // validationResoultCheck(req);
    console.log(req.body);

    const date = new Date(req.body.date);
    const honeyTaken = req.body.honeyTaken;
    const waxTaken = req.body.waxTaken;

    const newData = {
      date,
      honeyTaken,
      waxTaken,
    };

    const beeHave = await BeeHave.findById(beeHaveId);

    if (!beeHave) {
      errorThrow(401, `BeeHave of id:${beeHaveId} does not exists.`);
    }
    const checkedBeeHave = beeHave!;

    checkedBeeHave.honeyTakenAll = checkedBeeHave.honeyTakenAll + honeyTaken;
    checkedBeeHave.waxTakenAll = checkedBeeHave.waxTakenAll + waxTaken;
    checkedBeeHave.history!.push(newData);

    checkedBeeHave.save();

    res.status(201).json({
      message: "Data added.",
      data: checkedBeeHave.populate("history"),
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteBeeHave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beeHaveId = req.params.beeHaveId;
  const userId = req.userId;

  try {
    const checkedUser = await userCheck(userId);

    const filteredBeeGarden = checkedUser.beeGarden!.beeHaves.filter(
      (beeHave) => beeHave !== new Types.ObjectId(beeHaveId)
    );
    checkedUser.beeGarden!.beeHaves = filteredBeeGarden;

    await checkedUser.save();
    await BeeHave.findByIdAndDelete(beeHaveId);

    res.status(204).json({
      message: "BeeHave deleted.",
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const setBeeHavePosition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beeHaveId = req.params.beeHaveId;
  const newXPosition = req.body.xPosition;
  const newYPosition = req.body.yPosition;
  console.log(req);
  try {
    const beeHave = await BeeHave.findById(beeHaveId);

    if (!beeHave) {
      errorThrow(401, `BeeHave of id:${beeHaveId} does not exists.`);
    }

    const checkedBeeHave = beeHave!;
    checkedBeeHave.xPosition = newXPosition;
    checkedBeeHave.yPosition = newYPosition;

    checkedBeeHave.save();

    res.status(204).json({
      beeHave: checkedBeeHave,
      message: "BeeHave updated.",
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
