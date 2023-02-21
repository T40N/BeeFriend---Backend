import { Router } from "express";

import {
  addNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "../controller/note";

import isAuth from "../middleware/is-auth";

const noteRouter = Router();

noteRouter.post("/addNote/:beeHaveId", isAuth, addNote);
noteRouter.get("/getNote/:noteId", isAuth, getNote);
noteRouter.get("/getNotes/:beeHaveId", isAuth, getNotes);
noteRouter.put("/updateNote/:noteId", isAuth, updateNote);
noteRouter.delete("/deleteNote/:noteId", isAuth, deleteNote);

export default noteRouter;
