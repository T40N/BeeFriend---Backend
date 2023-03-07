"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    opis: {
        type: String,
        require: true,
    },
});
const Event = (0, mongoose_1.model)("Event", eventSchema);
exports.default = Event;
