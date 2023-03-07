"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validationResoultCheck = (req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
    }
};
exports.default = validationResoultCheck;
