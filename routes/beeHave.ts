import { Router } from "express";
import { body } from "express-validator";
import { addBeeHave, getBeeHave, updateBeeHave } from "../controller/beeHave";
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
beeHaveRouter.get("/getAllBeeHaves", isAuth);
beeHaveRouter.put("/updateBeeHave/:beeHaveId", isAuth, [
  body("name").isString().notEmpty().trim().isLength({ min: 3 }),
  body("notes").isString().trim(),
],
updateBeeHave
);

export default beeHaveRouter;
