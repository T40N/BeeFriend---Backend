import { Router } from "express";
import { body } from "express-validator";
import {
  addFodder,
  getAllFodder,
  getMagazyn,
  getAllTools,
  addTools,
  deleteFodder,
  deleteFullFodder,
  deleteTool,
  deleteFullTools,
} from "../controller/magazyn";

import isAuth from "../middleware/is-auth";

const magazynRouter = Router();

magazynRouter.post("/addFodder", isAuth, addFodder);
magazynRouter.post("/addTools", isAuth, addTools);
magazynRouter.delete("/deleteFodder/:fodderId", isAuth, deleteFodder);
magazynRouter.delete("/deleteFullFodder/:fodderId", isAuth, deleteFullFodder);
magazynRouter.delete("/deleteTool/:fodderId", isAuth, deleteTool);
magazynRouter.delete("/deleteFullTools/:fodderId", isAuth, deleteFullTools);
magazynRouter.get("/tools", isAuth, getAllFodder);
magazynRouter.get("/fodder", isAuth, getAllTools);
magazynRouter.get("/", isAuth, getMagazyn);

export default magazynRouter;
