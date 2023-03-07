"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const magazynSchema = new mongoose_1.Schema({
    fodder: [{ type: mongoose_1.Types.ObjectId, ref: "Fodder" }],
    tools: [{ type: mongoose_1.Types.ObjectId, ref: "Tools" }],
});
const Magazyn = (0, mongoose_1.model)("Magazyn", magazynSchema);
exports.default = Magazyn;
