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
exports.changeCordinates = exports.getBeeGarden = exports.addBeeGarden = void 0;
const error_catch_1 = __importDefault(require("../helpers/error-catch"));
const userCheck_1 = __importDefault(require("../helpers/userCheck"));
const validation_resoult_check_1 = __importDefault(require("../helpers/validation-resoult-check"));
const addBeeGarden = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validation_resoult_check_1.default)(req);
        const userId = req.userId;
        const xCordinate = req.body.xCordinate;
        const yCordinate = req.body.yCordinate;
        const checkedUser = yield (0, userCheck_1.default)(userId);
        checkedUser.beeGarden.xCordinate = xCordinate;
        checkedUser.beeGarden.yCordinate = yCordinate;
        checkedUser.save();
        res.status(201).json({
            message: "BeeGarden created",
            data: checkedUser.beeGarden,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.addBeeGarden = addBeeGarden;
const getBeeGarden = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const userPopulated = yield checkedUser.populate("beeGarden.beeHaves");
        const userPopulatedWithNotes = yield userPopulated.populate("beeGarden.beeHaves.notes");
        res.status(200).json({
            message: `BeeGarden of user: ${checkedUser._id}`,
            data: userPopulatedWithNotes.beeGarden,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getBeeGarden = getBeeGarden;
const changeCordinates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        (0, validation_resoult_check_1.default)(req);
        const xCordinate = req.body.xCordinate;
        const yCordinate = req.body.yCordinate;
        const checkedUser = yield (0, userCheck_1.default)(userId);
        checkedUser.beeGarden.xCordinate = xCordinate;
        checkedUser.beeGarden.yCordinate = yCordinate;
        checkedUser.save();
        res.status(201).json({
            message: "Cordinates succesfully updated",
            data: checkedUser.beeGarden,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.changeCordinates = changeCordinates;
