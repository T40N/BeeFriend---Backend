import { Router } from "express";
import { body } from "express-validator";
import {
  addEvent,
  deleteEvent,
  getEvent,
  getEvents,
} from "../controller/event";
import isAuth from "../middleware/is-auth";

const eventRouter = Router();

eventRouter.post("/addEvent", isAuth, addEvent);
eventRouter.get("/:eventId", isAuth, getEvent);
eventRouter.get("/", isAuth, getEvents);
eventRouter.delete("/:eventId", isAuth, deleteEvent);

export default eventRouter;
