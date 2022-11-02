import e, { Request, Response, NextFunction } from "express";
import { Document, Types, Model } from "mongoose";
import errorCatch from "../helpers/error-catch";
import userCheck from "../helpers/userCheck";
import validationResoultCheck from "../helpers/validation-resoult-check";
import { Tools, Fodder, IMagazynItems } from "../models/magazynItems";
import Magazyn, { IMagazyn } from "../models/magazyn";

type ItemModel = Model<IMagazynItems, {}, {}, {}, any>;

type MagazynDocument =
  | (Document<unknown, any, IMagazyn> &
      IMagazyn & {
        _id: Types.ObjectId;
      })
  | null;

const addItem = async (
  name: string,
  opis: string,
  ItemModel: ItemModel,
  magazynDocument: MagazynDocument,
  magazynItemName: "fodder" | "tools"
) => {
  let item = await ItemModel.findOne({ name });
  if (item) {
    const isOwnerOfFodder = magazynDocument![magazynItemName].includes(
      item._id
    );
    if (!isOwnerOfFodder) errorThrow(401, `User is not owner of item: ${name}`);

    item.quantity++;
  } else {
    item = new ItemModel({
      name,
      opis,
      quantity: 1,
    });
    magazynDocument!.fodder.push(item._id);
  }

  magazynDocument!.save();
  item.save();
  return item;
};

const findMagazyn = async (magazynId: Types.ObjectId) => {
  const magazyn = await Magazyn.findById(magazynId);

  if (!magazyn) {
    errorThrow(401, "Magazyn does not exists");
  }
  return magazyn!;
};

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

    const user = await userCheck(userId);

    const magazyn = await findMagazyn(user.magazyn);

    const fodder = await addItem(name, opis, Fodder, magazyn, "fodder");

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

    const user = await userCheck(userId);

    const magazyn = await findMagazyn(user.magazyn);

    const tools = await addItem(name, opis, Fodder, magazyn, "tools");

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
) => {
  const userId = req.userId;
  const fodderId = req.params.fodderId;
  try {
    const user = await userCheck(userId);
    const magazyn = await findMagazyn(user.magazyn);
    const fodder = await Fodder.findById(fodderId);

    if (!fodder) {
      errorThrow(401, `Fodder of id:${fodderId} not found`);
    }
    const checkedFodder = fodder!;

    const isOwnerOfFodder = magazyn.fodder.includes(checkedFodder._id);

    if (!isOwnerOfFodder) {
      errorThrow(
        401,
        `User of id:${userId} is not owner of food item of id:${fodderId}`
      );
    }

    if (checkedFodder.quantity > 1) {
      checkedFodder.quantity = checkedFodder.quantity - 1;
      await magazyn.save();

      res.status(200).json({
        message: `Fodder of id:${fodderId} deleted`,
      });
    } else {
      const fodderFiltered = magazyn.fodder.filter((savedFodderId) => {
        return savedFodderId.toString() !== fodderId;
      });
      await checkedFodder.remove();
      magazyn.fodder = fodderFiltered;
      await magazyn.save();

      res.status(200).json({
        message: `Fodder of id:${fodderId} deleted`,
      });
    }
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteFullFodder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const fodderId = req.params.fodderId;
  try {
    const user = await userCheck(userId);
    const magazyn = await findMagazyn(user.magazyn);
    const fodder = await Fodder.findById(fodderId);

    if (!fodder) {
      errorThrow(401, `Fodder of id:${fodderId} not found`);
    }
    const checkedFodder = fodder!;

    const isOwnerOfFodder = magazyn.fodder.includes(checkedFodder._id);

    if (!isOwnerOfFodder) {
      errorThrow(
        401,
        `User of id:${userId} is not owner of food item of id:${fodderId}`
      );
    }

    const fodderFiltered = magazyn.fodder.filter((savedFodderId) => {
      return savedFodderId.toString() !== fodderId;
    });
    await checkedFodder.remove();
    magazyn.fodder = fodderFiltered;
    await magazyn.save();

    res.status(200).json({
      message: `Fodder of id:${fodderId} deleted`,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteTool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const fodderId = req.params.fodderId;
  try {
    const user = await userCheck(userId);
    const magazyn = await findMagazyn(user.magazyn);
    const tools = await Tools.findById(fodderId);

    if (!tools) {
      errorThrow(401, `Fodder of id:${fodderId} not found`);
    }
    const checkedTools = tools!;

    const isOwnerOfFodder = magazyn.fodder.includes(checkedTools._id);

    if (!isOwnerOfFodder) {
      errorThrow(
        401,
        `User of id:${userId} is not owner of food item of id:${fodderId}`
      );
    }

    if (checkedTools.quantity > 1) {
      checkedTools.quantity = checkedTools.quantity - 1;
      await magazyn.save();

      res.status(200).json({
        message: `Fodder of id:${fodderId} deleted`,
      });
    } else {
      const fodderFiltered = magazyn.fodder.filter((savedFodderId) => {
        return savedFodderId.toString() !== fodderId;
      });
      await checkedTools.remove();
      magazyn.fodder = fodderFiltered;
      await magazyn.save();

      res.status(200).json({
        message: `Fodder of id:${fodderId} deleted`,
      });
    }
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteFullTools = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const toolsId = req.params.toolsId;
  try {
    const user = await userCheck(userId);
    const magazyn = await findMagazyn(user.magazyn);
    const tools = await Tools.findById(toolsId);

    if (!tools) {
      errorThrow(401, `Fodder of id:${toolsId} not found`);
    }
    const checkedTools = tools!;

    const isOwnerOfFodder = magazyn.fodder.includes(checkedTools._id);

    if (!isOwnerOfFodder) {
      errorThrow(
        401,
        `User of id:${userId} is not owner of food item of id:${toolsId}`
      );
    }

    const toolsFiltered = magazyn.fodder.filter((savedFodderId) => {
      return savedFodderId.toString() !== toolsId;
    });
    await checkedTools.remove();
    magazyn.fodder = toolsFiltered;
    await magazyn.save();

    res.status(200).json({
      message: `Fodder of id:${toolsId} deleted`,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
