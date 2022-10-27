import { Router } from "express";
import { body } from "express-validator";
import { addBeeGarden, getBeeGarden } from "../controller/beeGarden";

import isAuth from "../middleware/is-auth";

const beeGardenRouter = Router();

beeGardenRouter.post(
  "/addBeeGarden",
  isAuth,
  [
    body("xCordinate").isNumeric().notEmpty(),
    body("yCordinate").isNumeric().notEmpty(),
  ],
  addBeeGarden
);
beeGardenRouter.get("/beeGarden", isAuth, getBeeGarden);

export default beeGardenRouter;
