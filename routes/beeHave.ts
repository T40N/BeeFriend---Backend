import { Router } from "express";
import { body } from "express-validator";

import {
  addBeeHave,
  addData,
  deleteBeeHave,
  getBeeHave,
  getBeeHaves,
  updateBeeHave,
  setBeeHavePosition,
} from "../controller/beeHave";
import isAuth from "../middleware/is-auth";

const beeHaveRouter = Router();

beeHaveRouter.post(
  "/addBeeHave",
  isAuth,
  addBeeHave
);
beeHaveRouter.get("/getBeeHave/:beeHaveId", isAuth, getBeeHave);
beeHaveRouter.get("/getAllBeeHaves", isAuth, getBeeHaves);
beeHaveRouter.put(
  "/updateName/:beeHaveId",
  isAuth,
  [body("name").isString().notEmpty().trim().isLength({ min: 3 })],
  updateBeeHave
);
beeHaveRouter.put("/setPosition/:beeHaveId", isAuth, setBeeHavePosition);
beeHaveRouter.put(
  "/addData/:beeHaveId",
  isAuth,
  addData
);
beeHaveRouter.delete("/delete/:beeHaveId", isAuth, deleteBeeHave);

export default beeHaveRouter;
