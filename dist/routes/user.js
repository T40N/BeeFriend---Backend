"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_1 = require("../controller/user");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const userRouter = (0, express_1.Router)();
userRouter.put("/changepassword", is_auth_1.default, user_1.changePassword);
userRouter.put("/changeemail", is_auth_1.default, user_1.changeEmail);
userRouter.delete("/delete", is_auth_1.default, [(0, express_validator_1.body)("password").isString().trim().notEmpty().isLength({ min: 5 })], user_1.deleteUser);
exports.default = userRouter;
