"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const beeGarden_1 = require("../controller/beeGarden");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const beeGardenRouter = (0, express_1.Router)();
beeGardenRouter.post("/addBeeGarden", is_auth_1.default, [
    (0, express_validator_1.body)("xCordinate").isNumeric().notEmpty(),
    (0, express_validator_1.body)("yCordinate").isNumeric().notEmpty(),
], beeGarden_1.addBeeGarden);
beeGardenRouter.get("/beeGarden", is_auth_1.default, beeGarden_1.getBeeGarden);
beeGardenRouter.put("/updateCordinate", is_auth_1.default, [
    (0, express_validator_1.body)("xCordinate").isNumeric().notEmpty(),
    (0, express_validator_1.body)("yCordinate").isNumeric().notEmpty(),
], beeGarden_1.changeCordinates);
exports.default = beeGardenRouter;
