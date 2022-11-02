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

magazynRouter.post(
  "/addFodder",
  isAuth,
  [
    body("name").isString().trim().notEmpty().isLength({ min: 5 }),
    body("opis").isString().trim().notEmpty().isLength({ min: 5 }),
  ],
  addFodder
);
magazynRouter.post(
  "/addTools",
  isAuth,
  [
    body("name").isString().trim().notEmpty().isLength({ min: 5 }),
    body("opis").isString().trim().notEmpty().isLength({ min: 5 }),
  ],
  addTools
);
magazynRouter.delete("/deleteFodder/:fodderId", isAuth, deleteFodder);
magazynRouter.delete("/deleteFullFodder/:fodderId", isAuth, deleteFullFodder);
magazynRouter.delete("/deleteTool/:toolsId", isAuth, deleteTool);
magazynRouter.delete("/deleteFullTools/:toolsId", isAuth, deleteFullTools);
magazynRouter.get("/tools", isAuth, getAllFodder);
magazynRouter.get("/fodder", isAuth, getAllTools);
magazynRouter.get("/", isAuth, getMagazyn);

export default magazynRouter;
