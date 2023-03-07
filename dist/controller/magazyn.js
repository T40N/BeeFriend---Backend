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
exports.deleteFullTools = exports.deleteTool = exports.deleteFullFodder = exports.deleteFodder = exports.addTools = exports.addFodder = exports.getAllTools = exports.getAllFodder = exports.getMagazyn = void 0;
const error_catch_1 = __importDefault(require("../helpers/error-catch"));
const userCheck_1 = __importDefault(require("../helpers/userCheck"));
const magazynItems_1 = require("../models/magazynItems");
const magazyn_1 = __importDefault(require("../models/magazyn"));
const addItem = (name, opis, ItemModel, magazynDocument, magazynItemName, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    let item = yield ItemModel.findOne({ name });
    if (item) {
        const isOwnerOfFodder = magazynDocument[magazynItemName].includes(item._id);
        if (!isOwnerOfFodder)
            errorThrow(401, `User is not owner of item: ${name}`);
        item.quantity += quantity || 1;
    }
    else {
        item = new ItemModel({
            name,
            opis,
            quantity: quantity || 1,
        });
        if (ItemModel === magazynItems_1.Fodder)
            magazynDocument.fodder.push(item._id);
        if (ItemModel === magazynItems_1.Tools)
            magazynDocument.tools.push(item._id);
    }
    magazynDocument.save();
    item.save();
    return item;
});
const findMagazyn = (magazynId) => __awaiter(void 0, void 0, void 0, function* () {
    const magazyn = yield magazyn_1.default.findById(magazynId);
    if (!magazyn) {
        errorThrow(401, "Magazyn does not exists");
    }
    return magazyn;
});
const getMagazyn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const magazyn = yield magazyn_1.default.findById(checkedUser.magazyn).populate("fodder");
        const magazynWithTools = yield (magazyn === null || magazyn === void 0 ? void 0 : magazyn.populate("tools"));
        res.status(200).json({
            message: "Magazyn retrived succesfully.",
            data: magazynWithTools,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getMagazyn = getMagazyn;
const getAllFodder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const magazyn = yield magazyn_1.default.findById(checkedUser.magazyn).populate("fodder");
        if (!magazyn) {
            errorThrow(401, "Magazyn does not exists.");
        }
        const checkedMagazyn = magazyn;
        const fodder = checkedMagazyn.fodder;
        if (fodder.length === 0) {
            res.status(200).json({
                message: "Fodder is empty.",
                data: fodder,
            });
        }
        res.status(200).json({
            message: "Fodder retrived succefully",
            data: fodder,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getAllFodder = getAllFodder;
const getAllTools = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const magazyn = yield magazyn_1.default.findById(checkedUser.magazyn).populate("tools");
        if (!magazyn) {
            const error = new Error("Magazyn does not exists.");
            error.status = 401;
            throw error;
        }
        const tools = magazyn.tools;
        if (tools.length === 0) {
            res.status(200).json({
                message: "Fodder is empty.",
                data: tools,
            });
        }
        res.status(200).json({
            message: "Fodder retrived succefully",
            data: tools,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getAllTools = getAllTools;
const addFodder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const quantity = req.body.quantity || undefined;
        const user = yield (0, userCheck_1.default)(userId);
        const magazyn = yield findMagazyn(user.magazyn);
        const fodder = yield addItem("syrop", "syrop", magazynItems_1.Fodder, magazyn, "fodder", quantity);
        res.status(201).json({
            message: "Fodder added to magazyn.",
            data: fodder,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.addFodder = addFodder;
const addTools = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const name = req.body.name;
        const opis = req.body.opis;
        const user = yield (0, userCheck_1.default)(userId);
        const magazyn = yield findMagazyn(user.magazyn);
        const tools = yield addItem(name, opis, magazynItems_1.Tools, magazyn, "tools");
        res.status(201).json({
            message: "Tools added to magazyn.",
            data: tools,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.addTools = addTools;
const deleteFodder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const fodderId = req.params.fodderId;
    try {
        const quantity = req.body.quantity || 1;
        const user = yield (0, userCheck_1.default)(userId);
        const magazyn = yield findMagazyn(user.magazyn);
        const fodder = yield magazynItems_1.Fodder.findById(fodderId);
        if (!fodder) {
            errorThrow(401, `Fodder of id:${fodderId} not found`);
        }
        const checkedFodder = fodder;
        const isOwnerOfFodder = magazyn.fodder.includes(checkedFodder._id);
        if (!isOwnerOfFodder) {
            errorThrow(401, `User of id:${userId} is not owner of food item of id:${fodderId}`);
        }
        if (checkedFodder.quantity > 1) {
            let deletedQuantity = checkedFodder.quantity - quantity;
            if (deletedQuantity > 0) {
                checkedFodder.quantity = deletedQuantity;
            }
            else {
                checkedFodder.quantity = 0;
            }
            yield checkedFodder.save();
            yield magazyn.save();
            return res.status(200).json({
                message: `Fodder of id:${fodderId} deleted`,
            });
        }
        else {
            const fodderFiltered = magazyn.fodder.filter((savedFodderId) => {
                return savedFodderId.toString() !== fodderId;
            });
            yield checkedFodder.remove();
            magazyn.fodder = fodderFiltered;
            yield magazyn.save();
            res.status(200).json({
                message: `Fodder of id:${fodderId} deleted`,
            });
        }
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteFodder = deleteFodder;
const deleteFullFodder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const fodderId = req.params.fodderId;
    try {
        const user = yield (0, userCheck_1.default)(userId);
        const magazyn = yield findMagazyn(user.magazyn);
        const fodder = yield magazynItems_1.Fodder.findById(fodderId);
        if (!fodder) {
            errorThrow(401, `Fodder of id:${fodderId} not found`);
        }
        const checkedFodder = fodder;
        const isOwnerOfFodder = magazyn.fodder.includes(checkedFodder._id);
        if (!isOwnerOfFodder) {
            errorThrow(401, `User of id:${userId} is not owner of food item of id:${fodderId}`);
        }
        const fodderFiltered = magazyn.fodder.filter((savedFodderId) => {
            return savedFodderId.toString() !== fodderId;
        });
        yield checkedFodder.remove();
        magazyn.fodder = fodderFiltered;
        yield magazyn.save();
        res.status(200).json({
            message: `Fodder of id:${fodderId} deleted`,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteFullFodder = deleteFullFodder;
const deleteTool = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const fodderId = req.params.fodderId;
    try {
        const user = yield (0, userCheck_1.default)(userId);
        const magazyn = yield findMagazyn(user.magazyn);
        const tools = yield magazynItems_1.Tools.findById(fodderId);
        if (!tools) {
            errorThrow(401, `Fodder of id:${fodderId} not found`);
        }
        const checkedTools = tools;
        const isOwnerOfFodder = magazyn.tools.includes(checkedTools._id);
        if (!isOwnerOfFodder) {
            errorThrow(401, `User of id:${userId} is not owner of food item of id:${fodderId}`);
        }
        if (checkedTools.quantity > 1) {
            checkedTools.quantity = checkedTools.quantity - 1;
            yield checkedTools.save();
            yield magazyn.save();
            res.status(200).json({
                message: `Fodder of id:${fodderId} deleted`,
            });
        }
        else {
            const fodderFiltered = magazyn.tools.filter((savedFodderId) => {
                return savedFodderId.toString() !== fodderId;
            });
            yield checkedTools.remove();
            magazyn.tools = fodderFiltered;
            yield magazyn.save();
            res.status(200).json({
                message: `Fodder of id:${fodderId} deleted`,
            });
        }
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteTool = deleteTool;
const deleteFullTools = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const toolsId = req.params.toolsId;
    try {
        const user = yield (0, userCheck_1.default)(userId);
        const magazyn = yield findMagazyn(user.magazyn);
        const tools = yield magazynItems_1.Tools.findById(toolsId);
        if (!tools) {
            errorThrow(401, `Fodder of id:${toolsId} not found`);
        }
        const checkedTools = tools;
        const isOwnerOfFodder = magazyn.fodder.includes(checkedTools._id);
        if (!isOwnerOfFodder) {
            errorThrow(401, `User of id:${userId} is not owner of food item of id:${toolsId}`);
        }
        const toolsFiltered = magazyn.fodder.filter((savedFodderId) => {
            return savedFodderId.toString() !== toolsId;
        });
        yield checkedTools.remove();
        magazyn.fodder = toolsFiltered;
        yield magazyn.save();
        res.status(200).json({
            message: `Fodder of id:${toolsId} deleted`,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteFullTools = deleteFullTools;
