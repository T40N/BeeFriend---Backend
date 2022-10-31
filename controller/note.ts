import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
import validationResoultCheck from "../helpers/validation-resoult-check";
import { Types } from "mongoose";

import User from "../models/user";
import BeeHave from "../models/beeHave";
import Note from "../models/note";
import userCheck from "../helpers/userCheck";

export const addNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const beeHaveId = req.params.beeHaveId;

  try {
    validationResoultCheck(req);
    const { title, content } = req.body;

    const checkedUser = await userCheck(userId);

    const isOwnerOfBeeHave = checkedUser.beeGarden!.beeHaves.includes(
      new Types.ObjectId(beeHaveId)
    );

    if (!isOwnerOfBeeHave) {
      errorThrow(
        401,
        `User of id:${userId} is not owner of beeHave of id:${beeHaveId}.`
      );
    }

    const beeHave = await BeeHave.findById(beeHaveId);

    if (!beeHave) {
      errorThrow(401, `BeeHave of id:${beeHaveId} not found`);
    }

    const note = new Note({
      title,
      content,
    });
    await note.save();

    beeHave!.notes!.push(note._id);
    await beeHave?.save();

    res.status(201).json({
      message: "Note added successfully.",
      data: beeHave?.notes,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      errorThrow(401, `Note of id:${noteId}`);
    }

    res.status(200).json({
      message: "Note retrived successfully.",
      data: note,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const beeHaveId = req.params.beeHaveId;

  try {
    const beeHave = await BeeHave.findById(beeHaveId);

    if (!beeHave) {
      errorThrow(401, `BeeHave of id:${beeHaveId} does not exists.`);
    }

    res.status(200).json({
      message: "Notes retrived succesfully.",
      data: beeHave!.notes,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.noteId;

  try {
    validationResoultCheck(req);

    const { title, content } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      errorThrow(401, `Note of id:${noteId} does not exists.`);
    }

    note!.title = title;
    note!.content = content;
    await note!.save();

    res.status(201).json({
      message: "Note updated succesfully.",
      data: note,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      errorThrow(401, `Note of id:${noteId} does not exists.`);
    }

    res.status(201).json({
      message: "Note deleted successfully.",
      data: note,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
