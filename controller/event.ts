import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import errorCatch from "../helpers/error-catch";
import userCheck from "../helpers/userCheck";
import validationResoulteCheck from "../helpers/validation-resoult-check";

import Event from "../models/event";

export const getCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const checkedUser = await userCheck(userId);
    const userWithCalendar = await checkedUser.populate("calendar");

    res.status(200).json({
      message: "Calendar retrived",
      data: userWithCalendar.calendar,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const addEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const date = new Date(req.body.date);
    const name = req.body.name;
    const opis = req.body.opis;

    const event = new Event({
      date,
      name,
      opis,
    });
    await event.save();

    const checkedUser = await userCheck(userId);

    checkedUser.calendar.push(event._id);
    await checkedUser.save();

    res.status(200).json({
      message: "Event added to calendar",
      data: event,
      calendar: checkedUser.calendar,
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
      errorThrow(401, `Event of id:${eventId} does not exists.`);
    }
    const checkedEvent = event!;

    res.status(200).json({
      message: "Event retrived succesfully.",
      data: checkedEvent,
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
    const checkedUser = await (await userCheck(userId)).populate("calendar");
    const { calendar } = checkedUser;

    res.status(200).json({
      messange: "All events from calendar retrived succesfully.",
      data: calendar,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const eventId = req.params.eventId;

  try {
    const checkedUser = await userCheck(userId);

    const filteredCalendar = checkedUser.calendar.filter(
      (event) => event !== new Types.ObjectId(eventId)
    );

    if (filteredCalendar.length === 0) {
      errorThrow(
        401,
        `Event of id: ${eventId} does not exists, or this event is not owned by user of id:${userId}.`
      );
    }

    checkedUser.calendar = filteredCalendar;
    await checkedUser.save();
    await Event.findByIdAndDelete(eventId);

    res.status(204).json({
      message: "Event succesfully created.",
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = req.params.eventId;
  const userId = req.userId;

  try {
    validationResoulteCheck(req);

    const name = req.body.name;
    const date = new Date(req.body.name);
    const opis = req.body.opis;

    const checkedUser = await userCheck(userId);

    const eventIndex = checkedUser.calendar.indexOf(
      new Types.ObjectId(eventId)
    );
    if (eventIndex === -1) {
      errorThrow(
        401,
        `Event of id:${eventId} does not exists or user of id:${userId} is not owner of this event`
      );
    }

    const event = await Event.findByIdAndUpdate(eventId, {
      name,
      date,
      opis,
    });

    res.status(201).json({
      message: "Event updated succesfully",
      event,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};
