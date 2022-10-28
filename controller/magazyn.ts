import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
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

    if (!user) {
      const error = new Error("User does not exist.");
      error.status = 401;
      throw error;
    }

    const magazyn = user.magazyn;

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

    if (!user) {
      const error = new Error("User does not exist.");
      error.status = 401;
      throw error;
    }

    const magazyn = await Magazyn.findById(user.magazyn);

    if (!user) {
      const error = new Error("Magazyn does not exists.");
      error.status = 401;
      throw error;
    }

    const fodder = magazyn!.fodder;

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

    if (!user) {
      const error = new Error("User does not exist.");
      error.status = 401;
      throw error;
    }

    const magazyn = await Magazyn.findById(user.magazyn);

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
      const error = new Error("Magazyn does not exists.");
      error.status = 401;
      throw error;
    }

    const fodderToAdd = magazyn.fodder.filter((food) => food.name === name);
    if (fodderToAdd.length === 0) {
      magazyn.fodder.push({
        name,
        opis,
        quantity: 0,
      });
      await magazyn.save();
    } else {
      const fodderToAddIndex = magazyn.fodder.indexOf(fodderToAdd[0]);

      magazyn.fodder[fodderToAddIndex] = {
        name,
        opis,
        quantity: magazyn.fodder[fodderToAddIndex].quantity + 1,
      };
    }

    res.status(201).json({
      message: "Fodder added to magazyn.",
      data: magazyn.fodder,
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
      const error = new Error("Magazyn does not exists.");
      error.status = 401;
      throw error;
    }

    const toolsToAdd = magazyn.tools.filter((tool) => tool.name === name);
    if (toolsToAdd.length === 0) {
      magazyn.tools.push({
        name,
        opis,
        quantity: 0,
      });
      await magazyn.save();
    } else {
      const toolsToAddIndex = magazyn.tools.indexOf(toolsToAdd[0]);

      magazyn.tools[toolsToAddIndex] = {
        name,
        opis,
        quantity: magazyn.tools[toolsToAddIndex].quantity + 1,
      };
    }

    res.status(201).json({
      message: "Tools added to magazyn.",
      data: magazyn.fodder,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
