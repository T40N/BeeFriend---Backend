import { Router } from "express";
import { body } from "express-validator";
import {
  addFodder,
  addTools,
  getFodder,
  getMagazyn,
  getTools,
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
magazynRouter.get("/tools", isAuth, getTools);
magazynRouter.get("/fodder", isAuth, getFodder);
magazynRouter.get("/", isAuth, getMagazyn);

export default magazynRouter;
