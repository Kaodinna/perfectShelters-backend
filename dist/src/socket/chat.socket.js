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
exports.registerChatHandlers = void 0;
const chat_model_1 = __importDefault(require("../model/chat.model"));
const notification_1 = require("../utils/notification");
const db_config_1 = require("../config/db.config");
function registerChatHandlers(io, socket) {
    // Visitor starts or resumes a chat session
    socket.on("chat:start", ({ sessionId, visitorName, visitorEmail, visitorPhone }) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let chat = yield chat_model_1.default.findOne({ sessionId });
            const isNew = !chat;
            if (!chat) {
                chat = yield chat_model_1.default.create({ sessionId, visitorName, visitorEmail, visitorPhone });
                // Fire-and-forget — don't block the socket response
                const adminChatUrl = `${db_config_1.FRONTEND_URL || "https://perfect-shelters.vercel.app"}/admin-chats`;
                (0, notification_1.sendEmail)(db_config_1.ADMIN_EMAIL, `💬 New chat from ${visitorName}`, (0, notification_1.chatNotificationHtml)(visitorName, visitorPhone, adminChatUrl));
            }
            socket.join(sessionId);
            socket.emit("chat:history", chat.messages);
            // Notify admin room of new session
            io.to("admin").emit("chat:new_session", {
                sessionId,
                visitorName: chat.visitorName,
                lastMessage: (_a = chat.messages[chat.messages.length - 1]) !== null && _a !== void 0 ? _a : null,
                unreadCount: chat.unreadCount,
                status: chat.status,
                createdAt: chat.createdAt,
            });
        }
        catch (err) {
            socket.emit("chat:error", "Could not start chat session");
        }
    }));
    // Visitor or admin sends a message
    socket.on("chat:message", ({ sessionId, text, sender }) => __awaiter(this, void 0, void 0, function* () {
        try {
            const msg = { sender, text, timestamp: new Date(), read: false };
            const chat = yield chat_model_1.default.findOneAndUpdate({ sessionId }, {
                $push: { messages: msg },
                $inc: { unreadCount: sender === "visitor" ? 1 : 0 },
            }, { new: true });
            if (!chat)
                return;
            // Broadcast to both visitor and any admin watching this session
            io.to(sessionId).emit("chat:message", msg);
            // Update admin session list
            io.to("admin").emit("chat:session_update", {
                sessionId,
                visitorName: chat.visitorName,
                lastMessage: msg,
                unreadCount: chat.unreadCount,
                status: chat.status,
                createdAt: chat.createdAt,
            });
        }
        catch (err) {
            socket.emit("chat:error", "Message failed to send");
        }
    }));
    // Admin joins the admin room to receive all session events
    socket.on("admin:join", () => {
        socket.join("admin");
    });
    // Admin opens a specific session — mark messages as read
    socket.on("admin:open_session", ({ sessionId }) => __awaiter(this, void 0, void 0, function* () {
        socket.join(sessionId);
        yield chat_model_1.default.updateOne({ sessionId }, { $set: { "messages.$[elem].read": true, unreadCount: 0 } }, { arrayFilters: [{ "elem.sender": "visitor" }] });
        const chat = yield chat_model_1.default.findOne({ sessionId });
        if (chat)
            socket.emit("chat:history", chat.messages);
    }));
    // Typing indicator
    socket.on("chat:typing", ({ sessionId, sender }) => {
        socket.to(sessionId).emit("chat:typing", { sender });
    });
    // Close a session
    socket.on("chat:close", ({ sessionId }) => __awaiter(this, void 0, void 0, function* () {
        yield chat_model_1.default.updateOne({ sessionId }, { status: "closed" });
        io.to(sessionId).emit("chat:closed");
        io.to("admin").emit("chat:session_update", { sessionId, status: "closed" });
    }));
}
exports.registerChatHandlers = registerChatHandlers;
