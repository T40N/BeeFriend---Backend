"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const getConfig = () => {
    return {
        DB_CONNECT: process.env.DB_CONNECT,
        JWT_SECRET: process.env.JWT_SECRET,
    };
};
const getCheckedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing env of key: ${key}`);
        }
    }
    return config;
};
const config = getConfig();
const checkedConfig = getCheckedConfig(config);
exports.default = checkedConfig;
