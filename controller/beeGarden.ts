import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
import userCheck from "../helpers/userCheck";
import validationResoultCheck from "../helpers/validation-resoult-check";

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

    const checkedUser = await userCheck(userId);

    checkedUser.beeGarden!.xCordinate = xCordinate;
    checkedUser.beeGarden!.yCordinate = yCordinate;

    checkedUser.save();

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
    const checkedUser = await userCheck(userId);
    const userPopulated = await checkedUser.populate("beeGarden.beeHaves");
    const userPopulatedWithNotes = await userPopulated.populate(
      "beeGarden.beeHaves.notes"
    );
    res.status(200).json({
      message: `BeeGarden of user: ${checkedUser._id}`,
      data: userPopulatedWithNotes.beeGarden,
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

    const checkedUser = await userCheck(userId);

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
