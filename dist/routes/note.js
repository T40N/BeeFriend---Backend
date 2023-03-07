"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const note_1 = require("../controller/note");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const noteRouter = (0, express_1.Router)();
noteRouter.post("/addNote/:beeHaveId", is_auth_1.default, note_1.addNote);
noteRouter.get("/getNote/:noteId", is_auth_1.default, note_1.getNote);
noteRouter.get("/getNotes/:beeHaveId", is_auth_1.default, note_1.getNotes);
noteRouter.put("/updateNote/:noteId", is_auth_1.default, note_1.updateNote);
noteRouter.delete("/deleteNote/:noteId", is_auth_1.default, note_1.deleteNote);
exports.default = noteRouter;
