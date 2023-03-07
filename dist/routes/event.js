"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_1 = require("../controller/event");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const eventRouter = (0, express_1.Router)();
eventRouter.post("/addEvent", is_auth_1.default, event_1.addEvent);
eventRouter.get("/:eventId", is_auth_1.default, event_1.getEvent);
eventRouter.get("/", is_auth_1.default, event_1.getEvents);
eventRouter.delete("/:eventId", is_auth_1.default, event_1.deleteEvent);
exports.default = eventRouter;
