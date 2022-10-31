import e, { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
import userCheck from "../helpers/userCheck";
import validationResoultCheck from "../helpers/validation-resoult-check";
import Fodder from "../models/fodder";
import Magazyn from "../models/magazyn";
import Tools from "../models/tools";

export const getMagazyn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const checkedUser = await userCheck(userId);

    const magazyn = await Magazyn.findById(checkedUser.magazyn)
      .populate("fodder")
      .populate("tools");

    res.status(200).json({
      message: "Magazyn retrived succesfully.",
      data: magazyn,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getAllFodder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const checkedUser = await userCheck(userId);

    const magazyn = await Magazyn.findById(checkedUser.magazyn).populate(
      "fodder"
    );

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

export const getAllTools = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const checkedUser = await userCheck(userId);

    const magazyn = await Magazyn.findById(checkedUser.magazyn).populate(
      "tools"
    );

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

    let fodder = await Fodder.findOne({ name });
    if (fodder) {
      const isOwnerOfFodder = checkedMagazyn.fodder.includes(fodder._id);
      if (!isOwnerOfFodder)
        errorThrow(401, `User of id:${userId} is not owner of fooder: ${name}`);

      fodder.quantity++;
      fodder.save();
    } else {
      fodder = new Fodder({
        name,
        opis,
        quantity: 0,
      });
    }

    res.status(201).json({
      message: "Fodder added to magazyn.",
      data: fodder,
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

    let tools = await Tools.findOne({ name });
    if (tools) {
      const isOwnerOfFodder = checkedMagazyn.fodder.includes(fodder._id);
      if (!isOwnerOfFodder)
        errorThrow(401, `User of id:${userId} is not owner of fooder: ${name}`);

      tools.quantity++;
      tools.save();
    } else {
      tools = new Tools({
        name,
        opis,
        quantity: 0,
      });
    }

    res.status(201).json({
      message: "Tools added to magazyn.",
      data: tools,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteFodder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

//TODO refactor need to think about it.
// const addItem = (name: string, opis: string) => {};
