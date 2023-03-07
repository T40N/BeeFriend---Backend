"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fodder = exports.Tools = void 0;
const mongoose_1 = require("mongoose");
const itemsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    opis: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});
exports.Tools = (0, mongoose_1.model)("Tools", itemsSchema);
exports.Fodder = (0, mongoose_1.model)("Fodder", itemsSchema);
