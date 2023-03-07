"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    beeGarden: {
        xCordinate: {
            type: Number,
        },
        yCordinate: {
            type: Number,
        },
        beeHaves: [{ type: mongoose_1.Types.ObjectId, ref: "BeeHave" }],
    },
    calendar: [{ type: mongoose_1.Types.ObjectId, ref: "Event" }],
    magazyn: { type: mongoose_1.Types.ObjectId, ref: "Magazyn" },
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
