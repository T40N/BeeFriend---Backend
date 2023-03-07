"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const magazyn_1 = require("../controller/magazyn");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const magazynRouter = (0, express_1.Router)();
magazynRouter.post("/addFodder", is_auth_1.default, magazyn_1.addFodder);
magazynRouter.post("/addTools", is_auth_1.default, magazyn_1.addTools);
magazynRouter.delete("/deleteFodder/:fodderId", is_auth_1.default, magazyn_1.deleteFodder);
magazynRouter.delete("/deleteFullFodder/:fodderId", is_auth_1.default, magazyn_1.deleteFullFodder);
magazynRouter.delete("/deleteTool/:fodderId", is_auth_1.default, magazyn_1.deleteTool);
magazynRouter.delete("/deleteFullTools/:fodderId", is_auth_1.default, magazyn_1.deleteFullTools);
magazynRouter.get("/tools", is_auth_1.default, magazyn_1.getAllFodder);
magazynRouter.get("/fodder", is_auth_1.default, magazyn_1.getAllTools);
magazynRouter.get("/", is_auth_1.default, magazyn_1.getMagazyn);
exports.default = magazynRouter;
