"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const validation_resoult_check_1 = __importDefault(require("../helpers/validation-resoult-check"));
const config_1 = __importDefault(require("../config"));
const error_catch_1 = __importDefault(require("../helpers/error-catch"));
const magazyn_1 = __importDefault(require("../models/magazyn"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validation_resoult_check_1.default)(req);
        const email = req.body.email;
        const name = req.body.name;
        const surname = req.body.surname;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password !== confirmPassword) {
            errorThrow(401, `Password and Confirm password are not the same.`);
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const magazyn = new magazyn_1.default({
            tools: [],
            fodder: [],
        });
        yield magazyn.save();
        const user = new user_1.default({
            email,
            password: hashedPassword,
            name,
            surname,
            magazyn,
        });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id.toString(),
        }, config_1.default.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.status(201).json({
            message: "User created!",
            userId: user._id,
            token,
            email: user.email,
            name: user.name,
            surname: email.surname,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.signUp = signUp;
const logIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validation_resoult_check_1.default)(req);
        const email = req.body.email;
        const password = req.body.password;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            errorThrow(401, `User of email:${email} does not exists.`);
        }
        const checkedUser = user;
        const userWithCalendar = yield checkedUser.populate("calendar");
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            errorThrow(401, `Password is not correct`);
        }
        const token = jsonwebtoken_1.default.sign({
            email: checkedUser.email,
            userId: checkedUser._id.toString(),
        }, config_1.default.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.status(200).json({
            token: token,
            userId: checkedUser._id.toString(),
            name: checkedUser.name,
            surname: checkedUser.surname,
            email: checkedUser.email,
            calendar: userWithCalendar.calendar,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.logIn = logIn;
