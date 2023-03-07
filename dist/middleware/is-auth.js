"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        errorThrow(401, "Not authenticated");
    }
    const checkedAuthHeader = authHeader;
    const token = checkedAuthHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
    }
    catch (err) {
        if (err instanceof Error)
            err.status = 500;
        throw err;
    }
    if (!decodedToken) {
        errorThrow(401, "Not authorized");
    }
    const checkedDecodedToken = decodedToken;
    req.userId = checkedDecodedToken.userId;
    next();
};
exports.default = isAuth;
