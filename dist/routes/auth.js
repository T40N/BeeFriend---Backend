"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controller/auth");
const user_1 = __importDefault(require("../models/user"));
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
        return user_1.default.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject("Email address already exists!");
            }
        });
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("confirmPassword").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("name").trim().notEmpty(),
    (0, express_validator_1.body)("surname").trim().notEmpty(),
], auth_1.signUp);
authRouter.post("/login", [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),
    (0, express_validator_1.body)("password").trim().isLength({ min: 5 }),
], auth_1.logIn);
exports.default = authRouter;
