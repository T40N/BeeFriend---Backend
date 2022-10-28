import { Request, Response, NextFunction } from "express";
import errorCatch from "../helpers/error-catch";
import validationResoulteCheck from "../helpers/validation-resoult-check";

import Event from "../models/event";
import User from "../models/user";

export const addEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    validationResoulteCheck(req);

    const date = new Date(req.body.date);
    const name = req.body.name;
    const opis = req.body.opis;

    const event = new Event({
      date,
      name,
      opis,
    });
    await event.save();

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User does not exist.");
      error.status = 401;
      throw error;
    }

    user.calendar.push(event._id);
    await user.save();

    res.status(200).json({
      message: "Event added to calendar",
      data: event,
      calendar: user.calendar,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error(`Event of id:${eventId} not found.`);
      error.status = 401;
      throw error;
    }

    res.status(200).json({
      message: "Event retrived succesfully.",
      data: event,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate("calendar");

    if (!user) {
      const error = new Error(`User not found.`);
      error.status = 401;
      throw error;
    }

    const { calendar } = user;

    res.status(200).json({
      messange: "All events from calendar retrived succesfully.",
      data: calendar,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
