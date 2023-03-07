"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("./config"));
const auth_1 = __importDefault(require("./routes/auth"));
const beeGarden_1 = __importDefault(require("./routes/beeGarden"));
const beeHave_1 = __importDefault(require("./routes/beeHave"));
const event_1 = __importDefault(require("./routes/event"));
const magazyn_1 = __importDefault(require("./routes/magazyn"));
const note_1 = __importDefault(require("./routes/note"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    //res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/auth", auth_1.default);
app.use(beeGarden_1.default);
app.use(beeHave_1.default);
app.use("/event", event_1.default);
app.use("/magazyn", magazyn_1.default);
app.use("/notes", note_1.default);
app.use("/user", user_1.default);
app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;
    const data = error.data || "Unexpected server error";
    res.status(status).json({ message: message, data });
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connection } = yield mongoose_1.default.connect(config_1.default.DB_CONNECT);
        console.log(`🚀 Mongo connected: ${connection.host}`);
        app.listen(8080);
    }
    catch (err) {
        console.log(err);
    }
});
connectDB();
