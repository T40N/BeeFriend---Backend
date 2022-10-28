import { Router } from "express";
import { body } from "express-validator";

import {
  addBeeHave,
  addData,
  deleteBeeHave,
  getBeeHave,
  getBeeHaves,
  updateBeeHave,
} from "../controller/beeHave";
import isAuth from "../middleware/is-auth";

const beeHaveRouter = Router();

beeHaveRouter.post(
  "/addBeeHave",
  isAuth,
  [
    body("name").isString().notEmpty().trim().isLength({ min: 3 }),
    body("notes").isString().trim(),
  ],
  addBeeHave
);
beeHaveRouter.get("/getBeeHave/:beeHaveId", isAuth, getBeeHave);
beeHaveRouter.get("/getAllBeeHaves", isAuth, getBeeHaves);
beeHaveRouter.put(
  "/updateBeeHave/:beeHaveId",
  isAuth,
  [
    body("name").isString().notEmpty().trim().isLength({ min: 3 }),
    body("notes").isString().trim(),
  ],
  updateBeeHave
);
beeHaveRouter.post(
  "/addData/:beeHaveId",
  isAuth,
  [
    body("date").isString().trim().notEmpty(),
    body("honeyTaken").isNumeric().notEmpty(),
    body("waxTaken").isNumeric().notEmpty(),
  ],
  addData
);
beeHaveRouter.delete("/delete/:beeHaveId", isAuth, deleteBeeHave);

export default beeHaveRouter;
