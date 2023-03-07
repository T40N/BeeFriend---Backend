"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const beeHave_1 = require("../controller/beeHave");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const beeHaveRouter = (0, express_1.Router)();
beeHaveRouter.post("/addBeeHave", is_auth_1.default, beeHave_1.addBeeHave);
beeHaveRouter.get("/getBeeHave/:beeHaveId", is_auth_1.default, beeHave_1.getBeeHave);
beeHaveRouter.get("/getAllBeeHaves", is_auth_1.default, beeHave_1.getBeeHaves);
beeHaveRouter.put("/updateName/:beeHaveId", is_auth_1.default, [(0, express_validator_1.body)("name").isString().notEmpty().trim().isLength({ min: 3 })], beeHave_1.updateBeeHave);
beeHaveRouter.put("/setPosition/:beeHaveId", is_auth_1.default, beeHave_1.setBeeHavePosition);
beeHaveRouter.put("/addData/:beeHaveId", is_auth_1.default, beeHave_1.addData);
beeHaveRouter.delete("/delete/:beeHaveId", is_auth_1.default, beeHave_1.deleteBeeHave);
exports.default = beeHaveRouter;
