"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender: { type: String, enum: ["visitor", "admin"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});
const chatSchema = new mongoose_1.default.Schema({
    sessionId: { type: String, required: true, unique: true, index: true },
    visitorName: { type: String, default: "Visitor" },
    visitorEmail: { type: String },
    visitorPhone: { type: String },
    messages: [messageSchema],
    status: { type: String, enum: ["active", "closed"], default: "active" },
    unreadCount: { type: Number, default: 0 },
}, { timestamps: true });
const Chat = mongoose_1.default.model("Chat", chatSchema);
exports.default = Chat;
