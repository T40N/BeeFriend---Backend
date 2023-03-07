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
exports.deleteUser = exports.changeEmail = exports.changePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_catch_1 = __importDefault(require("../helpers/error-catch"));
const userCheck_1 = __importDefault(require("../helpers/userCheck"));
const magazyn_1 = __importDefault(require("../models/magazyn"));
const event_1 = __importDefault(require("../models/event"));
const beeHave_1 = __importDefault(require("../models/beeHave"));
const validation_resoult_check_1 = __importDefault(require("../helpers/validation-resoult-check"));
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const isPasswordCorrect = yield bcryptjs_1.default.compare(oldPassword, checkedUser.password);
        if (!isPasswordCorrect) {
            errorThrow(401, `Old password is not correct`);
        }
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        checkedUser.password = hashedNewPassword;
        yield checkedUser.save();
        res.status(201).json({
            message: "Password changed succesfully.",
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.changePassword = changePassword;
const changeEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldEmail, newEmail } = req.body;
    const userId = req.userId;
    try {
        (0, validation_resoult_check_1.default)(req);
        const checkedUser = yield (0, userCheck_1.default)(userId);
        if (oldEmail !== checkedUser.email) {
            errorThrow(401, `Old email is invalid.`);
        }
        checkedUser.email = newEmail;
        yield checkedUser.save();
        res.status(201).json({
            message: "Email changed succesfully.",
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.changeEmail = changeEmail;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password } = req.body;
    const userId = req.userId;
    try {
        (0, validation_resoult_check_1.default)(req);
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const isPasswordCorrect = bcryptjs_1.default.compare(password, checkedUser.password);
        if (!isPasswordCorrect) {
            errorThrow(401, `Password is not correct`);
        }
        yield magazyn_1.default.findByIdAndDelete(checkedUser.magazyn);
        checkedUser.calendar.forEach((eventId) => __awaiter(void 0, void 0, void 0, function* () {
            yield event_1.default.findByIdAndDelete(eventId);
        }));
        (_a = checkedUser.beeGarden) === null || _a === void 0 ? void 0 : _a.beeHaves.forEach((beeHaveId) => __awaiter(void 0, void 0, void 0, function* () {
            yield beeHave_1.default.findByIdAndDelete(beeHaveId);
        }));
        yield checkedUser.remove();
        res.status(200).json({
            message: "User and his data removed succesfully.",
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteUser = deleteUser;
