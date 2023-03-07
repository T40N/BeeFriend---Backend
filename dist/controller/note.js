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
exports.deleteNote = exports.updateNote = exports.getNotes = exports.getNote = exports.addNote = void 0;
const error_catch_1 = __importDefault(require("../helpers/error-catch"));
const validation_resoult_check_1 = __importDefault(require("../helpers/validation-resoult-check"));
const mongoose_1 = require("mongoose");
const beeHave_1 = __importDefault(require("../models/beeHave"));
const note_1 = __importDefault(require("../models/note"));
const userCheck_1 = __importDefault(require("../helpers/userCheck"));
const addNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const beeHaveId = req.params.beeHaveId;
    try {
        const { title, content } = req.body;
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const isOwnerOfBeeHave = checkedUser.beeGarden.beeHaves.includes(new mongoose_1.Types.ObjectId(beeHaveId));
        if (!isOwnerOfBeeHave) {
            errorThrow(401, `User of id:${userId} is not owner of beeHave of id:${beeHaveId}.`);
        }
        const beeHave = yield beeHave_1.default.findById(beeHaveId);
        if (!beeHave) {
            errorThrow(401, `BeeHave of id:${beeHaveId} not found`);
        }
        const note = new note_1.default({
            title,
            content,
        });
        yield note.save();
        beeHave.notes.push(note._id);
        yield (beeHave === null || beeHave === void 0 ? void 0 : beeHave.save());
        res.status(201).json({
            message: "Note added successfully.",
            data: beeHave === null || beeHave === void 0 ? void 0 : beeHave.notes,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.addNote = addNote;
const getNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    try {
        const note = yield note_1.default.findById(noteId);
        if (!note) {
            errorThrow(401, `Note of id:${noteId}`);
        }
        res.status(200).json({
            message: "Note retrived successfully.",
            data: note,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getNote = getNote;
const getNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const beeHaveId = req.params.beeHaveId;
    try {
        const beeHave = yield beeHave_1.default.findById(beeHaveId);
        if (!beeHave) {
            errorThrow(401, `BeeHave of id:${beeHaveId} does not exists.`);
        }
        res.status(200).json({
            message: "Notes retrived succesfully.",
            data: beeHave.notes,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getNotes = getNotes;
const updateNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    try {
        (0, validation_resoult_check_1.default)(req);
        const { title, content } = req.body;
        const note = yield note_1.default.findById(noteId);
        if (!note) {
            errorThrow(401, `Note of id:${noteId} does not exists.`);
        }
        note.title = title;
        note.content = content;
        yield note.save();
        res.status(201).json({
            message: "Note updated succesfully.",
            data: note,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    try {
        const note = yield note_1.default.findById(noteId);
        if (!note) {
            errorThrow(401, `Note of id:${noteId} does not exists.`);
        }
        note === null || note === void 0 ? void 0 : note.delete();
        res.status(201).json({
            message: "Note deleted successfully.",
            data: noteId,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteNote = deleteNote;
