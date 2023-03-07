"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const beeHaveSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    honeyTakenAll: {
        type: Number,
        required: true,
    },
    waxTakenAll: {
        type: Number,
        required: true,
    },
    notes: [{ type: mongoose_1.Types.ObjectId, ref: "Note" }],
    history: [
        {
            date: {
                type: Date,
                required: true,
            },
            honeyTaken: {
                type: Number,
                required: true,
            },
            waxTaken: {
                type: Number,
                required: true,
            },
        },
    ],
    xPosition: {
        type: Number,
    },
    yPosition: {
        type: Number,
    },
});
const BeeHave = (0, mongoose_1.model)("BeeHave", beeHaveSchema);
exports.default = BeeHave;
