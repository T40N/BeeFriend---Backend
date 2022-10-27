import { Router } from "express";
import { body } from "express-validator";
import { addBeeHave } from "../controller/beeHave";
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
beeHaveRouter.get("/getBeeHave/:beeHaveId", isAuth);
beeHaveRouter.get("/getAllBeeHaves", isAuth);

export default beeHaveRouter;
