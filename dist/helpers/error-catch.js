"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorCatch = (err, next) => {
    if (err instanceof Error) {
        if (!err.status)
            err.status = 500;
        next(err);
    }
};
exports.default = errorCatch;
