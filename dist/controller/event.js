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
exports.updateEvent = exports.deleteEvent = exports.getEvents = exports.getEvent = exports.addEvent = exports.getCalendar = void 0;
const mongoose_1 = require("mongoose");
const error_catch_1 = __importDefault(require("../helpers/error-catch"));
const userCheck_1 = __importDefault(require("../helpers/userCheck"));
const validation_resoult_check_1 = __importDefault(require("../helpers/validation-resoult-check"));
const event_1 = __importDefault(require("../models/event"));
const getCalendar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const userWithCalendar = yield checkedUser.populate("calendar");
        res.status(200).json({
            message: "Calendar retrived",
            data: userWithCalendar.calendar,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getCalendar = getCalendar;
const addEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const date = new Date(req.body.date);
        const name = req.body.name;
        const opis = req.body.opis;
        const event = new event_1.default({
            date,
            name,
            opis,
        });
        yield event.save();
        const checkedUser = yield (0, userCheck_1.default)(userId);
        checkedUser.calendar.push(event._id);
        yield checkedUser.save();
        res.status(200).json({
            message: "Event added to calendar",
            data: event,
            calendar: checkedUser.calendar,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.addEvent = addEvent;
const getEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.eventId;
    try {
        const event = yield event_1.default.findById(eventId);
        if (!event) {
            errorThrow(401, `Event of id:${eventId} does not exists.`);
        }
        const checkedEvent = event;
        res.status(200).json({
            message: "Event retrived succesfully.",
            data: checkedEvent,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getEvent = getEvent;
const getEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const checkedUser = yield (yield (0, userCheck_1.default)(userId)).populate("calendar");
        const { calendar } = checkedUser;
        res.status(200).json({
            messange: "All events from calendar retrived succesfully.",
            data: calendar,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.getEvents = getEvents;
const deleteEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const eventId = req.params.eventId;
    try {
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const filteredCalendar = checkedUser.calendar.filter((event) => event !== new mongoose_1.Types.ObjectId(eventId));
        if (filteredCalendar.length === 0) {
            errorThrow(401, `Event of id: ${eventId} does not exists, or this event is not owned by user of id:${userId}.`);
        }
        checkedUser.calendar = filteredCalendar;
        yield checkedUser.save();
        yield event_1.default.findByIdAndDelete(eventId);
        res.status(204).json({
            message: "Event succesfully created.",
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.deleteEvent = deleteEvent;
const updateEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.eventId;
    const userId = req.userId;
    try {
        (0, validation_resoult_check_1.default)(req);
        const name = req.body.name;
        const date = new Date(req.body.name);
        const opis = req.body.opis;
        const checkedUser = yield (0, userCheck_1.default)(userId);
        const eventIndex = checkedUser.calendar.indexOf(new mongoose_1.Types.ObjectId(eventId));
        if (eventIndex === -1) {
            errorThrow(401, `Event of id:${eventId} does not exists or user of id:${userId} is not owner of this event`);
        }
        const event = yield event_1.default.findByIdAndUpdate(eventId, {
            name,
            date,
            opis,
        });
        res.status(201).json({
            message: "Event updated succesfully",
            event,
        });
    }
    catch (err) {
        (0, error_catch_1.default)(err, next);
    }
});
exports.updateEvent = updateEvent;
