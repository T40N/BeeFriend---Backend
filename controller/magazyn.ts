import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
import userCheck from "../helpers/userCheck";
import validationResoultCheck from "../helpers/validation-resoult-check";
import Magazyn from "../models/magazyn";

import User from "../models/user";

export const getMagazyn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate("magazyn");

    const checkedUser = userCheck(user, userId);

    const magazyn = checkedUser.magazyn;

    res.status(200).json({
      message: "Magazyn retrived succesfully.",
      data: magazyn,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getFodder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    const checkedUser = userCheck(user, userId);

    const magazyn = await Magazyn.findById(checkedUser.magazyn);

    if (!magazyn) {
      errorThrow(401, "Magazyn does not exists.");
    }
    const checkedMagazyn = magazyn!;

    const fodder = checkedMagazyn.fodder;

    if (fodder.length === 0) {
      res.status(200).json({
        message: "Fodder is empty.",
        data: fodder,
      });
    }

    res.status(200).json({
      message: "Fodder retrived succefully",
      data: fodder,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getTools = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    const checkedUser = userCheck(user, userId);

    const magazyn = await Magazyn.findById(checkedUser.magazyn);

    if (!magazyn) {
      const error = new Error("Magazyn does not exists.");
      error.status = 401;
      throw error;
    }

    const tools = magazyn!.tools;

    if (tools.length === 0) {
      res.status(200).json({
        message: "Fodder is empty.",
        data: tools,
      });
    }

    res.status(200).json({
      message: "Fodder retrived succefully",
      data: tools,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const addFodder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    validationResoultCheck(req);

    const name = req.body.name;
    const opis = req.body.opis;

    const magazyn = await Magazyn.findById(userId);

    if (!magazyn) {
      errorThrow(401, "Magazyn does not exists");
    }
    const checkedMagazyn = magazyn!;

    const fodderToAdd = checkedMagazyn.fodder.filter(
      (food) => food.name === name
    );
    if (fodderToAdd.length === 0) {
      checkedMagazyn.fodder.push({
        name,
        opis,
        quantity: 0,
      });
      await checkedMagazyn.save();
    } else {
      const fodderToAddIndex = checkedMagazyn.fodder.indexOf(fodderToAdd[0]);

      checkedMagazyn.fodder[fodderToAddIndex] = {
        name,
        opis,
        quantity: checkedMagazyn.fodder[fodderToAddIndex].quantity + 1,
      };
    }

    res.status(201).json({
      message: "Fodder added to magazyn.",
      data: checkedMagazyn.fodder,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const addTools = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    validationResoultCheck(req);

    const name = req.body.name;
    const opis = req.body.opis;

    const magazyn = await Magazyn.findById(userId);

    if (!magazyn) {
      errorThrow(401, "Magazyn does not exists.");
    }
    const checkedMagazyn = magazyn!;

    const toolsToAdd = checkedMagazyn.tools.filter(
      (tool) => tool.name === name
    );
    if (toolsToAdd.length === 0) {
      checkedMagazyn.tools.push({
        name,
        opis,
        quantity: 0,
      });
      await checkedMagazyn.save();
    } else {
      const toolsToAddIndex = checkedMagazyn.tools.indexOf(toolsToAdd[0]);

      checkedMagazyn.tools[toolsToAddIndex] = {
        name,
        opis,
        quantity: checkedMagazyn.tools[toolsToAddIndex].quantity + 1,
      };
    }

    res.status(201).json({
      message: "Tools added to magazyn.",
      data: checkedMagazyn.fodder,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
