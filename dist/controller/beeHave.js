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
exports.setBeeHavePosition = exports.deleteBeeHave = exports.addData = exports.updateBeeHave = exports.getBeeHaves = exports.getBeeHave = exports.addBeeHave = void 0;
const error_catch_1 = __importDefault(require("../helpers/error-catch"));
const validation_resoult_check_1 = __importDefault(require("../helpers/validation-resoult-check"));
const mongoose_1 = require("mongoose");
const beeHave_1 = __importDefault(require("../models/beeHave"));
const userCheck_1 = __importDefault(require("../helpers/userCheck"));
const addBeeHave = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const name = req.body.name;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const beeHave = new beeHave_1.default({
            name,
            honeyTakenAll: 0,
            waxTakenAll: 0,
            notes: [],
        });
        yield beeHave.save();
        checkedUser.beeGarden.beeHaves.push(beeHave._id);
        yield checkedUser.save();
        res.status(200).json({
            message: "BeeHave created",
            data: beeHave,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.addBeeHave = addBeeHave;
const getBeeHave = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const beeHaveId = req.params.beeHaveId;
    try {
        const beeHave = yield beeHave_1.default.findById(beeHaveId);
        if (!beeHave) {
            const error = new Error("Bee have of this Id does not exist.");
            error.status = 401;
            throw error;
        }
        res.status(200).json({
            message: "Bee have found",
            data: beeHave,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getBeeHave = getBeeHave;
const getBeeHaves = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const userPopulated = yield checkedUser.populate("beeGarden.beeHaves");
        if (userPopulated.beeGarden.beeHaves.length === 0) {
            res.status(200).json({
                message: "User have no bee haves in bee garden yet.",
                data: userPopulated.beeGarden.beeHaves,
            });
        }
        res.status(200).json({
            message: "Bee haves succesfully retrived.",
            data: userPopulated.beeGarden.beeHaves,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getBeeHaves = getBeeHaves;
const updateBeeHave = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const beeHaveId = req.params.beeHaveId;
    try {
        (0, validation_resoult_check_1.default)(req);
        const name = req.body.name;
        const beeHave = yield beeHave_1.default.findById(beeHaveId);
        if (!beeHave) {
            const error = new Error(`BeeHave of id: ${beeHave} not found.`);
            error.status = 401;
            throw error;
        }
        beeHave.name = name;
        yield beeHave.save();
        res.status(201).json({
            message: "BeeHave succesfully updated.",
            beeHave,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.updateBeeHave = updateBeeHave;
const addData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const beeHaveId = req.params.beeHaveId;
    try {
        const date = new Date(req.body.date);
        const honeyTaken = req.body.honeyTaken;
        const waxTaken = req.body.waxTaken;
        const newData = {
            date,
            honeyTaken,
            waxTaken,
        };
        const beeHave = yield beeHave_1.default.findById(beeHaveId);
        if (!beeHave) {
            errorThrow(401, `BeeHave of id:${beeHaveId} does not exists.`);
        }
        const checkedBeeHave = beeHave;
        checkedBeeHave.honeyTakenAll = checkedBeeHave.honeyTakenAll + honeyTaken;
        checkedBeeHave.waxTakenAll = checkedBeeHave.waxTakenAll + waxTaken;
        checkedBeeHave.history.push(newData);
        checkedBeeHave.save();
        res.status(201).json({
            message: "Data added.",
            data: checkedBeeHave.populate("history"),
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.addData = addData;
const deleteBeeHave = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const beeHaveId = req.params.beeHaveId;
    const userId = req.userId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const filteredBeeGarden = checkedUser.beeGarden.beeHaves.filter((beeHave) => beeHave !== new mongoose_1.Types.ObjectId(beeHaveId));
        checkedUser.beeGarden.beeHaves = filteredBeeGarden;
        yield checkedUser.save();
        yield beeHave_1.default.findByIdAndDelete(beeHaveId);
        res.status(204).json({
            message: "BeeHave deleted.",
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteBeeHave = deleteBeeHave;
const setBeeHavePosition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const beeHaveId = req.params.beeHaveId;
    const newXPosition = req.body.xPosition;
    const newYPosition = req.body.yPosition;
    try {
        const beeHave = yield beeHave_1.default.findById(beeHaveId);
        if (!beeHave) {
            errorThrow(401, `BeeHave of id:${beeHaveId} does not exists.`);
        }
        const checkedBeeHave = beeHave;
        checkedBeeHave.xPosition = newXPosition;
        checkedBeeHave.yPosition = newYPosition;
        checkedBeeHave.save();
        res.status(204).json({
            beeHave: checkedBeeHave,
            message: "BeeHave updated.",
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.setBeeHavePosition = setBeeHavePosition;
